# MeterBalancesCreate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Balance** | Pointer to **float64** |  | [optional] 
**BalanceId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**BillableOrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ConsumedUnits** | Pointer to **float64** |  | [optional] 
**CreditedUnits** | Pointer to **float64** |  | [optional] 
**CustomerId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**LastEventId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**MeterId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 

## Methods

### NewMeterBalancesCreate

`func NewMeterBalancesCreate() *MeterBalancesCreate`

NewMeterBalancesCreate instantiates a new MeterBalancesCreate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewMeterBalancesCreateWithDefaults

`func NewMeterBalancesCreateWithDefaults() *MeterBalancesCreate`

NewMeterBalancesCreateWithDefaults instantiates a new MeterBalancesCreate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetBalance

`func (o *MeterBalancesCreate) GetBalance() float64`

GetBalance returns the Balance field if non-nil, zero value otherwise.

### GetBalanceOk

`func (o *MeterBalancesCreate) GetBalanceOk() (*float64, bool)`

GetBalanceOk returns a tuple with the Balance field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBalance

`func (o *MeterBalancesCreate) SetBalance(v float64)`

SetBalance sets Balance field to given value.

### HasBalance

`func (o *MeterBalancesCreate) HasBalance() bool`

HasBalance returns a boolean if a field has been set.

### GetBalanceId

`func (o *MeterBalancesCreate) GetBalanceId() string`

GetBalanceId returns the BalanceId field if non-nil, zero value otherwise.

### GetBalanceIdOk

`func (o *MeterBalancesCreate) GetBalanceIdOk() (*string, bool)`

GetBalanceIdOk returns a tuple with the BalanceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBalanceId

`func (o *MeterBalancesCreate) SetBalanceId(v string)`

SetBalanceId sets BalanceId field to given value.

### HasBalanceId

`func (o *MeterBalancesCreate) HasBalanceId() bool`

HasBalanceId returns a boolean if a field has been set.

### GetBillableOrganizationId

`func (o *MeterBalancesCreate) GetBillableOrganizationId() string`

GetBillableOrganizationId returns the BillableOrganizationId field if non-nil, zero value otherwise.

### GetBillableOrganizationIdOk

`func (o *MeterBalancesCreate) GetBillableOrganizationIdOk() (*string, bool)`

GetBillableOrganizationIdOk returns a tuple with the BillableOrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBillableOrganizationId

`func (o *MeterBalancesCreate) SetBillableOrganizationId(v string)`

SetBillableOrganizationId sets BillableOrganizationId field to given value.

### HasBillableOrganizationId

`func (o *MeterBalancesCreate) HasBillableOrganizationId() bool`

HasBillableOrganizationId returns a boolean if a field has been set.

### GetConsumedUnits

`func (o *MeterBalancesCreate) GetConsumedUnits() float64`

GetConsumedUnits returns the ConsumedUnits field if non-nil, zero value otherwise.

### GetConsumedUnitsOk

`func (o *MeterBalancesCreate) GetConsumedUnitsOk() (*float64, bool)`

GetConsumedUnitsOk returns a tuple with the ConsumedUnits field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetConsumedUnits

`func (o *MeterBalancesCreate) SetConsumedUnits(v float64)`

SetConsumedUnits sets ConsumedUnits field to given value.

### HasConsumedUnits

`func (o *MeterBalancesCreate) HasConsumedUnits() bool`

HasConsumedUnits returns a boolean if a field has been set.

### GetCreditedUnits

`func (o *MeterBalancesCreate) GetCreditedUnits() float64`

GetCreditedUnits returns the CreditedUnits field if non-nil, zero value otherwise.

### GetCreditedUnitsOk

`func (o *MeterBalancesCreate) GetCreditedUnitsOk() (*float64, bool)`

GetCreditedUnitsOk returns a tuple with the CreditedUnits field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreditedUnits

`func (o *MeterBalancesCreate) SetCreditedUnits(v float64)`

SetCreditedUnits sets CreditedUnits field to given value.

### HasCreditedUnits

`func (o *MeterBalancesCreate) HasCreditedUnits() bool`

HasCreditedUnits returns a boolean if a field has been set.

### GetCustomerId

`func (o *MeterBalancesCreate) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *MeterBalancesCreate) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *MeterBalancesCreate) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *MeterBalancesCreate) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetLastEventId

`func (o *MeterBalancesCreate) GetLastEventId() string`

GetLastEventId returns the LastEventId field if non-nil, zero value otherwise.

### GetLastEventIdOk

`func (o *MeterBalancesCreate) GetLastEventIdOk() (*string, bool)`

GetLastEventIdOk returns a tuple with the LastEventId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastEventId

`func (o *MeterBalancesCreate) SetLastEventId(v string)`

SetLastEventId sets LastEventId field to given value.

### HasLastEventId

`func (o *MeterBalancesCreate) HasLastEventId() bool`

HasLastEventId returns a boolean if a field has been set.

### GetMeterId

`func (o *MeterBalancesCreate) GetMeterId() string`

GetMeterId returns the MeterId field if non-nil, zero value otherwise.

### GetMeterIdOk

`func (o *MeterBalancesCreate) GetMeterIdOk() (*string, bool)`

GetMeterIdOk returns a tuple with the MeterId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMeterId

`func (o *MeterBalancesCreate) SetMeterId(v string)`

SetMeterId sets MeterId field to given value.

### HasMeterId

`func (o *MeterBalancesCreate) HasMeterId() bool`

HasMeterId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


