# CustomerInvoicesUpdate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**CurrencyCode** | Pointer to **string** | Three-letter ISO currency code (e.g., XOF, USD, EUR) | [optional] 
**CustomerId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**CustomerInvoiceId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Description** | Pointer to **string** |  | [optional] 
**DueDate** | Pointer to **string** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**Status** | Pointer to **string** | Current status of the resource | [optional] 

## Methods

### NewCustomerInvoicesUpdate

`func NewCustomerInvoicesUpdate() *CustomerInvoicesUpdate`

NewCustomerInvoicesUpdate instantiates a new CustomerInvoicesUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCustomerInvoicesUpdateWithDefaults

`func NewCustomerInvoicesUpdateWithDefaults() *CustomerInvoicesUpdate`

NewCustomerInvoicesUpdateWithDefaults instantiates a new CustomerInvoicesUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAmount

`func (o *CustomerInvoicesUpdate) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *CustomerInvoicesUpdate) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *CustomerInvoicesUpdate) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *CustomerInvoicesUpdate) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *CustomerInvoicesUpdate) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *CustomerInvoicesUpdate) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *CustomerInvoicesUpdate) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *CustomerInvoicesUpdate) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetCustomerId

`func (o *CustomerInvoicesUpdate) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *CustomerInvoicesUpdate) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *CustomerInvoicesUpdate) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *CustomerInvoicesUpdate) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetCustomerInvoiceId

`func (o *CustomerInvoicesUpdate) GetCustomerInvoiceId() string`

GetCustomerInvoiceId returns the CustomerInvoiceId field if non-nil, zero value otherwise.

### GetCustomerInvoiceIdOk

`func (o *CustomerInvoicesUpdate) GetCustomerInvoiceIdOk() (*string, bool)`

GetCustomerInvoiceIdOk returns a tuple with the CustomerInvoiceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerInvoiceId

`func (o *CustomerInvoicesUpdate) SetCustomerInvoiceId(v string)`

SetCustomerInvoiceId sets CustomerInvoiceId field to given value.

### HasCustomerInvoiceId

`func (o *CustomerInvoicesUpdate) HasCustomerInvoiceId() bool`

HasCustomerInvoiceId returns a boolean if a field has been set.

### GetDescription

`func (o *CustomerInvoicesUpdate) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *CustomerInvoicesUpdate) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *CustomerInvoicesUpdate) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *CustomerInvoicesUpdate) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetDueDate

`func (o *CustomerInvoicesUpdate) GetDueDate() string`

GetDueDate returns the DueDate field if non-nil, zero value otherwise.

### GetDueDateOk

`func (o *CustomerInvoicesUpdate) GetDueDateOk() (*string, bool)`

GetDueDateOk returns a tuple with the DueDate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDueDate

`func (o *CustomerInvoicesUpdate) SetDueDate(v string)`

SetDueDate sets DueDate field to given value.

### HasDueDate

`func (o *CustomerInvoicesUpdate) HasDueDate() bool`

HasDueDate returns a boolean if a field has been set.

### GetMetadata

`func (o *CustomerInvoicesUpdate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *CustomerInvoicesUpdate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *CustomerInvoicesUpdate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *CustomerInvoicesUpdate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetStatus

`func (o *CustomerInvoicesUpdate) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *CustomerInvoicesUpdate) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *CustomerInvoicesUpdate) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *CustomerInvoicesUpdate) HasStatus() bool`

HasStatus returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


