# Prices

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**BillingInterval** | Pointer to **string** |  | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**CurrencyCode** | Pointer to **string** | Three-letter ISO currency code (e.g., XOF, USD, EUR) | [optional] 
**Environment** | Pointer to **string** |  | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**IsDefault** | Pointer to **bool** |  | [optional] 
**MaximumAmount** | Pointer to **float64** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**MinimumAmount** | Pointer to **float64** |  | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PriceId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PricingModel** | Pointer to **string** |  | [optional] 
**ProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ProviderPriceId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ProviderProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 

## Methods

### NewPrices

`func NewPrices() *Prices`

NewPrices instantiates a new Prices object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPricesWithDefaults

`func NewPricesWithDefaults() *Prices`

NewPricesWithDefaults instantiates a new Prices object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAmount

`func (o *Prices) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *Prices) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *Prices) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *Prices) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetBillingInterval

`func (o *Prices) GetBillingInterval() string`

GetBillingInterval returns the BillingInterval field if non-nil, zero value otherwise.

### GetBillingIntervalOk

`func (o *Prices) GetBillingIntervalOk() (*string, bool)`

GetBillingIntervalOk returns a tuple with the BillingInterval field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBillingInterval

`func (o *Prices) SetBillingInterval(v string)`

SetBillingInterval sets BillingInterval field to given value.

### HasBillingInterval

`func (o *Prices) HasBillingInterval() bool`

HasBillingInterval returns a boolean if a field has been set.

### GetCreatedAt

`func (o *Prices) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *Prices) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *Prices) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *Prices) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *Prices) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *Prices) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *Prices) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *Prices) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetEnvironment

`func (o *Prices) GetEnvironment() string`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *Prices) GetEnvironmentOk() (*string, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *Prices) SetEnvironment(v string)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *Prices) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetIsActive

`func (o *Prices) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *Prices) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *Prices) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *Prices) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetIsDefault

`func (o *Prices) GetIsDefault() bool`

GetIsDefault returns the IsDefault field if non-nil, zero value otherwise.

### GetIsDefaultOk

`func (o *Prices) GetIsDefaultOk() (*bool, bool)`

GetIsDefaultOk returns a tuple with the IsDefault field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsDefault

`func (o *Prices) SetIsDefault(v bool)`

SetIsDefault sets IsDefault field to given value.

### HasIsDefault

`func (o *Prices) HasIsDefault() bool`

HasIsDefault returns a boolean if a field has been set.

### GetMaximumAmount

`func (o *Prices) GetMaximumAmount() float64`

GetMaximumAmount returns the MaximumAmount field if non-nil, zero value otherwise.

### GetMaximumAmountOk

`func (o *Prices) GetMaximumAmountOk() (*float64, bool)`

GetMaximumAmountOk returns a tuple with the MaximumAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaximumAmount

`func (o *Prices) SetMaximumAmount(v float64)`

SetMaximumAmount sets MaximumAmount field to given value.

### HasMaximumAmount

`func (o *Prices) HasMaximumAmount() bool`

HasMaximumAmount returns a boolean if a field has been set.

### GetMetadata

`func (o *Prices) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *Prices) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *Prices) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *Prices) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetMinimumAmount

`func (o *Prices) GetMinimumAmount() float64`

GetMinimumAmount returns the MinimumAmount field if non-nil, zero value otherwise.

### GetMinimumAmountOk

`func (o *Prices) GetMinimumAmountOk() (*float64, bool)`

GetMinimumAmountOk returns a tuple with the MinimumAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMinimumAmount

`func (o *Prices) SetMinimumAmount(v float64)`

SetMinimumAmount sets MinimumAmount field to given value.

### HasMinimumAmount

`func (o *Prices) HasMinimumAmount() bool`

HasMinimumAmount returns a boolean if a field has been set.

### GetOrganizationId

`func (o *Prices) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *Prices) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *Prices) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *Prices) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetPriceId

`func (o *Prices) GetPriceId() string`

GetPriceId returns the PriceId field if non-nil, zero value otherwise.

### GetPriceIdOk

`func (o *Prices) GetPriceIdOk() (*string, bool)`

GetPriceIdOk returns a tuple with the PriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriceId

`func (o *Prices) SetPriceId(v string)`

SetPriceId sets PriceId field to given value.

### HasPriceId

`func (o *Prices) HasPriceId() bool`

HasPriceId returns a boolean if a field has been set.

### GetPricingModel

`func (o *Prices) GetPricingModel() string`

GetPricingModel returns the PricingModel field if non-nil, zero value otherwise.

### GetPricingModelOk

`func (o *Prices) GetPricingModelOk() (*string, bool)`

GetPricingModelOk returns a tuple with the PricingModel field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPricingModel

`func (o *Prices) SetPricingModel(v string)`

SetPricingModel sets PricingModel field to given value.

### HasPricingModel

`func (o *Prices) HasPricingModel() bool`

HasPricingModel returns a boolean if a field has been set.

### GetProductId

`func (o *Prices) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *Prices) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *Prices) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *Prices) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetProviderPriceId

`func (o *Prices) GetProviderPriceId() string`

GetProviderPriceId returns the ProviderPriceId field if non-nil, zero value otherwise.

### GetProviderPriceIdOk

`func (o *Prices) GetProviderPriceIdOk() (*string, bool)`

GetProviderPriceIdOk returns a tuple with the ProviderPriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderPriceId

`func (o *Prices) SetProviderPriceId(v string)`

SetProviderPriceId sets ProviderPriceId field to given value.

### HasProviderPriceId

`func (o *Prices) HasProviderPriceId() bool`

HasProviderPriceId returns a boolean if a field has been set.

### GetProviderProductId

`func (o *Prices) GetProviderProductId() string`

GetProviderProductId returns the ProviderProductId field if non-nil, zero value otherwise.

### GetProviderProductIdOk

`func (o *Prices) GetProviderProductIdOk() (*string, bool)`

GetProviderProductIdOk returns a tuple with the ProviderProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderProductId

`func (o *Prices) SetProviderProductId(v string)`

SetProviderProductId sets ProviderProductId field to given value.

### HasProviderProductId

`func (o *Prices) HasProviderProductId() bool`

HasProviderProductId returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *Prices) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *Prices) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *Prices) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *Prices) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


