# InstallmentPaymentsUpdate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**DueDate** | Pointer to **string** |  | [optional] 
**InstallmentId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**InterestAmount** | Pointer to **float64** |  | [optional] 
**PaidAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] 
**PaymentLink** | Pointer to **string** |  | [optional] 
**PaymentMethodCode** | Pointer to **string** |  | [optional] 
**PlanId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PrincipalAmount** | Pointer to **float64** |  | [optional] 
**ProcessingFee** | Pointer to **float64** |  | [optional] 
**ProviderCode** | Pointer to **string** |  | [optional] 
**SequenceNumber** | Pointer to **float64** |  | [optional] 
**SpiPaymentRequestId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**SpiTxId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Status** | Pointer to **string** | Current status of the resource | [optional] 
**TransactionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 

## Methods

### NewInstallmentPaymentsUpdate

`func NewInstallmentPaymentsUpdate() *InstallmentPaymentsUpdate`

NewInstallmentPaymentsUpdate instantiates a new InstallmentPaymentsUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewInstallmentPaymentsUpdateWithDefaults

`func NewInstallmentPaymentsUpdateWithDefaults() *InstallmentPaymentsUpdate`

NewInstallmentPaymentsUpdateWithDefaults instantiates a new InstallmentPaymentsUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAmount

