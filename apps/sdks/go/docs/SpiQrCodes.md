# SpiQrCodes

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Categorie** | Pointer to **string** |  | [optional] 
**CheckoutSessionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ComptePaye** | Pointer to **string** |  | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**CreatedBy** | Pointer to **string** |  | [optional] [readonly] 
**Environment** | Pointer to **string** |  | [optional] 
**ExpiresAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**IsUsed** | Pointer to **bool** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**Montant** | Pointer to **float64** |  | [optional] 
**Name** | Pointer to **string** |  | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PayeurAlias** | Pointer to **string** |  | [optional] 
**PaymentRequestId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PlanId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**QrCodeData** | Pointer to **string** |  | [optional] 
**QrCodeId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**QrCodeImageData** | Pointer to **string** |  | [optional] 
**QrCodeImageUrl** | Pointer to **string** | URL/URI | [optional] 
**QrCodeType** | Pointer to **string** |  | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 

## Methods

### NewSpiQrCodes

`func NewSpiQrCodes() *SpiQrCodes`

NewSpiQrCodes instantiates a new SpiQrCodes object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSpiQrCodesWithDefaults

`func NewSpiQrCodesWithDefaults() *SpiQrCodes`

NewSpiQrCodesWithDefaults instantiates a new SpiQrCodes object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCategorie

`func (o *SpiQrCodes) GetCategorie() string`

GetCategorie returns the Categorie field if non-nil, zero value otherwise.

### GetCategorieOk

`func (o *SpiQrCodes) GetCategorieOk() (*string, bool)`

GetCategorieOk returns a tuple with the Categorie field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCategorie

`func (o *SpiQrCodes) SetCategorie(v string)`

SetCategorie sets Categorie field to given value.

### HasCategorie

`func (o *SpiQrCodes) HasCategorie() bool`

HasCategorie returns a boolean if a field has been set.

### GetCheckoutSessionId

`func (o *SpiQrCodes) GetCheckoutSessionId() string`

GetCheckoutSessionId returns the CheckoutSessionId field if non-nil, zero value otherwise.

### GetCheckoutSessionIdOk

`func (o *SpiQrCodes) GetCheckoutSessionIdOk() (*string, bool)`

GetCheckoutSessionIdOk returns a tuple with the CheckoutSessionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCheckoutSessionId

`func (o *SpiQrCodes) SetCheckoutSessionId(v string)`

SetCheckoutSessionId sets CheckoutSessionId field to given value.

### HasCheckoutSessionId

`func (o *SpiQrCodes) HasCheckoutSessionId() bool`

HasCheckoutSessionId returns a boolean if a field has been set.

### GetComptePaye

`func (o *SpiQrCodes) GetComptePaye() string`

GetComptePaye returns the ComptePaye field if non-nil, zero value otherwise.

### GetComptePayeOk

`func (o *SpiQrCodes) GetComptePayeOk() (*string, bool)`

GetComptePayeOk returns a tuple with the ComptePaye field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetComptePaye

`func (o *SpiQrCodes) SetComptePaye(v string)`

SetComptePaye sets ComptePaye field to given value.

### HasComptePaye

`func (o *SpiQrCodes) HasComptePaye() bool`

HasComptePaye returns a boolean if a field has been set.

### GetCreatedAt

