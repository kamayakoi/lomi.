# Transactions

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**CheckoutSessionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**CurrencyCode** | Pointer to **string** | Three-letter ISO currency code (e.g., XOF, USD, EUR) | [optional] 
**CustomerId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Description** | Pointer to **string** |  | [optional] 
**DiscountAmount** | Pointer to **float64** |  | [optional] 
**Environment** | Pointer to **string** |  | [optional] 
**FeeAmount** | Pointer to **float64** |  | [optional] 
**FeeStructureId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**GrossAmount** | Pointer to **float64** |  | [optional] 
**IsBnpl** | Pointer to **bool** |  | [optional] 
**IsPos** | Pointer to **bool** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**NetAmount** | Pointer to **float64** |  | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PaymentMethodCode** | Pointer to **string** |  | [optional] 
**PriceId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ProviderCode** | Pointer to **string** |  | [optional] 
**Quantity** | Pointer to **float64** |  | [optional] 
**SpiAccountNumber** | Pointer to **string** |  | [optional] 
**SpiBulkInstructionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**SpiDateEnvoi** | Pointer to **string** |  | [optional] 
**SpiDateIrrevocabilite** | Pointer to **string** |  | [optional] 
**SpiDiscountAmount** | Pointer to **float64** |  | [optional] 
**SpiDiscountRate** | Pointer to **float64** |  | [optional] 
**SpiEnd2endId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**SpiPaymentCategory** | Pointer to **string** |  | [optional] 
**SpiPaymentFlowType** | Pointer to **string** |  | [optional] 
**SpiPaymentStatus** | Pointer to **string** |  | [optional] 
**SpiRejectionReason** | Pointer to **string** |  | [optional] 
**SpiTxId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Status** | Pointer to **string** | Current status of the resource | [optional] 
**SubscriptionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**TransactionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] [readonly] 
**TransactionType** | Pointer to **string** |  | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 

## Methods

### NewTransactions

`func NewTransactions() *Transactions`

NewTransactions instantiates a new Transactions object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewTransactionsWithDefaults

`func NewTransactionsWithDefaults() *Transactions`

NewTransactionsWithDefaults instantiates a new Transactions object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCheckoutSessionId

`func (o *Transactions) GetCheckoutSessionId() string`

GetCheckoutSessionId returns the CheckoutSessionId field if non-nil, zero value otherwise.

### GetCheckoutSessionIdOk

`func (o *Transactions) GetCheckoutSessionIdOk() (*string, bool)`

GetCheckoutSessionIdOk returns a tuple with the CheckoutSessionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCheckoutSessionId

`func (o *Transactions) SetCheckoutSessionId(v string)`

SetCheckoutSessionId sets CheckoutSessionId field to given value.

### HasCheckoutSessionId

`func (o *Transactions) HasCheckoutSessionId() bool`

HasCheckoutSessionId returns a boolean if a field has been set.

### GetCreatedAt

`func (o *Transactions) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *Transactions) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *Transactions) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *Transactions) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *Transactions) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *Transactions) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *Transactions) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *Transactions) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetCustomerId

`func (o *Transactions) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *Transactions) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *Transactions) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *Transactions) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetDescription

