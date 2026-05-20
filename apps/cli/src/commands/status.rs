use anyhow::Result;
use clap::Args;

use crate::api::health_check;
use crate::auth::session::ensure_authenticated;
use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct StatusArgs {}

pub async fn run(common: &CommonOptions, _args: StatusArgs) -> Result<()> {
    cli::banner::print_intro("Checking lomi. CLI status");

    let spinner = indicatif::ProgressBar::new_spinner();
    spinner.set_style(
        indicatif::ProgressStyle::default_spinner()
            .template("{spinner} {msg}")
            .unwrap(),
    );
    spinner.set_message("Verifying login...");
    spinner.enable_steady_tick(std::time::Duration::from_millis(100));

    let auth = ensure_authenticated(common, true, false, true).await?;

    spinner.set_message("Checking API connection...");
    health_check(&auth).await?;

    spinner.finish_and_clear();
    cli::output::print_success("CLI token found");
    cli::output::print_success("Connected to lomi. API");
    println!();
    println!("You are logged in and ready to use lomi. commands.");
    cli::banner::print_outro("Status check complete");
    Ok(())
}
