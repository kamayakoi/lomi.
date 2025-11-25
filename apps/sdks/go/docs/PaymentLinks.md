# PaymentLinks

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AllowCouponCode** | Pointer to **bool** |  | [optional] 
**AllowQuantity** | Pointer to **bool** |  | [optional] 
**AllowedProviders** | Pointer to **string** |  | [optional] 
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**CancelUrl** | Pointer to **string** | URL/URI | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**CreatedBy** | Pointer to **string** |  | [optional] [readonly] 
**CurrencyCode** | Pointer to **string** | Three-letter ISO currency code (e.g., XOF, USD, EUR) | [optional] 
**Environment** | Pointer to **string** |  | [optional] 
**ExpiresAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**LinkId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**LinkType** | Pointer to **string** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PriceId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PrivateDescription** | Pointer to **string** |  | [optional] 
**ProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PublicDescription** | Pointer to **string** |  | [optional] 
**Quantity** | Pointer to **float64** |  | [optional] 
**SuccessUrl** | Pointer to **string** | URL/URI | [optional] 
**Title** | Pointer to **string** |  | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**Url** | Pointer to **string** | URL/URI | [optional] 

## Methods

### NewPaymentLinks

`func NewPaymentLinks() *PaymentLinks`

NewPaymentLinks instantiates a new PaymentLinks object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPaymentLinksWithDefaults

`func NewPaymentLinksWithDefaults() *PaymentLinks`

NewPaymentLinksWithDefaults instantiates a new PaymentLinks object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAllowCouponCode

`func (o *PaymentLinks) GetAllowCouponCode() bool`

GetAllowCouponCode returns the AllowCouponCode field if non-nil, zero value otherwise.

### GetAllowCouponCodeOk

`func (o *PaymentLinks) GetAllowCouponCodeOk() (*bool, bool)`

GetAllowCouponCodeOk returns a tuple with the AllowCouponCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowCouponCode

`func (o *PaymentLinks) SetAllowCouponCode(v bool)`

SetAllowCouponCode sets AllowCouponCode field to given value.

### HasAllowCouponCode

`func (o *PaymentLinks) HasAllowCouponCode() bool`

HasAllowCouponCode returns a boolean if a field has been set.

### GetAllowQuantity

`func (o *PaymentLinks) GetAllowQuantity() bool`

GetAllowQuantity returns the AllowQuantity field if non-nil, zero value otherwise.

### GetAllowQuantityOk

`func (o *PaymentLinks) GetAllowQuantityOk() (*bool, bool)`

GetAllowQuantityOk returns a tuple with the AllowQuantity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowQuantity

`func (o *PaymentLinks) SetAllowQuantity(v bool)`

SetAllowQuantity sets AllowQuantity field to given value.

### HasAllowQuantity

`func (o *PaymentLinks) HasAllowQuantity() bool`

HasAllowQuantity returns a boolean if a field has been set.

### GetAllowedProviders

`func (o *PaymentLinks) GetAllowedProviders() string`

GetAllowedProviders returns the AllowedProviders field if non-nil, zero value otherwise.

### GetAllowedProvidersOk

`func (o *PaymentLinks) GetAllowedProvidersOk() (*string, bool)`

GetAllowedProvidersOk returns a tuple with the AllowedProviders field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowedProviders

`func (o *PaymentLinks) SetAllowedProviders(v string)`

SetAllowedProviders sets AllowedProviders field to given value.

### HasAllowedProviders

`func (o *PaymentLinks) HasAllowedProviders() bool`

HasAllowedProviders returns a boolean if a field has been set.

### GetAmount

