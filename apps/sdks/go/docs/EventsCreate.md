# EventsCreate

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

### NewEventsCreate

`func NewEventsCreate() *EventsCreate`

NewEventsCreate instantiates a new EventsCreate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewEventsCreateWithDefaults

`func NewEventsCreateWithDefaults() *EventsCreate`

NewEventsCreateWithDefaults instantiates a new EventsCreate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCustomerId

`func (o *EventsCreate) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *EventsCreate) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *EventsCreate) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *EventsCreate) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetEventData

`func (o *EventsCreate) GetEventData() map[string]interface{}`

GetEventData returns the EventData field if non-nil, zero value otherwise.

### GetEventDataOk

`func (o *EventsCreate) GetEventDataOk() (*map[string]interface{}, bool)`

GetEventDataOk returns a tuple with the EventData field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventData

`func (o *EventsCreate) SetEventData(v map[string]interface{})`

SetEventData sets EventData field to given value.

### HasEventData

`func (o *EventsCreate) HasEventData() bool`

HasEventData returns a boolean if a field has been set.

### GetEventId

`func (o *EventsCreate) GetEventId() string`

GetEventId returns the EventId field if non-nil, zero value otherwise.

### GetEventIdOk

`func (o *EventsCreate) GetEventIdOk() (*string, bool)`

GetEventIdOk returns a tuple with the EventId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventId

`func (o *EventsCreate) SetEventId(v string)`

SetEventId sets EventId field to given value.

### HasEventId

`func (o *EventsCreate) HasEventId() bool`

HasEventId returns a boolean if a field has been set.

### GetEventName

`func (o *EventsCreate) GetEventName() string`

GetEventName returns the EventName field if non-nil, zero value otherwise.

### GetEventNameOk

`func (o *EventsCreate) GetEventNameOk() (*string, bool)`

GetEventNameOk returns a tuple with the EventName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventName

`func (o *EventsCreate) SetEventName(v string)`

SetEventName sets EventName field to given value.

### HasEventName

`func (o *EventsCreate) HasEventName() bool`

HasEventName returns a boolean if a field has been set.

### GetMetadata

`func (o *EventsCreate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *EventsCreate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *EventsCreate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *EventsCreate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetProductId

`func (o *EventsCreate) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *EventsCreate) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *EventsCreate) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *EventsCreate) HasProductId() bool`

HasProductId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


