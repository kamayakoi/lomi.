# MetersUpdate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Aggregation** | Pointer to **map[string]interface{}** |  | [optional] 
**Filter** | Pointer to **map[string]interface{}** |  | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**MeterId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Name** | Pointer to **string** |  | [optional] 
**ProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 

## Methods

### NewMetersUpdate

`func NewMetersUpdate() *MetersUpdate`

NewMetersUpdate instantiates a new MetersUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewMetersUpdateWithDefaults

`func NewMetersUpdateWithDefaults() *MetersUpdate`

NewMetersUpdateWithDefaults instantiates a new MetersUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAggregation

`func (o *MetersUpdate) GetAggregation() map[string]interface{}`

GetAggregation returns the Aggregation field if non-nil, zero value otherwise.

### GetAggregationOk

`func (o *MetersUpdate) GetAggregationOk() (*map[string]interface{}, bool)`

GetAggregationOk returns a tuple with the Aggregation field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAggregation

`func (o *MetersUpdate) SetAggregation(v map[string]interface{})`

SetAggregation sets Aggregation field to given value.

### HasAggregation

`func (o *MetersUpdate) HasAggregation() bool`

HasAggregation returns a boolean if a field has been set.

### GetFilter

`func (o *MetersUpdate) GetFilter() map[string]interface{}`

GetFilter returns the Filter field if non-nil, zero value otherwise.

### GetFilterOk

`func (o *MetersUpdate) GetFilterOk() (*map[string]interface{}, bool)`

GetFilterOk returns a tuple with the Filter field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFilter

`func (o *MetersUpdate) SetFilter(v map[string]interface{})`

SetFilter sets Filter field to given value.

### HasFilter

`func (o *MetersUpdate) HasFilter() bool`

HasFilter returns a boolean if a field has been set.

### GetIsActive

`func (o *MetersUpdate) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *MetersUpdate) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *MetersUpdate) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *MetersUpdate) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetMeterId

`func (o *MetersUpdate) GetMeterId() string`

GetMeterId returns the MeterId field if non-nil, zero value otherwise.

### GetMeterIdOk

`func (o *MetersUpdate) GetMeterIdOk() (*string, bool)`

GetMeterIdOk returns a tuple with the MeterId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMeterId

`func (o *MetersUpdate) SetMeterId(v string)`

SetMeterId sets MeterId field to given value.

### HasMeterId

`func (o *MetersUpdate) HasMeterId() bool`

HasMeterId returns a boolean if a field has been set.

### GetName

`func (o *MetersUpdate) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *MetersUpdate) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *MetersUpdate) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *MetersUpdate) HasName() bool`

HasName returns a boolean if a field has been set.

### GetProductId

`func (o *MetersUpdate) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *MetersUpdate) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *MetersUpdate) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *MetersUpdate) HasProductId() bool`

HasProductId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


