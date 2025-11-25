# DiscountCoupons

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AppliesToProductTypes** | Pointer to **string** |  | [optional] 
**Code** | Pointer to **string** |  | [optional] 
**CouponId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**CurrentUses** | Pointer to **float64** |  | [optional] 
**CustomerType** | Pointer to **string** |  | [optional] 
**Description** | Pointer to **string** |  | [optional] 
**DiscountFixedAmount** | Pointer to **float64** |  | [optional] 
**DiscountPercentage** | Pointer to **float64** |  | [optional] 
**DiscountType** | Pointer to **string** |  | [optional] 
**Environment** | Pointer to **string** |  | [optional] 
**ExpiresAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**IsOrganizationWide** | Pointer to **bool** |  | [optional] 
**MaxQuantityPerUse** | Pointer to **float64** |  | [optional] 
**MaxUses** | Pointer to **float64** |  | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ScopeType** | Pointer to **string** |  | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**UsageFrequencyLimit** | Pointer to **string** |  | [optional] 
**UsageLimitValue** | Pointer to **float64** |  | [optional] 
**ValidFrom** | Pointer to **string** |  | [optional] 

## Methods

### NewDiscountCoupons

`func NewDiscountCoupons() *DiscountCoupons`

NewDiscountCoupons instantiates a new DiscountCoupons object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDiscountCouponsWithDefaults

`func NewDiscountCouponsWithDefaults() *DiscountCoupons`

NewDiscountCouponsWithDefaults instantiates a new DiscountCoupons object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAppliesToProductTypes

`func (o *DiscountCoupons) GetAppliesToProductTypes() string`

GetAppliesToProductTypes returns the AppliesToProductTypes field if non-nil, zero value otherwise.

### GetAppliesToProductTypesOk

`func (o *DiscountCoupons) GetAppliesToProductTypesOk() (*string, bool)`

GetAppliesToProductTypesOk returns a tuple with the AppliesToProductTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAppliesToProductTypes

`func (o *DiscountCoupons) SetAppliesToProductTypes(v string)`

SetAppliesToProductTypes sets AppliesToProductTypes field to given value.

### HasAppliesToProductTypes

`func (o *DiscountCoupons) HasAppliesToProductTypes() bool`

HasAppliesToProductTypes returns a boolean if a field has been set.

### GetCode

`func (o *DiscountCoupons) GetCode() string`

GetCode returns the Code field if non-nil, zero value otherwise.

### GetCodeOk

`func (o *DiscountCoupons) GetCodeOk() (*string, bool)`

GetCodeOk returns a tuple with the Code field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCode

`func (o *DiscountCoupons) SetCode(v string)`

SetCode sets Code field to given value.

### HasCode

`func (o *DiscountCoupons) HasCode() bool`

HasCode returns a boolean if a field has been set.

### GetCouponId

`func (o *DiscountCoupons) GetCouponId() string`

GetCouponId returns the CouponId field if non-nil, zero value otherwise.

### GetCouponIdOk

`func (o *DiscountCoupons) GetCouponIdOk() (*string, bool)`

GetCouponIdOk returns a tuple with the CouponId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCouponId

`func (o *DiscountCoupons) SetCouponId(v string)`

SetCouponId sets CouponId field to given value.

### HasCouponId

`func (o *DiscountCoupons) HasCouponId() bool`

HasCouponId returns a boolean if a field has been set.

### GetCreatedAt

`func (o *DiscountCoupons) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *DiscountCoupons) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *DiscountCoupons) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *DiscountCoupons) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetCurrentUses

`func (o *DiscountCoupons) GetCurrentUses() float64`

GetCurrentUses returns the CurrentUses field if non-nil, zero value otherwise.

### GetCurrentUsesOk

`func (o *DiscountCoupons) GetCurrentUsesOk() (*float64, bool)`

GetCurrentUsesOk returns a tuple with the CurrentUses field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrentUses

`func (o *DiscountCoupons) SetCurrentUses(v float64)`

SetCurrentUses sets CurrentUses field to given value.

### HasCurrentUses

`func (o *DiscountCoupons) HasCurrentUses() bool`

HasCurrentUses returns a boolean if a field has been set.

### GetCustomerType

`func (o *DiscountCoupons) GetCustomerType() string`

GetCustomerType returns the CustomerType field if non-nil, zero value otherwise.

### GetCustomerTypeOk

`func (o *DiscountCoupons) GetCustomerTypeOk() (*string, bool)`

GetCustomerTypeOk returns a tuple with the CustomerType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerType

`func (o *DiscountCoupons) SetCustomerType(v string)`

SetCustomerType sets CustomerType field to given value.

### HasCustomerType

`func (o *DiscountCoupons) HasCustomerType() bool`

HasCustomerType returns a boolean if a field has been set.

### GetDescription

`func (o *DiscountCoupons) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *DiscountCoupons) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *DiscountCoupons) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *DiscountCoupons) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetDiscountFixedAmount

