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
struct LineItem {
    price: String,
    quantity: u32,
}

#[derive(Serialize)]
struct CreateCheckoutSessionRequest {
    merchant_id: String,
    success_url: String,
    cancel_url: String,
    line_items: Vec<LineItem>,
    #[serde(skip_serializing_if = "Option::is_none")]
    customer_email: Option<String>,
}

#[derive(Deserialize)]
struct CheckoutSessionResponse {
    id: String,
    url: String,
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

    let merchant_id = cli::prompts::text("Enter your merchant ID:")?;
    let price_id = cli::prompts::text("Enter price ID (price_xxx):")?;
    let success_url = cli::prompts::text("Success URL (use {CHECKOUT_SESSION_ID} placeholder):")?;
    let cancel_url = cli::prompts::text("Cancel URL:")?;
    let customer_email: String = cli::prompts::text("Customer email (optional, press Enter to skip):")?;
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
                merchant_id,
                success_url,
                cancel_url,
                line_items: vec![LineItem {
                    price: price_id,
                    quantity: 1,
                }],
                customer_email,
            },
        )
        .await?;

    spinner.finish_and_clear();
    cli::output::print_success("Checkout session created!");

    println!();
    println!("{}", "Session Details:".bold());
    println!("ID:  {}", response.id.cyan());
    println!("URL: {}", response.url.bright_blue());
    println!();
    println!("Redirect your customer to the URL above to complete payment.");
    Ok(())
}
