# DiscountCouponsCreate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AppliesToProductTypes** | Pointer to **string** |  | [optional] 
**Code** | Pointer to **string** |  | [optional] 
**CouponId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**CurrentUses** | Pointer to **float64** |  | [optional] 
**CustomerType** | Pointer to **string** |  | [optional] 
**Description** | Pointer to **string** |  | [optional] 
**DiscountFixedAmount** | Pointer to **float64** |  | [optional] 
**DiscountPercentage** | Pointer to **float64** |  | [optional] 
**DiscountType** | Pointer to **string** |  | [optional] 
**ExpiresAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**IsOrganizationWide** | Pointer to **bool** |  | [optional] 
**MaxQuantityPerUse** | Pointer to **float64** |  | [optional] 
**MaxUses** | Pointer to **float64** |  | [optional] 
**ScopeType** | Pointer to **string** |  | [optional] 
**UsageFrequencyLimit** | Pointer to **string** |  | [optional] 
**UsageLimitValue** | Pointer to **float64** |  | [optional] 
**ValidFrom** | Pointer to **string** |  | [optional] 

## Methods

### NewDiscountCouponsCreate

`func NewDiscountCouponsCreate() *DiscountCouponsCreate`

NewDiscountCouponsCreate instantiates a new DiscountCouponsCreate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDiscountCouponsCreateWithDefaults

`func NewDiscountCouponsCreateWithDefaults() *DiscountCouponsCreate`

NewDiscountCouponsCreateWithDefaults instantiates a new DiscountCouponsCreate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAppliesToProductTypes

`func (o *DiscountCouponsCreate) GetAppliesToProductTypes() string`

GetAppliesToProductTypes returns the AppliesToProductTypes field if non-nil, zero value otherwise.

### GetAppliesToProductTypesOk

`func (o *DiscountCouponsCreate) GetAppliesToProductTypesOk() (*string, bool)`

GetAppliesToProductTypesOk returns a tuple with the AppliesToProductTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAppliesToProductTypes

`func (o *DiscountCouponsCreate) SetAppliesToProductTypes(v string)`

SetAppliesToProductTypes sets AppliesToProductTypes field to given value.

### HasAppliesToProductTypes

`func (o *DiscountCouponsCreate) HasAppliesToProductTypes() bool`

HasAppliesToProductTypes returns a boolean if a field has been set.

### GetCode

`func (o *DiscountCouponsCreate) GetCode() string`

GetCode returns the Code field if non-nil, zero value otherwise.

### GetCodeOk

`func (o *DiscountCouponsCreate) GetCodeOk() (*string, bool)`

GetCodeOk returns a tuple with the Code field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCode

`func (o *DiscountCouponsCreate) SetCode(v string)`

SetCode sets Code field to given value.

### HasCode

`func (o *DiscountCouponsCreate) HasCode() bool`

HasCode returns a boolean if a field has been set.

### GetCouponId

`func (o *DiscountCouponsCreate) GetCouponId() string`

GetCouponId returns the CouponId field if non-nil, zero value otherwise.

### GetCouponIdOk

`func (o *DiscountCouponsCreate) GetCouponIdOk() (*string, bool)`

GetCouponIdOk returns a tuple with the CouponId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCouponId

`func (o *DiscountCouponsCreate) SetCouponId(v string)`

SetCouponId sets CouponId field to given value.

### HasCouponId

`func (o *DiscountCouponsCreate) HasCouponId() bool`

HasCouponId returns a boolean if a field has been set.

### GetCurrentUses

`func (o *DiscountCouponsCreate) GetCurrentUses() float64`

GetCurrentUses returns the CurrentUses field if non-nil, zero value otherwise.

### GetCurrentUsesOk

`func (o *DiscountCouponsCreate) GetCurrentUsesOk() (*float64, bool)`

GetCurrentUsesOk returns a tuple with the CurrentUses field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrentUses

`func (o *DiscountCouponsCreate) SetCurrentUses(v float64)`

SetCurrentUses sets CurrentUses field to given value.

### HasCurrentUses

`func (o *DiscountCouponsCreate) HasCurrentUses() bool`

HasCurrentUses returns a boolean if a field has been set.

### GetCustomerType

`func (o *DiscountCouponsCreate) GetCustomerType() string`

GetCustomerType returns the CustomerType field if non-nil, zero value otherwise.

### GetCustomerTypeOk