`func (o *Transactions) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *Transactions) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *Transactions) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *Transactions) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetDiscountAmount

`func (o *Transactions) GetDiscountAmount() float64`

GetDiscountAmount returns the DiscountAmount field if non-nil, zero value otherwise.

### GetDiscountAmountOk

`func (o *Transactions) GetDiscountAmountOk() (*float64, bool)`

GetDiscountAmountOk returns a tuple with the DiscountAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDiscountAmount

`func (o *Transactions) SetDiscountAmount(v float64)`

SetDiscountAmount sets DiscountAmount field to given value.

### HasDiscountAmount

`func (o *Transactions) HasDiscountAmount() bool`

HasDiscountAmount returns a boolean if a field has been set.

### GetEnvironment

`func (o *Transactions) GetEnvironment() string`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *Transactions) GetEnvironmentOk() (*string, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *Transactions) SetEnvironment(v string)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *Transactions) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetFeeAmount

`func (o *Transactions) GetFeeAmount() float64`

GetFeeAmount returns the FeeAmount field if non-nil, zero value otherwise.

### GetFeeAmountOk

`func (o *Transactions) GetFeeAmountOk() (*float64, bool)`

GetFeeAmountOk returns a tuple with the FeeAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFeeAmount

`func (o *Transactions) SetFeeAmount(v float64)`

SetFeeAmount sets FeeAmount field to given value.

### HasFeeAmount

`func (o *Transactions) HasFeeAmount() bool`

HasFeeAmount returns a boolean if a field has been set.

### GetFeeStructureId

`func (o *Transactions) GetFeeStructureId() string`

GetFeeStructureId returns the FeeStructureId field if non-nil, zero value otherwise.

### GetFeeStructureIdOk

`func (o *Transactions) GetFeeStructureIdOk() (*string, bool)`

GetFeeStructureIdOk returns a tuple with the FeeStructureId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFeeStructureId

`func (o *Transactions) SetFeeStructureId(v string)`

SetFeeStructureId sets FeeStructureId field to given value.

### HasFeeStructureId

`func (o *Transactions) HasFeeStructureId() bool`

HasFeeStructureId returns a boolean if a field has been set.

### GetGrossAmount

`func (o *Transactions) GetGrossAmount() float64`

GetGrossAmount returns the GrossAmount field if non-nil, zero value otherwise.

### GetGrossAmountOk

`func (o *Transactions) GetGrossAmountOk() (*float64, bool)`

GetGrossAmountOk returns a tuple with the GrossAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetGrossAmount

`func (o *Transactions) SetGrossAmount(v float64)`

SetGrossAmount sets GrossAmount field to given value.

### HasGrossAmount

`func (o *Transactions) HasGrossAmount() bool`

HasGrossAmount returns a boolean if a field has been set.

### GetIsBnpl

`func (o *Transactions) GetIsBnpl() bool`

GetIsBnpl returns the IsBnpl field if non-nil, zero value otherwise.

### GetIsBnplOk

`func (o *Transactions) GetIsBnplOk() (*bool, bool)`

GetIsBnplOk returns a tuple with the IsBnpl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsBnpl

`func (o *Transactions) SetIsBnpl(v bool)`

SetIsBnpl sets IsBnpl field to given value.

### HasIsBnpl

`func (o *Transactions) HasIsBnpl() bool`

HasIsBnpl returns a boolean if a field has been set.

### GetIsPos

`func (o *Transactions) GetIsPos() bool`

GetIsPos returns the IsPos field if non-nil, zero value otherwise.

### GetIsPosOk

`func (o *Transactions) GetIsPosOk() (*bool, bool)`

GetIsPosOk returns a tuple with the IsPos field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsPos

`func (o *Transactions) SetIsPos(v bool)`

SetIsPos sets IsPos field to given value.

### HasIsPos

`func (o *Transactions) HasIsPos() bool`

HasIsPos returns a boolean if a field has been set.

### GetMetadata

`func (o *Transactions) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *Transactions) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *Transactions) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *Transactions) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetNetAmount

`func (o *Transactions) GetNetAmount() float64`

GetNetAmount returns the NetAmount field if non-nil, zero value otherwise.

### GetNetAmountOk

`func (o *Transactions) GetNetAmountOk() (*float64, bool)`

GetNetAmountOk returns a tuple with the NetAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNetAmount

`func (o *Transactions) SetNetAmount(v float64)`

SetNetAmount sets NetAmount field to given value.

### HasNetAmount

`func (o *Transactions) HasNetAmount() bool`

HasNetAmount returns a boolean if a field has been set.

### GetOrganizationId

