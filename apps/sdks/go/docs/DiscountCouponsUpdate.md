# DiscountCouponsUpdate

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

### NewDiscountCouponsUpdate

`func NewDiscountCouponsUpdate() *DiscountCouponsUpdate`

NewDiscountCouponsUpdate instantiates a new DiscountCouponsUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDiscountCouponsUpdateWithDefaults

`func NewDiscountCouponsUpdateWithDefaults() *DiscountCouponsUpdate`

NewDiscountCouponsUpdateWithDefaults instantiates a new DiscountCouponsUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAppliesToProductTypes

`func (o *DiscountCouponsUpdate) GetAppliesToProductTypes() string`

GetAppliesToProductTypes returns the AppliesToProductTypes field if non-nil, zero value otherwise.

### GetAppliesToProductTypesOk

`func (o *DiscountCouponsUpdate) GetAppliesToProductTypesOk() (*string, bool)`

GetAppliesToProductTypesOk returns a tuple with the AppliesToProductTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAppliesToProductTypes

`func (o *DiscountCouponsUpdate) SetAppliesToProductTypes(v string)`

SetAppliesToProductTypes sets AppliesToProductTypes field to given value.

### HasAppliesToProductTypes

`func (o *DiscountCouponsUpdate) HasAppliesToProductTypes() bool`

HasAppliesToProductTypes returns a boolean if a field has been set.

### GetCode

`func (o *DiscountCouponsUpdate) GetCode() string`

GetCode returns the Code field if non-nil, zero value otherwise.

### GetCodeOk

`func (o *DiscountCouponsUpdate) GetCodeOk() (*string, bool)`

GetCodeOk returns a tuple with the Code field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCode

`func (o *DiscountCouponsUpdate) SetCode(v string)`

SetCode sets Code field to given value.

### HasCode

`func (o *DiscountCouponsUpdate) HasCode() bool`

HasCode returns a boolean if a field has been set.

### GetCouponId

`func (o *DiscountCouponsUpdate) GetCouponId() string`

GetCouponId returns the CouponId field if non-nil, zero value otherwise.

### GetCouponIdOk

`func (o *DiscountCouponsUpdate) GetCouponIdOk() (*string, bool)`

GetCouponIdOk returns a tuple with the CouponId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCouponId

`func (o *DiscountCouponsUpdate) SetCouponId(v string)`

SetCouponId sets CouponId field to given value.

### HasCouponId

`func (o *DiscountCouponsUpdate) HasCouponId() bool`

HasCouponId returns a boolean if a field has been set.

### GetCurrentUses

`func (o *DiscountCouponsUpdate) GetCurrentUses() float64`

GetCurrentUses returns the CurrentUses field if non-nil, zero value otherwise.

### GetCurrentUsesOk

`func (o *DiscountCouponsUpdate) GetCurrentUsesOk() (*float64, bool)`

GetCurrentUsesOk returns a tuple with the CurrentUses field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrentUses

`func (o *DiscountCouponsUpdate) SetCurrentUses(v float64)`

SetCurrentUses sets CurrentUses field to given value.

### HasCurrentUses

`func (o *DiscountCouponsUpdate) HasCurrentUses() bool`

HasCurrentUses returns a boolean if a field has been set.

### GetCustomerType

`func (o *DiscountCouponsUpdate) GetCustomerType() string`

GetCustomerType returns the CustomerType field if non-nil, zero value otherwise.

### GetCustomerTypeOk

`func (o *DiscountCouponsUpdate) GetCustomerTypeOk() (*string, bool)`

GetCustomerTypeOk returns a tuple with the CustomerType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerType

`func (o *DiscountCouponsUpdate) SetCustomerType(v string)`

SetCustomerType sets CustomerType field to given value.

### HasCustomerType

`func (o *DiscountCouponsUpdate) HasCustomerType() bool`

HasCustomerType returns a boolean if a field has been set.

### GetDescription

