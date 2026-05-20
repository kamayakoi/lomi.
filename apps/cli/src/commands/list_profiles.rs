use anyhow::Result;
use clap::Args;

use crate::cli::{self, CommonOptions};
use crate::config::GlobalConfig;

#[derive(Args, Debug)]
pub struct ListProfilesArgs {}

pub async fn run(_common: &CommonOptions, _args: ListProfilesArgs) -> Result<()> {
    cli::banner::print_intro("CLI profiles");

    let config = GlobalConfig::load()?;
    let profiles = config.list_profiles();

    if profiles.is_empty() {
        println!("No profiles configured. Run `lomi login` first.");
        return Ok(());
    }

    for profile in profiles {
        let marker = if profile == config.current_profile {
            "●"
        } else {
            "○"
        };
        let api_url = config
            .profile(&profile)
            .and_then(|p| p.api_url.as_deref())
            .unwrap_or(crate::cli::PRODUCTION_API_URL);
        println!("{}  {} - {}", marker, profile, api_url);
    }

    println!();
    println!("Current profile: {}", config.current_profile);
    cli::banner::print_outro("Use `lomi switch <profile>` to change the default profile");
    Ok(())
}
