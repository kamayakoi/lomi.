# Meters

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Aggregation** | Pointer to **map[string]interface{}** |  | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**Filter** | Pointer to **map[string]interface{}** |  | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**MeterId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Name** | Pointer to **string** |  | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 

## Methods

### NewMeters

`func NewMeters() *Meters`

NewMeters instantiates a new Meters object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewMetersWithDefaults

`func NewMetersWithDefaults() *Meters`

NewMetersWithDefaults instantiates a new Meters object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAggregation

`func (o *Meters) GetAggregation() map[string]interface{}`

GetAggregation returns the Aggregation field if non-nil, zero value otherwise.

### GetAggregationOk

`func (o *Meters) GetAggregationOk() (*map[string]interface{}, bool)`

GetAggregationOk returns a tuple with the Aggregation field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAggregation

`func (o *Meters) SetAggregation(v map[string]interface{})`

SetAggregation sets Aggregation field to given value.

### HasAggregation

`func (o *Meters) HasAggregation() bool`

HasAggregation returns a boolean if a field has been set.

### GetCreatedAt

`func (o *Meters) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *Meters) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *Meters) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *Meters) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetFilter

`func (o *Meters) GetFilter() map[string]interface{}`

GetFilter returns the Filter field if non-nil, zero value otherwise.

### GetFilterOk

`func (o *Meters) GetFilterOk() (*map[string]interface{}, bool)`

GetFilterOk returns a tuple with the Filter field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFilter

`func (o *Meters) SetFilter(v map[string]interface{})`

SetFilter sets Filter field to given value.

### HasFilter

`func (o *Meters) HasFilter() bool`

HasFilter returns a boolean if a field has been set.

### GetIsActive

`func (o *Meters) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *Meters) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *Meters) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *Meters) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetMeterId

`func (o *Meters) GetMeterId() string`

GetMeterId returns the MeterId field if non-nil, zero value otherwise.

### GetMeterIdOk

`func (o *Meters) GetMeterIdOk() (*string, bool)`

GetMeterIdOk returns a tuple with the MeterId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMeterId

`func (o *Meters) SetMeterId(v string)`

SetMeterId sets MeterId field to given value.

### HasMeterId

`func (o *Meters) HasMeterId() bool`

HasMeterId returns a boolean if a field has been set.

### GetName

`func (o *Meters) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *Meters) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *Meters) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *Meters) HasName() bool`

HasName returns a boolean if a field has been set.

### GetOrganizationId

`func (o *Meters) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *Meters) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *Meters) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *Meters) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetProductId

`func (o *Meters) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *Meters) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *Meters) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *Meters) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *Meters) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *Meters) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *Meters) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *Meters) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


