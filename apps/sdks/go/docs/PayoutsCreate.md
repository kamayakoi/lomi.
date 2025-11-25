# PayoutsCreate

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
**Status** | Pointer to **string** | Current status of the resource | [optional] 

## Methods

### NewPayoutsCreate

`func NewPayoutsCreate() *PayoutsCreate`

NewPayoutsCreate instantiates a new PayoutsCreate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPayoutsCreateWithDefaults

`func NewPayoutsCreateWithDefaults() *PayoutsCreate`

NewPayoutsCreateWithDefaults instantiates a new PayoutsCreate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAccountId

`func (o *PayoutsCreate) GetAccountId() string`

GetAccountId returns the AccountId field if non-nil, zero value otherwise.

### GetAccountIdOk

`func (o *PayoutsCreate) GetAccountIdOk() (*string, bool)`

GetAccountIdOk returns a tuple with the AccountId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAccountId

`func (o *PayoutsCreate) SetAccountId(v string)`

SetAccountId sets AccountId field to given value.

### HasAccountId

`func (o *PayoutsCreate) HasAccountId() bool`

HasAccountId returns a boolean if a field has been set.

### GetAmount

`func (o *PayoutsCreate) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *PayoutsCreate) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *PayoutsCreate) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *PayoutsCreate) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *PayoutsCreate) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *PayoutsCreate) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *PayoutsCreate) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *PayoutsCreate) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetMetadata

`func (o *PayoutsCreate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *PayoutsCreate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *PayoutsCreate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *PayoutsCreate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetPaymentMethodCode

`func (o *PayoutsCreate) GetPaymentMethodCode() string`

GetPaymentMethodCode returns the PaymentMethodCode field if non-nil, zero value otherwise.

### GetPaymentMethodCodeOk

`func (o *PayoutsCreate) GetPaymentMethodCodeOk() (*string, bool)`

GetPaymentMethodCodeOk returns a tuple with the PaymentMethodCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentMethodCode

`func (o *PayoutsCreate) SetPaymentMethodCode(v string)`

SetPaymentMethodCode sets PaymentMethodCode field to given value.

### HasPaymentMethodCode

`func (o *PayoutsCreate) HasPaymentMethodCode() bool`

HasPaymentMethodCode returns a boolean if a field has been set.

### GetPayoutId

`func (o *PayoutsCreate) GetPayoutId() string`

GetPayoutId returns the PayoutId field if non-nil, zero value otherwise.

### GetPayoutIdOk

`func (o *PayoutsCreate) GetPayoutIdOk() (*string, bool)`

GetPayoutIdOk returns a tuple with the PayoutId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayoutId

`func (o *PayoutsCreate) SetPayoutId(v string)`

SetPayoutId sets PayoutId field to given value.

### HasPayoutId

`func (o *PayoutsCreate) HasPayoutId() bool`

HasPayoutId returns a boolean if a field has been set.

### GetPayoutMethodId

`func (o *PayoutsCreate) GetPayoutMethodId() string`

GetPayoutMethodId returns the PayoutMethodId field if non-nil, zero value otherwise.

### GetPayoutMethodIdOk

`func (o *PayoutsCreate) GetPayoutMethodIdOk() (*string, bool)`

GetPayoutMethodIdOk returns a tuple with the PayoutMethodId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayoutMethodId

`func (o *PayoutsCreate) SetPayoutMethodId(v string)`

SetPayoutMethodId sets PayoutMethodId field to given value.

### HasPayoutMethodId

`func (o *PayoutsCreate) HasPayoutMethodId() bool`

HasPayoutMethodId returns a boolean if a field has been set.

### GetProviderCode

`func (o *PayoutsCreate) GetProviderCode() string`

GetProviderCode returns the ProviderCode field if non-nil, zero value otherwise.

### GetProviderCodeOk

`func (o *PayoutsCreate) GetProviderCodeOk() (*string, bool)`

GetProviderCodeOk returns a tuple with the ProviderCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderCode

`func (o *PayoutsCreate) SetProviderCode(v string)`

SetProviderCode sets ProviderCode field to given value.

### HasProviderCode

`func (o *PayoutsCreate) HasProviderCode() bool`

HasProviderCode returns a boolean if a field has been set.

### GetStatus

`func (o *PayoutsCreate) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *PayoutsCreate) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *PayoutsCreate) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *PayoutsCreate) HasStatus() bool`

HasStatus returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