`func (o *DiscountCouponsUpdate) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *DiscountCouponsUpdate) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *DiscountCouponsUpdate) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *DiscountCouponsUpdate) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetDiscountFixedAmount

`func (o *DiscountCouponsUpdate) GetDiscountFixedAmount() float64`

GetDiscountFixedAmount returns the DiscountFixedAmount field if non-nil, zero value otherwise.

### GetDiscountFixedAmountOk

`func (o *DiscountCouponsUpdate) GetDiscountFixedAmountOk() (*float64, bool)`

GetDiscountFixedAmountOk returns a tuple with the DiscountFixedAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDiscountFixedAmount

`func (o *DiscountCouponsUpdate) SetDiscountFixedAmount(v float64)`

SetDiscountFixedAmount sets DiscountFixedAmount field to given value.

### HasDiscountFixedAmount

`func (o *DiscountCouponsUpdate) HasDiscountFixedAmount() bool`

HasDiscountFixedAmount returns a boolean if a field has been set.

### GetDiscountPercentage

`func (o *DiscountCouponsUpdate) GetDiscountPercentage() float64`

GetDiscountPercentage returns the DiscountPercentage field if non-nil, zero value otherwise.

### GetDiscountPercentageOk

`func (o *DiscountCouponsUpdate) GetDiscountPercentageOk() (*float64, bool)`

GetDiscountPercentageOk returns a tuple with the DiscountPercentage field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDiscountPercentage

`func (o *DiscountCouponsUpdate) SetDiscountPercentage(v float64)`

SetDiscountPercentage sets DiscountPercentage field to given value.

### HasDiscountPercentage

`func (o *DiscountCouponsUpdate) HasDiscountPercentage() bool`

HasDiscountPercentage returns a boolean if a field has been set.

### GetDiscountType

`func (o *DiscountCouponsUpdate) GetDiscountType() string`

GetDiscountType returns the DiscountType field if non-nil, zero value otherwise.

### GetDiscountTypeOk

`func (o *DiscountCouponsUpdate) GetDiscountTypeOk() (*string, bool)`

GetDiscountTypeOk returns a tuple with the DiscountType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDiscountType

`func (o *DiscountCouponsUpdate) SetDiscountType(v string)`

SetDiscountType sets DiscountType field to given value.

### HasDiscountType

`func (o *DiscountCouponsUpdate) HasDiscountType() bool`

HasDiscountType returns a boolean if a field has been set.

### GetExpiresAt

`func (o *DiscountCouponsUpdate) GetExpiresAt() time.Time`

GetExpiresAt returns the ExpiresAt field if non-nil, zero value otherwise.

### GetExpiresAtOk

`func (o *DiscountCouponsUpdate) GetExpiresAtOk() (*time.Time, bool)`

GetExpiresAtOk returns a tuple with the ExpiresAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiresAt

`func (o *DiscountCouponsUpdate) SetExpiresAt(v time.Time)`

SetExpiresAt sets ExpiresAt field to given value.

### HasExpiresAt

`func (o *DiscountCouponsUpdate) HasExpiresAt() bool`

HasExpiresAt returns a boolean if a field has been set.

### GetIsActive

`func (o *DiscountCouponsUpdate) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *DiscountCouponsUpdate) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *DiscountCouponsUpdate) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *DiscountCouponsUpdate) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetIsOrganizationWide

`func (o *DiscountCouponsUpdate) GetIsOrganizationWide() bool`

GetIsOrganizationWide returns the IsOrganizationWide field if non-nil, zero value otherwise.

### GetIsOrganizationWideOk

`func (o *DiscountCouponsUpdate) GetIsOrganizationWideOk() (*bool, bool)`

GetIsOrganizationWideOk returns a tuple with the IsOrganizationWide field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsOrganizationWide

`func (o *DiscountCouponsUpdate) SetIsOrganizationWide(v bool)`

SetIsOrganizationWide sets IsOrganizationWide field to given value.

### HasIsOrganizationWide

`func (o *DiscountCouponsUpdate) HasIsOrganizationWide() bool`

HasIsOrganizationWide returns a boolean if a field has been set.

### GetMaxQuantityPerUse

`func (o *DiscountCouponsUpdate) GetMaxQuantityPerUse() float64`

GetMaxQuantityPerUse returns the MaxQuantityPerUse field if non-nil, zero value otherwise.

### GetMaxQuantityPerUseOk

