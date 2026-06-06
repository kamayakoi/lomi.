use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct MeResponse {
    pub merchant_id: String,
    pub organization_id: String,
    pub organization_name: String,
    pub environment: String,
}

#[derive(Debug, Deserialize)]
pub struct BalanceResponse {
    pub balances: Option<Vec<BalanceEntry>>,
}

#[derive(Debug, Deserialize)]
pub struct BalanceEntry {
    pub currency_code: Option<String>,
    pub available_balance: Option<f64>,
}

#[derive(Debug, Deserialize)]
pub struct WebhookListResponse {
    pub data: Option<Vec<WebhookSummary>>,
}

#[derive(Debug, Deserialize)]
pub struct WebhookSummary {
    pub id: Option<String>,
    pub webhook_id: Option<String>,
    pub url: Option<String>,
    pub active: Option<bool>,
    pub is_active: Option<bool>,
    pub events: Option<Vec<String>>,
    pub authorized_events: Option<Vec<String>>,
}

impl WebhookSummary {
    pub fn id(&self) -> Option<&str> {
        self.id
            .as_deref()
            .or(self.webhook_id.as_deref())
    }

    pub fn is_active(&self) -> bool {
        self.active.or(self.is_active).unwrap_or(false)
    }
}

#[derive(Debug, Deserialize)]
pub struct ProductListResponse {
    pub data: Option<Vec<ProductSummary>>,
}

#[derive(Debug, Deserialize)]
pub struct ProductSummary {
    pub product_id: Option<String>,
    pub id: Option<String>,
    pub name: Option<String>,
    pub prices: Option<Vec<PriceSummary>>,
}

#[derive(Debug, Deserialize)]
pub struct PriceSummary {
    pub price_id: Option<String>,
    pub id: Option<String>,
    pub amount: Option<f64>,
    pub currency_code: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct TransactionListResponse {
    pub data: Option<Vec<serde_json::Value>>,
}
