use anyhow::{bail, Context, Result};
use std::env;

use crate::auth::device_flow::{api_url_for_profile, login, LoginOptions};
use crate::cli::CommonOptions;
use crate::config::GlobalConfig;

#[derive(Debug, Clone)]
pub struct AuthContext {
    pub profile: String,
    pub cli_token: String,
    pub api_url: String,
}

#[derive(Debug, Clone)]
pub enum AuthResult {
    Authenticated(AuthContext),
    Failed(String),
}

pub fn token_from_env() -> Option<String> {
    env::var("LOMI_ACCESS_TOKEN")
        .ok()
        .filter(|value| !value.is_empty())
}

pub fn resolve_auth(common: &CommonOptions) -> Result<Option<AuthContext>> {
    if let Some(token) = token_from_env() {
        return Ok(Some(AuthContext {
            profile: common.profile.clone(),
            cli_token: token,
            api_url: common.resolved_api_url(),
        }));
    }

    let config = GlobalConfig::load()?;
    if let Some(profile) = config.profile(&common.profile) {
        if let Some(token) = profile.cli_token.clone() {
            let api_url = profile
                .api_url
                .clone()
                .unwrap_or_else(|| common.resolved_api_url());
            return Ok(Some(AuthContext {
                profile: common.profile.clone(),
                cli_token: token,
                api_url,
            }));
        }
    }

    Ok(None)
}

pub async fn ensure_authenticated(
    common: &CommonOptions,
    open_browser: bool,
    embedded: bool,
    silent: bool,
) -> Result<AuthContext> {
    if let Some(auth) = resolve_auth(common)? {
        return Ok(auth);
    }

    if !embedded && !silent {
        crate::cli::output::print_error("You must login first. Use `lomi login`.");
        bail!("Not authenticated");
    }

    if !crate::cli::output::is_tty() && embedded {
        bail!("Authentication required. Set LOMI_ACCESS_TOKEN or run `lomi login` in a TTY.");
    }

    let api_url = api_url_for_profile(&common.profile, common.api_url.as_deref());
    login(LoginOptions {
        profile: common.profile.clone(),
        api_url: api_url.clone(),
        open_browser,
        embedded,
        silent,
    })
    .await?;

    resolve_auth(common)?
        .context("Authentication succeeded but token was not saved")
}

pub async fn try_authenticated(common: &CommonOptions) -> AuthResult {
    match resolve_auth(common) {
        Ok(Some(auth)) => AuthResult::Authenticated(auth),
        Ok(None) => AuthResult::Failed("Not logged in".to_string()),
        Err(error) => AuthResult::Failed(error.to_string()),
    }
}
