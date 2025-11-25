# TransactionsCreate

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

### NewTransactionsCreate

`func NewTransactionsCreate() *TransactionsCreate`

NewTransactionsCreate instantiates a new TransactionsCreate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewTransactionsCreateWithDefaults

`func NewTransactionsCreateWithDefaults() *TransactionsCreate`

NewTransactionsCreateWithDefaults instantiates a new TransactionsCreate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCheckoutSessionId

`func (o *TransactionsCreate) GetCheckoutSessionId() string`

GetCheckoutSessionId returns the CheckoutSessionId field if non-nil, zero value otherwise.

### GetCheckoutSessionIdOk

`func (o *TransactionsCreate) GetCheckoutSessionIdOk() (*string, bool)`

GetCheckoutSessionIdOk returns a tuple with the CheckoutSessionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCheckoutSessionId

`func (o *TransactionsCreate) SetCheckoutSessionId(v string)`

SetCheckoutSessionId sets CheckoutSessionId field to given value.

### HasCheckoutSessionId

`func (o *TransactionsCreate) HasCheckoutSessionId() bool`

HasCheckoutSessionId returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *TransactionsCreate) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *TransactionsCreate) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *TransactionsCreate) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *TransactionsCreate) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetCustomerId

`func (o *TransactionsCreate) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *TransactionsCreate) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *TransactionsCreate) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *TransactionsCreate) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetDescription

`func (o *TransactionsCreate) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *TransactionsCreate) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *TransactionsCreate) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *TransactionsCreate) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetDiscountAmount

`func (o *TransactionsCreate) GetDiscountAmount() float64`

GetDiscountAmount returns the DiscountAmount field if non-nil, zero value otherwise.

### GetDiscountAmountOk

`func (o *TransactionsCreate) GetDiscountAmountOk() (*float64, bool)`

GetDiscountAmountOk returns a tuple with the DiscountAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDiscountAmount

`func (o *TransactionsCreate) SetDiscountAmount(v float64)`

SetDiscountAmount sets DiscountAmount field to given value.

### HasDiscountAmount

`func (o *TransactionsCreate) HasDiscountAmount() bool`

HasDiscountAmount returns a boolean if a field has been set.

### GetFeeAmount

`func (o *TransactionsCreate) GetFeeAmount() float64`

GetFeeAmount returns the FeeAmount field if non-nil, zero value otherwise.

### GetFeeAmountOk

`func (o *TransactionsCreate) GetFeeAmountOk() (*float64, bool)`

GetFeeAmountOk returns a tuple with the FeeAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFeeAmount

`func (o *TransactionsCreate) SetFeeAmount(v float64)`

SetFeeAmount sets FeeAmount field to given value.

### HasFeeAmount

`func (o *TransactionsCreate) HasFeeAmount() bool`

HasFeeAmount returns a boolean if a field has been set.

### GetFeeStructureId

`func (o *TransactionsCreate) GetFeeStructureId() string`

GetFeeStructureId returns the FeeStructureId field if non-nil, zero value otherwise.

### GetFeeStructureIdOk

`func (o *TransactionsCreate) GetFeeStructureIdOk() (*string, bool)`

GetFeeStructureIdOk returns a tuple with the FeeStructureId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFeeStructureId

`func (o *TransactionsCreate) SetFeeStructureId(v string)`

SetFeeStructureId sets FeeStructureId field to given value.

### HasFeeStructureId

`func (o *TransactionsCreate) HasFeeStructureId() bool`

HasFeeStructureId returns a boolean if a field has been set.

### GetGrossAmount

`func (o *TransactionsCreate) GetGrossAmount() float64`

GetGrossAmount returns the GrossAmount field if non-nil, zero value otherwise.

### GetGrossAmountOk

`func (o *TransactionsCreate) GetGrossAmountOk() (*float64, bool)`

GetGrossAmountOk returns a tuple with the GrossAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetGrossAmount

