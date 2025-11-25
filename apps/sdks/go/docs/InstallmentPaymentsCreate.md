# InstallmentPaymentsCreate

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

### NewInstallmentPaymentsCreate

`func NewInstallmentPaymentsCreate() *InstallmentPaymentsCreate`

NewInstallmentPaymentsCreate instantiates a new InstallmentPaymentsCreate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewInstallmentPaymentsCreateWithDefaults

`func NewInstallmentPaymentsCreateWithDefaults() *InstallmentPaymentsCreate`

NewInstallmentPaymentsCreateWithDefaults instantiates a new InstallmentPaymentsCreate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAmount

`func (o *InstallmentPaymentsCreate) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *InstallmentPaymentsCreate) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *InstallmentPaymentsCreate) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *InstallmentPaymentsCreate) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetDueDate

`func (o *InstallmentPaymentsCreate) GetDueDate() string`

GetDueDate returns the DueDate field if non-nil, zero value otherwise.

### GetDueDateOk

`func (o *InstallmentPaymentsCreate) GetDueDateOk() (*string, bool)`

GetDueDateOk returns a tuple with the DueDate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDueDate

`func (o *InstallmentPaymentsCreate) SetDueDate(v string)`

SetDueDate sets DueDate field to given value.

### HasDueDate

`func (o *InstallmentPaymentsCreate) HasDueDate() bool`

HasDueDate returns a boolean if a field has been set.

### GetInstallmentId

`func (o *InstallmentPaymentsCreate) GetInstallmentId() string`

GetInstallmentId returns the InstallmentId field if non-nil, zero value otherwise.

### GetInstallmentIdOk

`func (o *InstallmentPaymentsCreate) GetInstallmentIdOk() (*string, bool)`

GetInstallmentIdOk returns a tuple with the InstallmentId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInstallmentId

`func (o *InstallmentPaymentsCreate) SetInstallmentId(v string)`

SetInstallmentId sets InstallmentId field to given value.

### HasInstallmentId

`func (o *InstallmentPaymentsCreate) HasInstallmentId() bool`

HasInstallmentId returns a boolean if a field has been set.

### GetInterestAmount

`func (o *InstallmentPaymentsCreate) GetInterestAmount() float64`

GetInterestAmount returns the InterestAmount field if non-nil, zero value otherwise.

### GetInterestAmountOk

`func (o *InstallmentPaymentsCreate) GetInterestAmountOk() (*float64, bool)`

GetInterestAmountOk returns a tuple with the InterestAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInterestAmount

`func (o *InstallmentPaymentsCreate) SetInterestAmount(v float64)`

SetInterestAmount sets InterestAmount field to given value.

### HasInterestAmount

`func (o *InstallmentPaymentsCreate) HasInterestAmount() bool`

HasInterestAmount returns a boolean if a field has been set.

### GetPaidAt

`func (o *InstallmentPaymentsCreate) GetPaidAt() time.Time`

GetPaidAt returns the PaidAt field if non-nil, zero value otherwise.

### GetPaidAtOk

`func (o *InstallmentPaymentsCreate) GetPaidAtOk() (*time.Time, bool)`

GetPaidAtOk returns a tuple with the PaidAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaidAt

`func (o *InstallmentPaymentsCreate) SetPaidAt(v time.Time)`

SetPaidAt sets PaidAt field to given value.

### HasPaidAt

`func (o *InstallmentPaymentsCreate) HasPaidAt() bool`

HasPaidAt returns a boolean if a field has been set.

### GetPaymentLink

`func (o *InstallmentPaymentsCreate) GetPaymentLink() string`

GetPaymentLink returns the PaymentLink field if non-nil, zero value otherwise.

### GetPaymentLinkOk

`func (o *InstallmentPaymentsCreate) GetPaymentLinkOk() (*string, bool)`

GetPaymentLinkOk returns a tuple with the PaymentLink field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentLink

`func (o *InstallmentPaymentsCreate) SetPaymentLink(v string)`

SetPaymentLink sets PaymentLink field to given value.

### HasPaymentLink

`func (o *InstallmentPaymentsCreate) HasPaymentLink() bool`

HasPaymentLink returns a boolean if a field has been set.

### GetPaymentMethodCode

`func (o *InstallmentPaymentsCreate) GetPaymentMethodCode() string`

GetPaymentMethodCode returns the PaymentMethodCode field if non-nil, zero value otherwise.

### GetPaymentMethodCodeOk

`func (o *InstallmentPaymentsCreate) GetPaymentMethodCodeOk() (*string, bool)`

GetPaymentMethodCodeOk returns a tuple with the PaymentMethodCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentMethodCode

`func (o *InstallmentPaymentsCreate) SetPaymentMethodCode(v string)`

SetPaymentMethodCode sets PaymentMethodCode field to given value.

### HasPaymentMethodCode

`func (o *InstallmentPaymentsCreate) HasPaymentMethodCode() bool`

HasPaymentMethodCode returns a boolean if a field has been set.

### GetPlanId

`func (o *InstallmentPaymentsCreate) GetPlanId() string`

GetPlanId returns the PlanId field if non-nil, zero value otherwise.

### GetPlanIdOk

`func (o *InstallmentPaymentsCreate) GetPlanIdOk() (*string, bool)`

GetPlanIdOk returns a tuple with the PlanId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPlanId

`func (o *InstallmentPaymentsCreate) SetPlanId(v string)`

SetPlanId sets PlanId field to given value.

### HasPlanId

`func (o *InstallmentPaymentsCreate) HasPlanId() bool`

HasPlanId returns a boolean if a field has been set.

### GetPrincipalAmount

`func (o *InstallmentPaymentsCreate) GetPrincipalAmount() float64`

GetPrincipalAmount returns the PrincipalAmount field if non-nil, zero value otherwise.

### GetPrincipalAmountOk

`func (o *InstallmentPaymentsCreate) GetPrincipalAmountOk() (*float64, bool)`

GetPrincipalAmountOk returns a tuple with the PrincipalAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPrincipalAmount

`func (o *InstallmentPaymentsCreate) SetPrincipalAmount(v float64)`

SetPrincipalAmount sets PrincipalAmount field to given value.

### HasPrincipalAmount

`func (o *InstallmentPaymentsCreate) HasPrincipalAmount() bool`

HasPrincipalAmount returns a boolean if a field has been set.

### GetProcessingFee

`func (o *InstallmentPaymentsCreate) GetProcessingFee() float64`

GetProcessingFee returns the ProcessingFee field if non-nil, zero value otherwise.

### GetProcessingFeeOk

`func (o *InstallmentPaymentsCreate) GetProcessingFeeOk() (*float64, bool)`

GetProcessingFeeOk returns a tuple with the ProcessingFee field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProcessingFee

`func (o *InstallmentPaymentsCreate) SetProcessingFee(v float64)`

SetProcessingFee sets ProcessingFee field to given value.

### HasProcessingFee

`func (o *InstallmentPaymentsCreate) HasProcessingFee() bool`

HasProcessingFee returns a boolean if a field has been set.

### GetProviderCode

`func (o *InstallmentPaymentsCreate) GetProviderCode() string`

GetProviderCode returns the ProviderCode field if non-nil, zero value otherwise.

### GetProviderCodeOk

`func (o *InstallmentPaymentsCreate) GetProviderCodeOk() (*string, bool)`

GetProviderCodeOk returns a tuple with the ProviderCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderCode

`func (o *InstallmentPaymentsCreate) SetProviderCode(v string)`

SetProviderCode sets ProviderCode field to given value.

### HasProviderCode

`func (o *InstallmentPaymentsCreate) HasProviderCode() bool`

HasProviderCode returns a boolean if a field has been set.

### GetSequenceNumber

`func (o *InstallmentPaymentsCreate) GetSequenceNumber() float64`

GetSequenceNumber returns the SequenceNumber field if non-nil, zero value otherwise.

### GetSequenceNumberOk

`func (o *InstallmentPaymentsCreate) GetSequenceNumberOk() (*float64, bool)`

GetSequenceNumberOk returns a tuple with the SequenceNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSequenceNumber

`func (o *InstallmentPaymentsCreate) SetSequenceNumber(v float64)`

SetSequenceNumber sets SequenceNumber field to given value.

### HasSequenceNumber

`func (o *InstallmentPaymentsCreate) HasSequenceNumber() bool`

HasSequenceNumber returns a boolean if a field has been set.

### GetSpiPaymentRequestId

`func (o *InstallmentPaymentsCreate) GetSpiPaymentRequestId() string`

GetSpiPaymentRequestId returns the SpiPaymentRequestId field if non-nil, zero value otherwise.

### GetSpiPaymentRequestIdOk

`func (o *InstallmentPaymentsCreate) GetSpiPaymentRequestIdOk() (*string, bool)`

GetSpiPaymentRequestIdOk returns a tuple with the SpiPaymentRequestId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentRequestId

`func (o *InstallmentPaymentsCreate) SetSpiPaymentRequestId(v string)`

SetSpiPaymentRequestId sets SpiPaymentRequestId field to given value.

### HasSpiPaymentRequestId

`func (o *InstallmentPaymentsCreate) HasSpiPaymentRequestId() bool`

HasSpiPaymentRequestId returns a boolean if a field has been set.

### GetSpiTxId

`func (o *InstallmentPaymentsCreate) GetSpiTxId() string`

GetSpiTxId returns the SpiTxId field if non-nil, zero value otherwise.

### GetSpiTxIdOk

`func (o *InstallmentPaymentsCreate) GetSpiTxIdOk() (*string, bool)`

GetSpiTxIdOk returns a tuple with the SpiTxId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiTxId

`func (o *InstallmentPaymentsCreate) SetSpiTxId(v string)`

SetSpiTxId sets SpiTxId field to given value.

### HasSpiTxId

`func (o *InstallmentPaymentsCreate) HasSpiTxId() bool`

HasSpiTxId returns a boolean if a field has been set.

### GetStatus

`func (o *InstallmentPaymentsCreate) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *InstallmentPaymentsCreate) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *InstallmentPaymentsCreate) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *InstallmentPaymentsCreate) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetTransactionId

`func (o *InstallmentPaymentsCreate) GetTransactionId() string`

GetTransactionId returns the TransactionId field if non-nil, zero value otherwise.

### GetTransactionIdOk

`func (o *InstallmentPaymentsCreate) GetTransactionIdOk() (*string, bool)`

GetTransactionIdOk returns a tuple with the TransactionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTransactionId

`func (o *InstallmentPaymentsCreate) SetTransactionId(v string)`

SetTransactionId sets TransactionId field to given value.

### HasTransactionId

`func (o *InstallmentPaymentsCreate) HasTransactionId() bool`

HasTransactionId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


