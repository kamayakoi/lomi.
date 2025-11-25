# BeneficiaryPayoutsCreate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AccountId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**CurrencyCode** | Pointer to **string** | Three-letter ISO currency code (e.g., XOF, USD, EUR) | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**PaymentMethodCode** | Pointer to **string** |  | [optional] 
**PayoutId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PayoutMethodId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ProviderCode** | Pointer to **string** |  | [optional] 
**SpiBulkInstructionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Status** | Pointer to **string** | Current status of the resource | [optional] 

## Methods

### NewBeneficiaryPayoutsCreate

`func NewBeneficiaryPayoutsCreate() *BeneficiaryPayoutsCreate`

NewBeneficiaryPayoutsCreate instantiates a new BeneficiaryPayoutsCreate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewBeneficiaryPayoutsCreateWithDefaults

`func NewBeneficiaryPayoutsCreateWithDefaults() *BeneficiaryPayoutsCreate`

NewBeneficiaryPayoutsCreateWithDefaults instantiates a new BeneficiaryPayoutsCreate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAccountId

`func (o *BeneficiaryPayoutsCreate) GetAccountId() string`

GetAccountId returns the AccountId field if non-nil, zero value otherwise.

### GetAccountIdOk

`func (o *BeneficiaryPayoutsCreate) GetAccountIdOk() (*string, bool)`

GetAccountIdOk returns a tuple with the AccountId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAccountId

`func (o *BeneficiaryPayoutsCreate) SetAccountId(v string)`

SetAccountId sets AccountId field to given value.

### HasAccountId

`func (o *BeneficiaryPayoutsCreate) HasAccountId() bool`

HasAccountId returns a boolean if a field has been set.

### GetAmount

`func (o *BeneficiaryPayoutsCreate) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *BeneficiaryPayoutsCreate) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *BeneficiaryPayoutsCreate) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *BeneficiaryPayoutsCreate) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *BeneficiaryPayoutsCreate) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *BeneficiaryPayoutsCreate) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *BeneficiaryPayoutsCreate) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *BeneficiaryPayoutsCreate) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetMetadata

`func (o *BeneficiaryPayoutsCreate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *BeneficiaryPayoutsCreate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *BeneficiaryPayoutsCreate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *BeneficiaryPayoutsCreate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetPaymentMethodCode

`func (o *BeneficiaryPayoutsCreate) GetPaymentMethodCode() string`

GetPaymentMethodCode returns the PaymentMethodCode field if non-nil, zero value otherwise.

### GetPaymentMethodCodeOk

`func (o *BeneficiaryPayoutsCreate) GetPaymentMethodCodeOk() (*string, bool)`

GetPaymentMethodCodeOk returns a tuple with the PaymentMethodCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentMethodCode

`func (o *BeneficiaryPayoutsCreate) SetPaymentMethodCode(v string)`

SetPaymentMethodCode sets PaymentMethodCode field to given value.

### HasPaymentMethodCode

`func (o *BeneficiaryPayoutsCreate) HasPaymentMethodCode() bool`

HasPaymentMethodCode returns a boolean if a field has been set.

### GetPayoutId

`func (o *BeneficiaryPayoutsCreate) GetPayoutId() string`

GetPayoutId returns the PayoutId field if non-nil, zero value otherwise.

### GetPayoutIdOk

`func (o *BeneficiaryPayoutsCreate) GetPayoutIdOk() (*string, bool)`

GetPayoutIdOk returns a tuple with the PayoutId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayoutId

`func (o *BeneficiaryPayoutsCreate) SetPayoutId(v string)`

SetPayoutId sets PayoutId field to given value.

### HasPayoutId

`func (o *BeneficiaryPayoutsCreate) HasPayoutId() bool`

HasPayoutId returns a boolean if a field has been set.

### GetPayoutMethodId

`func (o *BeneficiaryPayoutsCreate) GetPayoutMethodId() string`

GetPayoutMethodId returns the PayoutMethodId field if non-nil, zero value otherwise.

### GetPayoutMethodIdOk

`func (o *BeneficiaryPayoutsCreate) GetPayoutMethodIdOk() (*string, bool)`

GetPayoutMethodIdOk returns a tuple with the PayoutMethodId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayoutMethodId

`func (o *BeneficiaryPayoutsCreate) SetPayoutMethodId(v string)`

SetPayoutMethodId sets PayoutMethodId field to given value.

### HasPayoutMethodId

`func (o *BeneficiaryPayoutsCreate) HasPayoutMethodId() bool`

HasPayoutMethodId returns a boolean if a field has been set.

### GetProviderCode

`func (o *BeneficiaryPayoutsCreate) GetProviderCode() string`

GetProviderCode returns the ProviderCode field if non-nil, zero value otherwise.

### GetProviderCodeOk

`func (o *BeneficiaryPayoutsCreate) GetProviderCodeOk() (*string, bool)`

GetProviderCodeOk returns a tuple with the ProviderCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderCode

`func (o *BeneficiaryPayoutsCreate) SetProviderCode(v string)`

SetProviderCode sets ProviderCode field to given value.

### HasProviderCode

`func (o *BeneficiaryPayoutsCreate) HasProviderCode() bool`

HasProviderCode returns a boolean if a field has been set.

### GetSpiBulkInstructionId

`func (o *BeneficiaryPayoutsCreate) GetSpiBulkInstructionId() string`

GetSpiBulkInstructionId returns the SpiBulkInstructionId field if non-nil, zero value otherwise.

### GetSpiBulkInstructionIdOk

`func (o *BeneficiaryPayoutsCreate) GetSpiBulkInstructionIdOk() (*string, bool)`

GetSpiBulkInstructionIdOk returns a tuple with the SpiBulkInstructionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiBulkInstructionId

`func (o *BeneficiaryPayoutsCreate) SetSpiBulkInstructionId(v string)`

SetSpiBulkInstructionId sets SpiBulkInstructionId field to given value.

### HasSpiBulkInstructionId

`func (o *BeneficiaryPayoutsCreate) HasSpiBulkInstructionId() bool`

HasSpiBulkInstructionId returns a boolean if a field has been set.

### GetStatus

`func (o *BeneficiaryPayoutsCreate) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *BeneficiaryPayoutsCreate) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *BeneficiaryPayoutsCreate) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *BeneficiaryPayoutsCreate) HasStatus() bool`

HasStatus returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


