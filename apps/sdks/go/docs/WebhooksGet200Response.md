# WebhooksGet200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | Pointer to [**[]Webhooks**](Webhooks.md) |  | [optional] 
**Pagination** | Pointer to [**CustomersGet200ResponsePagination**](CustomersGet200ResponsePagination.md) |  | [optional] 

## Methods

### NewWebhooksGet200Response

`func NewWebhooksGet200Response() *WebhooksGet200Response`

NewWebhooksGet200Response instantiates a new WebhooksGet200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewWebhooksGet200ResponseWithDefaults

`func NewWebhooksGet200ResponseWithDefaults() *WebhooksGet200Response`

NewWebhooksGet200ResponseWithDefaults instantiates a new WebhooksGet200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *WebhooksGet200Response) GetData() []Webhooks`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *WebhooksGet200Response) GetDataOk() (*[]Webhooks, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *WebhooksGet200Response) SetData(v []Webhooks)`

SetData sets Data field to given value.

### HasData

`func (o *WebhooksGet200Response) HasData() bool`

HasData returns a boolean if a field has been set.

### GetPagination

`func (o *WebhooksGet200Response) GetPagination() CustomersGet200ResponsePagination`

GetPagination returns the Pagination field if non-nil, zero value otherwise.

### GetPaginationOk

`func (o *WebhooksGet200Response) GetPaginationOk() (*CustomersGet200ResponsePagination, bool)`

GetPaginationOk returns a tuple with the Pagination field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPagination

`func (o *WebhooksGet200Response) SetPagination(v CustomersGet200ResponsePagination)`

SetPagination sets Pagination field to given value.

### HasPagination

`func (o *WebhooksGet200Response) HasPagination() bool`

HasPagination returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


