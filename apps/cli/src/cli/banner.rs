use crate::cli::{self, CommonOptions, DOCS_URL};
use colored::Colorize;

pub async fn print_banner(_common: &CommonOptions) -> anyhow::Result<()> {
    let version = env!("CARGO_PKG_VERSION");
    println!();
    println!(
        "{} {}",
        cli::output::logo(),
        format!("({version})").bright_black()
    );
    cli::output::divider();
    Ok(())
}

pub fn print_outro(message: &str) {
    println!();
    println!("{} {}", "└".bright_black(), message.green());
}

pub fn print_intro(message: &str) {
    println!();
    println!("{}  {}", "┌".bright_black(), message.bold());
}

pub fn print_next_steps(steps: &[&str]) {
    println!();
    println!("{}", "Next steps:".bold());
    for (index, step) in steps.iter().enumerate() {
        println!("   {}. {}", index + 1, step);
    }
    println!();
    println!(
        "{} {}",
        "Documentation:".bold(),
        DOCS_URL.bright_blue().underline()
    );
}