`func (o *DiscountCoupons) GetDiscountFixedAmount() float64`

GetDiscountFixedAmount returns the DiscountFixedAmount field if non-nil, zero value otherwise.

### GetDiscountFixedAmountOk

`func (o *DiscountCoupons) GetDiscountFixedAmountOk() (*float64, bool)`

GetDiscountFixedAmountOk returns a tuple with the DiscountFixedAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDiscountFixedAmount

`func (o *DiscountCoupons) SetDiscountFixedAmount(v float64)`

SetDiscountFixedAmount sets DiscountFixedAmount field to given value.

### HasDiscountFixedAmount

`func (o *DiscountCoupons) HasDiscountFixedAmount() bool`

HasDiscountFixedAmount returns a boolean if a field has been set.

### GetDiscountPercentage

`func (o *DiscountCoupons) GetDiscountPercentage() float64`

GetDiscountPercentage returns the DiscountPercentage field if non-nil, zero value otherwise.

### GetDiscountPercentageOk

`func (o *DiscountCoupons) GetDiscountPercentageOk() (*float64, bool)`

GetDiscountPercentageOk returns a tuple with the DiscountPercentage field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDiscountPercentage

`func (o *DiscountCoupons) SetDiscountPercentage(v float64)`

SetDiscountPercentage sets DiscountPercentage field to given value.

### HasDiscountPercentage

`func (o *DiscountCoupons) HasDiscountPercentage() bool`

HasDiscountPercentage returns a boolean if a field has been set.

### GetDiscountType

`func (o *DiscountCoupons) GetDiscountType() string`

GetDiscountType returns the DiscountType field if non-nil, zero value otherwise.

### GetDiscountTypeOk

`func (o *DiscountCoupons) GetDiscountTypeOk() (*string, bool)`

GetDiscountTypeOk returns a tuple with the DiscountType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDiscountType

`func (o *DiscountCoupons) SetDiscountType(v string)`

SetDiscountType sets DiscountType field to given value.

### HasDiscountType

`func (o *DiscountCoupons) HasDiscountType() bool`

HasDiscountType returns a boolean if a field has been set.

### GetEnvironment

`func (o *DiscountCoupons) GetEnvironment() string`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *DiscountCoupons) GetEnvironmentOk() (*string, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *DiscountCoupons) SetEnvironment(v string)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *DiscountCoupons) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetExpiresAt

`func (o *DiscountCoupons) GetExpiresAt() time.Time`

GetExpiresAt returns the ExpiresAt field if non-nil, zero value otherwise.

### GetExpiresAtOk

`func (o *DiscountCoupons) GetExpiresAtOk() (*time.Time, bool)`

GetExpiresAtOk returns a tuple with the ExpiresAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiresAt

`func (o *DiscountCoupons) SetExpiresAt(v time.Time)`

SetExpiresAt sets ExpiresAt field to given value.

### HasExpiresAt

`func (o *DiscountCoupons) HasExpiresAt() bool`

HasExpiresAt returns a boolean if a field has been set.

### GetIsActive

