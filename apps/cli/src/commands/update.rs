use anyhow::{bail, Context, Result};
use clap::Args;
use std::path::Path;
use std::process::Command;

use crate::cli::{self, CommonOptions};

#[derive(Args, Debug)]
pub struct UpdateArgs {
    /// Project path
    #[arg(default_value = ".")]
    pub path: String,
}

pub async fn run(_common: &CommonOptions, args: UpdateArgs) -> Result<()> {
    cli::banner::print_intro("Updating @lomi./sdk");

    let project_dir = Path::new(&args.path);
    if !project_dir.join("package.json").exists() {
        bail!("No package.json found in {}", args.path);
    }

    let package_manager = detect_package_manager(project_dir);
    let cli_version = env!("CARGO_PKG_VERSION");

    let spinner = indicatif::ProgressBar::new_spinner();
    spinner.set_message(format!("Updating @lomi./sdk via {package_manager}..."));
    spinner.enable_steady_tick(std::time::Duration::from_millis(100));

    let status = match package_manager.as_str() {
        "pnpm" => Command::new("pnpm")
            .args(["add", "@lomi./sdk@latest"])
            .current_dir(project_dir)
            .status(),
        "yarn" => Command::new("yarn")
            .args(["add", "@lomi./sdk@latest"])
            .current_dir(project_dir)
            .status(),
        "bun" => Command::new("bun")
            .args(["add", "@lomi./sdk@latest"])
            .current_dir(project_dir)
            .status(),
        _ => Command::new("npm")
            .args(["install", "@lomi./sdk@latest"])
            .current_dir(project_dir)
            .status(),
    }
    .context("Failed to run package manager")?;

    spinner.finish_and_clear();

    if !status.success() {
        bail!("Failed to update @lomi./sdk");
    }

    cli::output::print_success(&format!(
        "Updated @lomi./sdk (CLI version {cli_version})"
    ));
    cli::banner::print_outro("Update complete");
    Ok(())
}

fn detect_package_manager(project_dir: &Path) -> String {
    for (file, pm) in [
        ("pnpm-lock.yaml", "pnpm"),
        ("yarn.lock", "yarn"),
        ("bun.lockb", "bun"),
        ("bun.lock", "bun"),
    ] {
        if project_dir.join(file).exists() {
            return pm.to_string();
        }
    }
    "npm".to_string()
}
