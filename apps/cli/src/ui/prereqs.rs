use anyhow::{bail, Context, Result};
use std::path::Path;
use std::process::Command;

use crate::cli::{self, prompts};

pub struct PrereqOptions {
    pub yes: bool,
    pub dry_run: bool,
}

pub fn ensure_prereqs(project_dir: &Path, options: &PrereqOptions) -> Result<()> {
    ensure_node_available()?;

    let components_json = project_dir.join("components.json");
    if components_json.exists() {
        return Ok(());
    }

    if options.dry_run {
        cli::output::print_dim(&format!(
            "Would run: npx shadcn@latest init -y -d (in {})",
            project_dir.display()
        ));
        return Ok(());
    }

    let run_init = if options.yes {
        true
    } else {
        prompts::confirm(
            "No components.json found. Initialize shadcn/ui in this project?",
            true,
        )?
    };

    if !run_init {
        bail!(
            "shadcn/ui is required. Run `npx shadcn@latest init` in {} first.",
            project_dir.display()
        );
    }

    cli::output::print_info("Initializing shadcn/ui...");
    let status = Command::new("npx")
        .args(["shadcn@latest", "init", "-y", "-d"])
        .current_dir(project_dir)
        .status()
        .context("Failed to run shadcn init")?;

    if !status.success() {
        bail!("shadcn init failed. Run `npx shadcn@latest init` manually.");
    }

    if !components_json.exists() {
        bail!(
            "shadcn init completed but components.json is still missing in {}",
            project_dir.display()
        );
    }

    cli::output::print_success("shadcn/ui initialized");
    Ok(())
}

fn ensure_node_available() -> Result<()> {
    let node_ok = Command::new("node")
        .arg("--version")
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false);

    let npx_ok = Command::new("npx")
        .arg("--version")
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false);

    if !node_ok || !npx_ok {
        bail!("Node.js and npx are required. Install Node.js 18+ and try again.");
    }

    Ok(())
}
