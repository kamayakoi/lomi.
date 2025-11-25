# Payouts

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AccountId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**CreatedBy** | Pointer to **string** |  | [optional] [readonly] 
**CurrencyCode** | Pointer to **string** | Three-letter ISO currency code (e.g., XOF, USD, EUR) | [optional] 
**Environment** | Pointer to **string** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PaymentMethodCode** | Pointer to **string** |  | [optional] 
**PayoutId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PayoutMethodId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ProviderCode** | Pointer to **string** |  | [optional] 
**Status** | Pointer to **string** | Current status of the resource | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 

## Methods

### NewPayouts

`func NewPayouts() *Payouts`

NewPayouts instantiates a new Payouts object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPayoutsWithDefaults

`func NewPayoutsWithDefaults() *Payouts`

NewPayoutsWithDefaults instantiates a new Payouts object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAccountId

`func (o *Payouts) GetAccountId() string`

GetAccountId returns the AccountId field if non-nil, zero value otherwise.

### GetAccountIdOk

`func (o *Payouts) GetAccountIdOk() (*string, bool)`

GetAccountIdOk returns a tuple with the AccountId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAccountId

`func (o *Payouts) SetAccountId(v string)`

SetAccountId sets AccountId field to given value.

### HasAccountId

`func (o *Payouts) HasAccountId() bool`

HasAccountId returns a boolean if a field has been set.

### GetAmount

`func (o *Payouts) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *Payouts) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *Payouts) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *Payouts) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCreatedAt

`func (o *Payouts) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *Payouts) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *Payouts) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *Payouts) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetCreatedBy

`func (o *Payouts) GetCreatedBy() string`

GetCreatedBy returns the CreatedBy field if non-nil, zero value otherwise.

### GetCreatedByOk

`func (o *Payouts) GetCreatedByOk() (*string, bool)`

GetCreatedByOk returns a tuple with the CreatedBy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedBy

`func (o *Payouts) SetCreatedBy(v string)`

SetCreatedBy sets CreatedBy field to given value.

### HasCreatedBy

`func (o *Payouts) HasCreatedBy() bool`

HasCreatedBy returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *Payouts) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *Payouts) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *Payouts) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *Payouts) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetEnvironment

`func (o *Payouts) GetEnvironment() string`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *Payouts) GetEnvironmentOk() (*string, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *Payouts) SetEnvironment(v string)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *Payouts) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetMetadata

`func (o *Payouts) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *Payouts) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *Payouts) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *Payouts) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetOrganizationId

`func (o *Payouts) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *Payouts) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *Payouts) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *Payouts) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetPaymentMethodCode

`func (o *Payouts) GetPaymentMethodCode() string`

GetPaymentMethodCode returns the PaymentMethodCode field if non-nil, zero value otherwise.

### GetPaymentMethodCodeOk

`func (o *Payouts) GetPaymentMethodCodeOk() (*string, bool)`

GetPaymentMethodCodeOk returns a tuple with the PaymentMethodCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentMethodCode

`func (o *Payouts) SetPaymentMethodCode(v string)`

SetPaymentMethodCode sets PaymentMethodCode field to given value.

### HasPaymentMethodCode

`func (o *Payouts) HasPaymentMethodCode() bool`

HasPaymentMethodCode returns a boolean if a field has been set.

### GetPayoutId

`func (o *Payouts) GetPayoutId() string`

GetPayoutId returns the PayoutId field if non-nil, zero value otherwise.

### GetPayoutIdOk

`func (o *Payouts) GetPayoutIdOk() (*string, bool)`

GetPayoutIdOk returns a tuple with the PayoutId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayoutId

`func (o *Payouts) SetPayoutId(v string)`

SetPayoutId sets PayoutId field to given value.

### HasPayoutId

`func (o *Payouts) HasPayoutId() bool`

HasPayoutId returns a boolean if a field has been set.

### GetPayoutMethodId

`func (o *Payouts) GetPayoutMethodId() string`

GetPayoutMethodId returns the PayoutMethodId field if non-nil, zero value otherwise.

### GetPayoutMethodIdOk

`func (o *Payouts) GetPayoutMethodIdOk() (*string, bool)`

GetPayoutMethodIdOk returns a tuple with the PayoutMethodId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayoutMethodId

`func (o *Payouts) SetPayoutMethodId(v string)`

SetPayoutMethodId sets PayoutMethodId field to given value.

### HasPayoutMethodId

`func (o *Payouts) HasPayoutMethodId() bool`

HasPayoutMethodId returns a boolean if a field has been set.

### GetProviderCode

`func (o *Payouts) GetProviderCode() string`

GetProviderCode returns the ProviderCode field if non-nil, zero value otherwise.

### GetProviderCodeOk

`func (o *Payouts) GetProviderCodeOk() (*string, bool)`

GetProviderCodeOk returns a tuple with the ProviderCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderCode

`func (o *Payouts) SetProviderCode(v string)`

SetProviderCode sets ProviderCode field to given value.

### HasProviderCode

`func (o *Payouts) HasProviderCode() bool`

HasProviderCode returns a boolean if a field has been set.

### GetStatus

`func (o *Payouts) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *Payouts) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *Payouts) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *Payouts) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *Payouts) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *Payouts) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *Payouts) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *Payouts) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


