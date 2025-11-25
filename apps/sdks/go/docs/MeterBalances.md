# MeterBalances

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Balance** | Pointer to **float64** |  | [optional] 
**BalanceId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**BillableOrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ConsumedUnits** | Pointer to **float64** |  | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**CreditedUnits** | Pointer to **float64** |  | [optional] 
**CustomerId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**LastEventId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**MeterId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 

## Methods

### NewMeterBalances

`func NewMeterBalances() *MeterBalances`

NewMeterBalances instantiates a new MeterBalances object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewMeterBalancesWithDefaults

`func NewMeterBalancesWithDefaults() *MeterBalances`

NewMeterBalancesWithDefaults instantiates a new MeterBalances object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetBalance

`func (o *MeterBalances) GetBalance() float64`

GetBalance returns the Balance field if non-nil, zero value otherwise.

### GetBalanceOk

`func (o *MeterBalances) GetBalanceOk() (*float64, bool)`

GetBalanceOk returns a tuple with the Balance field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBalance

`func (o *MeterBalances) SetBalance(v float64)`

SetBalance sets Balance field to given value.

### HasBalance

`func (o *MeterBalances) HasBalance() bool`

HasBalance returns a boolean if a field has been set.

### GetBalanceId

`func (o *MeterBalances) GetBalanceId() string`

GetBalanceId returns the BalanceId field if non-nil, zero value otherwise.

### GetBalanceIdOk

`func (o *MeterBalances) GetBalanceIdOk() (*string, bool)`

GetBalanceIdOk returns a tuple with the BalanceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBalanceId

`func (o *MeterBalances) SetBalanceId(v string)`

SetBalanceId sets BalanceId field to given value.

### HasBalanceId

`func (o *MeterBalances) HasBalanceId() bool`

HasBalanceId returns a boolean if a field has been set.

### GetBillableOrganizationId

`func (o *MeterBalances) GetBillableOrganizationId() string`

GetBillableOrganizationId returns the BillableOrganizationId field if non-nil, zero value otherwise.

### GetBillableOrganizationIdOk

`func (o *MeterBalances) GetBillableOrganizationIdOk() (*string, bool)`

GetBillableOrganizationIdOk returns a tuple with the BillableOrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBillableOrganizationId

`func (o *MeterBalances) SetBillableOrganizationId(v string)`

SetBillableOrganizationId sets BillableOrganizationId field to given value.

### HasBillableOrganizationId

`func (o *MeterBalances) HasBillableOrganizationId() bool`

HasBillableOrganizationId returns a boolean if a field has been set.

### GetConsumedUnits

`func (o *MeterBalances) GetConsumedUnits() float64`

GetConsumedUnits returns the ConsumedUnits field if non-nil, zero value otherwise.

### GetConsumedUnitsOk

`func (o *MeterBalances) GetConsumedUnitsOk() (*float64, bool)`

GetConsumedUnitsOk returns a tuple with the ConsumedUnits field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetConsumedUnits

`func (o *MeterBalances) SetConsumedUnits(v float64)`

SetConsumedUnits sets ConsumedUnits field to given value.

### HasConsumedUnits

`func (o *MeterBalances) HasConsumedUnits() bool`

HasConsumedUnits returns a boolean if a field has been set.

### GetCreatedAt

`func (o *MeterBalances) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *MeterBalances) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *MeterBalances) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *MeterBalances) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetCreditedUnits

`func (o *MeterBalances) GetCreditedUnits() float64`

GetCreditedUnits returns the CreditedUnits field if non-nil, zero value otherwise.

### GetCreditedUnitsOk

`func (o *MeterBalances) GetCreditedUnitsOk() (*float64, bool)`

GetCreditedUnitsOk returns a tuple with the CreditedUnits field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreditedUnits

`func (o *MeterBalances) SetCreditedUnits(v float64)`

SetCreditedUnits sets CreditedUnits field to given value.

### HasCreditedUnits

`func (o *MeterBalances) HasCreditedUnits() bool`

HasCreditedUnits returns a boolean if a field has been set.

### GetCustomerId

`func (o *MeterBalances) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *MeterBalances) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *MeterBalances) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *MeterBalances) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetLastEventId

`func (o *MeterBalances) GetLastEventId() string`

GetLastEventId returns the LastEventId field if non-nil, zero value otherwise.

### GetLastEventIdOk

`func (o *MeterBalances) GetLastEventIdOk() (*string, bool)`

GetLastEventIdOk returns a tuple with the LastEventId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastEventId

`func (o *MeterBalances) SetLastEventId(v string)`

SetLastEventId sets LastEventId field to given value.

### HasLastEventId

`func (o *MeterBalances) HasLastEventId() bool`

HasLastEventId returns a boolean if a field has been set.

### GetMeterId

`func (o *MeterBalances) GetMeterId() string`

GetMeterId returns the MeterId field if non-nil, zero value otherwise.

### GetMeterIdOk

`func (o *MeterBalances) GetMeterIdOk() (*string, bool)`

GetMeterIdOk returns a tuple with the MeterId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMeterId

`func (o *MeterBalances) SetMeterId(v string)`

SetMeterId sets MeterId field to given value.

### HasMeterId

`func (o *MeterBalances) HasMeterId() bool`

HasMeterId returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *MeterBalances) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *MeterBalances) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *MeterBalances) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *MeterBalances) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


