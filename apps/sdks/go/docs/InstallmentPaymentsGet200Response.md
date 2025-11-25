# InstallmentPaymentsGet200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | Pointer to [**[]InstallmentPayments**](InstallmentPayments.md) |  | [optional] 
**Pagination** | Pointer to [**CustomersGet200ResponsePagination**](CustomersGet200ResponsePagination.md) |  | [optional] 

## Methods

### NewInstallmentPaymentsGet200Response

`func NewInstallmentPaymentsGet200Response() *InstallmentPaymentsGet200Response`

NewInstallmentPaymentsGet200Response instantiates a new InstallmentPaymentsGet200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewInstallmentPaymentsGet200ResponseWithDefaults

`func NewInstallmentPaymentsGet200ResponseWithDefaults() *InstallmentPaymentsGet200Response`

NewInstallmentPaymentsGet200ResponseWithDefaults instantiates a new InstallmentPaymentsGet200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *InstallmentPaymentsGet200Response) GetData() []InstallmentPayments`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *InstallmentPaymentsGet200Response) GetDataOk() (*[]InstallmentPayments, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *InstallmentPaymentsGet200Response) SetData(v []InstallmentPayments)`

SetData sets Data field to given value.

### HasData

`func (o *InstallmentPaymentsGet200Response) HasData() bool`

HasData returns a boolean if a field has been set.

### GetPagination

`func (o *InstallmentPaymentsGet200Response) GetPagination() CustomersGet200ResponsePagination`

GetPagination returns the Pagination field if non-nil, zero value otherwise.

### GetPaginationOk

`func (o *InstallmentPaymentsGet200Response) GetPaginationOk() (*CustomersGet200ResponsePagination, bool)`

GetPaginationOk returns a tuple with the Pagination field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPagination

`func (o *InstallmentPaymentsGet200Response) SetPagination(v CustomersGet200ResponsePagination)`

SetPagination sets Pagination field to given value.

### HasPagination

`func (o *InstallmentPaymentsGet200Response) HasPagination() bool`

HasPagination returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


