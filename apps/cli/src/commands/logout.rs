use anyhow::Result;
use clap::Args;

use crate::cli::{self, CommonOptions};
use crate::config::GlobalConfig;

#[derive(Args, Debug)]
pub struct LogoutArgs {}

pub async fn run(common: &CommonOptions, _args: LogoutArgs) -> Result<()> {
    cli::banner::print_intro(&format!("Logging out profile [{}]", common.profile));

    let mut config = GlobalConfig::load()?;
    config.clear_profile(&common.profile)?;

    cli::output::print_success(&format!("Logged out profile [{}]", common.profile));
    cli::banner::print_outro("Logout complete");
    Ok(())
}
