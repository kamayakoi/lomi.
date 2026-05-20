mod api;
mod auth;
mod cli;
mod commands;
mod config;
mod rules;

use anyhow::Result;
use clap::{Parser, Subcommand};
use cli::CommonOptions;

#[derive(Parser)]
#[command(
    name = "lomi.",
    bin_name = "lomi",
    about = "CLI for lomi.'s payment infrastructure",
    version
)]
struct Cli {
    #[command(flatten)]
    common: CommonOptions,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Log in to lomi. via browser authentication
    Login(commands::login::LoginArgs),
    /// Log out of lomi.
    Logout(commands::logout::LogoutArgs),
    /// Display the current logged-in account
    Whoami(commands::whoami::WhoamiArgs),
    /// Check login status and API connectivity
    Status(commands::status::StatusArgs),
    /// Initialize a lomi. project with example code
    Init(commands::init::InitArgs),
    /// Start a local webhook development server
    Dev(commands::dev::DevArgs),
    /// Manage checkout sessions
    Checkout(commands::checkout::CheckoutArgs),
    /// Manage payments
    Payments(commands::payments::PaymentsArgs),
    /// Install lomi. agent rules for Cursor, Claude, and other AI tools
    InstallRules(commands::install_rules::InstallRulesArgs),
    /// Update @lomi./sdk to the latest version
    Update(commands::update::UpdateArgs),
    /// List all CLI profiles
    ListProfiles(commands::list_profiles::ListProfilesArgs),
    /// Switch the default CLI profile
    Switch(commands::switch::SwitchArgs),
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();
    cli::banner::print_banner(&cli.common).await?;

    match cli.command {
        Commands::Login(args) => commands::login::run(&cli.common, args).await,
        Commands::Logout(args) => commands::logout::run(&cli.common, args).await,
        Commands::Whoami(args) => commands::whoami::run(&cli.common, args).await,
        Commands::Status(args) => commands::status::run(&cli.common, args).await,
        Commands::Init(args) => commands::init::run(&cli.common, args).await,
        Commands::Dev(args) => commands::dev::run(&cli.common, args).await,
        Commands::Checkout(args) => commands::checkout::run(&cli.common, args).await,
        Commands::Payments(args) => commands::payments::run(&cli.common, args).await,
        Commands::InstallRules(args) => commands::install_rules::run(&cli.common, args).await,
        Commands::Update(args) => commands::update::run(&cli.common, args).await,
        Commands::ListProfiles(args) => commands::list_profiles::run(&cli.common, args).await,
        Commands::Switch(args) => commands::switch::run(&cli.common, args).await,
    }
}
