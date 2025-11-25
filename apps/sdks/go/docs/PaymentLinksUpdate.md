# PaymentLinksUpdate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AllowCouponCode** | Pointer to **bool** |  | [optional] 
**AllowQuantity** | Pointer to **bool** |  | [optional] 
**AllowedProviders** | Pointer to **string** |  | [optional] 
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**CancelUrl** | Pointer to **string** | URL/URI | [optional] 
**CurrencyCode** | Pointer to **string** | Three-letter ISO currency code (e.g., XOF, USD, EUR) | [optional] 
**ExpiresAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**LinkId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**LinkType** | Pointer to **string** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**PriceId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PrivateDescription** | Pointer to **string** |  | [optional] 
**ProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PublicDescription** | Pointer to **string** |  | [optional] 
**Quantity** | Pointer to **float64** |  | [optional] 
**SuccessUrl** | Pointer to **string** | URL/URI | [optional] 
**Title** | Pointer to **string** |  | [optional] 
**Url** | Pointer to **string** | URL/URI | [optional] 

## Methods

### NewPaymentLinksUpdate

`func NewPaymentLinksUpdate() *PaymentLinksUpdate`

NewPaymentLinksUpdate instantiates a new PaymentLinksUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPaymentLinksUpdateWithDefaults

`func NewPaymentLinksUpdateWithDefaults() *PaymentLinksUpdate`

NewPaymentLinksUpdateWithDefaults instantiates a new PaymentLinksUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAllowCouponCode

`func (o *PaymentLinksUpdate) GetAllowCouponCode() bool`

GetAllowCouponCode returns the AllowCouponCode field if non-nil, zero value otherwise.

### GetAllowCouponCodeOk

`func (o *PaymentLinksUpdate) GetAllowCouponCodeOk() (*bool, bool)`

GetAllowCouponCodeOk returns a tuple with the AllowCouponCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowCouponCode

`func (o *PaymentLinksUpdate) SetAllowCouponCode(v bool)`

SetAllowCouponCode sets AllowCouponCode field to given value.

### HasAllowCouponCode

`func (o *PaymentLinksUpdate) HasAllowCouponCode() bool`

HasAllowCouponCode returns a boolean if a field has been set.

### GetAllowQuantity

`func (o *PaymentLinksUpdate) GetAllowQuantity() bool`

GetAllowQuantity returns the AllowQuantity field if non-nil, zero value otherwise.

### GetAllowQuantityOk

`func (o *PaymentLinksUpdate) GetAllowQuantityOk() (*bool, bool)`

GetAllowQuantityOk returns a tuple with the AllowQuantity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowQuantity

`func (o *PaymentLinksUpdate) SetAllowQuantity(v bool)`

SetAllowQuantity sets AllowQuantity field to given value.

### HasAllowQuantity

`func (o *PaymentLinksUpdate) HasAllowQuantity() bool`

HasAllowQuantity returns a boolean if a field has been set.

### GetAllowedProviders

`func (o *PaymentLinksUpdate) GetAllowedProviders() string`

GetAllowedProviders returns the AllowedProviders field if non-nil, zero value otherwise.

### GetAllowedProvidersOk

`func (o *PaymentLinksUpdate) GetAllowedProvidersOk() (*string, bool)`

GetAllowedProvidersOk returns a tuple with the AllowedProviders field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowedProviders

`func (o *PaymentLinksUpdate) SetAllowedProviders(v string)`

SetAllowedProviders sets AllowedProviders field to given value.

### HasAllowedProviders

`func (o *PaymentLinksUpdate) HasAllowedProviders() bool`

HasAllowedProviders returns a boolean if a field has been set.

### GetAmount

`func (o *PaymentLinksUpdate) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *PaymentLinksUpdate) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *PaymentLinksUpdate) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *PaymentLinksUpdate) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCancelUrl

`func (o *PaymentLinksUpdate) GetCancelUrl() string`

GetCancelUrl returns the CancelUrl field if non-nil, zero value otherwise.

### GetCancelUrlOk

`func (o *PaymentLinksUpdate) GetCancelUrlOk() (*string, bool)`

GetCancelUrlOk returns a tuple with the CancelUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCancelUrl

`func (o *PaymentLinksUpdate) SetCancelUrl(v string)`

SetCancelUrl sets CancelUrl field to given value.

### HasCancelUrl

`func (o *PaymentLinksUpdate) HasCancelUrl() bool`

HasCancelUrl returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *PaymentLinksUpdate) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *PaymentLinksUpdate) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *PaymentLinksUpdate) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *PaymentLinksUpdate) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetExpiresAt

`func (o *PaymentLinksUpdate) GetExpiresAt() time.Time`

GetExpiresAt returns the ExpiresAt field if non-nil, zero value otherwise.

### GetExpiresAtOk

`func (o *PaymentLinksUpdate) GetExpiresAtOk() (*time.Time, bool)`

GetExpiresAtOk returns a tuple with the ExpiresAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiresAt

`func (o *PaymentLinksUpdate) SetExpiresAt(v time.Time)`

SetExpiresAt sets ExpiresAt field to given value.

### HasExpiresAt

`func (o *PaymentLinksUpdate) HasExpiresAt() bool`

HasExpiresAt returns a boolean if a field has been set.

### GetIsActive

`func (o *PaymentLinksUpdate) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *PaymentLinksUpdate) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *PaymentLinksUpdate) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *PaymentLinksUpdate) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetLinkId

`func (o *PaymentLinksUpdate) GetLinkId() string`

GetLinkId returns the LinkId field if non-nil, zero value otherwise.

### GetLinkIdOk

`func (o *PaymentLinksUpdate) GetLinkIdOk() (*string, bool)`

