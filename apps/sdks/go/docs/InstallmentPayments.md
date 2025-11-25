# InstallmentPayments

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
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
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 

## Methods

### NewInstallmentPayments

`func NewInstallmentPayments() *InstallmentPayments`

NewInstallmentPayments instantiates a new InstallmentPayments object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewInstallmentPaymentsWithDefaults

`func NewInstallmentPaymentsWithDefaults() *InstallmentPayments`

NewInstallmentPaymentsWithDefaults instantiates a new InstallmentPayments object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAmount

`func (o *InstallmentPayments) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *InstallmentPayments) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *InstallmentPayments) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *InstallmentPayments) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCreatedAt

`func (o *InstallmentPayments) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *InstallmentPayments) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *InstallmentPayments) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *InstallmentPayments) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetDueDate

`func (o *InstallmentPayments) GetDueDate() string`

GetDueDate returns the DueDate field if non-nil, zero value otherwise.

### GetDueDateOk

`func (o *InstallmentPayments) GetDueDateOk() (*string, bool)`

GetDueDateOk returns a tuple with the DueDate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDueDate

`func (o *InstallmentPayments) SetDueDate(v string)`

SetDueDate sets DueDate field to given value.

### HasDueDate

`func (o *InstallmentPayments) HasDueDate() bool`

HasDueDate returns a boolean if a field has been set.

### GetInstallmentId

`func (o *InstallmentPayments) GetInstallmentId() string`

GetInstallmentId returns the InstallmentId field if non-nil, zero value otherwise.

### GetInstallmentIdOk

`func (o *InstallmentPayments) GetInstallmentIdOk() (*string, bool)`

GetInstallmentIdOk returns a tuple with the InstallmentId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInstallmentId

`func (o *InstallmentPayments) SetInstallmentId(v string)`

SetInstallmentId sets InstallmentId field to given value.

### HasInstallmentId

`func (o *InstallmentPayments) HasInstallmentId() bool`

HasInstallmentId returns a boolean if a field has been set.

### GetInterestAmount

`func (o *InstallmentPayments) GetInterestAmount() float64`

GetInterestAmount returns the InterestAmount field if non-nil, zero value otherwise.

### GetInterestAmountOk

`func (o *InstallmentPayments) GetInterestAmountOk() (*float64, bool)`

GetInterestAmountOk returns a tuple with the InterestAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInterestAmount

`func (o *InstallmentPayments) SetInterestAmount(v float64)`

SetInterestAmount sets InterestAmount field to given value.

### HasInterestAmount

`func (o *InstallmentPayments) HasInterestAmount() bool`

HasInterestAmount returns a boolean if a field has been set.

### GetPaidAt

`func (o *InstallmentPayments) GetPaidAt() time.Time`

GetPaidAt returns the PaidAt field if non-nil, zero value otherwise.

### GetPaidAtOk

`func (o *InstallmentPayments) GetPaidAtOk() (*time.Time, bool)`

GetPaidAtOk returns a tuple with the PaidAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaidAt

`func (o *InstallmentPayments) SetPaidAt(v time.Time)`

SetPaidAt sets PaidAt field to given value.

### HasPaidAt

`func (o *InstallmentPayments) HasPaidAt() bool`

HasPaidAt returns a boolean if a field has been set.

### GetPaymentLink

`func (o *InstallmentPayments) GetPaymentLink() string`

GetPaymentLink returns the PaymentLink field if non-nil, zero value otherwise.

### GetPaymentLinkOk

`func (o *InstallmentPayments) GetPaymentLinkOk() (*string, bool)`

GetPaymentLinkOk returns a tuple with the PaymentLink field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentLink

`func (o *InstallmentPayments) SetPaymentLink(v string)`

SetPaymentLink sets PaymentLink field to given value.

### HasPaymentLink

`func (o *InstallmentPayments) HasPaymentLink() bool`

HasPaymentLink returns a boolean if a field has been set.

### GetPaymentMethodCode

`func (o *InstallmentPayments) GetPaymentMethodCode() string`

GetPaymentMethodCode returns the PaymentMethodCode field if non-nil, zero value otherwise.

### GetPaymentMethodCodeOk

`func (o *InstallmentPayments) GetPaymentMethodCodeOk() (*string, bool)`

GetPaymentMethodCodeOk returns a tuple with the PaymentMethodCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentMethodCode

`func (o *InstallmentPayments) SetPaymentMethodCode(v string)`

SetPaymentMethodCode sets PaymentMethodCode field to given value.

### HasPaymentMethodCode

`func (o *InstallmentPayments) HasPaymentMethodCode() bool`

HasPaymentMethodCode returns a boolean if a field has been set.

### GetPlanId

`func (o *InstallmentPayments) GetPlanId() string`

GetPlanId returns the PlanId field if non-nil, zero value otherwise.

### GetPlanIdOk

`func (o *InstallmentPayments) GetPlanIdOk() (*string, bool)`

GetPlanIdOk returns a tuple with the PlanId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPlanId

`func (o *InstallmentPayments) SetPlanId(v string)`

SetPlanId sets PlanId field to given value.

