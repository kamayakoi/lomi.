use anyhow::Result;
use clap::{Args, Subcommand};
use colored::Colorize;
use serde::{Deserialize, Serialize};

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct PaymentsArgs {
    #[command(subcommand)]
    pub command: PaymentsCommand,
}

#[derive(Subcommand, Debug)]
pub enum PaymentsCommand {
    /// Create a new payment link
    Create,
}

#[derive(Serialize)]
struct CreatePaymentLinkRequest {
    merchant_id: String,
    title: String,
    price: f64,
    currency_code: String,
    link_type: &'static str,
    is_active: bool,
}

#[derive(Deserialize)]
struct PaymentLinkResponse {
    url: String,
    title: String,
    price: f64,
    currency_code: String,
}

pub async fn run(common: &CommonOptions, args: PaymentsArgs) -> Result<()> {
    match args.command {
        PaymentsCommand::Create => create_payment_link(common).await,
    }
}

async fn create_payment_link(common: &CommonOptions) -> Result<()> {
    cli::banner::print_intro("Create a payment link");

    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;

    let merchant_id = cli::prompts::text("Enter your merchant ID:")?;
    let title = cli::prompts::text("Enter payment link title:")?;
    let amount_text = cli::prompts::text("Enter amount:")?;
    let amount: f64 = amount_text
        .parse()
        .map_err(|_| anyhow::anyhow!("Amount must be a number"))?;
    let currency = cli::prompts::select(
        "Select currency:",
        vec!["XOF".to_string(), "USD".to_string(), "EUR".to_string()],
        "XOF".to_string(),
    )?;

    let spinner = indicatif::ProgressBar::new_spinner();
    spinner.set_message("Creating payment link...");
    spinner.enable_steady_tick(std::time::Duration::from_millis(100));

    let response: PaymentLinkResponse = client
        .post(
            "/payment-links",
            &CreatePaymentLinkRequest {
                merchant_id,
                title: title.clone(),
                price: amount,
                currency_code: currency.clone(),
                link_type: "instant",
                is_active: true,
            },
        )
        .await?;

    spinner.finish_and_clear();
    cli::output::print_success("Payment link created successfully!");

    println!();
    println!("{}", "Payment Link Details:".bold());
    println!("URL:    {}", response.url.bright_blue());
    println!("Title:  {}", response.title);
    println!("Amount: {} {}", response.price, response.currency_code);
    println!();
    println!("Share this link with your customers to accept payments.");
    Ok(())
}