`func (o *DiscountCouponsUpdate) GetMaxQuantityPerUseOk() (*float64, bool)`

GetMaxQuantityPerUseOk returns a tuple with the MaxQuantityPerUse field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaxQuantityPerUse

`func (o *DiscountCouponsUpdate) SetMaxQuantityPerUse(v float64)`

SetMaxQuantityPerUse sets MaxQuantityPerUse field to given value.

### HasMaxQuantityPerUse

`func (o *DiscountCouponsUpdate) HasMaxQuantityPerUse() bool`

HasMaxQuantityPerUse returns a boolean if a field has been set.

### GetMaxUses

`func (o *DiscountCouponsUpdate) GetMaxUses() float64`

GetMaxUses returns the MaxUses field if non-nil, zero value otherwise.

### GetMaxUsesOk

`func (o *DiscountCouponsUpdate) GetMaxUsesOk() (*float64, bool)`

GetMaxUsesOk returns a tuple with the MaxUses field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaxUses

`func (o *DiscountCouponsUpdate) SetMaxUses(v float64)`

SetMaxUses sets MaxUses field to given value.

### HasMaxUses

`func (o *DiscountCouponsUpdate) HasMaxUses() bool`

HasMaxUses returns a boolean if a field has been set.

### GetScopeType

`func (o *DiscountCouponsUpdate) GetScopeType() string`

GetScopeType returns the ScopeType field if non-nil, zero value otherwise.

### GetScopeTypeOk

`func (o *DiscountCouponsUpdate) GetScopeTypeOk() (*string, bool)`

GetScopeTypeOk returns a tuple with the ScopeType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScopeType

`func (o *DiscountCouponsUpdate) SetScopeType(v string)`

SetScopeType sets ScopeType field to given value.

### HasScopeType

`func (o *DiscountCouponsUpdate) HasScopeType() bool`

HasScopeType returns a boolean if a field has been set.

### GetUsageFrequencyLimit

`func (o *DiscountCouponsUpdate) GetUsageFrequencyLimit() string`

GetUsageFrequencyLimit returns the UsageFrequencyLimit field if non-nil, zero value otherwise.

### GetUsageFrequencyLimitOk

`func (o *DiscountCouponsUpdate) GetUsageFrequencyLimitOk() (*string, bool)`

GetUsageFrequencyLimitOk returns a tuple with the UsageFrequencyLimit field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsageFrequencyLimit

`func (o *DiscountCouponsUpdate) SetUsageFrequencyLimit(v string)`

SetUsageFrequencyLimit sets UsageFrequencyLimit field to given value.

### HasUsageFrequencyLimit

`func (o *DiscountCouponsUpdate) HasUsageFrequencyLimit() bool`

HasUsageFrequencyLimit returns a boolean if a field has been set.

### GetUsageLimitValue

`func (o *DiscountCouponsUpdate) GetUsageLimitValue() float64`

GetUsageLimitValue returns the UsageLimitValue field if non-nil, zero value otherwise.

### GetUsageLimitValueOk

`func (o *DiscountCouponsUpdate) GetUsageLimitValueOk() (*float64, bool)`

GetUsageLimitValueOk returns a tuple with the UsageLimitValue field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsageLimitValue

`func (o *DiscountCouponsUpdate) SetUsageLimitValue(v float64)`

SetUsageLimitValue sets UsageLimitValue field to given value.

### HasUsageLimitValue

`func (o *DiscountCouponsUpdate) HasUsageLimitValue() bool`

HasUsageLimitValue returns a boolean if a field has been set.

### GetValidFrom

`func (o *DiscountCouponsUpdate) GetValidFrom() string`

GetValidFrom returns the ValidFrom field if non-nil, zero value otherwise.

### GetValidFromOk

`func (o *DiscountCouponsUpdate) GetValidFromOk() (*string, bool)`

GetValidFromOk returns a tuple with the ValidFrom field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetValidFrom

`func (o *DiscountCouponsUpdate) SetValidFrom(v string)`

SetValidFrom sets ValidFrom field to given value.

### HasValidFrom

`func (o *DiscountCouponsUpdate) HasValidFrom() bool`

HasValidFrom returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