`func (o *SpiQrCodes) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *SpiQrCodes) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *SpiQrCodes) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *SpiQrCodes) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetCreatedBy

`func (o *SpiQrCodes) GetCreatedBy() string`

GetCreatedBy returns the CreatedBy field if non-nil, zero value otherwise.

### GetCreatedByOk

`func (o *SpiQrCodes) GetCreatedByOk() (*string, bool)`

GetCreatedByOk returns a tuple with the CreatedBy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedBy

`func (o *SpiQrCodes) SetCreatedBy(v string)`

SetCreatedBy sets CreatedBy field to given value.

### HasCreatedBy

`func (o *SpiQrCodes) HasCreatedBy() bool`

HasCreatedBy returns a boolean if a field has been set.

### GetEnvironment

`func (o *SpiQrCodes) GetEnvironment() string`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *SpiQrCodes) GetEnvironmentOk() (*string, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *SpiQrCodes) SetEnvironment(v string)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *SpiQrCodes) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetExpiresAt

`func (o *SpiQrCodes) GetExpiresAt() time.Time`

GetExpiresAt returns the ExpiresAt field if non-nil, zero value otherwise.

### GetExpiresAtOk

`func (o *SpiQrCodes) GetExpiresAtOk() (*time.Time, bool)`

GetExpiresAtOk returns a tuple with the ExpiresAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiresAt

`func (o *SpiQrCodes) SetExpiresAt(v time.Time)`

SetExpiresAt sets ExpiresAt field to given value.

### HasExpiresAt

`func (o *SpiQrCodes) HasExpiresAt() bool`

HasExpiresAt returns a boolean if a field has been set.

### GetIsActive

`func (o *SpiQrCodes) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *SpiQrCodes) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *SpiQrCodes) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *SpiQrCodes) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetIsUsed

`func (o *SpiQrCodes) GetIsUsed() bool`

GetIsUsed returns the IsUsed field if non-nil, zero value otherwise.

### GetIsUsedOk

`func (o *SpiQrCodes) GetIsUsedOk() (*bool, bool)`

GetIsUsedOk returns a tuple with the IsUsed field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsUsed

`func (o *SpiQrCodes) SetIsUsed(v bool)`

SetIsUsed sets IsUsed field to given value.

### HasIsUsed

`func (o *SpiQrCodes) HasIsUsed() bool`

HasIsUsed returns a boolean if a field has been set.

### GetMetadata

`func (o *SpiQrCodes) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *SpiQrCodes) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *SpiQrCodes) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *SpiQrCodes) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetMontant

`func (o *SpiQrCodes) GetMontant() float64`

GetMontant returns the Montant field if non-nil, zero value otherwise.

### GetMontantOk

`func (o *SpiQrCodes) GetMontantOk() (*float64, bool)`

GetMontantOk returns a tuple with the Montant field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMontant

`func (o *SpiQrCodes) SetMontant(v float64)`

SetMontant sets Montant field to given value.

### HasMontant

`func (o *SpiQrCodes) HasMontant() bool`

HasMontant returns a boolean if a field has been set.

### GetName

`func (o *SpiQrCodes) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *SpiQrCodes) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *SpiQrCodes) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *SpiQrCodes) HasName() bool`

HasName returns a boolean if a field has been set.

### GetOrganizationId

`func (o *SpiQrCodes) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *SpiQrCodes) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *SpiQrCodes) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *SpiQrCodes) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetPayeurAlias

`func (o *SpiQrCodes) GetPayeurAlias() string`

GetPayeurAlias returns the PayeurAlias field if non-nil, zero value otherwise.

### GetPayeurAliasOk

`func (o *SpiQrCodes) GetPayeurAliasOk() (*string, bool)`

GetPayeurAliasOk returns a tuple with the PayeurAlias field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayeurAlias

`func (o *SpiQrCodes) SetPayeurAlias(v string)`

SetPayeurAlias sets PayeurAlias field to given value.

### HasPayeurAlias

`func (o *SpiQrCodes) HasPayeurAlias() bool`

HasPayeurAlias returns a boolean if a field has been set.

### GetPaymentRequestId

`func (o *SpiQrCodes) GetPaymentRequestId() string`

GetPaymentRequestId returns the PaymentRequestId field if non-nil, zero value otherwise.

### GetPaymentRequestIdOk

`func (o *SpiQrCodes) GetPaymentRequestIdOk() (*string, bool)`

GetPaymentRequestIdOk returns a tuple with the PaymentRequestId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentRequestId

`func (o *SpiQrCodes) SetPaymentRequestId(v string)`

SetPaymentRequestId sets PaymentRequestId field to given value.

### HasPaymentRequestId

`func (o *SpiQrCodes) HasPaymentRequestId() bool`

HasPaymentRequestId returns a boolean if a field has been set.

### GetPlanId

`func (o *SpiQrCodes) GetPlanId() string`

GetPlanId returns the PlanId field if non-nil, zero value otherwise.