`func (o *DiscountCouponsCreate) GetCustomerTypeOk() (*string, bool)`

GetCustomerTypeOk returns a tuple with the CustomerType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerType

`func (o *DiscountCouponsCreate) SetCustomerType(v string)`

SetCustomerType sets CustomerType field to given value.

### HasCustomerType

`func (o *DiscountCouponsCreate) HasCustomerType() bool`

HasCustomerType returns a boolean if a field has been set.

### GetDescription

`func (o *DiscountCouponsCreate) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *DiscountCouponsCreate) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *DiscountCouponsCreate) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *DiscountCouponsCreate) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetDiscountFixedAmount

`func (o *DiscountCouponsCreate) GetDiscountFixedAmount() float64`

GetDiscountFixedAmount returns the DiscountFixedAmount field if non-nil, zero value otherwise.

### GetDiscountFixedAmountOk

`func (o *DiscountCouponsCreate) GetDiscountFixedAmountOk() (*float64, bool)`

GetDiscountFixedAmountOk returns a tuple with the DiscountFixedAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDiscountFixedAmount

`func (o *DiscountCouponsCreate) SetDiscountFixedAmount(v float64)`

SetDiscountFixedAmount sets DiscountFixedAmount field to given value.

### HasDiscountFixedAmount

`func (o *DiscountCouponsCreate) HasDiscountFixedAmount() bool`

HasDiscountFixedAmount returns a boolean if a field has been set.

### GetDiscountPercentage

`func (o *DiscountCouponsCreate) GetDiscountPercentage() float64`

GetDiscountPercentage returns the DiscountPercentage field if non-nil, zero value otherwise.

### GetDiscountPercentageOk

`func (o *DiscountCouponsCreate) GetDiscountPercentageOk() (*float64, bool)`

GetDiscountPercentageOk returns a tuple with the DiscountPercentage field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDiscountPercentage

`func (o *DiscountCouponsCreate) SetDiscountPercentage(v float64)`

SetDiscountPercentage sets DiscountPercentage field to given value.

### HasDiscountPercentage

`func (o *DiscountCouponsCreate) HasDiscountPercentage() bool`

HasDiscountPercentage returns a boolean if a field has been set.

### GetDiscountType

`func (o *DiscountCouponsCreate) GetDiscountType() string`

GetDiscountType returns the DiscountType field if non-nil, zero value otherwise.

### GetDiscountTypeOk

`func (o *DiscountCouponsCreate) GetDiscountTypeOk() (*string, bool)`

GetDiscountTypeOk returns a tuple with the DiscountType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDiscountType

`func (o *DiscountCouponsCreate) SetDiscountType(v string)`

SetDiscountType sets DiscountType field to given value.

### HasDiscountType

`func (o *DiscountCouponsCreate) HasDiscountType() bool`

HasDiscountType returns a boolean if a field has been set.

### GetExpiresAt

`func (o *DiscountCouponsCreate) GetExpiresAt() time.Time`

GetExpiresAt returns the ExpiresAt field if non-nil, zero value otherwise.

### GetExpiresAtOk

`func (o *DiscountCouponsCreate) GetExpiresAtOk() (*time.Time, bool)`

GetExpiresAtOk returns a tuple with the ExpiresAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiresAt

`func (o *DiscountCouponsCreate) SetExpiresAt(v time.Time)`

SetExpiresAt sets ExpiresAt field to given value.

### HasExpiresAt

`func (o *DiscountCouponsCreate) HasExpiresAt() bool`

HasExpiresAt returns a boolean if a field has been set.

### GetIsActive

`func (o *DiscountCouponsCreate) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *DiscountCouponsCreate) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *DiscountCouponsCreate) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *DiscountCouponsCreate) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetIsOrganizationWide

`func (o *DiscountCouponsCreate) GetIsOrganizationWide() bool`

GetIsOrganizationWide returns the IsOrganizationWide field if non-nil, zero value otherwise.

### GetIsOrganizationWideOk

`func (o *DiscountCouponsCreate) GetIsOrganizationWideOk() (*bool, bool)`

GetIsOrganizationWideOk returns a tuple with the IsOrganizationWide field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsOrganizationWide

`func (o *DiscountCouponsCreate) SetIsOrganizationWide(v bool)`

SetIsOrganizationWide sets IsOrganizationWide field to given value.

### HasIsOrganizationWide

`func (o *DiscountCouponsCreate) HasIsOrganizationWide() bool`