`func (o *DiscountCoupons) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *DiscountCoupons) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *DiscountCoupons) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *DiscountCoupons) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetIsOrganizationWide

`func (o *DiscountCoupons) GetIsOrganizationWide() bool`

GetIsOrganizationWide returns the IsOrganizationWide field if non-nil, zero value otherwise.

### GetIsOrganizationWideOk

`func (o *DiscountCoupons) GetIsOrganizationWideOk() (*bool, bool)`

GetIsOrganizationWideOk returns a tuple with the IsOrganizationWide field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsOrganizationWide

`func (o *DiscountCoupons) SetIsOrganizationWide(v bool)`

SetIsOrganizationWide sets IsOrganizationWide field to given value.

### HasIsOrganizationWide

`func (o *DiscountCoupons) HasIsOrganizationWide() bool`

HasIsOrganizationWide returns a boolean if a field has been set.

### GetMaxQuantityPerUse

`func (o *DiscountCoupons) GetMaxQuantityPerUse() float64`

GetMaxQuantityPerUse returns the MaxQuantityPerUse field if non-nil, zero value otherwise.

### GetMaxQuantityPerUseOk

`func (o *DiscountCoupons) GetMaxQuantityPerUseOk() (*float64, bool)`

GetMaxQuantityPerUseOk returns a tuple with the MaxQuantityPerUse field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaxQuantityPerUse

`func (o *DiscountCoupons) SetMaxQuantityPerUse(v float64)`

SetMaxQuantityPerUse sets MaxQuantityPerUse field to given value.

### HasMaxQuantityPerUse

`func (o *DiscountCoupons) HasMaxQuantityPerUse() bool`

HasMaxQuantityPerUse returns a boolean if a field has been set.

### GetMaxUses

`func (o *DiscountCoupons) GetMaxUses() float64`

GetMaxUses returns the MaxUses field if non-nil, zero value otherwise.

### GetMaxUsesOk

`func (o *DiscountCoupons) GetMaxUsesOk() (*float64, bool)`

GetMaxUsesOk returns a tuple with the MaxUses field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaxUses

`func (o *DiscountCoupons) SetMaxUses(v float64)`

SetMaxUses sets MaxUses field to given value.

### HasMaxUses

`func (o *DiscountCoupons) HasMaxUses() bool`

HasMaxUses returns a boolean if a field has been set.

### GetOrganizationId

`func (o *DiscountCoupons) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *DiscountCoupons) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *DiscountCoupons) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *DiscountCoupons) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetScopeType

`func (o *DiscountCoupons) GetScopeType() string`

GetScopeType returns the ScopeType field if non-nil, zero value otherwise.

### GetScopeTypeOk

`func (o *DiscountCoupons) GetScopeTypeOk() (*string, bool)`

GetScopeTypeOk returns a tuple with the ScopeType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScopeType

`func (o *DiscountCoupons) SetScopeType(v string)`

SetScopeType sets ScopeType field to given value.

### HasScopeType

`func (o *DiscountCoupons) HasScopeType() bool`

HasScopeType returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *DiscountCoupons) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *DiscountCoupons) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *DiscountCoupons) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *DiscountCoupons) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.

### GetUsageFrequencyLimit

`func (o *DiscountCoupons) GetUsageFrequencyLimit() string`

GetUsageFrequencyLimit returns the UsageFrequencyLimit field if non-nil, zero value otherwise.

### GetUsageFrequencyLimitOk

`func (o *DiscountCoupons) GetUsageFrequencyLimitOk() (*string, bool)`

GetUsageFrequencyLimitOk returns a tuple with the UsageFrequencyLimit field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsageFrequencyLimit

`func (o *DiscountCoupons) SetUsageFrequencyLimit(v string)`

SetUsageFrequencyLimit sets UsageFrequencyLimit field to given value.

### HasUsageFrequencyLimit

`func (o *DiscountCoupons) HasUsageFrequencyLimit() bool`

HasUsageFrequencyLimit returns a boolean if a field has been set.

### GetUsageLimitValue

`func (o *DiscountCoupons) GetUsageLimitValue() float64`

GetUsageLimitValue returns the UsageLimitValue field if non-nil, zero value otherwise.

### GetUsageLimitValueOk

`func (o *DiscountCoupons) GetUsageLimitValueOk() (*float64, bool)`

GetUsageLimitValueOk returns a tuple with the UsageLimitValue field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsageLimitValue

`func (o *DiscountCoupons) SetUsageLimitValue(v float64)`

SetUsageLimitValue sets UsageLimitValue field to given value.

### HasUsageLimitValue

`func (o *DiscountCoupons) HasUsageLimitValue() bool`

HasUsageLimitValue returns a boolean if a field has been set.

### GetValidFrom

`func (o *DiscountCoupons) GetValidFrom() string`

GetValidFrom returns the ValidFrom field if non-nil, zero value otherwise.

### GetValidFromOk

`func (o *DiscountCoupons) GetValidFromOk() (*string, bool)`

GetValidFromOk returns a tuple with the ValidFrom field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetValidFrom

`func (o *DiscountCoupons) SetValidFrom(v string)`

SetValidFrom sets ValidFrom field to given value.

### HasValidFrom

`func (o *DiscountCoupons) HasValidFrom() bool`

HasValidFrom returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


