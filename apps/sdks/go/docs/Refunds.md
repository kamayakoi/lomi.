# Refunds

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**Environment** | Pointer to **string** |  | [optional] 
**FeeAmount** | Pointer to **float64** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**Reason** | Pointer to **string** |  | [optional] 
**RefundId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**RefundedAmount** | Pointer to **float64** |  | [optional] 
**SpiAccountNumber** | Pointer to **string** |  | [optional] 
**SpiEnd2endId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**SpiFundReturnStatus** | Pointer to **string** |  | [optional] 
**SpiMotifCode** | Pointer to **string** |  | [optional] 
**SpiRejectionReason** | Pointer to **string** |  | [optional] 
**SpiRetourDateDemande** | Pointer to **string** |  | [optional] 
**SpiRetourDateIrrevocabilite** | Pointer to **string** |  | [optional] 
**SpiTxId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Status** | Pointer to **string** | Current status of the resource | [optional] 
**TransactionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 

## Methods

### NewRefunds

`func NewRefunds() *Refunds`

NewRefunds instantiates a new Refunds object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewRefundsWithDefaults

`func NewRefundsWithDefaults() *Refunds`

NewRefundsWithDefaults instantiates a new Refunds object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAmount

`func (o *Refunds) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *Refunds) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *Refunds) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *Refunds) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCreatedAt

`func (o *Refunds) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *Refunds) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *Refunds) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *Refunds) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetEnvironment

`func (o *Refunds) GetEnvironment() string`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *Refunds) GetEnvironmentOk() (*string, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *Refunds) SetEnvironment(v string)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *Refunds) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetFeeAmount

`func (o *Refunds) GetFeeAmount() float64`

GetFeeAmount returns the FeeAmount field if non-nil, zero value otherwise.

### GetFeeAmountOk

`func (o *Refunds) GetFeeAmountOk() (*float64, bool)`

GetFeeAmountOk returns a tuple with the FeeAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFeeAmount

`func (o *Refunds) SetFeeAmount(v float64)`

SetFeeAmount sets FeeAmount field to given value.

### HasFeeAmount

`func (o *Refunds) HasFeeAmount() bool`

HasFeeAmount returns a boolean if a field has been set.

### GetMetadata