`func (o *PaymentLinks) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *PaymentLinks) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *PaymentLinks) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *PaymentLinks) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCancelUrl

`func (o *PaymentLinks) GetCancelUrl() string`

GetCancelUrl returns the CancelUrl field if non-nil, zero value otherwise.

### GetCancelUrlOk

`func (o *PaymentLinks) GetCancelUrlOk() (*string, bool)`

GetCancelUrlOk returns a tuple with the CancelUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCancelUrl

`func (o *PaymentLinks) SetCancelUrl(v string)`

SetCancelUrl sets CancelUrl field to given value.

### HasCancelUrl

`func (o *PaymentLinks) HasCancelUrl() bool`

HasCancelUrl returns a boolean if a field has been set.

### GetCreatedAt

`func (o *PaymentLinks) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *PaymentLinks) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *PaymentLinks) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *PaymentLinks) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetCreatedBy

`func (o *PaymentLinks) GetCreatedBy() string`

GetCreatedBy returns the CreatedBy field if non-nil, zero value otherwise.

### GetCreatedByOk

`func (o *PaymentLinks) GetCreatedByOk() (*string, bool)`

GetCreatedByOk returns a tuple with the CreatedBy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedBy

`func (o *PaymentLinks) SetCreatedBy(v string)`

SetCreatedBy sets CreatedBy field to given value.

### HasCreatedBy

`func (o *PaymentLinks) HasCreatedBy() bool`

HasCreatedBy returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *PaymentLinks) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *PaymentLinks) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *PaymentLinks) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *PaymentLinks) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetEnvironment

`func (o *PaymentLinks) GetEnvironment() string`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *PaymentLinks) GetEnvironmentOk() (*string, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *PaymentLinks) SetEnvironment(v string)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *PaymentLinks) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetExpiresAt

`func (o *PaymentLinks) GetExpiresAt() time.Time`

GetExpiresAt returns the ExpiresAt field if non-nil, zero value otherwise.

### GetExpiresAtOk

`func (o *PaymentLinks) GetExpiresAtOk() (*time.Time, bool)`

GetExpiresAtOk returns a tuple with the ExpiresAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiresAt

`func (o *PaymentLinks) SetExpiresAt(v time.Time)`

SetExpiresAt sets ExpiresAt field to given value.

### HasExpiresAt

`func (o *PaymentLinks) HasExpiresAt() bool`

HasExpiresAt returns a boolean if a field has been set.

### GetIsActive

`func (o *PaymentLinks) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *PaymentLinks) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *PaymentLinks) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *PaymentLinks) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetLinkId

`func (o *PaymentLinks) GetLinkId() string`

GetLinkId returns the LinkId field if non-nil, zero value otherwise.

### GetLinkIdOk

`func (o *PaymentLinks) GetLinkIdOk() (*string, bool)`

GetLinkIdOk returns a tuple with the LinkId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLinkId

`func (o *PaymentLinks) SetLinkId(v string)`

SetLinkId sets LinkId field to given value.

### HasLinkId

`func (o *PaymentLinks) HasLinkId() bool`

HasLinkId returns a boolean if a field has been set.

### GetLinkType

`func (o *PaymentLinks) GetLinkType() string`

GetLinkType returns the LinkType field if non-nil, zero value otherwise.

### GetLinkTypeOk

`func (o *PaymentLinks) GetLinkTypeOk() (*string, bool)`

GetLinkTypeOk returns a tuple with the LinkType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLinkType

`func (o *PaymentLinks) SetLinkType(v string)`

SetLinkType sets LinkType field to given value.

### HasLinkType

`func (o *PaymentLinks) HasLinkType() bool`

HasLinkType returns a boolean if a field has been set.

### GetMetadata

`func (o *PaymentLinks) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *PaymentLinks) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *PaymentLinks) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *PaymentLinks) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetOrganizationId

