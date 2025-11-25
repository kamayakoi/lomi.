# ProductsUpdate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**BillingFrequency** | Pointer to **string** |  | [optional] 
**ChargeDay** | Pointer to **float64** |  | [optional] 
**Description** | Pointer to **string** |  | [optional] 
**DisplayOnStorefront** | Pointer to **bool** |  | [optional] 
**FailedPaymentAction** | Pointer to **string** |  | [optional] 
**FirstPaymentType** | Pointer to **string** |  | [optional] 
**ImageUrl** | Pointer to **string** | URL/URI | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**Name** | Pointer to **string** |  | [optional] 
**ProductType** | Pointer to **string** |  | [optional] 
**UsageAggregation** | Pointer to **string** |  | [optional] 
**UsageUnit** | Pointer to **string** |  | [optional] 

## Methods

### NewProductsUpdate

`func NewProductsUpdate() *ProductsUpdate`

NewProductsUpdate instantiates a new ProductsUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewProductsUpdateWithDefaults

`func NewProductsUpdateWithDefaults() *ProductsUpdate`

NewProductsUpdateWithDefaults instantiates a new ProductsUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetBillingFrequency

`func (o *ProductsUpdate) GetBillingFrequency() string`

GetBillingFrequency returns the BillingFrequency field if non-nil, zero value otherwise.

### GetBillingFrequencyOk

`func (o *ProductsUpdate) GetBillingFrequencyOk() (*string, bool)`

GetBillingFrequencyOk returns a tuple with the BillingFrequency field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBillingFrequency

`func (o *ProductsUpdate) SetBillingFrequency(v string)`

SetBillingFrequency sets BillingFrequency field to given value.

### HasBillingFrequency

`func (o *ProductsUpdate) HasBillingFrequency() bool`

HasBillingFrequency returns a boolean if a field has been set.

### GetChargeDay

`func (o *ProductsUpdate) GetChargeDay() float64`

GetChargeDay returns the ChargeDay field if non-nil, zero value otherwise.

### GetChargeDayOk

`func (o *ProductsUpdate) GetChargeDayOk() (*float64, bool)`

GetChargeDayOk returns a tuple with the ChargeDay field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetChargeDay

`func (o *ProductsUpdate) SetChargeDay(v float64)`

SetChargeDay sets ChargeDay field to given value.

### HasChargeDay

`func (o *ProductsUpdate) HasChargeDay() bool`

HasChargeDay returns a boolean if a field has been set.

### GetDescription