HasIsOrganizationWide returns a boolean if a field has been set.

### GetMaxQuantityPerUse

`func (o *DiscountCouponsCreate) GetMaxQuantityPerUse() float64`

GetMaxQuantityPerUse returns the MaxQuantityPerUse field if non-nil, zero value otherwise.

### GetMaxQuantityPerUseOk

`func (o *DiscountCouponsCreate) GetMaxQuantityPerUseOk() (*float64, bool)`

GetMaxQuantityPerUseOk returns a tuple with the MaxQuantityPerUse field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaxQuantityPerUse

`func (o *DiscountCouponsCreate) SetMaxQuantityPerUse(v float64)`

SetMaxQuantityPerUse sets MaxQuantityPerUse field to given value.

### HasMaxQuantityPerUse

`func (o *DiscountCouponsCreate) HasMaxQuantityPerUse() bool`

HasMaxQuantityPerUse returns a boolean if a field has been set.

### GetMaxUses

`func (o *DiscountCouponsCreate) GetMaxUses() float64`

GetMaxUses returns the MaxUses field if non-nil, zero value otherwise.

### GetMaxUsesOk

`func (o *DiscountCouponsCreate) GetMaxUsesOk() (*float64, bool)`

GetMaxUsesOk returns a tuple with the MaxUses field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaxUses

`func (o *DiscountCouponsCreate) SetMaxUses(v float64)`

SetMaxUses sets MaxUses field to given value.

### HasMaxUses

`func (o *DiscountCouponsCreate) HasMaxUses() bool`

HasMaxUses returns a boolean if a field has been set.

### GetScopeType

`func (o *DiscountCouponsCreate) GetScopeType() string`

GetScopeType returns the ScopeType field if non-nil, zero value otherwise.

### GetScopeTypeOk

`func (o *DiscountCouponsCreate) GetScopeTypeOk() (*string, bool)`

GetScopeTypeOk returns a tuple with the ScopeType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScopeType

`func (o *DiscountCouponsCreate) SetScopeType(v string)`

SetScopeType sets ScopeType field to given value.

### HasScopeType

`func (o *DiscountCouponsCreate) HasScopeType() bool`

HasScopeType returns a boolean if a field has been set.

### GetUsageFrequencyLimit

`func (o *DiscountCouponsCreate) GetUsageFrequencyLimit() string`

GetUsageFrequencyLimit returns the UsageFrequencyLimit field if non-nil, zero value otherwise.

### GetUsageFrequencyLimitOk

`func (o *DiscountCouponsCreate) GetUsageFrequencyLimitOk() (*string, bool)`

GetUsageFrequencyLimitOk returns a tuple with the UsageFrequencyLimit field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsageFrequencyLimit

`func (o *DiscountCouponsCreate) SetUsageFrequencyLimit(v string)`

SetUsageFrequencyLimit sets UsageFrequencyLimit field to given value.

### HasUsageFrequencyLimit

`func (o *DiscountCouponsCreate) HasUsageFrequencyLimit() bool`

HasUsageFrequencyLimit returns a boolean if a field has been set.

### GetUsageLimitValue

`func (o *DiscountCouponsCreate) GetUsageLimitValue() float64`

GetUsageLimitValue returns the UsageLimitValue field if non-nil, zero value otherwise.

### GetUsageLimitValueOk

`func (o *DiscountCouponsCreate) GetUsageLimitValueOk() (*float64, bool)`

GetUsageLimitValueOk returns a tuple with the UsageLimitValue field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsageLimitValue

`func (o *DiscountCouponsCreate) SetUsageLimitValue(v float64)`

SetUsageLimitValue sets UsageLimitValue field to given value.

### HasUsageLimitValue

`func (o *DiscountCouponsCreate) HasUsageLimitValue() bool`

HasUsageLimitValue returns a boolean if a field has been set.

### GetValidFrom

`func (o *DiscountCouponsCreate) GetValidFrom() string`

GetValidFrom returns the ValidFrom field if non-nil, zero value otherwise.

### GetValidFromOk

`func (o *DiscountCouponsCreate) GetValidFromOk() (*string, bool)`

GetValidFromOk returns a tuple with the ValidFrom field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetValidFrom

`func (o *DiscountCouponsCreate) SetValidFrom(v string)`

SetValidFrom sets ValidFrom field to given value.

### HasValidFrom

`func (o *DiscountCouponsCreate) HasValidFrom() bool`

HasValidFrom returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


