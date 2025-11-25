# ListPrices200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | Pointer to [**[]Prices**](Prices.md) |  | [optional] 
**Pagination** | Pointer to [**ListCustomers200ResponsePagination**](ListCustomers200ResponsePagination.md) |  | [optional] 

## Methods

### NewListPrices200Response

`func NewListPrices200Response() *ListPrices200Response`

NewListPrices200Response instantiates a new ListPrices200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewListPrices200ResponseWithDefaults

`func NewListPrices200ResponseWithDefaults() *ListPrices200Response`

NewListPrices200ResponseWithDefaults instantiates a new ListPrices200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *ListPrices200Response) GetData() []Prices`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *ListPrices200Response) GetDataOk() (*[]Prices, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *ListPrices200Response) SetData(v []Prices)`

SetData sets Data field to given value.

### HasData

`func (o *ListPrices200Response) HasData() bool`

HasData returns a boolean if a field has been set.

### GetPagination

`func (o *ListPrices200Response) GetPagination() ListCustomers200ResponsePagination`

GetPagination returns the Pagination field if non-nil, zero value otherwise.

### GetPaginationOk

`func (o *ListPrices200Response) GetPaginationOk() (*ListCustomers200ResponsePagination, bool)`

GetPaginationOk returns a tuple with the Pagination field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPagination

`func (o *ListPrices200Response) SetPagination(v ListCustomers200ResponsePagination)`

SetPagination sets Pagination field to given value.

### HasPagination

`func (o *ListPrices200Response) HasPagination() bool`

HasPagination returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


