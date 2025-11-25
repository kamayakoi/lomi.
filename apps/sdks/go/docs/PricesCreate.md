# PricesCreate

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

### NewPricesCreate

`func NewPricesCreate() *PricesCreate`

NewPricesCreate instantiates a new PricesCreate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPricesCreateWithDefaults

`func NewPricesCreateWithDefaults() *PricesCreate`

NewPricesCreateWithDefaults instantiates a new PricesCreate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAmount

`func (o *PricesCreate) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *PricesCreate) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *PricesCreate) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *PricesCreate) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetBillingInterval

`func (o *PricesCreate) GetBillingInterval() string`

GetBillingInterval returns the BillingInterval field if non-nil, zero value otherwise.

### GetBillingIntervalOk

`func (o *PricesCreate) GetBillingIntervalOk() (*string, bool)`

GetBillingIntervalOk returns a tuple with the BillingInterval field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBillingInterval

`func (o *PricesCreate) SetBillingInterval(v string)`

SetBillingInterval sets BillingInterval field to given value.

### HasBillingInterval

`func (o *PricesCreate) HasBillingInterval() bool`

HasBillingInterval returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *PricesCreate) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *PricesCreate) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *PricesCreate) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *PricesCreate) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetIsActive

`func (o *PricesCreate) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *PricesCreate) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *PricesCreate) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *PricesCreate) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetIsDefault

`func (o *PricesCreate) GetIsDefault() bool`

GetIsDefault returns the IsDefault field if non-nil, zero value otherwise.

### GetIsDefaultOk

`func (o *PricesCreate) GetIsDefaultOk() (*bool, bool)`

GetIsDefaultOk returns a tuple with the IsDefault field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsDefault

`func (o *PricesCreate) SetIsDefault(v bool)`

SetIsDefault sets IsDefault field to given value.

### HasIsDefault

`func (o *PricesCreate) HasIsDefault() bool`

HasIsDefault returns a boolean if a field has been set.

### GetMaximumAmount

`func (o *PricesCreate) GetMaximumAmount() float64`

GetMaximumAmount returns the MaximumAmount field if non-nil, zero value otherwise.

### GetMaximumAmountOk

`func (o *PricesCreate) GetMaximumAmountOk() (*float64, bool)`

GetMaximumAmountOk returns a tuple with the MaximumAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaximumAmount

`func (o *PricesCreate) SetMaximumAmount(v float64)`

SetMaximumAmount sets MaximumAmount field to given value.

### HasMaximumAmount

`func (o *PricesCreate) HasMaximumAmount() bool`

HasMaximumAmount returns a boolean if a field has been set.

### GetMetadata

`func (o *PricesCreate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *PricesCreate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *PricesCreate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *PricesCreate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetMinimumAmount

`func (o *PricesCreate) GetMinimumAmount() float64`

GetMinimumAmount returns the MinimumAmount field if non-nil, zero value otherwise.

### GetMinimumAmountOk

`func (o *PricesCreate) GetMinimumAmountOk() (*float64, bool)`

GetMinimumAmountOk returns a tuple with the MinimumAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMinimumAmount

`func (o *PricesCreate) SetMinimumAmount(v float64)`

SetMinimumAmount sets MinimumAmount field to given value.

### HasMinimumAmount

`func (o *PricesCreate) HasMinimumAmount() bool`

HasMinimumAmount returns a boolean if a field has been set.

### GetPriceId

`func (o *PricesCreate) GetPriceId() string`

GetPriceId returns the PriceId field if non-nil, zero value otherwise.

### GetPriceIdOk

`func (o *PricesCreate) GetPriceIdOk() (*string, bool)`

GetPriceIdOk returns a tuple with the PriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriceId

`func (o *PricesCreate) SetPriceId(v string)`

SetPriceId sets PriceId field to given value.

### HasPriceId

`func (o *PricesCreate) HasPriceId() bool`

HasPriceId returns a boolean if a field has been set.

### GetPricingModel

`func (o *PricesCreate) GetPricingModel() string`

GetPricingModel returns the PricingModel field if non-nil, zero value otherwise.

### GetPricingModelOk

`func (o *PricesCreate) GetPricingModelOk() (*string, bool)`

GetPricingModelOk returns a tuple with the PricingModel field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPricingModel

`func (o *PricesCreate) SetPricingModel(v string)`

SetPricingModel sets PricingModel field to given value.

### HasPricingModel

`func (o *PricesCreate) HasPricingModel() bool`

HasPricingModel returns a boolean if a field has been set.

### GetProductId

`func (o *PricesCreate) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *PricesCreate) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *PricesCreate) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *PricesCreate) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetProviderPriceId

`func (o *PricesCreate) GetProviderPriceId() string`

GetProviderPriceId returns the ProviderPriceId field if non-nil, zero value otherwise.

### GetProviderPriceIdOk

`func (o *PricesCreate) GetProviderPriceIdOk() (*string, bool)`

GetProviderPriceIdOk returns a tuple with the ProviderPriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderPriceId

`func (o *PricesCreate) SetProviderPriceId(v string)`

SetProviderPriceId sets ProviderPriceId field to given value.

### HasProviderPriceId

`func (o *PricesCreate) HasProviderPriceId() bool`

HasProviderPriceId returns a boolean if a field has been set.

### GetProviderProductId

`func (o *PricesCreate) GetProviderProductId() string`

GetProviderProductId returns the ProviderProductId field if non-nil, zero value otherwise.

### GetProviderProductIdOk

`func (o *PricesCreate) GetProviderProductIdOk() (*string, bool)`

GetProviderProductIdOk returns a tuple with the ProviderProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderProductId

`func (o *PricesCreate) SetProviderProductId(v string)`

SetProviderProductId sets ProviderProductId field to given value.

### HasProviderProductId

`func (o *PricesCreate) HasProviderProductId() bool`

HasProviderProductId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