`func (o *InstallmentPaymentsUpdate) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *InstallmentPaymentsUpdate) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *InstallmentPaymentsUpdate) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *InstallmentPaymentsUpdate) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetDueDate

`func (o *InstallmentPaymentsUpdate) GetDueDate() string`

GetDueDate returns the DueDate field if non-nil, zero value otherwise.

### GetDueDateOk

`func (o *InstallmentPaymentsUpdate) GetDueDateOk() (*string, bool)`

GetDueDateOk returns a tuple with the DueDate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDueDate

`func (o *InstallmentPaymentsUpdate) SetDueDate(v string)`

SetDueDate sets DueDate field to given value.

### HasDueDate

`func (o *InstallmentPaymentsUpdate) HasDueDate() bool`

HasDueDate returns a boolean if a field has been set.

### GetInstallmentId

`func (o *InstallmentPaymentsUpdate) GetInstallmentId() string`

GetInstallmentId returns the InstallmentId field if non-nil, zero value otherwise.

### GetInstallmentIdOk

`func (o *InstallmentPaymentsUpdate) GetInstallmentIdOk() (*string, bool)`

GetInstallmentIdOk returns a tuple with the InstallmentId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInstallmentId

`func (o *InstallmentPaymentsUpdate) SetInstallmentId(v string)`

SetInstallmentId sets InstallmentId field to given value.

### HasInstallmentId

`func (o *InstallmentPaymentsUpdate) HasInstallmentId() bool`

HasInstallmentId returns a boolean if a field has been set.

### GetInterestAmount

`func (o *InstallmentPaymentsUpdate) GetInterestAmount() float64`

GetInterestAmount returns the InterestAmount field if non-nil, zero value otherwise.

### GetInterestAmountOk

`func (o *InstallmentPaymentsUpdate) GetInterestAmountOk() (*float64, bool)`

GetInterestAmountOk returns a tuple with the InterestAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInterestAmount

`func (o *InstallmentPaymentsUpdate) SetInterestAmount(v float64)`

SetInterestAmount sets InterestAmount field to given value.

### HasInterestAmount

`func (o *InstallmentPaymentsUpdate) HasInterestAmount() bool`

HasInterestAmount returns a boolean if a field has been set.

### GetPaidAt

`func (o *InstallmentPaymentsUpdate) GetPaidAt() time.Time`

GetPaidAt returns the PaidAt field if non-nil, zero value otherwise.

### GetPaidAtOk

`func (o *InstallmentPaymentsUpdate) GetPaidAtOk() (*time.Time, bool)`

GetPaidAtOk returns a tuple with the PaidAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaidAt

`func (o *InstallmentPaymentsUpdate) SetPaidAt(v time.Time)`

SetPaidAt sets PaidAt field to given value.

### HasPaidAt

`func (o *InstallmentPaymentsUpdate) HasPaidAt() bool`

HasPaidAt returns a boolean if a field has been set.

### GetPaymentLink

`func (o *InstallmentPaymentsUpdate) GetPaymentLink() string`

GetPaymentLink returns the PaymentLink field if non-nil, zero value otherwise.

### GetPaymentLinkOk

`func (o *InstallmentPaymentsUpdate) GetPaymentLinkOk() (*string, bool)`

GetPaymentLinkOk returns a tuple with the PaymentLink field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentLink

`func (o *InstallmentPaymentsUpdate) SetPaymentLink(v string)`

SetPaymentLink sets PaymentLink field to given value.

### HasPaymentLink

`func (o *InstallmentPaymentsUpdate) HasPaymentLink() bool`

HasPaymentLink returns a boolean if a field has been set.

### GetPaymentMethodCode

`func (o *InstallmentPaymentsUpdate) GetPaymentMethodCode() string`

GetPaymentMethodCode returns the PaymentMethodCode field if non-nil, zero value otherwise.

### GetPaymentMethodCodeOk

`func (o *InstallmentPaymentsUpdate) GetPaymentMethodCodeOk() (*string, bool)`

GetPaymentMethodCodeOk returns a tuple with the PaymentMethodCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentMethodCode

`func (o *InstallmentPaymentsUpdate) SetPaymentMethodCode(v string)`

SetPaymentMethodCode sets PaymentMethodCode field to given value.

### HasPaymentMethodCode

`func (o *InstallmentPaymentsUpdate) HasPaymentMethodCode() bool`

HasPaymentMethodCode returns a boolean if a field has been set.

### GetPlanId

`func (o *InstallmentPaymentsUpdate) GetPlanId() string`

GetPlanId returns the PlanId field if non-nil, zero value otherwise.

### GetPlanIdOk

`func (o *InstallmentPaymentsUpdate) GetPlanIdOk() (*string, bool)`

GetPlanIdOk returns a tuple with the PlanId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPlanId

`func (o *InstallmentPaymentsUpdate) SetPlanId(v string)`

SetPlanId sets PlanId field to given value.

### HasPlanId

`func (o *InstallmentPaymentsUpdate) HasPlanId() bool`

HasPlanId returns a boolean if a field has been set.

### GetPrincipalAmount

`func (o *InstallmentPaymentsUpdate) GetPrincipalAmount() float64`

GetPrincipalAmount returns the PrincipalAmount field if non-nil, zero value otherwise.

### GetPrincipalAmountOk

`func (o *InstallmentPaymentsUpdate) GetPrincipalAmountOk() (*float64, bool)`

GetPrincipalAmountOk returns a tuple with the PrincipalAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPrincipalAmount

`func (o *InstallmentPaymentsUpdate) SetPrincipalAmount(v float64)`

SetPrincipalAmount sets PrincipalAmount field to given value.

### HasPrincipalAmount

`func (o *InstallmentPaymentsUpdate) HasPrincipalAmount() bool`

HasPrincipalAmount returns a boolean if a field has been set.

### GetProcessingFee

`func (o *InstallmentPaymentsUpdate) GetProcessingFee() float64`

GetProcessingFee returns the ProcessingFee field if non-nil, zero value otherwise.

### GetProcessingFeeOk

`func (o *InstallmentPaymentsUpdate) GetProcessingFeeOk() (*float64, bool)`

GetProcessingFeeOk returns a tuple with the ProcessingFee field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProcessingFee

`func (o *InstallmentPaymentsUpdate) SetProcessingFee(v float64)`

SetProcessingFee sets ProcessingFee field to given value.

### HasProcessingFee

`func (o *InstallmentPaymentsUpdate) HasProcessingFee() bool`

HasProcessingFee returns a boolean if a field has been set.

### GetProviderCode

`func (o *InstallmentPaymentsUpdate) GetProviderCode() string`

GetProviderCode returns the ProviderCode field if non-nil, zero value otherwise.

### GetProviderCodeOk

`func (o *InstallmentPaymentsUpdate) GetProviderCodeOk() (*string, bool)`

GetProviderCodeOk returns a tuple with the ProviderCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderCode

`func (o *InstallmentPaymentsUpdate) SetProviderCode(v string)`

SetProviderCode sets ProviderCode field to given value.

### HasProviderCode

`func (o *InstallmentPaymentsUpdate) HasProviderCode() bool`

HasProviderCode returns a boolean if a field has been set.

### GetSequenceNumber

`func (o *InstallmentPaymentsUpdate) GetSequenceNumber() float64`

GetSequenceNumber returns the SequenceNumber field if non-nil, zero value otherwise.

### GetSequenceNumberOk

`func (o *InstallmentPaymentsUpdate) GetSequenceNumberOk() (*float64, bool)`

GetSequenceNumberOk returns a tuple with the SequenceNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSequenceNumber

`func (o *InstallmentPaymentsUpdate) SetSequenceNumber(v float64)`

SetSequenceNumber sets SequenceNumber field to given value.

### HasSequenceNumber

`func (o *InstallmentPaymentsUpdate) HasSequenceNumber() bool`

HasSequenceNumber returns a boolean if a field has been set.

### GetSpiPaymentRequestId

`func (o *InstallmentPaymentsUpdate) GetSpiPaymentRequestId() string`

GetSpiPaymentRequestId returns the SpiPaymentRequestId field if non-nil, zero value otherwise.

### GetSpiPaymentRequestIdOk

`func (o *InstallmentPaymentsUpdate) GetSpiPaymentRequestIdOk() (*string, bool)`

GetSpiPaymentRequestIdOk returns a tuple with the SpiPaymentRequestId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentRequestId

`func (o *InstallmentPaymentsUpdate) SetSpiPaymentRequestId(v string)`

SetSpiPaymentRequestId sets SpiPaymentRequestId field to given value.

### HasSpiPaymentRequestId

`func (o *InstallmentPaymentsUpdate) HasSpiPaymentRequestId() bool`

HasSpiPaymentRequestId returns a boolean if a field has been set.

### GetSpiTxId

`func (o *InstallmentPaymentsUpdate) GetSpiTxId() string`

GetSpiTxId returns the SpiTxId field if non-nil, zero value otherwise.

### GetSpiTxIdOk

`func (o *InstallmentPaymentsUpdate) GetSpiTxIdOk() (*string, bool)`

GetSpiTxIdOk returns a tuple with the SpiTxId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiTxId

`func (o *InstallmentPaymentsUpdate) SetSpiTxId(v string)`

SetSpiTxId sets SpiTxId field to given value.

### HasSpiTxId

`func (o *InstallmentPaymentsUpdate) HasSpiTxId() bool`

HasSpiTxId returns a boolean if a field has been set.

### GetStatus

`func (o *InstallmentPaymentsUpdate) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *InstallmentPaymentsUpdate) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *InstallmentPaymentsUpdate) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *InstallmentPaymentsUpdate) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetTransactionId

`func (o *InstallmentPaymentsUpdate) GetTransactionId() string`

GetTransactionId returns the TransactionId field if non-nil, zero value otherwise.

### GetTransactionIdOk

`func (o *InstallmentPaymentsUpdate) GetTransactionIdOk() (*string, bool)`

GetTransactionIdOk returns a tuple with the TransactionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTransactionId

`func (o *InstallmentPaymentsUpdate) SetTransactionId(v string)`

SetTransactionId sets TransactionId field to given value.

### HasTransactionId

`func (o *InstallmentPaymentsUpdate) HasTransactionId() bool`

HasTransactionId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


