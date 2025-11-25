# TransactionsUpdate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**CheckoutSessionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**CurrencyCode** | Pointer to **string** | Three-letter ISO currency code (e.g., XOF, USD, EUR) | [optional] 
**CustomerId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Description** | Pointer to **string** |  | [optional] 
**DiscountAmount** | Pointer to **float64** |  | [optional] 
**FeeAmount** | Pointer to **float64** |  | [optional] 
**FeeStructureId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**GrossAmount** | Pointer to **float64** |  | [optional] 
**IsBnpl** | Pointer to **bool** |  | [optional] 
**IsPos** | Pointer to **bool** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**NetAmount** | Pointer to **float64** |  | [optional] 
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
**TransactionType** | Pointer to **string** |  | [optional] 

## Methods

### NewTransactionsUpdate

`func NewTransactionsUpdate() *TransactionsUpdate`

NewTransactionsUpdate instantiates a new TransactionsUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewTransactionsUpdateWithDefaults

`func NewTransactionsUpdateWithDefaults() *TransactionsUpdate`

NewTransactionsUpdateWithDefaults instantiates a new TransactionsUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCheckoutSessionId

`func (o *TransactionsUpdate) GetCheckoutSessionId() string`

GetCheckoutSessionId returns the CheckoutSessionId field if non-nil, zero value otherwise.

### GetCheckoutSessionIdOk

`func (o *TransactionsUpdate) GetCheckoutSessionIdOk() (*string, bool)`

GetCheckoutSessionIdOk returns a tuple with the CheckoutSessionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCheckoutSessionId

`func (o *TransactionsUpdate) SetCheckoutSessionId(v string)`

SetCheckoutSessionId sets CheckoutSessionId field to given value.

### HasCheckoutSessionId

`func (o *TransactionsUpdate) HasCheckoutSessionId() bool`

HasCheckoutSessionId returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *TransactionsUpdate) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *TransactionsUpdate) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *TransactionsUpdate) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *TransactionsUpdate) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetCustomerId

`func (o *TransactionsUpdate) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *TransactionsUpdate) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *TransactionsUpdate) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *TransactionsUpdate) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetDescription

`func (o *TransactionsUpdate) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *TransactionsUpdate) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *TransactionsUpdate) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *TransactionsUpdate) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetDiscountAmount

`func (o *TransactionsUpdate) GetDiscountAmount() float64`

GetDiscountAmount returns the DiscountAmount field if non-nil, zero value otherwise.

### GetDiscountAmountOk

`func (o *TransactionsUpdate) GetDiscountAmountOk() (*float64, bool)`

GetDiscountAmountOk returns a tuple with the DiscountAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDiscountAmount

`func (o *TransactionsUpdate) SetDiscountAmount(v float64)`

SetDiscountAmount sets DiscountAmount field to given value.

### HasDiscountAmount

`func (o *TransactionsUpdate) HasDiscountAmount() bool`

HasDiscountAmount returns a boolean if a field has been set.

### GetFeeAmount

`func (o *TransactionsUpdate) GetFeeAmount() float64`

GetFeeAmount returns the FeeAmount field if non-nil, zero value otherwise.

### GetFeeAmountOk

`func (o *TransactionsUpdate) GetFeeAmountOk() (*float64, bool)`

GetFeeAmountOk returns a tuple with the FeeAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFeeAmount

`func (o *TransactionsUpdate) SetFeeAmount(v float64)`

SetFeeAmount sets FeeAmount field to given value.

### HasFeeAmount

`func (o *TransactionsUpdate) HasFeeAmount() bool`

HasFeeAmount returns a boolean if a field has been set.

### GetFeeStructureId

`func (o *TransactionsUpdate) GetFeeStructureId() string`

GetFeeStructureId returns the FeeStructureId field if non-nil, zero value otherwise.

### GetFeeStructureIdOk

`func (o *TransactionsUpdate) GetFeeStructureIdOk() (*string, bool)`

GetFeeStructureIdOk returns a tuple with the FeeStructureId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFeeStructureId

`func (o *TransactionsUpdate) SetFeeStructureId(v string)`