`func (o *TransactionsCreate) SetGrossAmount(v float64)`

SetGrossAmount sets GrossAmount field to given value.

### HasGrossAmount

`func (o *TransactionsCreate) HasGrossAmount() bool`

HasGrossAmount returns a boolean if a field has been set.

### GetIsBnpl

`func (o *TransactionsCreate) GetIsBnpl() bool`

GetIsBnpl returns the IsBnpl field if non-nil, zero value otherwise.

### GetIsBnplOk

`func (o *TransactionsCreate) GetIsBnplOk() (*bool, bool)`

GetIsBnplOk returns a tuple with the IsBnpl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsBnpl

`func (o *TransactionsCreate) SetIsBnpl(v bool)`

SetIsBnpl sets IsBnpl field to given value.

### HasIsBnpl

`func (o *TransactionsCreate) HasIsBnpl() bool`

HasIsBnpl returns a boolean if a field has been set.

### GetIsPos

`func (o *TransactionsCreate) GetIsPos() bool`

GetIsPos returns the IsPos field if non-nil, zero value otherwise.

### GetIsPosOk

`func (o *TransactionsCreate) GetIsPosOk() (*bool, bool)`

GetIsPosOk returns a tuple with the IsPos field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsPos

`func (o *TransactionsCreate) SetIsPos(v bool)`

SetIsPos sets IsPos field to given value.

### HasIsPos

`func (o *TransactionsCreate) HasIsPos() bool`

HasIsPos returns a boolean if a field has been set.

### GetMetadata

`func (o *TransactionsCreate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *TransactionsCreate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *TransactionsCreate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *TransactionsCreate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetNetAmount

`func (o *TransactionsCreate) GetNetAmount() float64`

GetNetAmount returns the NetAmount field if non-nil, zero value otherwise.

### GetNetAmountOk

`func (o *TransactionsCreate) GetNetAmountOk() (*float64, bool)`

GetNetAmountOk returns a tuple with the NetAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNetAmount

`func (o *TransactionsCreate) SetNetAmount(v float64)`

SetNetAmount sets NetAmount field to given value.

### HasNetAmount

`func (o *TransactionsCreate) HasNetAmount() bool`

HasNetAmount returns a boolean if a field has been set.

### GetPaymentMethodCode

`func (o *TransactionsCreate) GetPaymentMethodCode() string`

GetPaymentMethodCode returns the PaymentMethodCode field if non-nil, zero value otherwise.

### GetPaymentMethodCodeOk

`func (o *TransactionsCreate) GetPaymentMethodCodeOk() (*string, bool)`

GetPaymentMethodCodeOk returns a tuple with the PaymentMethodCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentMethodCode

`func (o *TransactionsCreate) SetPaymentMethodCode(v string)`

SetPaymentMethodCode sets PaymentMethodCode field to given value.

### HasPaymentMethodCode

`func (o *TransactionsCreate) HasPaymentMethodCode() bool`

HasPaymentMethodCode returns a boolean if a field has been set.

### GetPriceId

`func (o *TransactionsCreate) GetPriceId() string`

GetPriceId returns the PriceId field if non-nil, zero value otherwise.

### GetPriceIdOk

`func (o *TransactionsCreate) GetPriceIdOk() (*string, bool)`

GetPriceIdOk returns a tuple with the PriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriceId

`func (o *TransactionsCreate) SetPriceId(v string)`

SetPriceId sets PriceId field to given value.

### HasPriceId

`func (o *TransactionsCreate) HasPriceId() bool`

HasPriceId returns a boolean if a field has been set.

### GetProductId

`func (o *TransactionsCreate) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *TransactionsCreate) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *TransactionsCreate) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *TransactionsCreate) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetProviderCode

`func (o *TransactionsCreate) GetProviderCode() string`

GetProviderCode returns the ProviderCode field if non-nil, zero value otherwise.

### GetProviderCodeOk

`func (o *TransactionsCreate) GetProviderCodeOk() (*string, bool)`

