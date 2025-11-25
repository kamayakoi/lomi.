# DiscountCouponsGet200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | Pointer to [**[]DiscountCoupons**](DiscountCoupons.md) |  | [optional] 
**Pagination** | Pointer to [**CustomersGet200ResponsePagination**](CustomersGet200ResponsePagination.md) |  | [optional] 

## Methods

### NewDiscountCouponsGet200Response

`func NewDiscountCouponsGet200Response() *DiscountCouponsGet200Response`

NewDiscountCouponsGet200Response instantiates a new DiscountCouponsGet200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDiscountCouponsGet200ResponseWithDefaults

`func NewDiscountCouponsGet200ResponseWithDefaults() *DiscountCouponsGet200Response`

NewDiscountCouponsGet200ResponseWithDefaults instantiates a new DiscountCouponsGet200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *DiscountCouponsGet200Response) GetData() []DiscountCoupons`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *DiscountCouponsGet200Response) GetDataOk() (*[]DiscountCoupons, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *DiscountCouponsGet200Response) SetData(v []DiscountCoupons)`

SetData sets Data field to given value.

### HasData

`func (o *DiscountCouponsGet200Response) HasData() bool`

HasData returns a boolean if a field has been set.

### GetPagination

`func (o *DiscountCouponsGet200Response) GetPagination() CustomersGet200ResponsePagination`

GetPagination returns the Pagination field if non-nil, zero value otherwise.

### GetPaginationOk

`func (o *DiscountCouponsGet200Response) GetPaginationOk() (*CustomersGet200ResponsePagination, bool)`

GetPaginationOk returns a tuple with the Pagination field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPagination

`func (o *DiscountCouponsGet200Response) SetPagination(v CustomersGet200ResponsePagination)`

SetPagination sets Pagination field to given value.

### HasPagination

`func (o *DiscountCouponsGet200Response) HasPagination() bool`

HasPagination returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