### HasPlanId

`func (o *InstallmentPayments) HasPlanId() bool`

HasPlanId returns a boolean if a field has been set.

### GetPrincipalAmount

`func (o *InstallmentPayments) GetPrincipalAmount() float64`

GetPrincipalAmount returns the PrincipalAmount field if non-nil, zero value otherwise.

### GetPrincipalAmountOk

`func (o *InstallmentPayments) GetPrincipalAmountOk() (*float64, bool)`

GetPrincipalAmountOk returns a tuple with the PrincipalAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPrincipalAmount

`func (o *InstallmentPayments) SetPrincipalAmount(v float64)`

SetPrincipalAmount sets PrincipalAmount field to given value.

### HasPrincipalAmount

`func (o *InstallmentPayments) HasPrincipalAmount() bool`

HasPrincipalAmount returns a boolean if a field has been set.

### GetProcessingFee

`func (o *InstallmentPayments) GetProcessingFee() float64`

GetProcessingFee returns the ProcessingFee field if non-nil, zero value otherwise.

### GetProcessingFeeOk

`func (o *InstallmentPayments) GetProcessingFeeOk() (*float64, bool)`

GetProcessingFeeOk returns a tuple with the ProcessingFee field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProcessingFee

`func (o *InstallmentPayments) SetProcessingFee(v float64)`

SetProcessingFee sets ProcessingFee field to given value.

### HasProcessingFee

`func (o *InstallmentPayments) HasProcessingFee() bool`

HasProcessingFee returns a boolean if a field has been set.

### GetProviderCode

`func (o *InstallmentPayments) GetProviderCode() string`

GetProviderCode returns the ProviderCode field if non-nil, zero value otherwise.

### GetProviderCodeOk

`func (o *InstallmentPayments) GetProviderCodeOk() (*string, bool)`

GetProviderCodeOk returns a tuple with the ProviderCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderCode

`func (o *InstallmentPayments) SetProviderCode(v string)`

SetProviderCode sets ProviderCode field to given value.

### HasProviderCode

`func (o *InstallmentPayments) HasProviderCode() bool`

HasProviderCode returns a boolean if a field has been set.

### GetSequenceNumber

`func (o *InstallmentPayments) GetSequenceNumber() float64`

GetSequenceNumber returns the SequenceNumber field if non-nil, zero value otherwise.

### GetSequenceNumberOk

`func (o *InstallmentPayments) GetSequenceNumberOk() (*float64, bool)`

GetSequenceNumberOk returns a tuple with the SequenceNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSequenceNumber

`func (o *InstallmentPayments) SetSequenceNumber(v float64)`

SetSequenceNumber sets SequenceNumber field to given value.

### HasSequenceNumber

`func (o *InstallmentPayments) HasSequenceNumber() bool`

HasSequenceNumber returns a boolean if a field has been set.

### GetSpiPaymentRequestId

`func (o *InstallmentPayments) GetSpiPaymentRequestId() string`

GetSpiPaymentRequestId returns the SpiPaymentRequestId field if non-nil, zero value otherwise.

### GetSpiPaymentRequestIdOk

`func (o *InstallmentPayments) GetSpiPaymentRequestIdOk() (*string, bool)`

GetSpiPaymentRequestIdOk returns a tuple with the SpiPaymentRequestId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentRequestId

`func (o *InstallmentPayments) SetSpiPaymentRequestId(v string)`

SetSpiPaymentRequestId sets SpiPaymentRequestId field to given value.

### HasSpiPaymentRequestId

`func (o *InstallmentPayments) HasSpiPaymentRequestId() bool`

HasSpiPaymentRequestId returns a boolean if a field has been set.

### GetSpiTxId

`func (o *InstallmentPayments) GetSpiTxId() string`

GetSpiTxId returns the SpiTxId field if non-nil, zero value otherwise.

### GetSpiTxIdOk

`func (o *InstallmentPayments) GetSpiTxIdOk() (*string, bool)`

GetSpiTxIdOk returns a tuple with the SpiTxId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiTxId

`func (o *InstallmentPayments) SetSpiTxId(v string)`

SetSpiTxId sets SpiTxId field to given value.

### HasSpiTxId

`func (o *InstallmentPayments) HasSpiTxId() bool`

HasSpiTxId returns a boolean if a field has been set.

### GetStatus

`func (o *InstallmentPayments) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *InstallmentPayments) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *InstallmentPayments) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *InstallmentPayments) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetTransactionId

`func (o *InstallmentPayments) GetTransactionId() string`

GetTransactionId returns the TransactionId field if non-nil, zero value otherwise.

### GetTransactionIdOk

`func (o *InstallmentPayments) GetTransactionIdOk() (*string, bool)`

GetTransactionIdOk returns a tuple with the TransactionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTransactionId

`func (o *InstallmentPayments) SetTransactionId(v string)`

SetTransactionId sets TransactionId field to given value.

### HasTransactionId

`func (o *InstallmentPayments) HasTransactionId() bool`

HasTransactionId returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *InstallmentPayments) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *InstallmentPayments) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *InstallmentPayments) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *InstallmentPayments) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


