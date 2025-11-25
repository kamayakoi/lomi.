# PaymentRequestsGet200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | Pointer to [**[]PaymentRequests**](PaymentRequests.md) |  | [optional] 
**Pagination** | Pointer to [**CustomersGet200ResponsePagination**](CustomersGet200ResponsePagination.md) |  | [optional] 

## Methods

### NewPaymentRequestsGet200Response

`func NewPaymentRequestsGet200Response() *PaymentRequestsGet200Response`

NewPaymentRequestsGet200Response instantiates a new PaymentRequestsGet200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPaymentRequestsGet200ResponseWithDefaults

`func NewPaymentRequestsGet200ResponseWithDefaults() *PaymentRequestsGet200Response`

NewPaymentRequestsGet200ResponseWithDefaults instantiates a new PaymentRequestsGet200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *PaymentRequestsGet200Response) GetData() []PaymentRequests`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *PaymentRequestsGet200Response) GetDataOk() (*[]PaymentRequests, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *PaymentRequestsGet200Response) SetData(v []PaymentRequests)`

SetData sets Data field to given value.

### HasData

`func (o *PaymentRequestsGet200Response) HasData() bool`

HasData returns a boolean if a field has been set.

### GetPagination

`func (o *PaymentRequestsGet200Response) GetPagination() CustomersGet200ResponsePagination`

GetPagination returns the Pagination field if non-nil, zero value otherwise.

### GetPaginationOk

`func (o *PaymentRequestsGet200Response) GetPaginationOk() (*CustomersGet200ResponsePagination, bool)`

GetPaginationOk returns a tuple with the Pagination field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPagination

`func (o *PaymentRequestsGet200Response) SetPagination(v CustomersGet200ResponsePagination)`

SetPagination sets Pagination field to given value.

### HasPagination

`func (o *PaymentRequestsGet200Response) HasPagination() bool`

HasPagination returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