SetFeeStructureId sets FeeStructureId field to given value.

### HasFeeStructureId

`func (o *TransactionsUpdate) HasFeeStructureId() bool`

HasFeeStructureId returns a boolean if a field has been set.

### GetGrossAmount

`func (o *TransactionsUpdate) GetGrossAmount() float64`

GetGrossAmount returns the GrossAmount field if non-nil, zero value otherwise.

### GetGrossAmountOk

`func (o *TransactionsUpdate) GetGrossAmountOk() (*float64, bool)`

GetGrossAmountOk returns a tuple with the GrossAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetGrossAmount

`func (o *TransactionsUpdate) SetGrossAmount(v float64)`

SetGrossAmount sets GrossAmount field to given value.

### HasGrossAmount

`func (o *TransactionsUpdate) HasGrossAmount() bool`

HasGrossAmount returns a boolean if a field has been set.

### GetIsBnpl

`func (o *TransactionsUpdate) GetIsBnpl() bool`

GetIsBnpl returns the IsBnpl field if non-nil, zero value otherwise.

### GetIsBnplOk

`func (o *TransactionsUpdate) GetIsBnplOk() (*bool, bool)`

GetIsBnplOk returns a tuple with the IsBnpl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsBnpl

`func (o *TransactionsUpdate) SetIsBnpl(v bool)`

SetIsBnpl sets IsBnpl field to given value.

### HasIsBnpl

`func (o *TransactionsUpdate) HasIsBnpl() bool`

HasIsBnpl returns a boolean if a field has been set.

### GetIsPos

`func (o *TransactionsUpdate) GetIsPos() bool`

GetIsPos returns the IsPos field if non-nil, zero value otherwise.

### GetIsPosOk

`func (o *TransactionsUpdate) GetIsPosOk() (*bool, bool)`

GetIsPosOk returns a tuple with the IsPos field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsPos

`func (o *TransactionsUpdate) SetIsPos(v bool)`

SetIsPos sets IsPos field to given value.

### HasIsPos

`func (o *TransactionsUpdate) HasIsPos() bool`

HasIsPos returns a boolean if a field has been set.

### GetMetadata

`func (o *TransactionsUpdate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *TransactionsUpdate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *TransactionsUpdate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *TransactionsUpdate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetNetAmount

`func (o *TransactionsUpdate) GetNetAmount() float64`

GetNetAmount returns the NetAmount field if non-nil, zero value otherwise.

### GetNetAmountOk

`func (o *TransactionsUpdate) GetNetAmountOk() (*float64, bool)`

GetNetAmountOk returns a tuple with the NetAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNetAmount

`func (o *TransactionsUpdate) SetNetAmount(v float64)`

SetNetAmount sets NetAmount field to given value.

### HasNetAmount

`func (o *TransactionsUpdate) HasNetAmount() bool`

HasNetAmount returns a boolean if a field has been set.

### GetPaymentMethodCode

`func (o *TransactionsUpdate) GetPaymentMethodCode() string`

GetPaymentMethodCode returns the PaymentMethodCode field if non-nil, zero value otherwise.

### GetPaymentMethodCodeOk

`func (o *TransactionsUpdate) GetPaymentMethodCodeOk() (*string, bool)`

GetPaymentMethodCodeOk returns a tuple with the PaymentMethodCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentMethodCode

`func (o *TransactionsUpdate) SetPaymentMethodCode(v string)`

SetPaymentMethodCode sets PaymentMethodCode field to given value.

### HasPaymentMethodCode

`func (o *TransactionsUpdate) HasPaymentMethodCode() bool`

HasPaymentMethodCode returns a boolean if a field has been set.

### GetPriceId

`func (o *TransactionsUpdate) GetPriceId() string`

GetPriceId returns the PriceId field if non-nil, zero value otherwise.

### GetPriceIdOk

`func (o *TransactionsUpdate) GetPriceIdOk() (*string, bool)`

GetPriceIdOk returns a tuple with the PriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriceId

`func (o *TransactionsUpdate) SetPriceId(v string)`

SetPriceId sets PriceId field to given value.

### HasPriceId

`func (o *TransactionsUpdate) HasPriceId() bool`

HasPriceId returns a boolean if a field has been set.

### GetProductId

`func (o *TransactionsUpdate) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *TransactionsUpdate) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *TransactionsUpdate) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *TransactionsUpdate) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetProviderCode

`func (o *TransactionsUpdate) GetProviderCode() string`

GetProviderCode returns the ProviderCode field if non-nil, zero value otherwise.

### GetProviderCodeOk

`func (o *TransactionsUpdate) GetProviderCodeOk() (*string, bool)`

GetProviderCodeOk returns a tuple with the ProviderCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderCode

`func (o *TransactionsUpdate) SetProviderCode(v string)`

SetProviderCode sets ProviderCode field to given value.

### HasProviderCode

`func (o *TransactionsUpdate) HasProviderCode() bool`

HasProviderCode returns a boolean if a field has been set.

### GetQuantity

`func (o *TransactionsUpdate) GetQuantity() float64`

GetQuantity returns the Quantity field if non-nil, zero value otherwise.

### GetQuantityOk

`func (o *TransactionsUpdate) GetQuantityOk() (*float64, bool)`

GetQuantityOk returns a tuple with the Quantity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQuantity

`func (o *TransactionsUpdate) SetQuantity(v float64)`

SetQuantity sets Quantity field to given value.

### HasQuantity

`func (o *TransactionsUpdate) HasQuantity() bool`

HasQuantity returns a boolean if a field has been set.

### GetSpiAccountNumber

`func (o *TransactionsUpdate) GetSpiAccountNumber() string`

GetSpiAccountNumber returns the SpiAccountNumber field if non-nil, zero value otherwise.

### GetSpiAccountNumberOk

`func (o *TransactionsUpdate) GetSpiAccountNumberOk() (*string, bool)`

GetSpiAccountNumberOk returns a tuple with the SpiAccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAccountNumber

`func (o *TransactionsUpdate) SetSpiAccountNumber(v string)`

SetSpiAccountNumber sets SpiAccountNumber field to given value.

### HasSpiAccountNumber

`func (o *TransactionsUpdate) HasSpiAccountNumber() bool`

HasSpiAccountNumber returns a boolean if a field has been set.

### GetSpiBulkInstructionId

`func (o *TransactionsUpdate) GetSpiBulkInstructionId() string`

GetSpiBulkInstructionId returns the SpiBulkInstructionId field if non-nil, zero value otherwise.

### GetSpiBulkInstructionIdOk

`func (o *TransactionsUpdate) GetSpiBulkInstructionIdOk() (*string, bool)`

GetSpiBulkInstructionIdOk returns a tuple with the SpiBulkInstructionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiBulkInstructionId

`func (o *TransactionsUpdate) SetSpiBulkInstructionId(v string)`

SetSpiBulkInstructionId sets SpiBulkInstructionId field to given value.

### HasSpiBulkInstructionId

`func (o *TransactionsUpdate) HasSpiBulkInstructionId() bool`

HasSpiBulkInstructionId returns a boolean if a field has been set.

### GetSpiDateEnvoi

`func (o *TransactionsUpdate) GetSpiDateEnvoi() string`

GetSpiDateEnvoi returns the SpiDateEnvoi field if non-nil, zero value otherwise.

### GetSpiDateEnvoiOk

`func (o *TransactionsUpdate) GetSpiDateEnvoiOk() (*string, bool)`

GetSpiDateEnvoiOk returns a tuple with the SpiDateEnvoi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateEnvoi

`func (o *TransactionsUpdate) SetSpiDateEnvoi(v string)`

SetSpiDateEnvoi sets SpiDateEnvoi field to given value.

### HasSpiDateEnvoi

`func (o *TransactionsUpdate) HasSpiDateEnvoi() bool`

HasSpiDateEnvoi returns a boolean if a field has been set.

### GetSpiDateIrrevocabilite

`func (o *TransactionsUpdate) GetSpiDateIrrevocabilite() string`

GetSpiDateIrrevocabilite returns the SpiDateIrrevocabilite field if non-nil, zero value otherwise.

### GetSpiDateIrrevocabiliteOk