`func (o *PaymentLinks) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *PaymentLinks) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *PaymentLinks) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *PaymentLinks) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetPriceId

`func (o *PaymentLinks) GetPriceId() string`

GetPriceId returns the PriceId field if non-nil, zero value otherwise.

### GetPriceIdOk

`func (o *PaymentLinks) GetPriceIdOk() (*string, bool)`

GetPriceIdOk returns a tuple with the PriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriceId

`func (o *PaymentLinks) SetPriceId(v string)`

SetPriceId sets PriceId field to given value.

### HasPriceId

`func (o *PaymentLinks) HasPriceId() bool`

HasPriceId returns a boolean if a field has been set.

### GetPrivateDescription

`func (o *PaymentLinks) GetPrivateDescription() string`

GetPrivateDescription returns the PrivateDescription field if non-nil, zero value otherwise.

### GetPrivateDescriptionOk

`func (o *PaymentLinks) GetPrivateDescriptionOk() (*string, bool)`

GetPrivateDescriptionOk returns a tuple with the PrivateDescription field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPrivateDescription

`func (o *PaymentLinks) SetPrivateDescription(v string)`

SetPrivateDescription sets PrivateDescription field to given value.

### HasPrivateDescription

`func (o *PaymentLinks) HasPrivateDescription() bool`

HasPrivateDescription returns a boolean if a field has been set.

### GetProductId

`func (o *PaymentLinks) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *PaymentLinks) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *PaymentLinks) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *PaymentLinks) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetPublicDescription

`func (o *PaymentLinks) GetPublicDescription() string`

GetPublicDescription returns the PublicDescription field if non-nil, zero value otherwise.

### GetPublicDescriptionOk

`func (o *PaymentLinks) GetPublicDescriptionOk() (*string, bool)`

GetPublicDescriptionOk returns a tuple with the PublicDescription field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPublicDescription

`func (o *PaymentLinks) SetPublicDescription(v string)`

SetPublicDescription sets PublicDescription field to given value.

### HasPublicDescription

`func (o *PaymentLinks) HasPublicDescription() bool`

HasPublicDescription returns a boolean if a field has been set.

### GetQuantity

`func (o *PaymentLinks) GetQuantity() float64`

GetQuantity returns the Quantity field if non-nil, zero value otherwise.

### GetQuantityOk

`func (o *PaymentLinks) GetQuantityOk() (*float64, bool)`

GetQuantityOk returns a tuple with the Quantity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQuantity

`func (o *PaymentLinks) SetQuantity(v float64)`

SetQuantity sets Quantity field to given value.

### HasQuantity

`func (o *PaymentLinks) HasQuantity() bool`

HasQuantity returns a boolean if a field has been set.

### GetSuccessUrl

`func (o *PaymentLinks) GetSuccessUrl() string`

GetSuccessUrl returns the SuccessUrl field if non-nil, zero value otherwise.

### GetSuccessUrlOk

`func (o *PaymentLinks) GetSuccessUrlOk() (*string, bool)`

GetSuccessUrlOk returns a tuple with the SuccessUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccessUrl

`func (o *PaymentLinks) SetSuccessUrl(v string)`

SetSuccessUrl sets SuccessUrl field to given value.

### HasSuccessUrl

`func (o *PaymentLinks) HasSuccessUrl() bool`

HasSuccessUrl returns a boolean if a field has been set.

### GetTitle

`func (o *PaymentLinks) GetTitle() string`

GetTitle returns the Title field if non-nil, zero value otherwise.

### GetTitleOk

`func (o *PaymentLinks) GetTitleOk() (*string, bool)`

GetTitleOk returns a tuple with the Title field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTitle

`func (o *PaymentLinks) SetTitle(v string)`

SetTitle sets Title field to given value.

### HasTitle

`func (o *PaymentLinks) HasTitle() bool`

HasTitle returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *PaymentLinks) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *PaymentLinks) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *PaymentLinks) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *PaymentLinks) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.

### GetUrl

`func (o *PaymentLinks) GetUrl() string`

GetUrl returns the Url field if non-nil, zero value otherwise.

### GetUrlOk

`func (o *PaymentLinks) GetUrlOk() (*string, bool)`

GetUrlOk returns a tuple with the Url field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUrl

`func (o *PaymentLinks) SetUrl(v string)`

SetUrl sets Url field to given value.

### HasUrl

`func (o *PaymentLinks) HasUrl() bool`

HasUrl returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