`func (o *Transactions) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *Transactions) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *Transactions) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *Transactions) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetPaymentMethodCode

`func (o *Transactions) GetPaymentMethodCode() string`

GetPaymentMethodCode returns the PaymentMethodCode field if non-nil, zero value otherwise.

### GetPaymentMethodCodeOk

`func (o *Transactions) GetPaymentMethodCodeOk() (*string, bool)`

GetPaymentMethodCodeOk returns a tuple with the PaymentMethodCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentMethodCode

`func (o *Transactions) SetPaymentMethodCode(v string)`

SetPaymentMethodCode sets PaymentMethodCode field to given value.

### HasPaymentMethodCode

`func (o *Transactions) HasPaymentMethodCode() bool`

HasPaymentMethodCode returns a boolean if a field has been set.

### GetPriceId

`func (o *Transactions) GetPriceId() string`

GetPriceId returns the PriceId field if non-nil, zero value otherwise.

### GetPriceIdOk

`func (o *Transactions) GetPriceIdOk() (*string, bool)`

GetPriceIdOk returns a tuple with the PriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriceId

`func (o *Transactions) SetPriceId(v string)`

SetPriceId sets PriceId field to given value.

### HasPriceId

`func (o *Transactions) HasPriceId() bool`

HasPriceId returns a boolean if a field has been set.

### GetProductId

`func (o *Transactions) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *Transactions) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *Transactions) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *Transactions) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetProviderCode

`func (o *Transactions) GetProviderCode() string`

GetProviderCode returns the ProviderCode field if non-nil, zero value otherwise.

### GetProviderCodeOk

`func (o *Transactions) GetProviderCodeOk() (*string, bool)`

GetProviderCodeOk returns a tuple with the ProviderCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderCode

`func (o *Transactions) SetProviderCode(v string)`

SetProviderCode sets ProviderCode field to given value.

### HasProviderCode

`func (o *Transactions) HasProviderCode() bool`

HasProviderCode returns a boolean if a field has been set.

### GetQuantity

`func (o *Transactions) GetQuantity() float64`

GetQuantity returns the Quantity field if non-nil, zero value otherwise.

### GetQuantityOk

`func (o *Transactions) GetQuantityOk() (*float64, bool)`

GetQuantityOk returns a tuple with the Quantity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQuantity

`func (o *Transactions) SetQuantity(v float64)`

SetQuantity sets Quantity field to given value.

### HasQuantity

`func (o *Transactions) HasQuantity() bool`

HasQuantity returns a boolean if a field has been set.

### GetSpiAccountNumber

`func (o *Transactions) GetSpiAccountNumber() string`

GetSpiAccountNumber returns the SpiAccountNumber field if non-nil, zero value otherwise.

### GetSpiAccountNumberOk

`func (o *Transactions) GetSpiAccountNumberOk() (*string, bool)`

GetSpiAccountNumberOk returns a tuple with the SpiAccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAccountNumber

`func (o *Transactions) SetSpiAccountNumber(v string)`

SetSpiAccountNumber sets SpiAccountNumber field to given value.

### HasSpiAccountNumber

`func (o *Transactions) HasSpiAccountNumber() bool`

HasSpiAccountNumber returns a boolean if a field has been set.

### GetSpiBulkInstructionId

`func (o *Transactions) GetSpiBulkInstructionId() string`

GetSpiBulkInstructionId returns the SpiBulkInstructionId field if non-nil, zero value otherwise.

### GetSpiBulkInstructionIdOk

`func (o *Transactions) GetSpiBulkInstructionIdOk() (*string, bool)`

GetSpiBulkInstructionIdOk returns a tuple with the SpiBulkInstructionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiBulkInstructionId

`func (o *Transactions) SetSpiBulkInstructionId(v string)`

SetSpiBulkInstructionId sets SpiBulkInstructionId field to given value.

### HasSpiBulkInstructionId

`func (o *Transactions) HasSpiBulkInstructionId() bool`

HasSpiBulkInstructionId returns a boolean if a field has been set.

### GetSpiDateEnvoi

`func (o *Transactions) GetSpiDateEnvoi() string`

GetSpiDateEnvoi returns the SpiDateEnvoi field if non-nil, zero value otherwise.

### GetSpiDateEnvoiOk

`func (o *Transactions) GetSpiDateEnvoiOk() (*string, bool)`

GetSpiDateEnvoiOk returns a tuple with the SpiDateEnvoi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateEnvoi

`func (o *Transactions) SetSpiDateEnvoi(v string)`

SetSpiDateEnvoi sets SpiDateEnvoi field to given value.

### HasSpiDateEnvoi

`func (o *Transactions) HasSpiDateEnvoi() bool`

HasSpiDateEnvoi returns a boolean if a field has been set.

### GetSpiDateIrrevocabilite

`func (o *Transactions) GetSpiDateIrrevocabilite() string`