`func (o *TransactionsUpdate) GetSpiDateIrrevocabiliteOk() (*string, bool)`

GetSpiDateIrrevocabiliteOk returns a tuple with the SpiDateIrrevocabilite field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateIrrevocabilite

`func (o *TransactionsUpdate) SetSpiDateIrrevocabilite(v string)`

SetSpiDateIrrevocabilite sets SpiDateIrrevocabilite field to given value.

### HasSpiDateIrrevocabilite

`func (o *TransactionsUpdate) HasSpiDateIrrevocabilite() bool`

HasSpiDateIrrevocabilite returns a boolean if a field has been set.

### GetSpiDiscountAmount

`func (o *TransactionsUpdate) GetSpiDiscountAmount() float64`

GetSpiDiscountAmount returns the SpiDiscountAmount field if non-nil, zero value otherwise.

### GetSpiDiscountAmountOk

`func (o *TransactionsUpdate) GetSpiDiscountAmountOk() (*float64, bool)`

GetSpiDiscountAmountOk returns a tuple with the SpiDiscountAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDiscountAmount

`func (o *TransactionsUpdate) SetSpiDiscountAmount(v float64)`

SetSpiDiscountAmount sets SpiDiscountAmount field to given value.

### HasSpiDiscountAmount

`func (o *TransactionsUpdate) HasSpiDiscountAmount() bool`

HasSpiDiscountAmount returns a boolean if a field has been set.

### GetSpiDiscountRate

`func (o *TransactionsUpdate) GetSpiDiscountRate() float64`

GetSpiDiscountRate returns the SpiDiscountRate field if non-nil, zero value otherwise.

### GetSpiDiscountRateOk

`func (o *TransactionsUpdate) GetSpiDiscountRateOk() (*float64, bool)`

GetSpiDiscountRateOk returns a tuple with the SpiDiscountRate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDiscountRate

`func (o *TransactionsUpdate) SetSpiDiscountRate(v float64)`

SetSpiDiscountRate sets SpiDiscountRate field to given value.

### HasSpiDiscountRate

`func (o *TransactionsUpdate) HasSpiDiscountRate() bool`

HasSpiDiscountRate returns a boolean if a field has been set.

### GetSpiEnd2endId

`func (o *TransactionsUpdate) GetSpiEnd2endId() string`

GetSpiEnd2endId returns the SpiEnd2endId field if non-nil, zero value otherwise.

### GetSpiEnd2endIdOk

`func (o *TransactionsUpdate) GetSpiEnd2endIdOk() (*string, bool)`

GetSpiEnd2endIdOk returns a tuple with the SpiEnd2endId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiEnd2endId

`func (o *TransactionsUpdate) SetSpiEnd2endId(v string)`

SetSpiEnd2endId sets SpiEnd2endId field to given value.

### HasSpiEnd2endId

`func (o *TransactionsUpdate) HasSpiEnd2endId() bool`

HasSpiEnd2endId returns a boolean if a field has been set.

### GetSpiPaymentCategory

`func (o *TransactionsUpdate) GetSpiPaymentCategory() string`

GetSpiPaymentCategory returns the SpiPaymentCategory field if non-nil, zero value otherwise.

### GetSpiPaymentCategoryOk

`func (o *TransactionsUpdate) GetSpiPaymentCategoryOk() (*string, bool)`

GetSpiPaymentCategoryOk returns a tuple with the SpiPaymentCategory field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentCategory

`func (o *TransactionsUpdate) SetSpiPaymentCategory(v string)`

SetSpiPaymentCategory sets SpiPaymentCategory field to given value.

### HasSpiPaymentCategory

`func (o *TransactionsUpdate) HasSpiPaymentCategory() bool`

HasSpiPaymentCategory returns a boolean if a field has been set.

### GetSpiPaymentFlowType

`func (o *TransactionsUpdate) GetSpiPaymentFlowType() string`

GetSpiPaymentFlowType returns the SpiPaymentFlowType field if non-nil, zero value otherwise.

### GetSpiPaymentFlowTypeOk

`func (o *TransactionsUpdate) GetSpiPaymentFlowTypeOk() (*string, bool)`

