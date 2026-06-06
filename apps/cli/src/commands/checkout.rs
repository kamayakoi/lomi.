use anyhow::Result;
use clap::{Args, Subcommand};
use colored::Colorize;
use serde::{Deserialize, Serialize};

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct CheckoutArgs {
    #[command(subcommand)]
    pub command: CheckoutCommand,
}

#[derive(Subcommand, Debug)]
pub enum CheckoutCommand {
    /// Create a hosted checkout session
    Create,
}

#[derive(Serialize)]
struct CreateCheckoutSessionRequest {
    currency_code: String,
    success_url: String,
    cancel_url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    price_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    amount: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    customer_email: Option<String>,
}

#[derive(Deserialize)]
struct CheckoutSessionResponse {
    checkout_session_id: String,
    checkout_url: String,
}

pub async fn run(common: &CommonOptions, args: CheckoutArgs) -> Result<()> {
    match args.command {
        CheckoutCommand::Create => create_checkout_session(common).await,
    }
}

async fn create_checkout_session(common: &CommonOptions) -> Result<()> {
    cli::banner::print_intro("Create a checkout session");

    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;

    let use_price = cli::prompts::confirm("Do you have a price ID?", true)?;
    let (price_id, amount) = if use_price {
        let price_id = cli::prompts::text("Enter price ID:")?;
        (Some(price_id), None)
    } else {
        let amount_text = cli::prompts::text("Enter amount:")?;
        let amount: f64 = amount_text
            .parse()
            .map_err(|_| anyhow::anyhow!("Amount must be a number"))?;
        (None, Some(amount))
    };

    let currency = cli::prompts::select(
        "Select currency:",
        vec!["XOF".to_string(), "USD".to_string(), "EUR".to_string()],
        "XOF".to_string(),
    )?;
    let success_url = cli::prompts::text("Success URL:")?;
    let cancel_url = cli::prompts::text("Cancel URL:")?;
    let customer_email: String =
        cli::prompts::text("Customer email (optional, press Enter to skip):")?;
    let customer_email = if customer_email.trim().is_empty() {
        None
    } else {
        Some(customer_email)
    };

    let spinner = indicatif::ProgressBar::new_spinner();
    spinner.set_message("Creating checkout session...");
    spinner.enable_steady_tick(std::time::Duration::from_millis(100));

    let response: CheckoutSessionResponse = client
        .post(
            "/checkout-sessions",
            &CreateCheckoutSessionRequest {
                currency_code: currency,
                success_url,
                cancel_url,
                price_id,
                amount,
                customer_email,
            },
        )
        .await?;

    spinner.finish_and_clear();
    cli::output::print_success("Checkout session created!");

    println!();
    println!("{}", "Session Details:".bold());
    println!("ID:  {}", response.checkout_session_id.cyan());
    println!("URL: {}", response.checkout_url.bright_blue());
    println!();
    println!("Redirect your customer to the URL above to complete payment.");
    Ok(())
}