GetSpiDateIrrevocabilite returns the SpiDateIrrevocabilite field if non-nil, zero value otherwise.

### GetSpiDateIrrevocabiliteOk

`func (o *Transactions) GetSpiDateIrrevocabiliteOk() (*string, bool)`

GetSpiDateIrrevocabiliteOk returns a tuple with the SpiDateIrrevocabilite field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateIrrevocabilite

`func (o *Transactions) SetSpiDateIrrevocabilite(v string)`

SetSpiDateIrrevocabilite sets SpiDateIrrevocabilite field to given value.

### HasSpiDateIrrevocabilite

`func (o *Transactions) HasSpiDateIrrevocabilite() bool`

HasSpiDateIrrevocabilite returns a boolean if a field has been set.

### GetSpiDiscountAmount

`func (o *Transactions) GetSpiDiscountAmount() float64`

GetSpiDiscountAmount returns the SpiDiscountAmount field if non-nil, zero value otherwise.

### GetSpiDiscountAmountOk

`func (o *Transactions) GetSpiDiscountAmountOk() (*float64, bool)`

GetSpiDiscountAmountOk returns a tuple with the SpiDiscountAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDiscountAmount

`func (o *Transactions) SetSpiDiscountAmount(v float64)`

SetSpiDiscountAmount sets SpiDiscountAmount field to given value.

### HasSpiDiscountAmount

`func (o *Transactions) HasSpiDiscountAmount() bool`

HasSpiDiscountAmount returns a boolean if a field has been set.

### GetSpiDiscountRate

`func (o *Transactions) GetSpiDiscountRate() float64`

GetSpiDiscountRate returns the SpiDiscountRate field if non-nil, zero value otherwise.

### GetSpiDiscountRateOk

`func (o *Transactions) GetSpiDiscountRateOk() (*float64, bool)`

GetSpiDiscountRateOk returns a tuple with the SpiDiscountRate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDiscountRate

`func (o *Transactions) SetSpiDiscountRate(v float64)`

SetSpiDiscountRate sets SpiDiscountRate field to given value.

### HasSpiDiscountRate

`func (o *Transactions) HasSpiDiscountRate() bool`

HasSpiDiscountRate returns a boolean if a field has been set.

### GetSpiEnd2endId

`func (o *Transactions) GetSpiEnd2endId() string`

GetSpiEnd2endId returns the SpiEnd2endId field if non-nil, zero value otherwise.

### GetSpiEnd2endIdOk

`func (o *Transactions) GetSpiEnd2endIdOk() (*string, bool)`

GetSpiEnd2endIdOk returns a tuple with the SpiEnd2endId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiEnd2endId

`func (o *Transactions) SetSpiEnd2endId(v string)`

SetSpiEnd2endId sets SpiEnd2endId field to given value.

### HasSpiEnd2endId

`func (o *Transactions) HasSpiEnd2endId() bool`

HasSpiEnd2endId returns a boolean if a field has been set.

### GetSpiPaymentCategory

`func (o *Transactions) GetSpiPaymentCategory() string`

GetSpiPaymentCategory returns the SpiPaymentCategory field if non-nil, zero value otherwise.

### GetSpiPaymentCategoryOk

`func (o *Transactions) GetSpiPaymentCategoryOk() (*string, bool)`

GetSpiPaymentCategoryOk returns a tuple with the SpiPaymentCategory field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentCategory

`func (o *Transactions) SetSpiPaymentCategory(v string)`

SetSpiPaymentCategory sets SpiPaymentCategory field to given value.

### HasSpiPaymentCategory

`func (o *Transactions) HasSpiPaymentCategory() bool`

HasSpiPaymentCategory returns a boolean if a field has been set.

### GetSpiPaymentFlowType

`func (o *Transactions) GetSpiPaymentFlowType() string`

GetSpiPaymentFlowType returns the SpiPaymentFlowType field if non-nil, zero value otherwise.

### GetSpiPaymentFlowTypeOk

`func (o *Transactions) GetSpiPaymentFlowTypeOk() (*string, bool)`

GetSpiPaymentFlowTypeOk returns a tuple with the SpiPaymentFlowType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentFlowType

`func (o *Transactions) SetSpiPaymentFlowType(v string)`

