# MetersGet200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | Pointer to [**[]Meters**](Meters.md) |  | [optional] 
**Pagination** | Pointer to [**CustomersGet200ResponsePagination**](CustomersGet200ResponsePagination.md) |  | [optional] 

## Methods

### NewMetersGet200Response

`func NewMetersGet200Response() *MetersGet200Response`

NewMetersGet200Response instantiates a new MetersGet200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewMetersGet200ResponseWithDefaults

`func NewMetersGet200ResponseWithDefaults() *MetersGet200Response`

NewMetersGet200ResponseWithDefaults instantiates a new MetersGet200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *MetersGet200Response) GetData() []Meters`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *MetersGet200Response) GetDataOk() (*[]Meters, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *MetersGet200Response) SetData(v []Meters)`

SetData sets Data field to given value.

### HasData

`func (o *MetersGet200Response) HasData() bool`

HasData returns a boolean if a field has been set.

### GetPagination

`func (o *MetersGet200Response) GetPagination() CustomersGet200ResponsePagination`

GetPagination returns the Pagination field if non-nil, zero value otherwise.

### GetPaginationOk

`func (o *MetersGet200Response) GetPaginationOk() (*CustomersGet200ResponsePagination, bool)`

GetPaginationOk returns a tuple with the Pagination field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPagination

`func (o *MetersGet200Response) SetPagination(v CustomersGet200ResponsePagination)`

SetPagination sets Pagination field to given value.

### HasPagination

`func (o *MetersGet200Response) HasPagination() bool`

HasPagination returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


