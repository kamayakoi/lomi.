use anyhow::Result;
use clap::{Args, Subcommand};
use colored::Colorize;

use crate::api::ApiClient;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct TransactionsArgs {
    #[command(subcommand)]
    pub command: TransactionsCommand,
}

#[derive(Subcommand, Debug)]
pub enum TransactionsCommand {
    /// List recent transactions
    List,
}

pub async fn run(common: &CommonOptions, args: TransactionsArgs) -> Result<()> {
    match args.command {
        TransactionsCommand::List => list_transactions(common).await,
    }
}

async fn list_transactions(common: &CommonOptions) -> Result<()> {
    cli::banner::print_intro("Transactions");
    let auth = ensure_authenticated(common, true, false, false).await?;
    let client = ApiClient::new(&auth)?;

    let rows: Vec<serde_json::Value> = client.get("/transactions?limit=10").await?;
    if rows.is_empty() {
        println!("{} No transactions found.", "○".bright_black());
        return Ok(());
    }

    for row in rows {
        let id = row
            .get("transaction_id")
            .or_else(|| row.get("id"))
            .and_then(|v| v.as_str())
            .unwrap_or("-");
        let status = row
            .get("status")
            .and_then(|v| v.as_str())
            .unwrap_or("unknown");
        let amount = row.get("gross_amount").and_then(|v| v.as_f64()).unwrap_or(0.0);
        let currency = row
            .get("currency_code")
            .and_then(|v| v.as_str())
            .unwrap_or("XOF");
        println!(
            "{} {} {} {}",
            id.cyan(),
            status.yellow(),
            format!("{amount} {currency}").bright_black(),
            ""
        );
    }
    Ok(())
}