GetLinkIdOk returns a tuple with the LinkId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLinkId

`func (o *PaymentLinksUpdate) SetLinkId(v string)`

SetLinkId sets LinkId field to given value.

### HasLinkId

`func (o *PaymentLinksUpdate) HasLinkId() bool`

HasLinkId returns a boolean if a field has been set.

### GetLinkType

`func (o *PaymentLinksUpdate) GetLinkType() string`

GetLinkType returns the LinkType field if non-nil, zero value otherwise.

### GetLinkTypeOk

`func (o *PaymentLinksUpdate) GetLinkTypeOk() (*string, bool)`

GetLinkTypeOk returns a tuple with the LinkType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLinkType

`func (o *PaymentLinksUpdate) SetLinkType(v string)`

SetLinkType sets LinkType field to given value.

### HasLinkType

`func (o *PaymentLinksUpdate) HasLinkType() bool`

HasLinkType returns a boolean if a field has been set.

### GetMetadata

`func (o *PaymentLinksUpdate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *PaymentLinksUpdate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *PaymentLinksUpdate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *PaymentLinksUpdate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetPriceId

`func (o *PaymentLinksUpdate) GetPriceId() string`

GetPriceId returns the PriceId field if non-nil, zero value otherwise.

### GetPriceIdOk

`func (o *PaymentLinksUpdate) GetPriceIdOk() (*string, bool)`

GetPriceIdOk returns a tuple with the PriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriceId

`func (o *PaymentLinksUpdate) SetPriceId(v string)`

SetPriceId sets PriceId field to given value.

### HasPriceId

`func (o *PaymentLinksUpdate) HasPriceId() bool`

HasPriceId returns a boolean if a field has been set.

### GetPrivateDescription

`func (o *PaymentLinksUpdate) GetPrivateDescription() string`

GetPrivateDescription returns the PrivateDescription field if non-nil, zero value otherwise.

### GetPrivateDescriptionOk

`func (o *PaymentLinksUpdate) GetPrivateDescriptionOk() (*string, bool)`

GetPrivateDescriptionOk returns a tuple with the PrivateDescription field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPrivateDescription

`func (o *PaymentLinksUpdate) SetPrivateDescription(v string)`

SetPrivateDescription sets PrivateDescription field to given value.

### HasPrivateDescription

`func (o *PaymentLinksUpdate) HasPrivateDescription() bool`

HasPrivateDescription returns a boolean if a field has been set.

### GetProductId

`func (o *PaymentLinksUpdate) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *PaymentLinksUpdate) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *PaymentLinksUpdate) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *PaymentLinksUpdate) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetPublicDescription

`func (o *PaymentLinksUpdate) GetPublicDescription() string`

GetPublicDescription returns the PublicDescription field if non-nil, zero value otherwise.

### GetPublicDescriptionOk

`func (o *PaymentLinksUpdate) GetPublicDescriptionOk() (*string, bool)`

GetPublicDescriptionOk returns a tuple with the PublicDescription field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPublicDescription

`func (o *PaymentLinksUpdate) SetPublicDescription(v string)`

SetPublicDescription sets PublicDescription field to given value.

### HasPublicDescription

`func (o *PaymentLinksUpdate) HasPublicDescription() bool`

HasPublicDescription returns a boolean if a field has been set.

### GetQuantity

`func (o *PaymentLinksUpdate) GetQuantity() float64`

GetQuantity returns the Quantity field if non-nil, zero value otherwise.

### GetQuantityOk

`func (o *PaymentLinksUpdate) GetQuantityOk() (*float64, bool)`

GetQuantityOk returns a tuple with the Quantity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQuantity

`func (o *PaymentLinksUpdate) SetQuantity(v float64)`

SetQuantity sets Quantity field to given value.

### HasQuantity

`func (o *PaymentLinksUpdate) HasQuantity() bool`

HasQuantity returns a boolean if a field has been set.

### GetSuccessUrl

`func (o *PaymentLinksUpdate) GetSuccessUrl() string`

GetSuccessUrl returns the SuccessUrl field if non-nil, zero value otherwise.

### GetSuccessUrlOk

`func (o *PaymentLinksUpdate) GetSuccessUrlOk() (*string, bool)`

GetSuccessUrlOk returns a tuple with the SuccessUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccessUrl

`func (o *PaymentLinksUpdate) SetSuccessUrl(v string)`

SetSuccessUrl sets SuccessUrl field to given value.

### HasSuccessUrl

`func (o *PaymentLinksUpdate) HasSuccessUrl() bool`

HasSuccessUrl returns a boolean if a field has been set.

### GetTitle

`func (o *PaymentLinksUpdate) GetTitle() string`

GetTitle returns the Title field if non-nil, zero value otherwise.

### GetTitleOk

`func (o *PaymentLinksUpdate) GetTitleOk() (*string, bool)`

GetTitleOk returns a tuple with the Title field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTitle

`func (o *PaymentLinksUpdate) SetTitle(v string)`

SetTitle sets Title field to given value.

### HasTitle

`func (o *PaymentLinksUpdate) HasTitle() bool`

HasTitle returns a boolean if a field has been set.

### GetUrl

`func (o *PaymentLinksUpdate) GetUrl() string`

GetUrl returns the Url field if non-nil, zero value otherwise.

### GetUrlOk

`func (o *PaymentLinksUpdate) GetUrlOk() (*string, bool)`

GetUrlOk returns a tuple with the Url field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUrl

`func (o *PaymentLinksUpdate) SetUrl(v string)`

SetUrl sets Url field to given value.

### HasUrl

`func (o *PaymentLinksUpdate) HasUrl() bool`

HasUrl returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


