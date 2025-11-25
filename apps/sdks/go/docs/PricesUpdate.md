# PricesUpdate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**BillingInterval** | Pointer to **string** |  | [optional] 
**CurrencyCode** | Pointer to **string** | Three-letter ISO currency code (e.g., XOF, USD, EUR) | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**IsDefault** | Pointer to **bool** |  | [optional] 
**MaximumAmount** | Pointer to **float64** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**MinimumAmount** | Pointer to **float64** |  | [optional] 
**PriceId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PricingModel** | Pointer to **string** |  | [optional] 
**ProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ProviderPriceId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ProviderProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 

## Methods

### NewPricesUpdate

`func NewPricesUpdate() *PricesUpdate`

NewPricesUpdate instantiates a new PricesUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPricesUpdateWithDefaults

`func NewPricesUpdateWithDefaults() *PricesUpdate`

NewPricesUpdateWithDefaults instantiates a new PricesUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAmount

`func (o *PricesUpdate) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *PricesUpdate) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *PricesUpdate) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *PricesUpdate) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetBillingInterval

`func (o *PricesUpdate) GetBillingInterval() string`

GetBillingInterval returns the BillingInterval field if non-nil, zero value otherwise.

### GetBillingIntervalOk

`func (o *PricesUpdate) GetBillingIntervalOk() (*string, bool)`

GetBillingIntervalOk returns a tuple with the BillingInterval field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBillingInterval

`func (o *PricesUpdate) SetBillingInterval(v string)`

SetBillingInterval sets BillingInterval field to given value.

### HasBillingInterval

`func (o *PricesUpdate) HasBillingInterval() bool`

HasBillingInterval returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *PricesUpdate) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *PricesUpdate) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *PricesUpdate) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *PricesUpdate) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetIsActive

`func (o *PricesUpdate) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *PricesUpdate) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *PricesUpdate) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *PricesUpdate) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetIsDefault

`func (o *PricesUpdate) GetIsDefault() bool`

GetIsDefault returns the IsDefault field if non-nil, zero value otherwise.

### GetIsDefaultOk

`func (o *PricesUpdate) GetIsDefaultOk() (*bool, bool)`

GetIsDefaultOk returns a tuple with the IsDefault field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsDefault

`func (o *PricesUpdate) SetIsDefault(v bool)`

SetIsDefault sets IsDefault field to given value.

### HasIsDefault

`func (o *PricesUpdate) HasIsDefault() bool`

HasIsDefault returns a boolean if a field has been set.

### GetMaximumAmount

`func (o *PricesUpdate) GetMaximumAmount() float64`

GetMaximumAmount returns the MaximumAmount field if non-nil, zero value otherwise.

### GetMaximumAmountOk

`func (o *PricesUpdate) GetMaximumAmountOk() (*float64, bool)`

GetMaximumAmountOk returns a tuple with the MaximumAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaximumAmount

`func (o *PricesUpdate) SetMaximumAmount(v float64)`

SetMaximumAmount sets MaximumAmount field to given value.

### HasMaximumAmount

`func (o *PricesUpdate) HasMaximumAmount() bool`

HasMaximumAmount returns a boolean if a field has been set.

### GetMetadata

`func (o *PricesUpdate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *PricesUpdate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *PricesUpdate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *PricesUpdate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetMinimumAmount

`func (o *PricesUpdate) GetMinimumAmount() float64`

GetMinimumAmount returns the MinimumAmount field if non-nil, zero value otherwise.

### GetMinimumAmountOk

`func (o *PricesUpdate) GetMinimumAmountOk() (*float64, bool)`

GetMinimumAmountOk returns a tuple with the MinimumAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMinimumAmount

`func (o *PricesUpdate) SetMinimumAmount(v float64)`

SetMinimumAmount sets MinimumAmount field to given value.

### HasMinimumAmount

`func (o *PricesUpdate) HasMinimumAmount() bool`

HasMinimumAmount returns a boolean if a field has been set.

### GetPriceId

`func (o *PricesUpdate) GetPriceId() string`

GetPriceId returns the PriceId field if non-nil, zero value otherwise.

### GetPriceIdOk

`func (o *PricesUpdate) GetPriceIdOk() (*string, bool)`

GetPriceIdOk returns a tuple with the PriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriceId

`func (o *PricesUpdate) SetPriceId(v string)`

SetPriceId sets PriceId field to given value.

### HasPriceId

`func (o *PricesUpdate) HasPriceId() bool`

HasPriceId returns a boolean if a field has been set.

### GetPricingModel

`func (o *PricesUpdate) GetPricingModel() string`

GetPricingModel returns the PricingModel field if non-nil, zero value otherwise.

### GetPricingModelOk

`func (o *PricesUpdate) GetPricingModelOk() (*string, bool)`

GetPricingModelOk returns a tuple with the PricingModel field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPricingModel

`func (o *PricesUpdate) SetPricingModel(v string)`

SetPricingModel sets PricingModel field to given value.

### HasPricingModel

`func (o *PricesUpdate) HasPricingModel() bool`

HasPricingModel returns a boolean if a field has been set.

### GetProductId

`func (o *PricesUpdate) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *PricesUpdate) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *PricesUpdate) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *PricesUpdate) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetProviderPriceId

`func (o *PricesUpdate) GetProviderPriceId() string`

GetProviderPriceId returns the ProviderPriceId field if non-nil, zero value otherwise.

### GetProviderPriceIdOk

`func (o *PricesUpdate) GetProviderPriceIdOk() (*string, bool)`

GetProviderPriceIdOk returns a tuple with the ProviderPriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderPriceId

`func (o *PricesUpdate) SetProviderPriceId(v string)`

SetProviderPriceId sets ProviderPriceId field to given value.

### HasProviderPriceId

`func (o *PricesUpdate) HasProviderPriceId() bool`

HasProviderPriceId returns a boolean if a field has been set.

### GetProviderProductId

`func (o *PricesUpdate) GetProviderProductId() string`

GetProviderProductId returns the ProviderProductId field if non-nil, zero value otherwise.

### GetProviderProductIdOk

`func (o *PricesUpdate) GetProviderProductIdOk() (*string, bool)`

GetProviderProductIdOk returns a tuple with the ProviderProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderProductId

`func (o *PricesUpdate) SetProviderProductId(v string)`

SetProviderProductId sets ProviderProductId field to given value.

### HasProviderProductId

`func (o *PricesUpdate) HasProviderProductId() bool`

HasProviderProductId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


