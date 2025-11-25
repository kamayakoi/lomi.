# EventsUpdate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**CustomerId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**EventData** | Pointer to **map[string]interface{}** |  | [optional] 
**EventId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**EventName** | Pointer to **string** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**ProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 

## Methods

### NewEventsUpdate

`func NewEventsUpdate() *EventsUpdate`

NewEventsUpdate instantiates a new EventsUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewEventsUpdateWithDefaults

`func NewEventsUpdateWithDefaults() *EventsUpdate`

NewEventsUpdateWithDefaults instantiates a new EventsUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCustomerId

`func (o *EventsUpdate) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *EventsUpdate) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *EventsUpdate) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *EventsUpdate) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetEventData

`func (o *EventsUpdate) GetEventData() map[string]interface{}`

GetEventData returns the EventData field if non-nil, zero value otherwise.

### GetEventDataOk

`func (o *EventsUpdate) GetEventDataOk() (*map[string]interface{}, bool)`

GetEventDataOk returns a tuple with the EventData field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventData

`func (o *EventsUpdate) SetEventData(v map[string]interface{})`

SetEventData sets EventData field to given value.

### HasEventData

`func (o *EventsUpdate) HasEventData() bool`

HasEventData returns a boolean if a field has been set.

### GetEventId

`func (o *EventsUpdate) GetEventId() string`

GetEventId returns the EventId field if non-nil, zero value otherwise.

### GetEventIdOk

`func (o *EventsUpdate) GetEventIdOk() (*string, bool)`

GetEventIdOk returns a tuple with the EventId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventId

`func (o *EventsUpdate) SetEventId(v string)`

SetEventId sets EventId field to given value.

### HasEventId

`func (o *EventsUpdate) HasEventId() bool`

HasEventId returns a boolean if a field has been set.

### GetEventName

`func (o *EventsUpdate) GetEventName() string`

GetEventName returns the EventName field if non-nil, zero value otherwise.

### GetEventNameOk

`func (o *EventsUpdate) GetEventNameOk() (*string, bool)`

GetEventNameOk returns a tuple with the EventName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventName

`func (o *EventsUpdate) SetEventName(v string)`

SetEventName sets EventName field to given value.

### HasEventName

`func (o *EventsUpdate) HasEventName() bool`

HasEventName returns a boolean if a field has been set.

### GetMetadata

`func (o *EventsUpdate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *EventsUpdate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *EventsUpdate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *EventsUpdate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetProductId

`func (o *EventsUpdate) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *EventsUpdate) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *EventsUpdate) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *EventsUpdate) HasProductId() bool`

HasProductId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


