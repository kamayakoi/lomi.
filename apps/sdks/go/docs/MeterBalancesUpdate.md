# MeterBalancesUpdate

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

### NewMeterBalancesUpdate

`func NewMeterBalancesUpdate() *MeterBalancesUpdate`

NewMeterBalancesUpdate instantiates a new MeterBalancesUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewMeterBalancesUpdateWithDefaults

`func NewMeterBalancesUpdateWithDefaults() *MeterBalancesUpdate`

NewMeterBalancesUpdateWithDefaults instantiates a new MeterBalancesUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetBalance

`func (o *MeterBalancesUpdate) GetBalance() float64`

GetBalance returns the Balance field if non-nil, zero value otherwise.

### GetBalanceOk

`func (o *MeterBalancesUpdate) GetBalanceOk() (*float64, bool)`

GetBalanceOk returns a tuple with the Balance field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBalance

`func (o *MeterBalancesUpdate) SetBalance(v float64)`

SetBalance sets Balance field to given value.

### HasBalance

`func (o *MeterBalancesUpdate) HasBalance() bool`

HasBalance returns a boolean if a field has been set.

### GetBalanceId

`func (o *MeterBalancesUpdate) GetBalanceId() string`

GetBalanceId returns the BalanceId field if non-nil, zero value otherwise.

### GetBalanceIdOk

`func (o *MeterBalancesUpdate) GetBalanceIdOk() (*string, bool)`

GetBalanceIdOk returns a tuple with the BalanceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBalanceId

`func (o *MeterBalancesUpdate) SetBalanceId(v string)`

SetBalanceId sets BalanceId field to given value.

### HasBalanceId

`func (o *MeterBalancesUpdate) HasBalanceId() bool`

HasBalanceId returns a boolean if a field has been set.

### GetBillableOrganizationId

`func (o *MeterBalancesUpdate) GetBillableOrganizationId() string`

GetBillableOrganizationId returns the BillableOrganizationId field if non-nil, zero value otherwise.

### GetBillableOrganizationIdOk

`func (o *MeterBalancesUpdate) GetBillableOrganizationIdOk() (*string, bool)`

GetBillableOrganizationIdOk returns a tuple with the BillableOrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBillableOrganizationId

`func (o *MeterBalancesUpdate) SetBillableOrganizationId(v string)`

SetBillableOrganizationId sets BillableOrganizationId field to given value.

### HasBillableOrganizationId

`func (o *MeterBalancesUpdate) HasBillableOrganizationId() bool`

HasBillableOrganizationId returns a boolean if a field has been set.

### GetConsumedUnits

`func (o *MeterBalancesUpdate) GetConsumedUnits() float64`

GetConsumedUnits returns the ConsumedUnits field if non-nil, zero value otherwise.

### GetConsumedUnitsOk

`func (o *MeterBalancesUpdate) GetConsumedUnitsOk() (*float64, bool)`

GetConsumedUnitsOk returns a tuple with the ConsumedUnits field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetConsumedUnits

`func (o *MeterBalancesUpdate) SetConsumedUnits(v float64)`

SetConsumedUnits sets ConsumedUnits field to given value.

### HasConsumedUnits

`func (o *MeterBalancesUpdate) HasConsumedUnits() bool`

HasConsumedUnits returns a boolean if a field has been set.

### GetCreditedUnits

`func (o *MeterBalancesUpdate) GetCreditedUnits() float64`

GetCreditedUnits returns the CreditedUnits field if non-nil, zero value otherwise.

### GetCreditedUnitsOk

`func (o *MeterBalancesUpdate) GetCreditedUnitsOk() (*float64, bool)`

GetCreditedUnitsOk returns a tuple with the CreditedUnits field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreditedUnits

`func (o *MeterBalancesUpdate) SetCreditedUnits(v float64)`

SetCreditedUnits sets CreditedUnits field to given value.

### HasCreditedUnits

`func (o *MeterBalancesUpdate) HasCreditedUnits() bool`

HasCreditedUnits returns a boolean if a field has been set.

### GetCustomerId

`func (o *MeterBalancesUpdate) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *MeterBalancesUpdate) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *MeterBalancesUpdate) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *MeterBalancesUpdate) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetLastEventId

`func (o *MeterBalancesUpdate) GetLastEventId() string`

GetLastEventId returns the LastEventId field if non-nil, zero value otherwise.

### GetLastEventIdOk

`func (o *MeterBalancesUpdate) GetLastEventIdOk() (*string, bool)`

GetLastEventIdOk returns a tuple with the LastEventId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastEventId

`func (o *MeterBalancesUpdate) SetLastEventId(v string)`

SetLastEventId sets LastEventId field to given value.

### HasLastEventId

`func (o *MeterBalancesUpdate) HasLastEventId() bool`

HasLastEventId returns a boolean if a field has been set.

### GetMeterId

`func (o *MeterBalancesUpdate) GetMeterId() string`

GetMeterId returns the MeterId field if non-nil, zero value otherwise.

### GetMeterIdOk

`func (o *MeterBalancesUpdate) GetMeterIdOk() (*string, bool)`

GetMeterIdOk returns a tuple with the MeterId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMeterId

`func (o *MeterBalancesUpdate) SetMeterId(v string)`

SetMeterId sets MeterId field to given value.

### HasMeterId

`func (o *MeterBalancesUpdate) HasMeterId() bool`

HasMeterId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


