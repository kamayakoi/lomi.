# CustomerInvoicesGet200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | Pointer to [**[]CustomerInvoices**](CustomerInvoices.md) |  | [optional] 
**Pagination** | Pointer to [**CustomersGet200ResponsePagination**](CustomersGet200ResponsePagination.md) |  | [optional] 

## Methods

### NewCustomerInvoicesGet200Response

`func NewCustomerInvoicesGet200Response() *CustomerInvoicesGet200Response`

NewCustomerInvoicesGet200Response instantiates a new CustomerInvoicesGet200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCustomerInvoicesGet200ResponseWithDefaults

`func NewCustomerInvoicesGet200ResponseWithDefaults() *CustomerInvoicesGet200Response`

NewCustomerInvoicesGet200ResponseWithDefaults instantiates a new CustomerInvoicesGet200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *CustomerInvoicesGet200Response) GetData() []CustomerInvoices`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *CustomerInvoicesGet200Response) GetDataOk() (*[]CustomerInvoices, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *CustomerInvoicesGet200Response) SetData(v []CustomerInvoices)`

SetData sets Data field to given value.

### HasData

`func (o *CustomerInvoicesGet200Response) HasData() bool`

HasData returns a boolean if a field has been set.

### GetPagination

`func (o *CustomerInvoicesGet200Response) GetPagination() CustomersGet200ResponsePagination`

GetPagination returns the Pagination field if non-nil, zero value otherwise.

### GetPaginationOk

`func (o *CustomerInvoicesGet200Response) GetPaginationOk() (*CustomersGet200ResponsePagination, bool)`

GetPaginationOk returns a tuple with the Pagination field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPagination

`func (o *CustomerInvoicesGet200Response) SetPagination(v CustomersGet200ResponsePagination)`

SetPagination sets Pagination field to given value.

### HasPagination

`func (o *CustomerInvoicesGet200Response) HasPagination() bool`

HasPagination returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


