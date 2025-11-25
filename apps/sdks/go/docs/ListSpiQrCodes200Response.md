# ListSpiQrCodes200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | Pointer to [**[]SpiQrCodes**](SpiQrCodes.md) |  | [optional] 
**Pagination** | Pointer to [**ListCustomers200ResponsePagination**](ListCustomers200ResponsePagination.md) |  | [optional] 

## Methods

### NewListSpiQrCodes200Response

`func NewListSpiQrCodes200Response() *ListSpiQrCodes200Response`

NewListSpiQrCodes200Response instantiates a new ListSpiQrCodes200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewListSpiQrCodes200ResponseWithDefaults

`func NewListSpiQrCodes200ResponseWithDefaults() *ListSpiQrCodes200Response`

NewListSpiQrCodes200ResponseWithDefaults instantiates a new ListSpiQrCodes200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *ListSpiQrCodes200Response) GetData() []SpiQrCodes`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *ListSpiQrCodes200Response) GetDataOk() (*[]SpiQrCodes, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *ListSpiQrCodes200Response) SetData(v []SpiQrCodes)`

SetData sets Data field to given value.

### HasData

`func (o *ListSpiQrCodes200Response) HasData() bool`

HasData returns a boolean if a field has been set.

### GetPagination

`func (o *ListSpiQrCodes200Response) GetPagination() ListCustomers200ResponsePagination`

GetPagination returns the Pagination field if non-nil, zero value otherwise.

### GetPaginationOk

`func (o *ListSpiQrCodes200Response) GetPaginationOk() (*ListCustomers200ResponsePagination, bool)`

GetPaginationOk returns a tuple with the Pagination field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPagination

`func (o *ListSpiQrCodes200Response) SetPagination(v ListCustomers200ResponsePagination)`

SetPagination sets Pagination field to given value.

### HasPagination

`func (o *ListSpiQrCodes200Response) HasPagination() bool`

HasPagination returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