`func (o *ProductsUpdate) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *ProductsUpdate) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *ProductsUpdate) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *ProductsUpdate) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetDisplayOnStorefront

`func (o *ProductsUpdate) GetDisplayOnStorefront() bool`

GetDisplayOnStorefront returns the DisplayOnStorefront field if non-nil, zero value otherwise.

### GetDisplayOnStorefrontOk

`func (o *ProductsUpdate) GetDisplayOnStorefrontOk() (*bool, bool)`

GetDisplayOnStorefrontOk returns a tuple with the DisplayOnStorefront field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDisplayOnStorefront

`func (o *ProductsUpdate) SetDisplayOnStorefront(v bool)`

SetDisplayOnStorefront sets DisplayOnStorefront field to given value.

### HasDisplayOnStorefront

`func (o *ProductsUpdate) HasDisplayOnStorefront() bool`

HasDisplayOnStorefront returns a boolean if a field has been set.

### GetFailedPaymentAction

`func (o *ProductsUpdate) GetFailedPaymentAction() string`

GetFailedPaymentAction returns the FailedPaymentAction field if non-nil, zero value otherwise.

### GetFailedPaymentActionOk

`func (o *ProductsUpdate) GetFailedPaymentActionOk() (*string, bool)`

GetFailedPaymentActionOk returns a tuple with the FailedPaymentAction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFailedPaymentAction

`func (o *ProductsUpdate) SetFailedPaymentAction(v string)`

SetFailedPaymentAction sets FailedPaymentAction field to given value.

### HasFailedPaymentAction

`func (o *ProductsUpdate) HasFailedPaymentAction() bool`

HasFailedPaymentAction returns a boolean if a field has been set.

### GetFirstPaymentType

`func (o *ProductsUpdate) GetFirstPaymentType() string`

GetFirstPaymentType returns the FirstPaymentType field if non-nil, zero value otherwise.

### GetFirstPaymentTypeOk

`func (o *ProductsUpdate) GetFirstPaymentTypeOk() (*string, bool)`

GetFirstPaymentTypeOk returns a tuple with the FirstPaymentType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFirstPaymentType

`func (o *ProductsUpdate) SetFirstPaymentType(v string)`

SetFirstPaymentType sets FirstPaymentType field to given value.

### HasFirstPaymentType

`func (o *ProductsUpdate) HasFirstPaymentType() bool`

HasFirstPaymentType returns a boolean if a field has been set.

### GetImageUrl

`func (o *ProductsUpdate) GetImageUrl() string`

GetImageUrl returns the ImageUrl field if non-nil, zero value otherwise.

### GetImageUrlOk

`func (o *ProductsUpdate) GetImageUrlOk() (*string, bool)`

GetImageUrlOk returns a tuple with the ImageUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetImageUrl

`func (o *ProductsUpdate) SetImageUrl(v string)`

SetImageUrl sets ImageUrl field to given value.

### HasImageUrl

`func (o *ProductsUpdate) HasImageUrl() bool`

HasImageUrl returns a boolean if a field has been set.

### GetIsActive

`func (o *ProductsUpdate) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *ProductsUpdate) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *ProductsUpdate) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *ProductsUpdate) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetMetadata

`func (o *ProductsUpdate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *ProductsUpdate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *ProductsUpdate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *ProductsUpdate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetName

`func (o *ProductsUpdate) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *ProductsUpdate) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *ProductsUpdate) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *ProductsUpdate) HasName() bool`

HasName returns a boolean if a field has been set.

### GetProductType

`func (o *ProductsUpdate) GetProductType() string`

GetProductType returns the ProductType field if non-nil, zero value otherwise.

### GetProductTypeOk

`func (o *ProductsUpdate) GetProductTypeOk() (*string, bool)`

GetProductTypeOk returns a tuple with the ProductType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductType

`func (o *ProductsUpdate) SetProductType(v string)`

SetProductType sets ProductType field to given value.

### HasProductType

`func (o *ProductsUpdate) HasProductType() bool`

HasProductType returns a boolean if a field has been set.

### GetUsageAggregation

`func (o *ProductsUpdate) GetUsageAggregation() string`

GetUsageAggregation returns the UsageAggregation field if non-nil, zero value otherwise.

### GetUsageAggregationOk

`func (o *ProductsUpdate) GetUsageAggregationOk() (*string, bool)`

GetUsageAggregationOk returns a tuple with the UsageAggregation field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsageAggregation

`func (o *ProductsUpdate) SetUsageAggregation(v string)`

SetUsageAggregation sets UsageAggregation field to given value.

### HasUsageAggregation

`func (o *ProductsUpdate) HasUsageAggregation() bool`

HasUsageAggregation returns a boolean if a field has been set.

### GetUsageUnit

`func (o *ProductsUpdate) GetUsageUnit() string`

GetUsageUnit returns the UsageUnit field if non-nil, zero value otherwise.

### GetUsageUnitOk

`func (o *ProductsUpdate) GetUsageUnitOk() (*string, bool)`

GetUsageUnitOk returns a tuple with the UsageUnit field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsageUnit

`func (o *ProductsUpdate) SetUsageUnit(v string)`

SetUsageUnit sets UsageUnit field to given value.

### HasUsageUnit

`func (o *ProductsUpdate) HasUsageUnit() bool`

HasUsageUnit returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


