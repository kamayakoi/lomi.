# Products

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**BillingFrequency** | Pointer to **string** |  | [optional] 
**ChargeDay** | Pointer to **float64** |  | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**CreatedBy** | Pointer to **string** |  | [optional] [readonly] 
**Description** | Pointer to **string** |  | [optional] 
**DisplayOnStorefront** | Pointer to **bool** |  | [optional] 
**Environment** | Pointer to **string** |  | [optional] 
**FailedPaymentAction** | Pointer to **string** |  | [optional] 
**FirstPaymentType** | Pointer to **string** |  | [optional] 
**ImageUrl** | Pointer to **string** | URL/URI | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**Name** | Pointer to **string** |  | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] [readonly] 
**ProductType** | Pointer to **string** |  | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**UsageAggregation** | Pointer to **string** |  | [optional] 
**UsageUnit** | Pointer to **string** |  | [optional] 

## Methods

### NewProducts

`func NewProducts() *Products`

NewProducts instantiates a new Products object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewProductsWithDefaults

`func NewProductsWithDefaults() *Products`

NewProductsWithDefaults instantiates a new Products object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetBillingFrequency

`func (o *Products) GetBillingFrequency() string`

GetBillingFrequency returns the BillingFrequency field if non-nil, zero value otherwise.

### GetBillingFrequencyOk

`func (o *Products) GetBillingFrequencyOk() (*string, bool)`

GetBillingFrequencyOk returns a tuple with the BillingFrequency field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBillingFrequency

`func (o *Products) SetBillingFrequency(v string)`

SetBillingFrequency sets BillingFrequency field to given value.

### HasBillingFrequency

`func (o *Products) HasBillingFrequency() bool`

HasBillingFrequency returns a boolean if a field has been set.

### GetChargeDay

`func (o *Products) GetChargeDay() float64`

GetChargeDay returns the ChargeDay field if non-nil, zero value otherwise.

### GetChargeDayOk

`func (o *Products) GetChargeDayOk() (*float64, bool)`

GetChargeDayOk returns a tuple with the ChargeDay field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetChargeDay

`func (o *Products) SetChargeDay(v float64)`

SetChargeDay sets ChargeDay field to given value.

### HasChargeDay

`func (o *Products) HasChargeDay() bool`

HasChargeDay returns a boolean if a field has been set.

### GetCreatedAt

`func (o *Products) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *Products) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *Products) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *Products) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetCreatedBy

`func (o *Products) GetCreatedBy() string`

GetCreatedBy returns the CreatedBy field if non-nil, zero value otherwise.

### GetCreatedByOk

`func (o *Products) GetCreatedByOk() (*string, bool)`

GetCreatedByOk returns a tuple with the CreatedBy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedBy

`func (o *Products) SetCreatedBy(v string)`

SetCreatedBy sets CreatedBy field to given value.

### HasCreatedBy

`func (o *Products) HasCreatedBy() bool`

HasCreatedBy returns a boolean if a field has been set.

### GetDescription

`func (o *Products) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *Products) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *Products) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *Products) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetDisplayOnStorefront

`func (o *Products) GetDisplayOnStorefront() bool`

GetDisplayOnStorefront returns the DisplayOnStorefront field if non-nil, zero value otherwise.

### GetDisplayOnStorefrontOk

`func (o *Products) GetDisplayOnStorefrontOk() (*bool, bool)`

GetDisplayOnStorefrontOk returns a tuple with the DisplayOnStorefront field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDisplayOnStorefront

`func (o *Products) SetDisplayOnStorefront(v bool)`

SetDisplayOnStorefront sets DisplayOnStorefront field to given value.

### HasDisplayOnStorefront

`func (o *Products) HasDisplayOnStorefront() bool`

HasDisplayOnStorefront returns a boolean if a field has been set.

### GetEnvironment

`func (o *Products) GetEnvironment() string`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *Products) GetEnvironmentOk() (*string, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *Products) SetEnvironment(v string)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *Products) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetFailedPaymentAction

`func (o *Products) GetFailedPaymentAction() string`

GetFailedPaymentAction returns the FailedPaymentAction field if non-nil, zero value otherwise.

### GetFailedPaymentActionOk

`func (o *Products) GetFailedPaymentActionOk() (*string, bool)`

GetFailedPaymentActionOk returns a tuple with the FailedPaymentAction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFailedPaymentAction

`func (o *Products) SetFailedPaymentAction(v string)`

SetFailedPaymentAction sets FailedPaymentAction field to given value.

### HasFailedPaymentAction

`func (o *Products) HasFailedPaymentAction() bool`

HasFailedPaymentAction returns a boolean if a field has been set.

### GetFirstPaymentType

`func (o *Products) GetFirstPaymentType() string`

GetFirstPaymentType returns the FirstPaymentType field if non-nil, zero value otherwise.

### GetFirstPaymentTypeOk

`func (o *Products) GetFirstPaymentTypeOk() (*string, bool)`

GetFirstPaymentTypeOk returns a tuple with the FirstPaymentType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFirstPaymentType

`func (o *Products) SetFirstPaymentType(v string)`

SetFirstPaymentType sets FirstPaymentType field to given value.

### HasFirstPaymentType

`func (o *Products) HasFirstPaymentType() bool`

HasFirstPaymentType returns a boolean if a field has been set.

### GetImageUrl

`func (o *Products) GetImageUrl() string`

GetImageUrl returns the ImageUrl field if non-nil, zero value otherwise.

### GetImageUrlOk

`func (o *Products) GetImageUrlOk() (*string, bool)`

GetImageUrlOk returns a tuple with the ImageUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetImageUrl

`func (o *Products) SetImageUrl(v string)`

SetImageUrl sets ImageUrl field to given value.

### HasImageUrl

`func (o *Products) HasImageUrl() bool`

HasImageUrl returns a boolean if a field has been set.

### GetIsActive

`func (o *Products) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *Products) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *Products) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *Products) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetMetadata

`func (o *Products) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *Products) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *Products) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *Products) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetName

`func (o *Products) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *Products) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *Products) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *Products) HasName() bool`

HasName returns a boolean if a field has been set.

### GetOrganizationId

`func (o *Products) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *Products) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *Products) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *Products) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetProductId

`func (o *Products) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *Products) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *Products) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *Products) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetProductType

`func (o *Products) GetProductType() string`

GetProductType returns the ProductType field if non-nil, zero value otherwise.

### GetProductTypeOk

`func (o *Products) GetProductTypeOk() (*string, bool)`

GetProductTypeOk returns a tuple with the ProductType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductType

`func (o *Products) SetProductType(v string)`

SetProductType sets ProductType field to given value.

### HasProductType

`func (o *Products) HasProductType() bool`

HasProductType returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *Products) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *Products) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *Products) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *Products) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.

### GetUsageAggregation

`func (o *Products) GetUsageAggregation() string`

GetUsageAggregation returns the UsageAggregation field if non-nil, zero value otherwise.

### GetUsageAggregationOk

`func (o *Products) GetUsageAggregationOk() (*string, bool)`

GetUsageAggregationOk returns a tuple with the UsageAggregation field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsageAggregation

`func (o *Products) SetUsageAggregation(v string)`

SetUsageAggregation sets UsageAggregation field to given value.

### HasUsageAggregation

`func (o *Products) HasUsageAggregation() bool`

HasUsageAggregation returns a boolean if a field has been set.

### GetUsageUnit

`func (o *Products) GetUsageUnit() string`

GetUsageUnit returns the UsageUnit field if non-nil, zero value otherwise.

### GetUsageUnitOk

`func (o *Products) GetUsageUnitOk() (*string, bool)`

GetUsageUnitOk returns a tuple with the UsageUnit field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsageUnit

`func (o *Products) SetUsageUnit(v string)`

SetUsageUnit sets UsageUnit field to given value.

### HasUsageUnit

`func (o *Products) HasUsageUnit() bool`

HasUsageUnit returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


