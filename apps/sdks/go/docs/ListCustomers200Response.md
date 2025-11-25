# ListCustomers200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | Pointer to [**[]Customers**](Customers.md) |  | [optional] 
**Pagination** | Pointer to [**ListCustomers200ResponsePagination**](ListCustomers200ResponsePagination.md) |  | [optional] 

## Methods

### NewListCustomers200Response

`func NewListCustomers200Response() *ListCustomers200Response`

NewListCustomers200Response instantiates a new ListCustomers200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewListCustomers200ResponseWithDefaults

`func NewListCustomers200ResponseWithDefaults() *ListCustomers200Response`

NewListCustomers200ResponseWithDefaults instantiates a new ListCustomers200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *ListCustomers200Response) GetData() []Customers`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *ListCustomers200Response) GetDataOk() (*[]Customers, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *ListCustomers200Response) SetData(v []Customers)`

SetData sets Data field to given value.

### HasData

`func (o *ListCustomers200Response) HasData() bool`

HasData returns a boolean if a field has been set.

### GetPagination

`func (o *ListCustomers200Response) GetPagination() ListCustomers200ResponsePagination`

GetPagination returns the Pagination field if non-nil, zero value otherwise.

### GetPaginationOk

`func (o *ListCustomers200Response) GetPaginationOk() (*ListCustomers200ResponsePagination, bool)`

GetPaginationOk returns a tuple with the Pagination field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPagination

`func (o *ListCustomers200Response) SetPagination(v ListCustomers200ResponsePagination)`

SetPagination sets Pagination field to given value.

### HasPagination

`func (o *ListCustomers200Response) HasPagination() bool`

HasPagination returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


