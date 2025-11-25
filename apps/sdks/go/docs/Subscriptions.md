# Subscriptions

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**CreatedBy** | Pointer to **string** |  | [optional] [readonly] 
**CustomerId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**EndDate** | Pointer to **string** |  | [optional] 
**Environment** | Pointer to **string** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**NextBillingDate** | Pointer to **string** |  | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PriceId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**StartDate** | Pointer to **string** |  | [optional] 
**Status** | Pointer to **string** | Current status of the resource | [optional] 
**SubscriptionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] [readonly] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 

## Methods

### NewSubscriptions

`func NewSubscriptions() *Subscriptions`

NewSubscriptions instantiates a new Subscriptions object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSubscriptionsWithDefaults

`func NewSubscriptionsWithDefaults() *Subscriptions`

NewSubscriptionsWithDefaults instantiates a new Subscriptions object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCreatedAt

`func (o *Subscriptions) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *Subscriptions) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *Subscriptions) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *Subscriptions) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetCreatedBy

`func (o *Subscriptions) GetCreatedBy() string`

GetCreatedBy returns the CreatedBy field if non-nil, zero value otherwise.

### GetCreatedByOk

`func (o *Subscriptions) GetCreatedByOk() (*string, bool)`

GetCreatedByOk returns a tuple with the CreatedBy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedBy

`func (o *Subscriptions) SetCreatedBy(v string)`

SetCreatedBy sets CreatedBy field to given value.

### HasCreatedBy

`func (o *Subscriptions) HasCreatedBy() bool`

HasCreatedBy returns a boolean if a field has been set.

### GetCustomerId

`func (o *Subscriptions) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *Subscriptions) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *Subscriptions) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *Subscriptions) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetEndDate

`func (o *Subscriptions) GetEndDate() string`

GetEndDate returns the EndDate field if non-nil, zero value otherwise.

### GetEndDateOk

`func (o *Subscriptions) GetEndDateOk() (*string, bool)`

GetEndDateOk returns a tuple with the EndDate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEndDate

`func (o *Subscriptions) SetEndDate(v string)`

SetEndDate sets EndDate field to given value.

### HasEndDate

`func (o *Subscriptions) HasEndDate() bool`

HasEndDate returns a boolean if a field has been set.

### GetEnvironment

`func (o *Subscriptions) GetEnvironment() string`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *Subscriptions) GetEnvironmentOk() (*string, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *Subscriptions) SetEnvironment(v string)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *Subscriptions) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetMetadata

`func (o *Subscriptions) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *Subscriptions) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *Subscriptions) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *Subscriptions) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetNextBillingDate

`func (o *Subscriptions) GetNextBillingDate() string`

GetNextBillingDate returns the NextBillingDate field if non-nil, zero value otherwise.

### GetNextBillingDateOk

`func (o *Subscriptions) GetNextBillingDateOk() (*string, bool)`

GetNextBillingDateOk returns a tuple with the NextBillingDate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNextBillingDate

`func (o *Subscriptions) SetNextBillingDate(v string)`

SetNextBillingDate sets NextBillingDate field to given value.

### HasNextBillingDate

`func (o *Subscriptions) HasNextBillingDate() bool`

HasNextBillingDate returns a boolean if a field has been set.

### GetOrganizationId

`func (o *Subscriptions) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *Subscriptions) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *Subscriptions) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *Subscriptions) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetPriceId

`func (o *Subscriptions) GetPriceId() string`

GetPriceId returns the PriceId field if non-nil, zero value otherwise.

### GetPriceIdOk

`func (o *Subscriptions) GetPriceIdOk() (*string, bool)`

GetPriceIdOk returns a tuple with the PriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriceId

`func (o *Subscriptions) SetPriceId(v string)`

SetPriceId sets PriceId field to given value.

### HasPriceId

`func (o *Subscriptions) HasPriceId() bool`

HasPriceId returns a boolean if a field has been set.

### GetProductId

`func (o *Subscriptions) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *Subscriptions) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *Subscriptions) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *Subscriptions) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetStartDate

`func (o *Subscriptions) GetStartDate() string`

GetStartDate returns the StartDate field if non-nil, zero value otherwise.

### GetStartDateOk

`func (o *Subscriptions) GetStartDateOk() (*string, bool)`

GetStartDateOk returns a tuple with the StartDate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStartDate

`func (o *Subscriptions) SetStartDate(v string)`

SetStartDate sets StartDate field to given value.

### HasStartDate

`func (o *Subscriptions) HasStartDate() bool`

HasStartDate returns a boolean if a field has been set.

### GetStatus

`func (o *Subscriptions) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *Subscriptions) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *Subscriptions) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *Subscriptions) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetSubscriptionId

`func (o *Subscriptions) GetSubscriptionId() string`

GetSubscriptionId returns the SubscriptionId field if non-nil, zero value otherwise.

### GetSubscriptionIdOk

`func (o *Subscriptions) GetSubscriptionIdOk() (*string, bool)`

GetSubscriptionIdOk returns a tuple with the SubscriptionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubscriptionId

`func (o *Subscriptions) SetSubscriptionId(v string)`

SetSubscriptionId sets SubscriptionId field to given value.

### HasSubscriptionId

`func (o *Subscriptions) HasSubscriptionId() bool`

HasSubscriptionId returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *Subscriptions) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *Subscriptions) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *Subscriptions) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *Subscriptions) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