GetProviderCodeOk returns a tuple with the ProviderCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderCode

`func (o *TransactionsCreate) SetProviderCode(v string)`

SetProviderCode sets ProviderCode field to given value.

### HasProviderCode

`func (o *TransactionsCreate) HasProviderCode() bool`

HasProviderCode returns a boolean if a field has been set.

### GetQuantity

`func (o *TransactionsCreate) GetQuantity() float64`

GetQuantity returns the Quantity field if non-nil, zero value otherwise.

### GetQuantityOk

`func (o *TransactionsCreate) GetQuantityOk() (*float64, bool)`

GetQuantityOk returns a tuple with the Quantity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQuantity

`func (o *TransactionsCreate) SetQuantity(v float64)`

SetQuantity sets Quantity field to given value.

### HasQuantity

`func (o *TransactionsCreate) HasQuantity() bool`

HasQuantity returns a boolean if a field has been set.

### GetSpiAccountNumber

`func (o *TransactionsCreate) GetSpiAccountNumber() string`

GetSpiAccountNumber returns the SpiAccountNumber field if non-nil, zero value otherwise.

### GetSpiAccountNumberOk

`func (o *TransactionsCreate) GetSpiAccountNumberOk() (*string, bool)`

GetSpiAccountNumberOk returns a tuple with the SpiAccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAccountNumber

`func (o *TransactionsCreate) SetSpiAccountNumber(v string)`

SetSpiAccountNumber sets SpiAccountNumber field to given value.

### HasSpiAccountNumber

`func (o *TransactionsCreate) HasSpiAccountNumber() bool`

HasSpiAccountNumber returns a boolean if a field has been set.

### GetSpiBulkInstructionId

`func (o *TransactionsCreate) GetSpiBulkInstructionId() string`

GetSpiBulkInstructionId returns the SpiBulkInstructionId field if non-nil, zero value otherwise.

### GetSpiBulkInstructionIdOk

`func (o *TransactionsCreate) GetSpiBulkInstructionIdOk() (*string, bool)`

GetSpiBulkInstructionIdOk returns a tuple with the SpiBulkInstructionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiBulkInstructionId

`func (o *TransactionsCreate) SetSpiBulkInstructionId(v string)`

SetSpiBulkInstructionId sets SpiBulkInstructionId field to given value.

### HasSpiBulkInstructionId

`func (o *TransactionsCreate) HasSpiBulkInstructionId() bool`

HasSpiBulkInstructionId returns a boolean if a field has been set.

### GetSpiDateEnvoi

`func (o *TransactionsCreate) GetSpiDateEnvoi() string`

GetSpiDateEnvoi returns the SpiDateEnvoi field if non-nil, zero value otherwise.

### GetSpiDateEnvoiOk

`func (o *TransactionsCreate) GetSpiDateEnvoiOk() (*string, bool)`

GetSpiDateEnvoiOk returns a tuple with the SpiDateEnvoi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateEnvoi

`func (o *TransactionsCreate) SetSpiDateEnvoi(v string)`

SetSpiDateEnvoi sets SpiDateEnvoi field to given value.

### HasSpiDateEnvoi

`func (o *TransactionsCreate) HasSpiDateEnvoi() bool`

HasSpiDateEnvoi returns a boolean if a field has been set.

### GetSpiDateIrrevocabilite

`func (o *TransactionsCreate) GetSpiDateIrrevocabilite() string`

GetSpiDateIrrevocabilite returns the SpiDateIrrevocabilite field if non-nil, zero value otherwise.

### GetSpiDateIrrevocabiliteOk

`func (o *TransactionsCreate) GetSpiDateIrrevocabiliteOk() (*string, bool)`

GetSpiDateIrrevocabiliteOk returns a tuple with the SpiDateIrrevocabilite field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateIrrevocabilite

`func (o *TransactionsCreate) SetSpiDateIrrevocabilite(v string)`

