# PayoutsGet200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | Pointer to [**[]Payouts**](Payouts.md) |  | [optional] 
**Pagination** | Pointer to [**CustomersGet200ResponsePagination**](CustomersGet200ResponsePagination.md) |  | [optional] 

## Methods

### NewPayoutsGet200Response

`func NewPayoutsGet200Response() *PayoutsGet200Response`

NewPayoutsGet200Response instantiates a new PayoutsGet200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPayoutsGet200ResponseWithDefaults

`func NewPayoutsGet200ResponseWithDefaults() *PayoutsGet200Response`

NewPayoutsGet200ResponseWithDefaults instantiates a new PayoutsGet200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *PayoutsGet200Response) GetData() []Payouts`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *PayoutsGet200Response) GetDataOk() (*[]Payouts, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *PayoutsGet200Response) SetData(v []Payouts)`

SetData sets Data field to given value.

### HasData

`func (o *PayoutsGet200Response) HasData() bool`

HasData returns a boolean if a field has been set.

### GetPagination

`func (o *PayoutsGet200Response) GetPagination() CustomersGet200ResponsePagination`

GetPagination returns the Pagination field if non-nil, zero value otherwise.

### GetPaginationOk

`func (o *PayoutsGet200Response) GetPaginationOk() (*CustomersGet200ResponsePagination, bool)`

GetPaginationOk returns a tuple with the Pagination field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPagination

`func (o *PayoutsGet200Response) SetPagination(v CustomersGet200ResponsePagination)`

SetPagination sets Pagination field to given value.

### HasPagination

`func (o *PayoutsGet200Response) HasPagination() bool`

HasPagination returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