GetSpiPaymentFlowTypeOk returns a tuple with the SpiPaymentFlowType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentFlowType

`func (o *TransactionsUpdate) SetSpiPaymentFlowType(v string)`

SetSpiPaymentFlowType sets SpiPaymentFlowType field to given value.

### HasSpiPaymentFlowType

`func (o *TransactionsUpdate) HasSpiPaymentFlowType() bool`

HasSpiPaymentFlowType returns a boolean if a field has been set.

### GetSpiPaymentStatus

`func (o *TransactionsUpdate) GetSpiPaymentStatus() string`

GetSpiPaymentStatus returns the SpiPaymentStatus field if non-nil, zero value otherwise.

### GetSpiPaymentStatusOk

`func (o *TransactionsUpdate) GetSpiPaymentStatusOk() (*string, bool)`

GetSpiPaymentStatusOk returns a tuple with the SpiPaymentStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentStatus

`func (o *TransactionsUpdate) SetSpiPaymentStatus(v string)`

SetSpiPaymentStatus sets SpiPaymentStatus field to given value.

### HasSpiPaymentStatus

`func (o *TransactionsUpdate) HasSpiPaymentStatus() bool`

HasSpiPaymentStatus returns a boolean if a field has been set.

### GetSpiRejectionReason

`func (o *TransactionsUpdate) GetSpiRejectionReason() string`

GetSpiRejectionReason returns the SpiRejectionReason field if non-nil, zero value otherwise.

### GetSpiRejectionReasonOk

`func (o *TransactionsUpdate) GetSpiRejectionReasonOk() (*string, bool)`

GetSpiRejectionReasonOk returns a tuple with the SpiRejectionReason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRejectionReason

`func (o *TransactionsUpdate) SetSpiRejectionReason(v string)`

SetSpiRejectionReason sets SpiRejectionReason field to given value.

### HasSpiRejectionReason

`func (o *TransactionsUpdate) HasSpiRejectionReason() bool`

HasSpiRejectionReason returns a boolean if a field has been set.

### GetSpiTxId

`func (o *TransactionsUpdate) GetSpiTxId() string`

GetSpiTxId returns the SpiTxId field if non-nil, zero value otherwise.

### GetSpiTxIdOk

`func (o *TransactionsUpdate) GetSpiTxIdOk() (*string, bool)`

GetSpiTxIdOk returns a tuple with the SpiTxId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiTxId

`func (o *TransactionsUpdate) SetSpiTxId(v string)`

SetSpiTxId sets SpiTxId field to given value.

### HasSpiTxId

`func (o *TransactionsUpdate) HasSpiTxId() bool`

HasSpiTxId returns a boolean if a field has been set.

### GetStatus

`func (o *TransactionsUpdate) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *TransactionsUpdate) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *TransactionsUpdate) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *TransactionsUpdate) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetSubscriptionId

`func (o *TransactionsUpdate) GetSubscriptionId() string`

GetSubscriptionId returns the SubscriptionId field if non-nil, zero value otherwise.

### GetSubscriptionIdOk

`func (o *TransactionsUpdate) GetSubscriptionIdOk() (*string, bool)`

GetSubscriptionIdOk returns a tuple with the SubscriptionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubscriptionId

`func (o *TransactionsUpdate) SetSubscriptionId(v string)`

SetSubscriptionId sets SubscriptionId field to given value.

### HasSubscriptionId

`func (o *TransactionsUpdate) HasSubscriptionId() bool`

HasSubscriptionId returns a boolean if a field has been set.

### GetTransactionType

`func (o *TransactionsUpdate) GetTransactionType() string`

GetTransactionType returns the TransactionType field if non-nil, zero value otherwise.

### GetTransactionTypeOk

`func (o *TransactionsUpdate) GetTransactionTypeOk() (*string, bool)`

GetTransactionTypeOk returns a tuple with the TransactionType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTransactionType

`func (o *TransactionsUpdate) SetTransactionType(v string)`

SetTransactionType sets TransactionType field to given value.

### HasTransactionType

`func (o *TransactionsUpdate) HasTransactionType() bool`

HasTransactionType returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


