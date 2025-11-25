# WebhookDeliveryLogsGet200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | Pointer to [**[]WebhookDeliveryLogs**](WebhookDeliveryLogs.md) |  | [optional] 
**Pagination** | Pointer to [**CustomersGet200ResponsePagination**](CustomersGet200ResponsePagination.md) |  | [optional] 

## Methods

### NewWebhookDeliveryLogsGet200Response

`func NewWebhookDeliveryLogsGet200Response() *WebhookDeliveryLogsGet200Response`

NewWebhookDeliveryLogsGet200Response instantiates a new WebhookDeliveryLogsGet200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewWebhookDeliveryLogsGet200ResponseWithDefaults

`func NewWebhookDeliveryLogsGet200ResponseWithDefaults() *WebhookDeliveryLogsGet200Response`

NewWebhookDeliveryLogsGet200ResponseWithDefaults instantiates a new WebhookDeliveryLogsGet200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *WebhookDeliveryLogsGet200Response) GetData() []WebhookDeliveryLogs`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *WebhookDeliveryLogsGet200Response) GetDataOk() (*[]WebhookDeliveryLogs, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *WebhookDeliveryLogsGet200Response) SetData(v []WebhookDeliveryLogs)`

SetData sets Data field to given value.

### HasData

`func (o *WebhookDeliveryLogsGet200Response) HasData() bool`

HasData returns a boolean if a field has been set.

### GetPagination

`func (o *WebhookDeliveryLogsGet200Response) GetPagination() CustomersGet200ResponsePagination`

GetPagination returns the Pagination field if non-nil, zero value otherwise.

### GetPaginationOk

`func (o *WebhookDeliveryLogsGet200Response) GetPaginationOk() (*CustomersGet200ResponsePagination, bool)`

GetPaginationOk returns a tuple with the Pagination field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPagination

`func (o *WebhookDeliveryLogsGet200Response) SetPagination(v CustomersGet200ResponsePagination)`

SetPagination sets Pagination field to given value.

### HasPagination

`func (o *WebhookDeliveryLogsGet200Response) HasPagination() bool`

HasPagination returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