SetSpiDateIrrevocabilite sets SpiDateIrrevocabilite field to given value.

### HasSpiDateIrrevocabilite

`func (o *TransactionsCreate) HasSpiDateIrrevocabilite() bool`

HasSpiDateIrrevocabilite returns a boolean if a field has been set.

### GetSpiDiscountAmount

`func (o *TransactionsCreate) GetSpiDiscountAmount() float64`

GetSpiDiscountAmount returns the SpiDiscountAmount field if non-nil, zero value otherwise.

### GetSpiDiscountAmountOk

`func (o *TransactionsCreate) GetSpiDiscountAmountOk() (*float64, bool)`

GetSpiDiscountAmountOk returns a tuple with the SpiDiscountAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDiscountAmount

`func (o *TransactionsCreate) SetSpiDiscountAmount(v float64)`

SetSpiDiscountAmount sets SpiDiscountAmount field to given value.

### HasSpiDiscountAmount

`func (o *TransactionsCreate) HasSpiDiscountAmount() bool`

HasSpiDiscountAmount returns a boolean if a field has been set.

### GetSpiDiscountRate

`func (o *TransactionsCreate) GetSpiDiscountRate() float64`

GetSpiDiscountRate returns the SpiDiscountRate field if non-nil, zero value otherwise.

### GetSpiDiscountRateOk

`func (o *TransactionsCreate) GetSpiDiscountRateOk() (*float64, bool)`

GetSpiDiscountRateOk returns a tuple with the SpiDiscountRate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDiscountRate

`func (o *TransactionsCreate) SetSpiDiscountRate(v float64)`

SetSpiDiscountRate sets SpiDiscountRate field to given value.

### HasSpiDiscountRate

`func (o *TransactionsCreate) HasSpiDiscountRate() bool`

HasSpiDiscountRate returns a boolean if a field has been set.

### GetSpiEnd2endId

`func (o *TransactionsCreate) GetSpiEnd2endId() string`

GetSpiEnd2endId returns the SpiEnd2endId field if non-nil, zero value otherwise.

### GetSpiEnd2endIdOk

`func (o *TransactionsCreate) GetSpiEnd2endIdOk() (*string, bool)`

GetSpiEnd2endIdOk returns a tuple with the SpiEnd2endId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiEnd2endId

`func (o *TransactionsCreate) SetSpiEnd2endId(v string)`

SetSpiEnd2endId sets SpiEnd2endId field to given value.

### HasSpiEnd2endId

`func (o *TransactionsCreate) HasSpiEnd2endId() bool`

HasSpiEnd2endId returns a boolean if a field has been set.

### GetSpiPaymentCategory

`func (o *TransactionsCreate) GetSpiPaymentCategory() string`

GetSpiPaymentCategory returns the SpiPaymentCategory field if non-nil, zero value otherwise.

### GetSpiPaymentCategoryOk

`func (o *TransactionsCreate) GetSpiPaymentCategoryOk() (*string, bool)`

GetSpiPaymentCategoryOk returns a tuple with the SpiPaymentCategory field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentCategory

`func (o *TransactionsCreate) SetSpiPaymentCategory(v string)`

SetSpiPaymentCategory sets SpiPaymentCategory field to given value.

### HasSpiPaymentCategory

`func (o *TransactionsCreate) HasSpiPaymentCategory() bool`

HasSpiPaymentCategory returns a boolean if a field has been set.

### GetSpiPaymentFlowType

`func (o *TransactionsCreate) GetSpiPaymentFlowType() string`

GetSpiPaymentFlowType returns the SpiPaymentFlowType field if non-nil, zero value otherwise.

### GetSpiPaymentFlowTypeOk

`func (o *TransactionsCreate) GetSpiPaymentFlowTypeOk() (*string, bool)`

GetSpiPaymentFlowTypeOk returns a tuple with the SpiPaymentFlowType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentFlowType

