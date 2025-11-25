# ListCheckoutSessions200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | Pointer to [**[]CheckoutSessions**](CheckoutSessions.md) |  | [optional] 
**Pagination** | Pointer to [**ListCustomers200ResponsePagination**](ListCustomers200ResponsePagination.md) |  | [optional] 

## Methods

### NewListCheckoutSessions200Response

`func NewListCheckoutSessions200Response() *ListCheckoutSessions200Response`

NewListCheckoutSessions200Response instantiates a new ListCheckoutSessions200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewListCheckoutSessions200ResponseWithDefaults

`func NewListCheckoutSessions200ResponseWithDefaults() *ListCheckoutSessions200Response`

NewListCheckoutSessions200ResponseWithDefaults instantiates a new ListCheckoutSessions200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *ListCheckoutSessions200Response) GetData() []CheckoutSessions`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *ListCheckoutSessions200Response) GetDataOk() (*[]CheckoutSessions, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *ListCheckoutSessions200Response) SetData(v []CheckoutSessions)`

SetData sets Data field to given value.

### HasData

`func (o *ListCheckoutSessions200Response) HasData() bool`

HasData returns a boolean if a field has been set.

### GetPagination

`func (o *ListCheckoutSessions200Response) GetPagination() ListCustomers200ResponsePagination`

GetPagination returns the Pagination field if non-nil, zero value otherwise.

### GetPaginationOk

`func (o *ListCheckoutSessions200Response) GetPaginationOk() (*ListCustomers200ResponsePagination, bool)`

GetPaginationOk returns a tuple with the Pagination field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPagination

`func (o *ListCheckoutSessions200Response) SetPagination(v ListCustomers200ResponsePagination)`

SetPagination sets Pagination field to given value.

### HasPagination

`func (o *ListCheckoutSessions200Response) HasPagination() bool`

HasPagination returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