SetSpiPaymentFlowType sets SpiPaymentFlowType field to given value.

### HasSpiPaymentFlowType

`func (o *Transactions) HasSpiPaymentFlowType() bool`

HasSpiPaymentFlowType returns a boolean if a field has been set.

### GetSpiPaymentStatus

`func (o *Transactions) GetSpiPaymentStatus() string`

GetSpiPaymentStatus returns the SpiPaymentStatus field if non-nil, zero value otherwise.

### GetSpiPaymentStatusOk

`func (o *Transactions) GetSpiPaymentStatusOk() (*string, bool)`

GetSpiPaymentStatusOk returns a tuple with the SpiPaymentStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentStatus

`func (o *Transactions) SetSpiPaymentStatus(v string)`

SetSpiPaymentStatus sets SpiPaymentStatus field to given value.

### HasSpiPaymentStatus

`func (o *Transactions) HasSpiPaymentStatus() bool`

HasSpiPaymentStatus returns a boolean if a field has been set.

### GetSpiRejectionReason

`func (o *Transactions) GetSpiRejectionReason() string`

GetSpiRejectionReason returns the SpiRejectionReason field if non-nil, zero value otherwise.

### GetSpiRejectionReasonOk

`func (o *Transactions) GetSpiRejectionReasonOk() (*string, bool)`

GetSpiRejectionReasonOk returns a tuple with the SpiRejectionReason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRejectionReason

`func (o *Transactions) SetSpiRejectionReason(v string)`

SetSpiRejectionReason sets SpiRejectionReason field to given value.

### HasSpiRejectionReason

`func (o *Transactions) HasSpiRejectionReason() bool`

HasSpiRejectionReason returns a boolean if a field has been set.

### GetSpiTxId

`func (o *Transactions) GetSpiTxId() string`

GetSpiTxId returns the SpiTxId field if non-nil, zero value otherwise.

### GetSpiTxIdOk

`func (o *Transactions) GetSpiTxIdOk() (*string, bool)`

GetSpiTxIdOk returns a tuple with the SpiTxId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiTxId

`func (o *Transactions) SetSpiTxId(v string)`

SetSpiTxId sets SpiTxId field to given value.

### HasSpiTxId

`func (o *Transactions) HasSpiTxId() bool`

HasSpiTxId returns a boolean if a field has been set.

### GetStatus

`func (o *Transactions) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *Transactions) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *Transactions) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *Transactions) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetSubscriptionId

`func (o *Transactions) GetSubscriptionId() string`

GetSubscriptionId returns the SubscriptionId field if non-nil, zero value otherwise.

### GetSubscriptionIdOk

`func (o *Transactions) GetSubscriptionIdOk() (*string, bool)`

GetSubscriptionIdOk returns a tuple with the SubscriptionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubscriptionId

`func (o *Transactions) SetSubscriptionId(v string)`

SetSubscriptionId sets SubscriptionId field to given value.

### HasSubscriptionId

`func (o *Transactions) HasSubscriptionId() bool`

HasSubscriptionId returns a boolean if a field has been set.

### GetTransactionId

`func (o *Transactions) GetTransactionId() string`

GetTransactionId returns the TransactionId field if non-nil, zero value otherwise.

### GetTransactionIdOk

`func (o *Transactions) GetTransactionIdOk() (*string, bool)`

GetTransactionIdOk returns a tuple with the TransactionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTransactionId

`func (o *Transactions) SetTransactionId(v string)`

SetTransactionId sets TransactionId field to given value.

### HasTransactionId

`func (o *Transactions) HasTransactionId() bool`

HasTransactionId returns a boolean if a field has been set.

### GetTransactionType

`func (o *Transactions) GetTransactionType() string`

GetTransactionType returns the TransactionType field if non-nil, zero value otherwise.

### GetTransactionTypeOk

`func (o *Transactions) GetTransactionTypeOk() (*string, bool)`

GetTransactionTypeOk returns a tuple with the TransactionType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTransactionType

`func (o *Transactions) SetTransactionType(v string)`

SetTransactionType sets TransactionType field to given value.

### HasTransactionType

`func (o *Transactions) HasTransactionType() bool`

HasTransactionType returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *Transactions) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *Transactions) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *Transactions) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *Transactions) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