`func (o *TransactionsCreate) SetSpiPaymentFlowType(v string)`

SetSpiPaymentFlowType sets SpiPaymentFlowType field to given value.

### HasSpiPaymentFlowType

`func (o *TransactionsCreate) HasSpiPaymentFlowType() bool`

HasSpiPaymentFlowType returns a boolean if a field has been set.

### GetSpiPaymentStatus

`func (o *TransactionsCreate) GetSpiPaymentStatus() string`

GetSpiPaymentStatus returns the SpiPaymentStatus field if non-nil, zero value otherwise.

### GetSpiPaymentStatusOk

`func (o *TransactionsCreate) GetSpiPaymentStatusOk() (*string, bool)`

GetSpiPaymentStatusOk returns a tuple with the SpiPaymentStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentStatus

`func (o *TransactionsCreate) SetSpiPaymentStatus(v string)`

SetSpiPaymentStatus sets SpiPaymentStatus field to given value.

### HasSpiPaymentStatus

`func (o *TransactionsCreate) HasSpiPaymentStatus() bool`

HasSpiPaymentStatus returns a boolean if a field has been set.

### GetSpiRejectionReason

`func (o *TransactionsCreate) GetSpiRejectionReason() string`

GetSpiRejectionReason returns the SpiRejectionReason field if non-nil, zero value otherwise.

### GetSpiRejectionReasonOk

`func (o *TransactionsCreate) GetSpiRejectionReasonOk() (*string, bool)`

GetSpiRejectionReasonOk returns a tuple with the SpiRejectionReason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRejectionReason

`func (o *TransactionsCreate) SetSpiRejectionReason(v string)`

SetSpiRejectionReason sets SpiRejectionReason field to given value.

### HasSpiRejectionReason

`func (o *TransactionsCreate) HasSpiRejectionReason() bool`

HasSpiRejectionReason returns a boolean if a field has been set.

### GetSpiTxId

`func (o *TransactionsCreate) GetSpiTxId() string`

GetSpiTxId returns the SpiTxId field if non-nil, zero value otherwise.

### GetSpiTxIdOk

`func (o *TransactionsCreate) GetSpiTxIdOk() (*string, bool)`

GetSpiTxIdOk returns a tuple with the SpiTxId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiTxId

`func (o *TransactionsCreate) SetSpiTxId(v string)`

SetSpiTxId sets SpiTxId field to given value.

### HasSpiTxId

`func (o *TransactionsCreate) HasSpiTxId() bool`

HasSpiTxId returns a boolean if a field has been set.

### GetStatus

`func (o *TransactionsCreate) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *TransactionsCreate) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *TransactionsCreate) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *TransactionsCreate) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetSubscriptionId

`func (o *TransactionsCreate) GetSubscriptionId() string`

GetSubscriptionId returns the SubscriptionId field if non-nil, zero value otherwise.

### GetSubscriptionIdOk

`func (o *TransactionsCreate) GetSubscriptionIdOk() (*string, bool)`

GetSubscriptionIdOk returns a tuple with the SubscriptionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubscriptionId

`func (o *TransactionsCreate) SetSubscriptionId(v string)`

SetSubscriptionId sets SubscriptionId field to given value.

### HasSubscriptionId

`func (o *TransactionsCreate) HasSubscriptionId() bool`

HasSubscriptionId returns a boolean if a field has been set.

### GetTransactionType

`func (o *TransactionsCreate) GetTransactionType() string`

GetTransactionType returns the TransactionType field if non-nil, zero value otherwise.

### GetTransactionTypeOk

`func (o *TransactionsCreate) GetTransactionTypeOk() (*string, bool)`

GetTransactionTypeOk returns a tuple with the TransactionType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTransactionType

`func (o *TransactionsCreate) SetTransactionType(v string)`

SetTransactionType sets TransactionType field to given value.

### HasTransactionType

`func (o *TransactionsCreate) HasTransactionType() bool`

HasTransactionType returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