### GetPlanIdOk

`func (o *SpiQrCodes) GetPlanIdOk() (*string, bool)`

GetPlanIdOk returns a tuple with the PlanId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPlanId

`func (o *SpiQrCodes) SetPlanId(v string)`

SetPlanId sets PlanId field to given value.

### HasPlanId

`func (o *SpiQrCodes) HasPlanId() bool`

HasPlanId returns a boolean if a field has been set.

### GetProductId

`func (o *SpiQrCodes) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *SpiQrCodes) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *SpiQrCodes) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *SpiQrCodes) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetQrCodeData

`func (o *SpiQrCodes) GetQrCodeData() string`

GetQrCodeData returns the QrCodeData field if non-nil, zero value otherwise.

### GetQrCodeDataOk

`func (o *SpiQrCodes) GetQrCodeDataOk() (*string, bool)`

GetQrCodeDataOk returns a tuple with the QrCodeData field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQrCodeData

`func (o *SpiQrCodes) SetQrCodeData(v string)`

SetQrCodeData sets QrCodeData field to given value.

### HasQrCodeData

`func (o *SpiQrCodes) HasQrCodeData() bool`

HasQrCodeData returns a boolean if a field has been set.

### GetQrCodeId

`func (o *SpiQrCodes) GetQrCodeId() string`

GetQrCodeId returns the QrCodeId field if non-nil, zero value otherwise.

### GetQrCodeIdOk

`func (o *SpiQrCodes) GetQrCodeIdOk() (*string, bool)`

GetQrCodeIdOk returns a tuple with the QrCodeId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQrCodeId

`func (o *SpiQrCodes) SetQrCodeId(v string)`

SetQrCodeId sets QrCodeId field to given value.

### HasQrCodeId

`func (o *SpiQrCodes) HasQrCodeId() bool`

HasQrCodeId returns a boolean if a field has been set.

### GetQrCodeImageData

`func (o *SpiQrCodes) GetQrCodeImageData() string`

GetQrCodeImageData returns the QrCodeImageData field if non-nil, zero value otherwise.

### GetQrCodeImageDataOk

`func (o *SpiQrCodes) GetQrCodeImageDataOk() (*string, bool)`

GetQrCodeImageDataOk returns a tuple with the QrCodeImageData field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQrCodeImageData

`func (o *SpiQrCodes) SetQrCodeImageData(v string)`

SetQrCodeImageData sets QrCodeImageData field to given value.

### HasQrCodeImageData

`func (o *SpiQrCodes) HasQrCodeImageData() bool`

HasQrCodeImageData returns a boolean if a field has been set.

### GetQrCodeImageUrl

`func (o *SpiQrCodes) GetQrCodeImageUrl() string`

GetQrCodeImageUrl returns the QrCodeImageUrl field if non-nil, zero value otherwise.

### GetQrCodeImageUrlOk

`func (o *SpiQrCodes) GetQrCodeImageUrlOk() (*string, bool)`

GetQrCodeImageUrlOk returns a tuple with the QrCodeImageUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQrCodeImageUrl

`func (o *SpiQrCodes) SetQrCodeImageUrl(v string)`

SetQrCodeImageUrl sets QrCodeImageUrl field to given value.

### HasQrCodeImageUrl

`func (o *SpiQrCodes) HasQrCodeImageUrl() bool`

HasQrCodeImageUrl returns a boolean if a field has been set.

### GetQrCodeType

`func (o *SpiQrCodes) GetQrCodeType() string`

GetQrCodeType returns the QrCodeType field if non-nil, zero value otherwise.

### GetQrCodeTypeOk

`func (o *SpiQrCodes) GetQrCodeTypeOk() (*string, bool)`

GetQrCodeTypeOk returns a tuple with the QrCodeType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQrCodeType

`func (o *SpiQrCodes) SetQrCodeType(v string)`

SetQrCodeType sets QrCodeType field to given value.

### HasQrCodeType

`func (o *SpiQrCodes) HasQrCodeType() bool`

HasQrCodeType returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *SpiQrCodes) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *SpiQrCodes) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *SpiQrCodes) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *SpiQrCodes) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


