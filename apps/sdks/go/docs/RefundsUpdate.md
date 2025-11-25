# RefundsUpdate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
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

## Methods

### NewRefundsUpdate

`func NewRefundsUpdate() *RefundsUpdate`

NewRefundsUpdate instantiates a new RefundsUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewRefundsUpdateWithDefaults

`func NewRefundsUpdateWithDefaults() *RefundsUpdate`

NewRefundsUpdateWithDefaults instantiates a new RefundsUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAmount

`func (o *RefundsUpdate) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *RefundsUpdate) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *RefundsUpdate) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *RefundsUpdate) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetFeeAmount

`func (o *RefundsUpdate) GetFeeAmount() float64`

GetFeeAmount returns the FeeAmount field if non-nil, zero value otherwise.

### GetFeeAmountOk

`func (o *RefundsUpdate) GetFeeAmountOk() (*float64, bool)`

GetFeeAmountOk returns a tuple with the FeeAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFeeAmount

`func (o *RefundsUpdate) SetFeeAmount(v float64)`

SetFeeAmount sets FeeAmount field to given value.

### HasFeeAmount

`func (o *RefundsUpdate) HasFeeAmount() bool`

HasFeeAmount returns a boolean if a field has been set.

### GetMetadata

`func (o *RefundsUpdate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *RefundsUpdate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *RefundsUpdate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *RefundsUpdate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetReason

`func (o *RefundsUpdate) GetReason() string`

GetReason returns the Reason field if non-nil, zero value otherwise.

### GetReasonOk

`func (o *RefundsUpdate) GetReasonOk() (*string, bool)`

GetReasonOk returns a tuple with the Reason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetReason

`func (o *RefundsUpdate) SetReason(v string)`

SetReason sets Reason field to given value.

### HasReason

`func (o *RefundsUpdate) HasReason() bool`

HasReason returns a boolean if a field has been set.

### GetRefundId

`func (o *RefundsUpdate) GetRefundId() string`

GetRefundId returns the RefundId field if non-nil, zero value otherwise.

### GetRefundIdOk

`func (o *RefundsUpdate) GetRefundIdOk() (*string, bool)`

GetRefundIdOk returns a tuple with the RefundId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRefundId

`func (o *RefundsUpdate) SetRefundId(v string)`

SetRefundId sets RefundId field to given value.

### HasRefundId

`func (o *RefundsUpdate) HasRefundId() bool`

HasRefundId returns a boolean if a field has been set.

### GetRefundedAmount

`func (o *RefundsUpdate) GetRefundedAmount() float64`

GetRefundedAmount returns the RefundedAmount field if non-nil, zero value otherwise.

### GetRefundedAmountOk

`func (o *RefundsUpdate) GetRefundedAmountOk() (*float64, bool)`

GetRefundedAmountOk returns a tuple with the RefundedAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRefundedAmount

`func (o *RefundsUpdate) SetRefundedAmount(v float64)`

SetRefundedAmount sets RefundedAmount field to given value.

### HasRefundedAmount

`func (o *RefundsUpdate) HasRefundedAmount() bool`

HasRefundedAmount returns a boolean if a field has been set.

### GetSpiAccountNumber

`func (o *RefundsUpdate) GetSpiAccountNumber() string`

GetSpiAccountNumber returns the SpiAccountNumber field if non-nil, zero value otherwise.

### GetSpiAccountNumberOk

`func (o *RefundsUpdate) GetSpiAccountNumberOk() (*string, bool)`

GetSpiAccountNumberOk returns a tuple with the SpiAccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAccountNumber

`func (o *RefundsUpdate) SetSpiAccountNumber(v string)`

SetSpiAccountNumber sets SpiAccountNumber field to given value.

### HasSpiAccountNumber

`func (o *RefundsUpdate) HasSpiAccountNumber() bool`

HasSpiAccountNumber returns a boolean if a field has been set.

### GetSpiEnd2endId

`func (o *RefundsUpdate) GetSpiEnd2endId() string`

GetSpiEnd2endId returns the SpiEnd2endId field if non-nil, zero value otherwise.

### GetSpiEnd2endIdOk

`func (o *RefundsUpdate) GetSpiEnd2endIdOk() (*string, bool)`

GetSpiEnd2endIdOk returns a tuple with the SpiEnd2endId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiEnd2endId

`func (o *RefundsUpdate) SetSpiEnd2endId(v string)`

SetSpiEnd2endId sets SpiEnd2endId field to given value.

### HasSpiEnd2endId

`func (o *RefundsUpdate) HasSpiEnd2endId() bool`

HasSpiEnd2endId returns a boolean if a field has been set.

### GetSpiFundReturnStatus

`func (o *RefundsUpdate) GetSpiFundReturnStatus() string`

GetSpiFundReturnStatus returns the SpiFundReturnStatus field if non-nil, zero value otherwise.

### GetSpiFundReturnStatusOk

`func (o *RefundsUpdate) GetSpiFundReturnStatusOk() (*string, bool)`

GetSpiFundReturnStatusOk returns a tuple with the SpiFundReturnStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiFundReturnStatus

`func (o *RefundsUpdate) SetSpiFundReturnStatus(v string)`

SetSpiFundReturnStatus sets SpiFundReturnStatus field to given value.

### HasSpiFundReturnStatus

`func (o *RefundsUpdate) HasSpiFundReturnStatus() bool`

HasSpiFundReturnStatus returns a boolean if a field has been set.

### GetSpiMotifCode

`func (o *RefundsUpdate) GetSpiMotifCode() string`

GetSpiMotifCode returns the SpiMotifCode field if non-nil, zero value otherwise.

### GetSpiMotifCodeOk

`func (o *RefundsUpdate) GetSpiMotifCodeOk() (*string, bool)`

GetSpiMotifCodeOk returns a tuple with the SpiMotifCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiMotifCode

`func (o *RefundsUpdate) SetSpiMotifCode(v string)`

SetSpiMotifCode sets SpiMotifCode field to given value.

### HasSpiMotifCode

`func (o *RefundsUpdate) HasSpiMotifCode() bool`

HasSpiMotifCode returns a boolean if a field has been set.

### GetSpiRejectionReason

`func (o *RefundsUpdate) GetSpiRejectionReason() string`

GetSpiRejectionReason returns the SpiRejectionReason field if non-nil, zero value otherwise.

### GetSpiRejectionReasonOk

`func (o *RefundsUpdate) GetSpiRejectionReasonOk() (*string, bool)`

GetSpiRejectionReasonOk returns a tuple with the SpiRejectionReason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRejectionReason

`func (o *RefundsUpdate) SetSpiRejectionReason(v string)`

SetSpiRejectionReason sets SpiRejectionReason field to given value.

### HasSpiRejectionReason

`func (o *RefundsUpdate) HasSpiRejectionReason() bool`

HasSpiRejectionReason returns a boolean if a field has been set.

### GetSpiRetourDateDemande

`func (o *RefundsUpdate) GetSpiRetourDateDemande() string`

GetSpiRetourDateDemande returns the SpiRetourDateDemande field if non-nil, zero value otherwise.

### GetSpiRetourDateDemandeOk

`func (o *RefundsUpdate) GetSpiRetourDateDemandeOk() (*string, bool)`

GetSpiRetourDateDemandeOk returns a tuple with the SpiRetourDateDemande field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRetourDateDemande

`func (o *RefundsUpdate) SetSpiRetourDateDemande(v string)`

SetSpiRetourDateDemande sets SpiRetourDateDemande field to given value.

### HasSpiRetourDateDemande

`func (o *RefundsUpdate) HasSpiRetourDateDemande() bool`

HasSpiRetourDateDemande returns a boolean if a field has been set.

### GetSpiRetourDateIrrevocabilite

`func (o *RefundsUpdate) GetSpiRetourDateIrrevocabilite() string`

GetSpiRetourDateIrrevocabilite returns the SpiRetourDateIrrevocabilite field if non-nil, zero value otherwise.

### GetSpiRetourDateIrrevocabiliteOk

`func (o *RefundsUpdate) GetSpiRetourDateIrrevocabiliteOk() (*string, bool)`

GetSpiRetourDateIrrevocabiliteOk returns a tuple with the SpiRetourDateIrrevocabilite field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRetourDateIrrevocabilite

`func (o *RefundsUpdate) SetSpiRetourDateIrrevocabilite(v string)`

SetSpiRetourDateIrrevocabilite sets SpiRetourDateIrrevocabilite field to given value.

### HasSpiRetourDateIrrevocabilite

`func (o *RefundsUpdate) HasSpiRetourDateIrrevocabilite() bool`

HasSpiRetourDateIrrevocabilite returns a boolean if a field has been set.

### GetSpiTxId

`func (o *RefundsUpdate) GetSpiTxId() string`

GetSpiTxId returns the SpiTxId field if non-nil, zero value otherwise.

### GetSpiTxIdOk

`func (o *RefundsUpdate) GetSpiTxIdOk() (*string, bool)`

GetSpiTxIdOk returns a tuple with the SpiTxId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiTxId

`func (o *RefundsUpdate) SetSpiTxId(v string)`

SetSpiTxId sets SpiTxId field to given value.

### HasSpiTxId

`func (o *RefundsUpdate) HasSpiTxId() bool`

HasSpiTxId returns a boolean if a field has been set.

### GetStatus

`func (o *RefundsUpdate) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *RefundsUpdate) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *RefundsUpdate) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *RefundsUpdate) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetTransactionId

`func (o *RefundsUpdate) GetTransactionId() string`

GetTransactionId returns the TransactionId field if non-nil, zero value otherwise.

### GetTransactionIdOk

`func (o *RefundsUpdate) GetTransactionIdOk() (*string, bool)`

GetTransactionIdOk returns a tuple with the TransactionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTransactionId

`func (o *RefundsUpdate) SetTransactionId(v string)`

SetTransactionId sets TransactionId field to given value.

### HasTransactionId

`func (o *RefundsUpdate) HasTransactionId() bool`

HasTransactionId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