`func (o *Refunds) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *Refunds) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *Refunds) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *Refunds) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetReason

`func (o *Refunds) GetReason() string`

GetReason returns the Reason field if non-nil, zero value otherwise.

### GetReasonOk

`func (o *Refunds) GetReasonOk() (*string, bool)`

GetReasonOk returns a tuple with the Reason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetReason

`func (o *Refunds) SetReason(v string)`

SetReason sets Reason field to given value.

### HasReason

`func (o *Refunds) HasReason() bool`

HasReason returns a boolean if a field has been set.

### GetRefundId

`func (o *Refunds) GetRefundId() string`

GetRefundId returns the RefundId field if non-nil, zero value otherwise.

### GetRefundIdOk

`func (o *Refunds) GetRefundIdOk() (*string, bool)`

GetRefundIdOk returns a tuple with the RefundId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRefundId

`func (o *Refunds) SetRefundId(v string)`

SetRefundId sets RefundId field to given value.

### HasRefundId

`func (o *Refunds) HasRefundId() bool`

HasRefundId returns a boolean if a field has been set.

### GetRefundedAmount

`func (o *Refunds) GetRefundedAmount() float64`

GetRefundedAmount returns the RefundedAmount field if non-nil, zero value otherwise.

### GetRefundedAmountOk

`func (o *Refunds) GetRefundedAmountOk() (*float64, bool)`

GetRefundedAmountOk returns a tuple with the RefundedAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRefundedAmount

`func (o *Refunds) SetRefundedAmount(v float64)`

SetRefundedAmount sets RefundedAmount field to given value.

### HasRefundedAmount

`func (o *Refunds) HasRefundedAmount() bool`

HasRefundedAmount returns a boolean if a field has been set.

### GetSpiAccountNumber

`func (o *Refunds) GetSpiAccountNumber() string`

GetSpiAccountNumber returns the SpiAccountNumber field if non-nil, zero value otherwise.

### GetSpiAccountNumberOk

`func (o *Refunds) GetSpiAccountNumberOk() (*string, bool)`

GetSpiAccountNumberOk returns a tuple with the SpiAccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAccountNumber

`func (o *Refunds) SetSpiAccountNumber(v string)`

SetSpiAccountNumber sets SpiAccountNumber field to given value.

### HasSpiAccountNumber

`func (o *Refunds) HasSpiAccountNumber() bool`

HasSpiAccountNumber returns a boolean if a field has been set.

### GetSpiEnd2endId

`func (o *Refunds) GetSpiEnd2endId() string`

GetSpiEnd2endId returns the SpiEnd2endId field if non-nil, zero value otherwise.

### GetSpiEnd2endIdOk

`func (o *Refunds) GetSpiEnd2endIdOk() (*string, bool)`

GetSpiEnd2endIdOk returns a tuple with the SpiEnd2endId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiEnd2endId

`func (o *Refunds) SetSpiEnd2endId(v string)`

SetSpiEnd2endId sets SpiEnd2endId field to given value.

### HasSpiEnd2endId

`func (o *Refunds) HasSpiEnd2endId() bool`

HasSpiEnd2endId returns a boolean if a field has been set.

### GetSpiFundReturnStatus

`func (o *Refunds) GetSpiFundReturnStatus() string`

GetSpiFundReturnStatus returns the SpiFundReturnStatus field if non-nil, zero value otherwise.

### GetSpiFundReturnStatusOk

`func (o *Refunds) GetSpiFundReturnStatusOk() (*string, bool)`

GetSpiFundReturnStatusOk returns a tuple with the SpiFundReturnStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiFundReturnStatus

`func (o *Refunds) SetSpiFundReturnStatus(v string)`

SetSpiFundReturnStatus sets SpiFundReturnStatus field to given value.

### HasSpiFundReturnStatus

`func (o *Refunds) HasSpiFundReturnStatus() bool`

HasSpiFundReturnStatus returns a boolean if a field has been set.

### GetSpiMotifCode

`func (o *Refunds) GetSpiMotifCode() string`

GetSpiMotifCode returns the SpiMotifCode field if non-nil, zero value otherwise.

### GetSpiMotifCodeOk

`func (o *Refunds) GetSpiMotifCodeOk() (*string, bool)`

GetSpiMotifCodeOk returns a tuple with the SpiMotifCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiMotifCode

`func (o *Refunds) SetSpiMotifCode(v string)`

SetSpiMotifCode sets SpiMotifCode field to given value.

### HasSpiMotifCode

`func (o *Refunds) HasSpiMotifCode() bool`

HasSpiMotifCode returns a boolean if a field has been set.

### GetSpiRejectionReason

`func (o *Refunds) GetSpiRejectionReason() string`

GetSpiRejectionReason returns the SpiRejectionReason field if non-nil, zero value otherwise.

### GetSpiRejectionReasonOk

`func (o *Refunds) GetSpiRejectionReasonOk() (*string, bool)`

GetSpiRejectionReasonOk returns a tuple with the SpiRejectionReason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRejectionReason

`func (o *Refunds) SetSpiRejectionReason(v string)`

SetSpiRejectionReason sets SpiRejectionReason field to given value.

### HasSpiRejectionReason

`func (o *Refunds) HasSpiRejectionReason() bool`

HasSpiRejectionReason returns a boolean if a field has been set.

### GetSpiRetourDateDemande

`func (o *Refunds) GetSpiRetourDateDemande() string`

GetSpiRetourDateDemande returns the SpiRetourDateDemande field if non-nil, zero value otherwise.

### GetSpiRetourDateDemandeOk

`func (o *Refunds) GetSpiRetourDateDemandeOk() (*string, bool)`

GetSpiRetourDateDemandeOk returns a tuple with the SpiRetourDateDemande field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRetourDateDemande

`func (o *Refunds) SetSpiRetourDateDemande(v string)`

SetSpiRetourDateDemande sets SpiRetourDateDemande field to given value.

### HasSpiRetourDateDemande

`func (o *Refunds) HasSpiRetourDateDemande() bool`

HasSpiRetourDateDemande returns a boolean if a field has been set.

### GetSpiRetourDateIrrevocabilite

`func (o *Refunds) GetSpiRetourDateIrrevocabilite() string`

GetSpiRetourDateIrrevocabilite returns the SpiRetourDateIrrevocabilite field if non-nil, zero value otherwise.

### GetSpiRetourDateIrrevocabiliteOk

`func (o *Refunds) GetSpiRetourDateIrrevocabiliteOk() (*string, bool)`

GetSpiRetourDateIrrevocabiliteOk returns a tuple with the SpiRetourDateIrrevocabilite field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRetourDateIrrevocabilite

`func (o *Refunds) SetSpiRetourDateIrrevocabilite(v string)`

SetSpiRetourDateIrrevocabilite sets SpiRetourDateIrrevocabilite field to given value.

### HasSpiRetourDateIrrevocabilite

`func (o *Refunds) HasSpiRetourDateIrrevocabilite() bool`

HasSpiRetourDateIrrevocabilite returns a boolean if a field has been set.

### GetSpiTxId

`func (o *Refunds) GetSpiTxId() string`

GetSpiTxId returns the SpiTxId field if non-nil, zero value otherwise.

### GetSpiTxIdOk

`func (o *Refunds) GetSpiTxIdOk() (*string, bool)`

GetSpiTxIdOk returns a tuple with the SpiTxId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiTxId

`func (o *Refunds) SetSpiTxId(v string)`

SetSpiTxId sets SpiTxId field to given value.

### HasSpiTxId

`func (o *Refunds) HasSpiTxId() bool`

HasSpiTxId returns a boolean if a field has been set.

### GetStatus

`func (o *Refunds) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *Refunds) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *Refunds) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *Refunds) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetTransactionId

`func (o *Refunds) GetTransactionId() string`

GetTransactionId returns the TransactionId field if non-nil, zero value otherwise.

### GetTransactionIdOk

`func (o *Refunds) GetTransactionIdOk() (*string, bool)`

GetTransactionIdOk returns a tuple with the TransactionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTransactionId

`func (o *Refunds) SetTransactionId(v string)`

SetTransactionId sets TransactionId field to given value.

### HasTransactionId

`func (o *Refunds) HasTransactionId() bool`

HasTransactionId returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *Refunds) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *Refunds) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *Refunds) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *Refunds) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


