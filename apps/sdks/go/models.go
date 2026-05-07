// Package lomi provides types for the lomi. API
// AUTO-GENERATED - Do not edit manually
package lomi

// Accounts represents a accounts
type Accounts struct {
	AccountId string `json:"account_id"`
	Balance float64 `json:"balance"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	IsSpiAccount bool `json:"is_spi_account"`
	OrganizationId string `json:"organization_id"`
	SpiAccountBalance *float64 `json:"spi_account_balance"`
	SpiAccountBalanceSyncError *string `json:"spi_account_balance_sync_error"`
	SpiAccountBalanceSyncedAt *string `json:"spi_account_balance_synced_at"`
	SpiAccountNumber *string `json:"spi_account_number"`
	UpdatedAt string `json:"updated_at"`
}

// AccountsCreate represents the payload to create a accounts
type AccountsCreate struct {
	AccountId *string `json:"account_id,omitempty"`
	Balance *float64 `json:"balance,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CurrencyCode *string `json:"currency_code,omitempty"`
	IsSpiAccount *bool `json:"is_spi_account,omitempty"`
	OrganizationId string `json:"organization_id"`
	SpiAccountBalance *float64 `json:"spi_account_balance,omitempty"`
	SpiAccountBalanceSyncError *string `json:"spi_account_balance_sync_error,omitempty"`
	SpiAccountBalanceSyncedAt *string `json:"spi_account_balance_synced_at,omitempty"`
	SpiAccountNumber *string `json:"spi_account_number,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// AccountsUpdate represents the payload to update a accounts
type AccountsUpdate struct {
	AccountId *string `json:"account_id,omitempty"`
	Balance *float64 `json:"balance,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CurrencyCode *string `json:"currency_code,omitempty"`
	IsSpiAccount *bool `json:"is_spi_account,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	SpiAccountBalance *float64 `json:"spi_account_balance,omitempty"`
	SpiAccountBalanceSyncError *string `json:"spi_account_balance_sync_error,omitempty"`
	SpiAccountBalanceSyncedAt *string `json:"spi_account_balance_synced_at,omitempty"`
	SpiAccountNumber *string `json:"spi_account_number,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// Organizations represents a organizations
type Organizations struct {
	Arr float64 `json:"arr"`
	CreatedAt string `json:"created_at"`
	DefaultCurrency string `json:"default_currency"`
	DeletedAt *string `json:"deleted_at"`
	Email string `json:"email"`
	EmployeeNumber *string `json:"employee_number"`
	Industry *string `json:"industry"`
	IsDeleted bool `json:"is_deleted"`
	IsStarterBusiness bool `json:"is_starter_business"`
	LogoUrl *string `json:"logo_url"`
	MerchantLifetimeValue float64 `json:"merchant_lifetime_value"`
	Metadata *map[string]interface{} `json:"metadata"`
	Mrr float64 `json:"mrr"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PhoneNumber string `json:"phone_number"`
	PinCode *string `json:"pin_code"`
	Slug *string `json:"slug"`
	Status string `json:"status"`
	StorefrontEnabled bool `json:"storefront_enabled"`
	TotalCustomers *float64 `json:"total_customers"`
	TotalMerchants *float64 `json:"total_merchants"`
	TotalRevenue *float64 `json:"total_revenue"`
	TotalTransactions *float64 `json:"total_transactions"`
	UpdatedAt string `json:"updated_at"`
	VerificationStatus string `json:"verification_status"`
	WebsiteUrl *string `json:"website_url"`
}

// OrganizationsCreate represents the payload to create a organizations
type OrganizationsCreate struct {
	Arr *float64 `json:"arr,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	DefaultCurrency *string `json:"default_currency,omitempty"`
	DeletedAt *string `json:"deleted_at,omitempty"`
	Email string `json:"email"`
	EmployeeNumber *string `json:"employee_number,omitempty"`
	Industry *string `json:"industry,omitempty"`
	IsDeleted *bool `json:"is_deleted,omitempty"`
	IsStarterBusiness *bool `json:"is_starter_business,omitempty"`
	LogoUrl *string `json:"logo_url,omitempty"`
	MerchantLifetimeValue *float64 `json:"merchant_lifetime_value,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	Mrr *float64 `json:"mrr,omitempty"`
	Name string `json:"name"`
	OrganizationId *string `json:"organization_id,omitempty"`
	PhoneNumber string `json:"phone_number"`
	PinCode *string `json:"pin_code,omitempty"`
	Slug *string `json:"slug,omitempty"`
	Status *string `json:"status,omitempty"`
	StorefrontEnabled *bool `json:"storefront_enabled,omitempty"`
	TotalCustomers *float64 `json:"total_customers,omitempty"`
	TotalMerchants *float64 `json:"total_merchants,omitempty"`
	TotalRevenue *float64 `json:"total_revenue,omitempty"`
	TotalTransactions *float64 `json:"total_transactions,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	VerificationStatus *string `json:"verification_status,omitempty"`
	WebsiteUrl *string `json:"website_url,omitempty"`
}

// OrganizationsUpdate represents the payload to update a organizations
type OrganizationsUpdate struct {
	Arr *float64 `json:"arr,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	DefaultCurrency *string `json:"default_currency,omitempty"`
	DeletedAt *string `json:"deleted_at,omitempty"`
	Email *string `json:"email,omitempty"`
	EmployeeNumber *string `json:"employee_number,omitempty"`
	Industry *string `json:"industry,omitempty"`
	IsDeleted *bool `json:"is_deleted,omitempty"`
	IsStarterBusiness *bool `json:"is_starter_business,omitempty"`
	LogoUrl *string `json:"logo_url,omitempty"`
	MerchantLifetimeValue *float64 `json:"merchant_lifetime_value,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	Mrr *float64 `json:"mrr,omitempty"`
	Name *string `json:"name,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	PhoneNumber *string `json:"phone_number,omitempty"`
	PinCode *string `json:"pin_code,omitempty"`
	Slug *string `json:"slug,omitempty"`
	Status *string `json:"status,omitempty"`
	StorefrontEnabled *bool `json:"storefront_enabled,omitempty"`
	TotalCustomers *float64 `json:"total_customers,omitempty"`
	TotalMerchants *float64 `json:"total_merchants,omitempty"`
	TotalRevenue *float64 `json:"total_revenue,omitempty"`
	TotalTransactions *float64 `json:"total_transactions,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	VerificationStatus *string `json:"verification_status,omitempty"`
	WebsiteUrl *string `json:"website_url,omitempty"`
}

// Customers represents a customers
type Customers struct {
	Address *string `json:"address"`
	City *string `json:"city"`
	Country *string `json:"country"`
	CreatedAt string `json:"created_at"`
	CreatedBy *string `json:"created_by"`
	CustomerId string `json:"customer_id"`
	DeletedAt *string `json:"deleted_at"`
	Email *string `json:"email"`
	Environment string `json:"environment"`
	IsBusiness bool `json:"is_business"`
	IsDeleted bool `json:"is_deleted"`
	Metadata *map[string]interface{} `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PhoneNumber *string `json:"phone_number"`
	PostalCode *string `json:"postal_code"`
	ProviderCustomerId *string `json:"provider_customer_id"`
	SpiAliasMbno *string `json:"spi_alias_mbno"`
	SpiAliasShid *string `json:"spi_alias_shid"`
	SpiPrimaryAlias *string `json:"spi_primary_alias"`
	UpdatedAt string `json:"updated_at"`
	WhatsappNumber *string `json:"whatsapp_number"`
}

// CustomersCreate represents the payload to create a customers
type CustomersCreate struct {
	Address *string `json:"address,omitempty"`
	City *string `json:"city,omitempty"`
	Country *string `json:"country,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CustomerId *string `json:"customer_id,omitempty"`
	DeletedAt *string `json:"deleted_at,omitempty"`
	Email *string `json:"email,omitempty"`
	Environment *string `json:"environment,omitempty"`
	IsBusiness *bool `json:"is_business,omitempty"`
	IsDeleted *bool `json:"is_deleted,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PhoneNumber *string `json:"phone_number,omitempty"`
	PostalCode *string `json:"postal_code,omitempty"`
	ProviderCustomerId *string `json:"provider_customer_id,omitempty"`
	SpiAliasMbno *string `json:"spi_alias_mbno,omitempty"`
	SpiAliasShid *string `json:"spi_alias_shid,omitempty"`
	SpiPrimaryAlias *string `json:"spi_primary_alias,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	WhatsappNumber *string `json:"whatsapp_number,omitempty"`
}

// CustomersUpdate represents the payload to update a customers
type CustomersUpdate struct {
	Address *string `json:"address,omitempty"`
	City *string `json:"city,omitempty"`
	Country *string `json:"country,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CustomerId *string `json:"customer_id,omitempty"`
	DeletedAt *string `json:"deleted_at,omitempty"`
	Email *string `json:"email,omitempty"`
	Environment *string `json:"environment,omitempty"`
	IsBusiness *bool `json:"is_business,omitempty"`
	IsDeleted *bool `json:"is_deleted,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	Name *string `json:"name,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	PhoneNumber *string `json:"phone_number,omitempty"`
	PostalCode *string `json:"postal_code,omitempty"`
	ProviderCustomerId *string `json:"provider_customer_id,omitempty"`
	SpiAliasMbno *string `json:"spi_alias_mbno,omitempty"`
	SpiAliasShid *string `json:"spi_alias_shid,omitempty"`
	SpiPrimaryAlias *string `json:"spi_primary_alias,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	WhatsappNumber *string `json:"whatsapp_number,omitempty"`
}

// PaymentRequests represents a payment_requests
type PaymentRequests struct {
	Amount float64 `json:"amount"`
	CreatedAt string `json:"created_at"`
	CreatedBy *string `json:"created_by"`
	CurrencyCode string `json:"currency_code"`
	CustomerId *string `json:"customer_id"`
	Description *string `json:"description"`
	Environment string `json:"environment"`
	ExpiryDate string `json:"expiry_date"`
	OrganizationId string `json:"organization_id"`
	PaymentLink *string `json:"payment_link"`
	PaymentReference *string `json:"payment_reference"`
	RequestId string `json:"request_id"`
	SpiAccountNumber *string `json:"spi_account_number"`
	SpiBulkInstructionId *string `json:"spi_bulk_instruction_id"`
	SpiConfirmation bool `json:"spi_confirmation"`
	SpiDateEnvoi *string `json:"spi_date_envoi"`
	SpiDateIrrevocabilite *string `json:"spi_date_irrevocabilite"`
	SpiDateLimitePaiement *string `json:"spi_date_limite_paiement"`
	SpiDateLimiteReponse *string `json:"spi_date_limite_reponse"`
	SpiDateRejet *string `json:"spi_date_rejet"`
	SpiDebitDiffere bool `json:"spi_debit_differe"`
	SpiEnd2endId *string `json:"spi_end2end_id"`
	SpiPayeurAlias *string `json:"spi_payeur_alias"`
	SpiPayeurNom *string `json:"spi_payeur_nom"`
	SpiPayeurPays *string `json:"spi_payeur_pays"`
	SpiRefDocNumero *string `json:"spi_ref_doc_numero"`
	SpiRemiseAmount *float64 `json:"spi_remise_amount"`
	SpiRemiseRate *float64 `json:"spi_remise_rate"`
	SpiTxId *string `json:"spi_tx_id"`
	Status string `json:"status"`
	UpdatedAt string `json:"updated_at"`
}

// PaymentRequestsCreate represents the payload to create a payment_requests
type PaymentRequestsCreate struct {
	Amount float64 `json:"amount"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CurrencyCode string `json:"currency_code"`
	CustomerId *string `json:"customer_id,omitempty"`
	Description *string `json:"description,omitempty"`
	Environment *string `json:"environment,omitempty"`
	ExpiryDate string `json:"expiry_date"`
	OrganizationId string `json:"organization_id"`
	PaymentLink *string `json:"payment_link,omitempty"`
	PaymentReference *string `json:"payment_reference,omitempty"`
	RequestId *string `json:"request_id,omitempty"`
	SpiAccountNumber *string `json:"spi_account_number,omitempty"`
	SpiBulkInstructionId *string `json:"spi_bulk_instruction_id,omitempty"`
	SpiConfirmation *bool `json:"spi_confirmation,omitempty"`
	SpiDateEnvoi *string `json:"spi_date_envoi,omitempty"`
	SpiDateIrrevocabilite *string `json:"spi_date_irrevocabilite,omitempty"`
	SpiDateLimitePaiement *string `json:"spi_date_limite_paiement,omitempty"`
	SpiDateLimiteReponse *string `json:"spi_date_limite_reponse,omitempty"`
	SpiDateRejet *string `json:"spi_date_rejet,omitempty"`
	SpiDebitDiffere *bool `json:"spi_debit_differe,omitempty"`
	SpiEnd2endId *string `json:"spi_end2end_id,omitempty"`
	SpiPayeurAlias *string `json:"spi_payeur_alias,omitempty"`
	SpiPayeurNom *string `json:"spi_payeur_nom,omitempty"`
	SpiPayeurPays *string `json:"spi_payeur_pays,omitempty"`
	SpiRefDocNumero *string `json:"spi_ref_doc_numero,omitempty"`
	SpiRemiseAmount *float64 `json:"spi_remise_amount,omitempty"`
	SpiRemiseRate *float64 `json:"spi_remise_rate,omitempty"`
	SpiTxId *string `json:"spi_tx_id,omitempty"`
	Status *string `json:"status,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// PaymentRequestsUpdate represents the payload to update a payment_requests
type PaymentRequestsUpdate struct {
	Amount *float64 `json:"amount,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CurrencyCode *string `json:"currency_code,omitempty"`
	CustomerId *string `json:"customer_id,omitempty"`
	Description *string `json:"description,omitempty"`
	Environment *string `json:"environment,omitempty"`
	ExpiryDate *string `json:"expiry_date,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	PaymentLink *string `json:"payment_link,omitempty"`
	PaymentReference *string `json:"payment_reference,omitempty"`
	RequestId *string `json:"request_id,omitempty"`
	SpiAccountNumber *string `json:"spi_account_number,omitempty"`
	SpiBulkInstructionId *string `json:"spi_bulk_instruction_id,omitempty"`
	SpiConfirmation *bool `json:"spi_confirmation,omitempty"`
	SpiDateEnvoi *string `json:"spi_date_envoi,omitempty"`
	SpiDateIrrevocabilite *string `json:"spi_date_irrevocabilite,omitempty"`
	SpiDateLimitePaiement *string `json:"spi_date_limite_paiement,omitempty"`
	SpiDateLimiteReponse *string `json:"spi_date_limite_reponse,omitempty"`
	SpiDateRejet *string `json:"spi_date_rejet,omitempty"`
	SpiDebitDiffere *bool `json:"spi_debit_differe,omitempty"`
	SpiEnd2endId *string `json:"spi_end2end_id,omitempty"`
	SpiPayeurAlias *string `json:"spi_payeur_alias,omitempty"`
	SpiPayeurNom *string `json:"spi_payeur_nom,omitempty"`
	SpiPayeurPays *string `json:"spi_payeur_pays,omitempty"`
	SpiRefDocNumero *string `json:"spi_ref_doc_numero,omitempty"`
	SpiRemiseAmount *float64 `json:"spi_remise_amount,omitempty"`
	SpiRemiseRate *float64 `json:"spi_remise_rate,omitempty"`
	SpiTxId *string `json:"spi_tx_id,omitempty"`
	Status *string `json:"status,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// Transactions represents a transactions
type Transactions struct {
	CheckoutSessionId *string `json:"checkout_session_id"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	CustomerId string `json:"customer_id"`
	Description *string `json:"description"`
	DiscountAmount float64 `json:"discount_amount"`
	Environment string `json:"environment"`
	FeeAmount float64 `json:"fee_amount"`
	FeeStructureId *string `json:"fee_structure_id"`
	GrossAmount float64 `json:"gross_amount"`
	IntegrationSource string `json:"integration_source"`
	IsBnpl bool `json:"is_bnpl"`
	IsPos bool `json:"is_pos"`
	Metadata *map[string]interface{} `json:"metadata"`
	NetAmount float64 `json:"net_amount"`
	OrganizationId string `json:"organization_id"`
	PaymentMethodCode string `json:"payment_method_code"`
	PriceId *string `json:"price_id"`
	ProductId *string `json:"product_id"`
	ProviderCode string `json:"provider_code"`
	Quantity float64 `json:"quantity"`
	SpiAccountNumber *string `json:"spi_account_number"`
	SpiBulkInstructionId *string `json:"spi_bulk_instruction_id"`
	SpiDateEnvoi *string `json:"spi_date_envoi"`
	SpiDateIrrevocabilite *string `json:"spi_date_irrevocabilite"`
	SpiDiscountAmount *float64 `json:"spi_discount_amount"`
	SpiDiscountRate *float64 `json:"spi_discount_rate"`
	SpiEnd2endId *string `json:"spi_end2end_id"`
	SpiTxId *string `json:"spi_tx_id"`
	Status string `json:"status"`
	StripePaymentIntentId *string `json:"stripe_payment_intent_id"`
	SubscriptionId *string `json:"subscription_id"`
	TransactionId string `json:"transaction_id"`
	TransactionType string `json:"transaction_type"`
	UpdatedAt string `json:"updated_at"`
}

// TransactionsCreate represents the payload to create a transactions
type TransactionsCreate struct {
	CheckoutSessionId *string `json:"checkout_session_id,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CurrencyCode *string `json:"currency_code,omitempty"`
	CustomerId string `json:"customer_id"`
	Description *string `json:"description,omitempty"`
	DiscountAmount *float64 `json:"discount_amount,omitempty"`
	Environment *string `json:"environment,omitempty"`
	FeeAmount float64 `json:"fee_amount"`
	FeeStructureId *string `json:"fee_structure_id,omitempty"`
	GrossAmount float64 `json:"gross_amount"`
	IntegrationSource *string `json:"integration_source,omitempty"`
	IsBnpl *bool `json:"is_bnpl,omitempty"`
	IsPos *bool `json:"is_pos,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	NetAmount float64 `json:"net_amount"`
	OrganizationId string `json:"organization_id"`
	PaymentMethodCode string `json:"payment_method_code"`
	PriceId *string `json:"price_id,omitempty"`
	ProductId *string `json:"product_id,omitempty"`
	ProviderCode string `json:"provider_code"`
	Quantity *float64 `json:"quantity,omitempty"`
	SpiAccountNumber *string `json:"spi_account_number,omitempty"`
	SpiBulkInstructionId *string `json:"spi_bulk_instruction_id,omitempty"`
	SpiDateEnvoi *string `json:"spi_date_envoi,omitempty"`
	SpiDateIrrevocabilite *string `json:"spi_date_irrevocabilite,omitempty"`
	SpiDiscountAmount *float64 `json:"spi_discount_amount,omitempty"`
	SpiDiscountRate *float64 `json:"spi_discount_rate,omitempty"`
	SpiEnd2endId *string `json:"spi_end2end_id,omitempty"`
	SpiTxId *string `json:"spi_tx_id,omitempty"`
	Status *string `json:"status,omitempty"`
	StripePaymentIntentId *string `json:"stripe_payment_intent_id,omitempty"`
	SubscriptionId *string `json:"subscription_id,omitempty"`
	TransactionId *string `json:"transaction_id,omitempty"`
	TransactionType string `json:"transaction_type"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// TransactionsUpdate represents the payload to update a transactions
type TransactionsUpdate struct {
	CheckoutSessionId *string `json:"checkout_session_id,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CurrencyCode *string `json:"currency_code,omitempty"`
	CustomerId *string `json:"customer_id,omitempty"`
	Description *string `json:"description,omitempty"`
	DiscountAmount *float64 `json:"discount_amount,omitempty"`
	Environment *string `json:"environment,omitempty"`
	FeeAmount *float64 `json:"fee_amount,omitempty"`
	FeeStructureId *string `json:"fee_structure_id,omitempty"`
	GrossAmount *float64 `json:"gross_amount,omitempty"`
	IntegrationSource *string `json:"integration_source,omitempty"`
	IsBnpl *bool `json:"is_bnpl,omitempty"`
	IsPos *bool `json:"is_pos,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	NetAmount *float64 `json:"net_amount,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	PaymentMethodCode *string `json:"payment_method_code,omitempty"`
	PriceId *string `json:"price_id,omitempty"`
	ProductId *string `json:"product_id,omitempty"`
	ProviderCode *string `json:"provider_code,omitempty"`
	Quantity *float64 `json:"quantity,omitempty"`
	SpiAccountNumber *string `json:"spi_account_number,omitempty"`
	SpiBulkInstructionId *string `json:"spi_bulk_instruction_id,omitempty"`
	SpiDateEnvoi *string `json:"spi_date_envoi,omitempty"`
	SpiDateIrrevocabilite *string `json:"spi_date_irrevocabilite,omitempty"`
	SpiDiscountAmount *float64 `json:"spi_discount_amount,omitempty"`
	SpiDiscountRate *float64 `json:"spi_discount_rate,omitempty"`
	SpiEnd2endId *string `json:"spi_end2end_id,omitempty"`
	SpiTxId *string `json:"spi_tx_id,omitempty"`
	Status *string `json:"status,omitempty"`
	StripePaymentIntentId *string `json:"stripe_payment_intent_id,omitempty"`
	SubscriptionId *string `json:"subscription_id,omitempty"`
	TransactionId *string `json:"transaction_id,omitempty"`
	TransactionType *string `json:"transaction_type,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// Refunds represents a refunds
type Refunds struct {
	Amount float64 `json:"amount"`
	CreatedAt string `json:"created_at"`
	Environment string `json:"environment"`
	FeeAmount float64 `json:"fee_amount"`
	Metadata *map[string]interface{} `json:"metadata"`
	Reason *string `json:"reason"`
	RefundId string `json:"refund_id"`
	RefundedAmount float64 `json:"refunded_amount"`
	SpiAccountNumber *string `json:"spi_account_number"`
	SpiEnd2endId *string `json:"spi_end2end_id"`
	SpiRetourDateDemande *string `json:"spi_retour_date_demande"`
	SpiRetourDateIrrevocabilite *string `json:"spi_retour_date_irrevocabilite"`
	SpiTxId *string `json:"spi_tx_id"`
	Status string `json:"status"`
	TransactionId string `json:"transaction_id"`
	UpdatedAt string `json:"updated_at"`
}

// RefundsCreate represents the payload to create a refunds
type RefundsCreate struct {
	Amount float64 `json:"amount"`
	CreatedAt *string `json:"created_at,omitempty"`
	Environment *string `json:"environment,omitempty"`
	FeeAmount *float64 `json:"fee_amount,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	Reason *string `json:"reason,omitempty"`
	RefundId *string `json:"refund_id,omitempty"`
	RefundedAmount float64 `json:"refunded_amount"`
	SpiAccountNumber *string `json:"spi_account_number,omitempty"`
	SpiEnd2endId *string `json:"spi_end2end_id,omitempty"`
	SpiRetourDateDemande *string `json:"spi_retour_date_demande,omitempty"`
	SpiRetourDateIrrevocabilite *string `json:"spi_retour_date_irrevocabilite,omitempty"`
	SpiTxId *string `json:"spi_tx_id,omitempty"`
	Status *string `json:"status,omitempty"`
	TransactionId string `json:"transaction_id"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// RefundsUpdate represents the payload to update a refunds
type RefundsUpdate struct {
	Amount *float64 `json:"amount,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	Environment *string `json:"environment,omitempty"`
	FeeAmount *float64 `json:"fee_amount,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	Reason *string `json:"reason,omitempty"`
	RefundId *string `json:"refund_id,omitempty"`
	RefundedAmount *float64 `json:"refunded_amount,omitempty"`
	SpiAccountNumber *string `json:"spi_account_number,omitempty"`
	SpiEnd2endId *string `json:"spi_end2end_id,omitempty"`
	SpiRetourDateDemande *string `json:"spi_retour_date_demande,omitempty"`
	SpiRetourDateIrrevocabilite *string `json:"spi_retour_date_irrevocabilite,omitempty"`
	SpiTxId *string `json:"spi_tx_id,omitempty"`
	Status *string `json:"status,omitempty"`
	TransactionId *string `json:"transaction_id,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// Products represents a products
type Products struct {
	ChargeDay *float64 `json:"charge_day"`
	ContinueSellingWhenOutOfStock *bool `json:"continue_selling_when_out_of_stock"`
	CreatedAt string `json:"created_at"`
	CreatedBy *string `json:"created_by"`
	Description *string `json:"description"`
	DisplayOnStorefront bool `json:"display_on_storefront"`
	Environment string `json:"environment"`
	Images *[]string `json:"images"`
	InventoryQuantity *float64 `json:"inventory_quantity"`
	IsActive bool `json:"is_active"`
	Metadata *map[string]interface{} `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	ProductId string `json:"product_id"`
	ProductType string `json:"product_type"`
	Sku *string `json:"sku"`
	TrackInventory *bool `json:"track_inventory"`
	TrialEnabled bool `json:"trial_enabled"`
	TrialPeriodDays *float64 `json:"trial_period_days"`
	UpdatedAt string `json:"updated_at"`
	UsageUnit *string `json:"usage_unit"`
}

// ProductsCreate represents the payload to create a products
type ProductsCreate struct {
	ChargeDay *float64 `json:"charge_day,omitempty"`
	ContinueSellingWhenOutOfStock *bool `json:"continue_selling_when_out_of_stock,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	Description *string `json:"description,omitempty"`
	DisplayOnStorefront *bool `json:"display_on_storefront,omitempty"`
	Environment *string `json:"environment,omitempty"`
	Images *[]string `json:"images,omitempty"`
	InventoryQuantity *float64 `json:"inventory_quantity,omitempty"`
	IsActive *bool `json:"is_active,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	ProductId *string `json:"product_id,omitempty"`
	ProductType *string `json:"product_type,omitempty"`
	Sku *string `json:"sku,omitempty"`
	TrackInventory *bool `json:"track_inventory,omitempty"`
	TrialEnabled *bool `json:"trial_enabled,omitempty"`
	TrialPeriodDays *float64 `json:"trial_period_days,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	UsageUnit *string `json:"usage_unit,omitempty"`
}

// ProductsUpdate represents the payload to update a products
type ProductsUpdate struct {
	ChargeDay *float64 `json:"charge_day,omitempty"`
	ContinueSellingWhenOutOfStock *bool `json:"continue_selling_when_out_of_stock,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	Description *string `json:"description,omitempty"`
	DisplayOnStorefront *bool `json:"display_on_storefront,omitempty"`
	Environment *string `json:"environment,omitempty"`
	Images *[]string `json:"images,omitempty"`
	InventoryQuantity *float64 `json:"inventory_quantity,omitempty"`
	IsActive *bool `json:"is_active,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	Name *string `json:"name,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	ProductId *string `json:"product_id,omitempty"`
	ProductType *string `json:"product_type,omitempty"`
	Sku *string `json:"sku,omitempty"`
	TrackInventory *bool `json:"track_inventory,omitempty"`
	TrialEnabled *bool `json:"trial_enabled,omitempty"`
	TrialPeriodDays *float64 `json:"trial_period_days,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	UsageUnit *string `json:"usage_unit,omitempty"`
}

// Subscriptions represents a subscriptions
type Subscriptions struct {
	CreatedAt string `json:"created_at"`
	CreatedBy *string `json:"created_by"`
	CustomerId string `json:"customer_id"`
	EndDate *string `json:"end_date"`
	Environment string `json:"environment"`
	Metadata *map[string]interface{} `json:"metadata"`
	NextBillingDate *string `json:"next_billing_date"`
	OrganizationId string `json:"organization_id"`
	PriceId *string `json:"price_id"`
	ProductId string `json:"product_id"`
	ProviderPaymentMethodId *string `json:"provider_payment_method_id"`
	StartDate string `json:"start_date"`
	Status string `json:"status"`
	SubscriptionId string `json:"subscription_id"`
	UpdatedAt string `json:"updated_at"`
}

// SubscriptionsCreate represents the payload to create a subscriptions
type SubscriptionsCreate struct {
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CustomerId string `json:"customer_id"`
	EndDate *string `json:"end_date,omitempty"`
	Environment *string `json:"environment,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	NextBillingDate *string `json:"next_billing_date,omitempty"`
	OrganizationId string `json:"organization_id"`
	PriceId *string `json:"price_id,omitempty"`
	ProductId string `json:"product_id"`
	ProviderPaymentMethodId *string `json:"provider_payment_method_id,omitempty"`
	StartDate string `json:"start_date"`
	Status *string `json:"status,omitempty"`
	SubscriptionId *string `json:"subscription_id,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// SubscriptionsUpdate represents the payload to update a subscriptions
type SubscriptionsUpdate struct {
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CustomerId *string `json:"customer_id,omitempty"`
	EndDate *string `json:"end_date,omitempty"`
	Environment *string `json:"environment,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	NextBillingDate *string `json:"next_billing_date,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	PriceId *string `json:"price_id,omitempty"`
	ProductId *string `json:"product_id,omitempty"`
	ProviderPaymentMethodId *string `json:"provider_payment_method_id,omitempty"`
	StartDate *string `json:"start_date,omitempty"`
	Status *string `json:"status,omitempty"`
	SubscriptionId *string `json:"subscription_id,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// DiscountCoupons represents a discount_coupons
type DiscountCoupons struct {
	Code string `json:"code"`
	CouponId string `json:"coupon_id"`
	CreatedAt string `json:"created_at"`
	CurrentUses float64 `json:"current_uses"`
	CustomerType string `json:"customer_type"`
	Description *string `json:"description"`
	DiscountFixedAmount *float64 `json:"discount_fixed_amount"`
	DiscountPercentage *float64 `json:"discount_percentage"`
	DiscountType string `json:"discount_type"`
	Environment string `json:"environment"`
	ExpiresAt *string `json:"expires_at"`
	IsActive bool `json:"is_active"`
	MaxQuantityPerUse *float64 `json:"max_quantity_per_use"`
	MaxUses *float64 `json:"max_uses"`
	OrganizationId string `json:"organization_id"`
	ScopeType string `json:"scope_type"`
	UpdatedAt string `json:"updated_at"`
	UsageFrequencyLimit string `json:"usage_frequency_limit"`
	UsageLimitValue *float64 `json:"usage_limit_value"`
	ValidFrom *string `json:"valid_from"`
}

// DiscountCouponsCreate represents the payload to create a discount_coupons
type DiscountCouponsCreate struct {
	Code string `json:"code"`
	CouponId *string `json:"coupon_id,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CurrentUses *float64 `json:"current_uses,omitempty"`
	CustomerType *string `json:"customer_type,omitempty"`
	Description *string `json:"description,omitempty"`
	DiscountFixedAmount *float64 `json:"discount_fixed_amount,omitempty"`
	DiscountPercentage *float64 `json:"discount_percentage,omitempty"`
	DiscountType *string `json:"discount_type,omitempty"`
	Environment *string `json:"environment,omitempty"`
	ExpiresAt *string `json:"expires_at,omitempty"`
	IsActive *bool `json:"is_active,omitempty"`
	MaxQuantityPerUse *float64 `json:"max_quantity_per_use,omitempty"`
	MaxUses *float64 `json:"max_uses,omitempty"`
	OrganizationId string `json:"organization_id"`
	ScopeType *string `json:"scope_type,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	UsageFrequencyLimit *string `json:"usage_frequency_limit,omitempty"`
	UsageLimitValue *float64 `json:"usage_limit_value,omitempty"`
	ValidFrom *string `json:"valid_from,omitempty"`
}

// DiscountCouponsUpdate represents the payload to update a discount_coupons
type DiscountCouponsUpdate struct {
	Code *string `json:"code,omitempty"`
	CouponId *string `json:"coupon_id,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CurrentUses *float64 `json:"current_uses,omitempty"`
	CustomerType *string `json:"customer_type,omitempty"`
	Description *string `json:"description,omitempty"`
	DiscountFixedAmount *float64 `json:"discount_fixed_amount,omitempty"`
	DiscountPercentage *float64 `json:"discount_percentage,omitempty"`
	DiscountType *string `json:"discount_type,omitempty"`
	Environment *string `json:"environment,omitempty"`
	ExpiresAt *string `json:"expires_at,omitempty"`
	IsActive *bool `json:"is_active,omitempty"`
	MaxQuantityPerUse *float64 `json:"max_quantity_per_use,omitempty"`
	MaxUses *float64 `json:"max_uses,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	ScopeType *string `json:"scope_type,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	UsageFrequencyLimit *string `json:"usage_frequency_limit,omitempty"`
	UsageLimitValue *float64 `json:"usage_limit_value,omitempty"`
	ValidFrom *string `json:"valid_from,omitempty"`
}

// CheckoutSessions represents a checkout_sessions
type CheckoutSessions struct {
	AllowCouponCode bool `json:"allow_coupon_code"`
	AllowQuantity bool `json:"allow_quantity"`
	Amount float64 `json:"amount"`
	CancelUrl *string `json:"cancel_url"`
	CheckoutSessionId string `json:"checkout_session_id"`
	CheckoutUrl *string `json:"checkout_url"`
	CreatedAt string `json:"created_at"`
	CreatedBy *string `json:"created_by"`
	CurrencyCode string `json:"currency_code"`
	CustomerEmail *string `json:"customer_email"`
	CustomerId *string `json:"customer_id"`
	CustomerName *string `json:"customer_name"`
	CustomerPhone *string `json:"customer_phone"`
	Description *string `json:"description"`
	Environment string `json:"environment"`
	ExpiresAt string `json:"expires_at"`
	InstallmentPlanId *string `json:"installment_plan_id"`
	IntegrationSource string `json:"integration_source"`
	IsPos bool `json:"is_pos"`
	IsSpi bool `json:"is_spi"`
	Metadata *map[string]interface{} `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PaymentLinkId *string `json:"payment_link_id"`
	PaymentRequestId *string `json:"payment_request_id"`
	PriceId *string `json:"price_id"`
	ProductId *string `json:"product_id"`
	QrCodeData *map[string]interface{} `json:"qr_code_data"`
	QrCodeType *string `json:"qr_code_type"`
	Quantity float64 `json:"quantity"`
	RequireBillingAddress bool `json:"require_billing_address"`
	SpiAccountNumber *string `json:"spi_account_number"`
	SpiQrCodeId *string `json:"spi_qr_code_id"`
	Status string `json:"status"`
	SubscriptionId *string `json:"subscription_id"`
	SuccessUrl *string `json:"success_url"`
	Title *string `json:"title"`
	UpdatedAt string `json:"updated_at"`
}

// CheckoutSessionsCreate represents the payload to create a checkout_sessions
type CheckoutSessionsCreate struct {
	AllowCouponCode *bool `json:"allow_coupon_code,omitempty"`
	AllowQuantity *bool `json:"allow_quantity,omitempty"`
	Amount float64 `json:"amount"`
	CancelUrl *string `json:"cancel_url,omitempty"`
	CheckoutSessionId *string `json:"checkout_session_id,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CurrencyCode string `json:"currency_code"`
	CustomerEmail *string `json:"customer_email,omitempty"`
	CustomerId *string `json:"customer_id,omitempty"`
	CustomerName *string `json:"customer_name,omitempty"`
	CustomerPhone *string `json:"customer_phone,omitempty"`
	Description *string `json:"description,omitempty"`
	Environment *string `json:"environment,omitempty"`
	ExpiresAt string `json:"expires_at"`
	InstallmentPlanId *string `json:"installment_plan_id,omitempty"`
	IntegrationSource *string `json:"integration_source,omitempty"`
	IsPos *bool `json:"is_pos,omitempty"`
	IsSpi *bool `json:"is_spi,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	OrganizationId string `json:"organization_id"`
	PaymentLinkId *string `json:"payment_link_id,omitempty"`
	PaymentRequestId *string `json:"payment_request_id,omitempty"`
	PriceId *string `json:"price_id,omitempty"`
	ProductId *string `json:"product_id,omitempty"`
	QrCodeData *map[string]interface{} `json:"qr_code_data,omitempty"`
	QrCodeType *string `json:"qr_code_type,omitempty"`
	Quantity *float64 `json:"quantity,omitempty"`
	RequireBillingAddress *bool `json:"require_billing_address,omitempty"`
	SpiAccountNumber *string `json:"spi_account_number,omitempty"`
	SpiQrCodeId *string `json:"spi_qr_code_id,omitempty"`
	Status *string `json:"status,omitempty"`
	SubscriptionId *string `json:"subscription_id,omitempty"`
	SuccessUrl *string `json:"success_url,omitempty"`
	Title *string `json:"title,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// CheckoutSessionsUpdate represents the payload to update a checkout_sessions
type CheckoutSessionsUpdate struct {
	AllowCouponCode *bool `json:"allow_coupon_code,omitempty"`
	AllowQuantity *bool `json:"allow_quantity,omitempty"`
	Amount *float64 `json:"amount,omitempty"`
	CancelUrl *string `json:"cancel_url,omitempty"`
	CheckoutSessionId *string `json:"checkout_session_id,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CurrencyCode *string `json:"currency_code,omitempty"`
	CustomerEmail *string `json:"customer_email,omitempty"`
	CustomerId *string `json:"customer_id,omitempty"`
	CustomerName *string `json:"customer_name,omitempty"`
	CustomerPhone *string `json:"customer_phone,omitempty"`
	Description *string `json:"description,omitempty"`
	Environment *string `json:"environment,omitempty"`
	ExpiresAt *string `json:"expires_at,omitempty"`
	InstallmentPlanId *string `json:"installment_plan_id,omitempty"`
	IntegrationSource *string `json:"integration_source,omitempty"`
	IsPos *bool `json:"is_pos,omitempty"`
	IsSpi *bool `json:"is_spi,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	PaymentLinkId *string `json:"payment_link_id,omitempty"`
	PaymentRequestId *string `json:"payment_request_id,omitempty"`
	PriceId *string `json:"price_id,omitempty"`
	ProductId *string `json:"product_id,omitempty"`
	QrCodeData *map[string]interface{} `json:"qr_code_data,omitempty"`
	QrCodeType *string `json:"qr_code_type,omitempty"`
	Quantity *float64 `json:"quantity,omitempty"`
	RequireBillingAddress *bool `json:"require_billing_address,omitempty"`
	SpiAccountNumber *string `json:"spi_account_number,omitempty"`
	SpiQrCodeId *string `json:"spi_qr_code_id,omitempty"`
	Status *string `json:"status,omitempty"`
	SubscriptionId *string `json:"subscription_id,omitempty"`
	SuccessUrl *string `json:"success_url,omitempty"`
	Title *string `json:"title,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// PaymentLinks represents a payment_links
type PaymentLinks struct {
	AllowCouponCode bool `json:"allow_coupon_code"`
	AllowQuantity bool `json:"allow_quantity"`
	Amount *float64 `json:"amount"`
	CancelUrl *string `json:"cancel_url"`
	CreatedAt string `json:"created_at"`
	CreatedBy *string `json:"created_by"`
	CurrencyCode string `json:"currency_code"`
	Description *string `json:"description"`
	Environment string `json:"environment"`
	ExpiresAt *string `json:"expires_at"`
	IsActive bool `json:"is_active"`
	LinkId string `json:"link_id"`
	LinkType string `json:"link_type"`
	Metadata *map[string]interface{} `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PriceId *string `json:"price_id"`
	ProductId *string `json:"product_id"`
	Quantity float64 `json:"quantity"`
	RequireBillingAddress bool `json:"require_billing_address"`
	SuccessUrl *string `json:"success_url"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	Url string `json:"url"`
}

// PaymentLinksCreate represents the payload to create a payment_links
type PaymentLinksCreate struct {
	AllowCouponCode *bool `json:"allow_coupon_code,omitempty"`
	AllowQuantity *bool `json:"allow_quantity,omitempty"`
	Amount *float64 `json:"amount,omitempty"`
	CancelUrl *string `json:"cancel_url,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CurrencyCode string `json:"currency_code"`
	Description *string `json:"description,omitempty"`
	Environment *string `json:"environment,omitempty"`
	ExpiresAt *string `json:"expires_at,omitempty"`
	IsActive *bool `json:"is_active,omitempty"`
	LinkId *string `json:"link_id,omitempty"`
	LinkType string `json:"link_type"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	OrganizationId string `json:"organization_id"`
	PriceId *string `json:"price_id,omitempty"`
	ProductId *string `json:"product_id,omitempty"`
	Quantity *float64 `json:"quantity,omitempty"`
	RequireBillingAddress *bool `json:"require_billing_address,omitempty"`
	SuccessUrl *string `json:"success_url,omitempty"`
	Title string `json:"title"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	Url string `json:"url"`
}

// PaymentLinksUpdate represents the payload to update a payment_links
type PaymentLinksUpdate struct {
	AllowCouponCode *bool `json:"allow_coupon_code,omitempty"`
	AllowQuantity *bool `json:"allow_quantity,omitempty"`
	Amount *float64 `json:"amount,omitempty"`
	CancelUrl *string `json:"cancel_url,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CurrencyCode *string `json:"currency_code,omitempty"`
	Description *string `json:"description,omitempty"`
	Environment *string `json:"environment,omitempty"`
	ExpiresAt *string `json:"expires_at,omitempty"`
	IsActive *bool `json:"is_active,omitempty"`
	LinkId *string `json:"link_id,omitempty"`
	LinkType *string `json:"link_type,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	PriceId *string `json:"price_id,omitempty"`
	ProductId *string `json:"product_id,omitempty"`
	Quantity *float64 `json:"quantity,omitempty"`
	RequireBillingAddress *bool `json:"require_billing_address,omitempty"`
	SuccessUrl *string `json:"success_url,omitempty"`
	Title *string `json:"title,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	Url *string `json:"url,omitempty"`
}

// Payouts represents a payouts
type Payouts struct {
	AccountId string `json:"account_id"`
	Amount float64 `json:"amount"`
	CreatedAt string `json:"created_at"`
	CreatedBy *string `json:"created_by"`
	CurrencyCode string `json:"currency_code"`
	Environment string `json:"environment"`
	Metadata *map[string]interface{} `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayoutId string `json:"payout_id"`
	PayoutMethodId *string `json:"payout_method_id"`
	ProviderCode *string `json:"provider_code"`
	Status string `json:"status"`
	UpdatedAt string `json:"updated_at"`
}

// PayoutsCreate represents the payload to create a payouts
type PayoutsCreate struct {
	AccountId string `json:"account_id"`
	Amount float64 `json:"amount"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CurrencyCode string `json:"currency_code"`
	Environment *string `json:"environment,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	OrganizationId string `json:"organization_id"`
	PayoutId *string `json:"payout_id,omitempty"`
	PayoutMethodId *string `json:"payout_method_id,omitempty"`
	ProviderCode *string `json:"provider_code,omitempty"`
	Status *string `json:"status,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// PayoutsUpdate represents the payload to update a payouts
type PayoutsUpdate struct {
	AccountId *string `json:"account_id,omitempty"`
	Amount *float64 `json:"amount,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CurrencyCode *string `json:"currency_code,omitempty"`
	Environment *string `json:"environment,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	PayoutId *string `json:"payout_id,omitempty"`
	PayoutMethodId *string `json:"payout_method_id,omitempty"`
	ProviderCode *string `json:"provider_code,omitempty"`
	Status *string `json:"status,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// BeneficiaryPayouts represents a beneficiary_payouts
type BeneficiaryPayouts struct {
	AccountId string `json:"account_id"`
	Amount float64 `json:"amount"`
	CreatedAt string `json:"created_at"`
	CreatedBy *string `json:"created_by"`
	CurrencyCode string `json:"currency_code"`
	Metadata *map[string]interface{} `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayoutId string `json:"payout_id"`
	PayoutMethodId *string `json:"payout_method_id"`
	ProviderCode *string `json:"provider_code"`
	SpiBulkInstructionId *string `json:"spi_bulk_instruction_id"`
	Status string `json:"status"`
	UpdatedAt string `json:"updated_at"`
}

// BeneficiaryPayoutsCreate represents the payload to create a beneficiary_payouts
type BeneficiaryPayoutsCreate struct {
	AccountId string `json:"account_id"`
	Amount float64 `json:"amount"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CurrencyCode string `json:"currency_code"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	OrganizationId string `json:"organization_id"`
	PayoutId *string `json:"payout_id,omitempty"`
	PayoutMethodId *string `json:"payout_method_id,omitempty"`
	ProviderCode *string `json:"provider_code,omitempty"`
	SpiBulkInstructionId *string `json:"spi_bulk_instruction_id,omitempty"`
	Status *string `json:"status,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// BeneficiaryPayoutsUpdate represents the payload to update a beneficiary_payouts
type BeneficiaryPayoutsUpdate struct {
	AccountId *string `json:"account_id,omitempty"`
	Amount *float64 `json:"amount,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	CurrencyCode *string `json:"currency_code,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	PayoutId *string `json:"payout_id,omitempty"`
	PayoutMethodId *string `json:"payout_method_id,omitempty"`
	ProviderCode *string `json:"provider_code,omitempty"`
	SpiBulkInstructionId *string `json:"spi_bulk_instruction_id,omitempty"`
	Status *string `json:"status,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
}

// Webhooks represents a webhooks
type Webhooks struct {
	AuthorizedEvents string `json:"authorized_events"`
	CreatedAt string `json:"created_at"`
	CreatedBy *string `json:"created_by"`
	DeletedAt *string `json:"deleted_at"`
	Environment string `json:"environment"`
	IsActive bool `json:"is_active"`
	LastPayload *map[string]interface{} `json:"last_payload"`
	LastResponseBody *string `json:"last_response_body"`
	LastResponseStatus *float64 `json:"last_response_status"`
	LastTriggeredAt *string `json:"last_triggered_at"`
	Metadata *map[string]interface{} `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	RetryCount *float64 `json:"retry_count"`
	SpiEventTypes *[]string `json:"spi_event_types"`
	SupportsSpi bool `json:"supports_spi"`
	UpdatedAt string `json:"updated_at"`
	Url string `json:"url"`
	VerificationToken string `json:"verification_token"`
	WebhookId string `json:"webhook_id"`
}

// WebhooksCreate represents the payload to create a webhooks
type WebhooksCreate struct {
	AuthorizedEvents *string `json:"authorized_events,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	DeletedAt *string `json:"deleted_at,omitempty"`
	Environment *string `json:"environment,omitempty"`
	IsActive *bool `json:"is_active,omitempty"`
	LastPayload *map[string]interface{} `json:"last_payload,omitempty"`
	LastResponseBody *string `json:"last_response_body,omitempty"`
	LastResponseStatus *float64 `json:"last_response_status,omitempty"`
	LastTriggeredAt *string `json:"last_triggered_at,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	OrganizationId string `json:"organization_id"`
	RetryCount *float64 `json:"retry_count,omitempty"`
	SpiEventTypes *[]string `json:"spi_event_types,omitempty"`
	SupportsSpi *bool `json:"supports_spi,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	Url string `json:"url"`
	VerificationToken string `json:"verification_token"`
	WebhookId *string `json:"webhook_id,omitempty"`
}

// WebhooksUpdate represents the payload to update a webhooks
type WebhooksUpdate struct {
	AuthorizedEvents *string `json:"authorized_events,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CreatedBy *string `json:"created_by,omitempty"`
	DeletedAt *string `json:"deleted_at,omitempty"`
	Environment *string `json:"environment,omitempty"`
	IsActive *bool `json:"is_active,omitempty"`
	LastPayload *map[string]interface{} `json:"last_payload,omitempty"`
	LastResponseBody *string `json:"last_response_body,omitempty"`
	LastResponseStatus *float64 `json:"last_response_status,omitempty"`
	LastTriggeredAt *string `json:"last_triggered_at,omitempty"`
	Metadata *map[string]interface{} `json:"metadata,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	RetryCount *float64 `json:"retry_count,omitempty"`
	SpiEventTypes *[]string `json:"spi_event_types,omitempty"`
	SupportsSpi *bool `json:"supports_spi,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	Url *string `json:"url,omitempty"`
	VerificationToken *string `json:"verification_token,omitempty"`
	WebhookId *string `json:"webhook_id,omitempty"`
}

// WebhookDeliveryLogs represents a webhook_delivery_logs
type WebhookDeliveryLogs struct {
	Amount *float64 `json:"amount"`
	AttemptNumber float64 `json:"attempt_number"`
	ComptePaye *string `json:"compte_paye"`
	ComptePayeur *string `json:"compte_payeur"`
	CreatedAt string `json:"created_at"`
	EventType string `json:"event_type"`
	Headers *map[string]interface{} `json:"headers"`
	IpAddress *string `json:"ip_address"`
	LogId string `json:"log_id"`
	OrganizationId string `json:"organization_id"`
	Payload map[string]interface{} `json:"payload"`
	RequestDurationMs *float64 `json:"request_duration_ms"`
	ResponseBody *string `json:"response_body"`
	ResponseStatus *float64 `json:"response_status"`
	SpiTxId *string `json:"spi_tx_id"`
	Success bool `json:"success"`
	UserAgent *string `json:"user_agent"`
	WebhookId string `json:"webhook_id"`
}

// WebhookDeliveryLogsCreate represents the payload to create a webhook_delivery_logs
type WebhookDeliveryLogsCreate struct {
	Amount *float64 `json:"amount,omitempty"`
	AttemptNumber *float64 `json:"attempt_number,omitempty"`
	ComptePaye *string `json:"compte_paye,omitempty"`
	ComptePayeur *string `json:"compte_payeur,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	EventType string `json:"event_type"`
	Headers *map[string]interface{} `json:"headers,omitempty"`
	IpAddress *string `json:"ip_address,omitempty"`
	LogId *string `json:"log_id,omitempty"`
	OrganizationId string `json:"organization_id"`
	Payload map[string]interface{} `json:"payload"`
	RequestDurationMs *float64 `json:"request_duration_ms,omitempty"`
	ResponseBody *string `json:"response_body,omitempty"`
	ResponseStatus *float64 `json:"response_status,omitempty"`
	SpiTxId *string `json:"spi_tx_id,omitempty"`
	Success *bool `json:"success,omitempty"`
	UserAgent *string `json:"user_agent,omitempty"`
	WebhookId string `json:"webhook_id"`
}

// WebhookDeliveryLogsUpdate represents the payload to update a webhook_delivery_logs
type WebhookDeliveryLogsUpdate struct {
	Amount *float64 `json:"amount,omitempty"`
	AttemptNumber *float64 `json:"attempt_number,omitempty"`
	ComptePaye *string `json:"compte_paye,omitempty"`
	ComptePayeur *string `json:"compte_payeur,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	EventType *string `json:"event_type,omitempty"`
	Headers *map[string]interface{} `json:"headers,omitempty"`
	IpAddress *string `json:"ip_address,omitempty"`
	LogId *string `json:"log_id,omitempty"`
	OrganizationId *string `json:"organization_id,omitempty"`
	Payload *map[string]interface{} `json:"payload,omitempty"`
	RequestDurationMs *float64 `json:"request_duration_ms,omitempty"`
	ResponseBody *string `json:"response_body,omitempty"`
	ResponseStatus *float64 `json:"response_status,omitempty"`
	SpiTxId *string `json:"spi_tx_id,omitempty"`
	Success *bool `json:"success,omitempty"`
	UserAgent *string `json:"user_agent,omitempty"`
	WebhookId *string `json:"webhook_id,omitempty"`
}

