# ListSpiAccountAliases200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | Pointer to [**[]SpiAccountAliases**](SpiAccountAliases.md) |  | [optional] 
**Pagination** | Pointer to [**ListCustomers200ResponsePagination**](ListCustomers200ResponsePagination.md) |  | [optional] 

## Methods

### NewListSpiAccountAliases200Response

`func NewListSpiAccountAliases200Response() *ListSpiAccountAliases200Response`

NewListSpiAccountAliases200Response instantiates a new ListSpiAccountAliases200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewListSpiAccountAliases200ResponseWithDefaults

`func NewListSpiAccountAliases200ResponseWithDefaults() *ListSpiAccountAliases200Response`

NewListSpiAccountAliases200ResponseWithDefaults instantiates a new ListSpiAccountAliases200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *ListSpiAccountAliases200Response) GetData() []SpiAccountAliases`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *ListSpiAccountAliases200Response) GetDataOk() (*[]SpiAccountAliases, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *ListSpiAccountAliases200Response) SetData(v []SpiAccountAliases)`

SetData sets Data field to given value.

### HasData

`func (o *ListSpiAccountAliases200Response) HasData() bool`

HasData returns a boolean if a field has been set.

### GetPagination

`func (o *ListSpiAccountAliases200Response) GetPagination() ListCustomers200ResponsePagination`

GetPagination returns the Pagination field if non-nil, zero value otherwise.

### GetPaginationOk

`func (o *ListSpiAccountAliases200Response) GetPaginationOk() (*ListCustomers200ResponsePagination, bool)`

GetPaginationOk returns a tuple with the Pagination field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPagination

`func (o *ListSpiAccountAliases200Response) SetPagination(v ListCustomers200ResponsePagination)`

SetPagination sets Pagination field to given value.

### HasPagination

`func (o *ListSpiAccountAliases200Response) HasPagination() bool`

HasPagination returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


