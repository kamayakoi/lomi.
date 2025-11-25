# PaymentRequestsUpdate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**CurrencyCode** | Pointer to **string** | Three-letter ISO currency code (e.g., XOF, USD, EUR) | [optional] 
**CustomerId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Description** | Pointer to **string** |  | [optional] 
**ExpiryDate** | Pointer to **string** |  | [optional] 
**PaymentLink** | Pointer to **string** |  | [optional] 
**PaymentReference** | Pointer to **string** |  | [optional] 
**SpiAccountNumber** | Pointer to **string** |  | [optional] 
**SpiBulkInstructionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**SpiConfirmation** | Pointer to **bool** |  | [optional] 
**SpiDateEnvoi** | Pointer to **string** |  | [optional] 
**SpiDateIrrevocabilite** | Pointer to **string** |  | [optional] 
**SpiDateLimitePaiement** | Pointer to **string** |  | [optional] 
**SpiDateLimiteReponse** | Pointer to **string** |  | [optional] 
**SpiDateRejet** | Pointer to **string** |  | [optional] 
**SpiDebitDiffere** | Pointer to **bool** |  | [optional] 
**SpiEnd2endId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**SpiPayeurAlias** | Pointer to **string** |  | [optional] 
**SpiPayeurNom** | Pointer to **string** |  | [optional] 
**SpiPayeurPays** | Pointer to **string** |  | [optional] 
**SpiPaymentRequestCategory** | Pointer to **string** |  | [optional] 
**SpiPaymentStatus** | Pointer to **string** |  | [optional] 
**SpiRefDocNumero** | Pointer to **string** |  | [optional] 
**SpiRefDocType** | Pointer to **string** |  | [optional] 
**SpiRejectionReason** | Pointer to **string** |  | [optional] 
**SpiRemiseAmount** | Pointer to **float64** |  | [optional] 
**SpiRemiseRate** | Pointer to **float64** |  | [optional] 
**SpiTxId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Status** | Pointer to **string** | Current status of the resource | [optional] 

## Methods

### NewPaymentRequestsUpdate

`func NewPaymentRequestsUpdate() *PaymentRequestsUpdate`

NewPaymentRequestsUpdate instantiates a new PaymentRequestsUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPaymentRequestsUpdateWithDefaults

`func NewPaymentRequestsUpdateWithDefaults() *PaymentRequestsUpdate`

NewPaymentRequestsUpdateWithDefaults instantiates a new PaymentRequestsUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAmount

`func (o *PaymentRequestsUpdate) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *PaymentRequestsUpdate) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *PaymentRequestsUpdate) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *PaymentRequestsUpdate) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *PaymentRequestsUpdate) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *PaymentRequestsUpdate) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *PaymentRequestsUpdate) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *PaymentRequestsUpdate) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetCustomerId

`func (o *PaymentRequestsUpdate) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *PaymentRequestsUpdate) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *PaymentRequestsUpdate) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *PaymentRequestsUpdate) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetDescription

`func (o *PaymentRequestsUpdate) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *PaymentRequestsUpdate) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *PaymentRequestsUpdate) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *PaymentRequestsUpdate) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetExpiryDate

`func (o *PaymentRequestsUpdate) GetExpiryDate() string`

GetExpiryDate returns the ExpiryDate field if non-nil, zero value otherwise.

### GetExpiryDateOk

`func (o *PaymentRequestsUpdate) GetExpiryDateOk() (*string, bool)`

GetExpiryDateOk returns a tuple with the ExpiryDate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiryDate

`func (o *PaymentRequestsUpdate) SetExpiryDate(v string)`

SetExpiryDate sets ExpiryDate field to given value.

### HasExpiryDate

`func (o *PaymentRequestsUpdate) HasExpiryDate() bool`

HasExpiryDate returns a boolean if a field has been set.

### GetPaymentLink

`func (o *PaymentRequestsUpdate) GetPaymentLink() string`

GetPaymentLink returns the PaymentLink field if non-nil, zero value otherwise.

### GetPaymentLinkOk

`func (o *PaymentRequestsUpdate) GetPaymentLinkOk() (*string, bool)`

GetPaymentLinkOk returns a tuple with the PaymentLink field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentLink

`func (o *PaymentRequestsUpdate) SetPaymentLink(v string)`

SetPaymentLink sets PaymentLink field to given value.

### HasPaymentLink

`func (o *PaymentRequestsUpdate) HasPaymentLink() bool`

HasPaymentLink returns a boolean if a field has been set.

### GetPaymentReference

`func (o *PaymentRequestsUpdate) GetPaymentReference() string`

GetPaymentReference returns the PaymentReference field if non-nil, zero value otherwise.

### GetPaymentReferenceOk

`func (o *PaymentRequestsUpdate) GetPaymentReferenceOk() (*string, bool)`

GetPaymentReferenceOk returns a tuple with the PaymentReference field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentReference

`func (o *PaymentRequestsUpdate) SetPaymentReference(v string)`

SetPaymentReference sets PaymentReference field to given value.

### HasPaymentReference

`func (o *PaymentRequestsUpdate) HasPaymentReference() bool`

HasPaymentReference returns a boolean if a field has been set.

### GetSpiAccountNumber

`func (o *PaymentRequestsUpdate) GetSpiAccountNumber() string`

GetSpiAccountNumber returns the SpiAccountNumber field if non-nil, zero value otherwise.

### GetSpiAccountNumberOk

`func (o *PaymentRequestsUpdate) GetSpiAccountNumberOk() (*string, bool)`

GetSpiAccountNumberOk returns a tuple with the SpiAccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAccountNumber

`func (o *PaymentRequestsUpdate) SetSpiAccountNumber(v string)`

SetSpiAccountNumber sets SpiAccountNumber field to given value.

### HasSpiAccountNumber

`func (o *PaymentRequestsUpdate) HasSpiAccountNumber() bool`

HasSpiAccountNumber returns a boolean if a field has been set.

### GetSpiBulkInstructionId

`func (o *PaymentRequestsUpdate) GetSpiBulkInstructionId() string`

GetSpiBulkInstructionId returns the SpiBulkInstructionId field if non-nil, zero value otherwise.

### GetSpiBulkInstructionIdOk

`func (o *PaymentRequestsUpdate) GetSpiBulkInstructionIdOk() (*string, bool)`

GetSpiBulkInstructionIdOk returns a tuple with the SpiBulkInstructionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiBulkInstructionId

`func (o *PaymentRequestsUpdate) SetSpiBulkInstructionId(v string)`

SetSpiBulkInstructionId sets SpiBulkInstructionId field to given value.

### HasSpiBulkInstructionId

`func (o *PaymentRequestsUpdate) HasSpiBulkInstructionId() bool`

HasSpiBulkInstructionId returns a boolean if a field has been set.

### GetSpiConfirmation

`func (o *PaymentRequestsUpdate) GetSpiConfirmation() bool`

GetSpiConfirmation returns the SpiConfirmation field if non-nil, zero value otherwise.

### GetSpiConfirmationOk

`func (o *PaymentRequestsUpdate) GetSpiConfirmationOk() (*bool, bool)`

GetSpiConfirmationOk returns a tuple with the SpiConfirmation field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiConfirmation

`func (o *PaymentRequestsUpdate) SetSpiConfirmation(v bool)`

SetSpiConfirmation sets SpiConfirmation field to given value.

### HasSpiConfirmation

`func (o *PaymentRequestsUpdate) HasSpiConfirmation() bool`

HasSpiConfirmation returns a boolean if a field has been set.

### GetSpiDateEnvoi

`func (o *PaymentRequestsUpdate) GetSpiDateEnvoi() string`

GetSpiDateEnvoi returns the SpiDateEnvoi field if non-nil, zero value otherwise.

### GetSpiDateEnvoiOk

`func (o *PaymentRequestsUpdate) GetSpiDateEnvoiOk() (*string, bool)`

GetSpiDateEnvoiOk returns a tuple with the SpiDateEnvoi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateEnvoi

`func (o *PaymentRequestsUpdate) SetSpiDateEnvoi(v string)`

SetSpiDateEnvoi sets SpiDateEnvoi field to given value.

### HasSpiDateEnvoi

`func (o *PaymentRequestsUpdate) HasSpiDateEnvoi() bool`

HasSpiDateEnvoi returns a boolean if a field has been set.

### GetSpiDateIrrevocabilite

`func (o *PaymentRequestsUpdate) GetSpiDateIrrevocabilite() string`

GetSpiDateIrrevocabilite returns the SpiDateIrrevocabilite field if non-nil, zero value otherwise.

### GetSpiDateIrrevocabiliteOk

`func (o *PaymentRequestsUpdate) GetSpiDateIrrevocabiliteOk() (*string, bool)`

GetSpiDateIrrevocabiliteOk returns a tuple with the SpiDateIrrevocabilite field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateIrrevocabilite

`func (o *PaymentRequestsUpdate) SetSpiDateIrrevocabilite(v string)`

SetSpiDateIrrevocabilite sets SpiDateIrrevocabilite field to given value.

### HasSpiDateIrrevocabilite

`func (o *PaymentRequestsUpdate) HasSpiDateIrrevocabilite() bool`

HasSpiDateIrrevocabilite returns a boolean if a field has been set.

### GetSpiDateLimitePaiement

`func (o *PaymentRequestsUpdate) GetSpiDateLimitePaiement() string`

GetSpiDateLimitePaiement returns the SpiDateLimitePaiement field if non-nil, zero value otherwise.

### GetSpiDateLimitePaiementOk

`func (o *PaymentRequestsUpdate) GetSpiDateLimitePaiementOk() (*string, bool)`

GetSpiDateLimitePaiementOk returns a tuple with the SpiDateLimitePaiement field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateLimitePaiement

`func (o *PaymentRequestsUpdate) SetSpiDateLimitePaiement(v string)`

SetSpiDateLimitePaiement sets SpiDateLimitePaiement field to given value.

### HasSpiDateLimitePaiement

`func (o *PaymentRequestsUpdate) HasSpiDateLimitePaiement() bool`

HasSpiDateLimitePaiement returns a boolean if a field has been set.

### GetSpiDateLimiteReponse

`func (o *PaymentRequestsUpdate) GetSpiDateLimiteReponse() string`

GetSpiDateLimiteReponse returns the SpiDateLimiteReponse field if non-nil, zero value otherwise.

### GetSpiDateLimiteReponseOk

`func (o *PaymentRequestsUpdate) GetSpiDateLimiteReponseOk() (*string, bool)`

GetSpiDateLimiteReponseOk returns a tuple with the SpiDateLimiteReponse field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateLimiteReponse

`func (o *PaymentRequestsUpdate) SetSpiDateLimiteReponse(v string)`

SetSpiDateLimiteReponse sets SpiDateLimiteReponse field to given value.

### HasSpiDateLimiteReponse

`func (o *PaymentRequestsUpdate) HasSpiDateLimiteReponse() bool`

HasSpiDateLimiteReponse returns a boolean if a field has been set.

### GetSpiDateRejet

`func (o *PaymentRequestsUpdate) GetSpiDateRejet() string`

GetSpiDateRejet returns the SpiDateRejet field if non-nil, zero value otherwise.

### GetSpiDateRejetOk

`func (o *PaymentRequestsUpdate) GetSpiDateRejetOk() (*string, bool)`

GetSpiDateRejetOk returns a tuple with the SpiDateRejet field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateRejet

`func (o *PaymentRequestsUpdate) SetSpiDateRejet(v string)`

SetSpiDateRejet sets SpiDateRejet field to given value.

### HasSpiDateRejet

`func (o *PaymentRequestsUpdate) HasSpiDateRejet() bool`

HasSpiDateRejet returns a boolean if a field has been set.

### GetSpiDebitDiffere

`func (o *PaymentRequestsUpdate) GetSpiDebitDiffere() bool`

GetSpiDebitDiffere returns the SpiDebitDiffere field if non-nil, zero value otherwise.

### GetSpiDebitDiffereOk

`func (o *PaymentRequestsUpdate) GetSpiDebitDiffereOk() (*bool, bool)`

GetSpiDebitDiffereOk returns a tuple with the SpiDebitDiffere field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDebitDiffere

`func (o *PaymentRequestsUpdate) SetSpiDebitDiffere(v bool)`

SetSpiDebitDiffere sets SpiDebitDiffere field to given value.

### HasSpiDebitDiffere

`func (o *PaymentRequestsUpdate) HasSpiDebitDiffere() bool`

HasSpiDebitDiffere returns a boolean if a field has been set.

### GetSpiEnd2endId

`func (o *PaymentRequestsUpdate) GetSpiEnd2endId() string`

GetSpiEnd2endId returns the SpiEnd2endId field if non-nil, zero value otherwise.

### GetSpiEnd2endIdOk

`func (o *PaymentRequestsUpdate) GetSpiEnd2endIdOk() (*string, bool)`

GetSpiEnd2endIdOk returns a tuple with the SpiEnd2endId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiEnd2endId

`func (o *PaymentRequestsUpdate) SetSpiEnd2endId(v string)`

SetSpiEnd2endId sets SpiEnd2endId field to given value.

### HasSpiEnd2endId

`func (o *PaymentRequestsUpdate) HasSpiEnd2endId() bool`

HasSpiEnd2endId returns a boolean if a field has been set.

### GetSpiPayeurAlias

`func (o *PaymentRequestsUpdate) GetSpiPayeurAlias() string`

GetSpiPayeurAlias returns the SpiPayeurAlias field if non-nil, zero value otherwise.

### GetSpiPayeurAliasOk

`func (o *PaymentRequestsUpdate) GetSpiPayeurAliasOk() (*string, bool)`

GetSpiPayeurAliasOk returns a tuple with the SpiPayeurAlias field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPayeurAlias

`func (o *PaymentRequestsUpdate) SetSpiPayeurAlias(v string)`

SetSpiPayeurAlias sets SpiPayeurAlias field to given value.

### HasSpiPayeurAlias

`func (o *PaymentRequestsUpdate) HasSpiPayeurAlias() bool`

HasSpiPayeurAlias returns a boolean if a field has been set.

### GetSpiPayeurNom

`func (o *PaymentRequestsUpdate) GetSpiPayeurNom() string`

GetSpiPayeurNom returns the SpiPayeurNom field if non-nil, zero value otherwise.

### GetSpiPayeurNomOk

`func (o *PaymentRequestsUpdate) GetSpiPayeurNomOk() (*string, bool)`

GetSpiPayeurNomOk returns a tuple with the SpiPayeurNom field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPayeurNom

`func (o *PaymentRequestsUpdate) SetSpiPayeurNom(v string)`

SetSpiPayeurNom sets SpiPayeurNom field to given value.

### HasSpiPayeurNom

`func (o *PaymentRequestsUpdate) HasSpiPayeurNom() bool`

HasSpiPayeurNom returns a boolean if a field has been set.

### GetSpiPayeurPays

`func (o *PaymentRequestsUpdate) GetSpiPayeurPays() string`

GetSpiPayeurPays returns the SpiPayeurPays field if non-nil, zero value otherwise.

### GetSpiPayeurPaysOk

`func (o *PaymentRequestsUpdate) GetSpiPayeurPaysOk() (*string, bool)`

GetSpiPayeurPaysOk returns a tuple with the SpiPayeurPays field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPayeurPays

`func (o *PaymentRequestsUpdate) SetSpiPayeurPays(v string)`

SetSpiPayeurPays sets SpiPayeurPays field to given value.

### HasSpiPayeurPays

`func (o *PaymentRequestsUpdate) HasSpiPayeurPays() bool`

HasSpiPayeurPays returns a boolean if a field has been set.

### GetSpiPaymentRequestCategory

`func (o *PaymentRequestsUpdate) GetSpiPaymentRequestCategory() string`

GetSpiPaymentRequestCategory returns the SpiPaymentRequestCategory field if non-nil, zero value otherwise.

### GetSpiPaymentRequestCategoryOk

`func (o *PaymentRequestsUpdate) GetSpiPaymentRequestCategoryOk() (*string, bool)`

GetSpiPaymentRequestCategoryOk returns a tuple with the SpiPaymentRequestCategory field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentRequestCategory

`func (o *PaymentRequestsUpdate) SetSpiPaymentRequestCategory(v string)`

SetSpiPaymentRequestCategory sets SpiPaymentRequestCategory field to given value.

### HasSpiPaymentRequestCategory

`func (o *PaymentRequestsUpdate) HasSpiPaymentRequestCategory() bool`

HasSpiPaymentRequestCategory returns a boolean if a field has been set.

### GetSpiPaymentStatus

`func (o *PaymentRequestsUpdate) GetSpiPaymentStatus() string`

GetSpiPaymentStatus returns the SpiPaymentStatus field if non-nil, zero value otherwise.

### GetSpiPaymentStatusOk

`func (o *PaymentRequestsUpdate) GetSpiPaymentStatusOk() (*string, bool)`

GetSpiPaymentStatusOk returns a tuple with the SpiPaymentStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentStatus

`func (o *PaymentRequestsUpdate) SetSpiPaymentStatus(v string)`

SetSpiPaymentStatus sets SpiPaymentStatus field to given value.

### HasSpiPaymentStatus

`func (o *PaymentRequestsUpdate) HasSpiPaymentStatus() bool`

HasSpiPaymentStatus returns a boolean if a field has been set.

### GetSpiRefDocNumero

`func (o *PaymentRequestsUpdate) GetSpiRefDocNumero() string`

GetSpiRefDocNumero returns the SpiRefDocNumero field if non-nil, zero value otherwise.

### GetSpiRefDocNumeroOk

`func (o *PaymentRequestsUpdate) GetSpiRefDocNumeroOk() (*string, bool)`

GetSpiRefDocNumeroOk returns a tuple with the SpiRefDocNumero field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRefDocNumero

`func (o *PaymentRequestsUpdate) SetSpiRefDocNumero(v string)`

SetSpiRefDocNumero sets SpiRefDocNumero field to given value.

### HasSpiRefDocNumero

`func (o *PaymentRequestsUpdate) HasSpiRefDocNumero() bool`

HasSpiRefDocNumero returns a boolean if a field has been set.

### GetSpiRefDocType

`func (o *PaymentRequestsUpdate) GetSpiRefDocType() string`

GetSpiRefDocType returns the SpiRefDocType field if non-nil, zero value otherwise.

### GetSpiRefDocTypeOk

`func (o *PaymentRequestsUpdate) GetSpiRefDocTypeOk() (*string, bool)`

GetSpiRefDocTypeOk returns a tuple with the SpiRefDocType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRefDocType

`func (o *PaymentRequestsUpdate) SetSpiRefDocType(v string)`

SetSpiRefDocType sets SpiRefDocType field to given value.

### HasSpiRefDocType

`func (o *PaymentRequestsUpdate) HasSpiRefDocType() bool`

HasSpiRefDocType returns a boolean if a field has been set.

### GetSpiRejectionReason

`func (o *PaymentRequestsUpdate) GetSpiRejectionReason() string`

GetSpiRejectionReason returns the SpiRejectionReason field if non-nil, zero value otherwise.

### GetSpiRejectionReasonOk

`func (o *PaymentRequestsUpdate) GetSpiRejectionReasonOk() (*string, bool)`

GetSpiRejectionReasonOk returns a tuple with the SpiRejectionReason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRejectionReason

`func (o *PaymentRequestsUpdate) SetSpiRejectionReason(v string)`

SetSpiRejectionReason sets SpiRejectionReason field to given value.

### HasSpiRejectionReason

`func (o *PaymentRequestsUpdate) HasSpiRejectionReason() bool`

HasSpiRejectionReason returns a boolean if a field has been set.

### GetSpiRemiseAmount

`func (o *PaymentRequestsUpdate) GetSpiRemiseAmount() float64`

GetSpiRemiseAmount returns the SpiRemiseAmount field if non-nil, zero value otherwise.

### GetSpiRemiseAmountOk

`func (o *PaymentRequestsUpdate) GetSpiRemiseAmountOk() (*float64, bool)`

GetSpiRemiseAmountOk returns a tuple with the SpiRemiseAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRemiseAmount

`func (o *PaymentRequestsUpdate) SetSpiRemiseAmount(v float64)`

SetSpiRemiseAmount sets SpiRemiseAmount field to given value.

### HasSpiRemiseAmount

`func (o *PaymentRequestsUpdate) HasSpiRemiseAmount() bool`

HasSpiRemiseAmount returns a boolean if a field has been set.

### GetSpiRemiseRate

`func (o *PaymentRequestsUpdate) GetSpiRemiseRate() float64`

GetSpiRemiseRate returns the SpiRemiseRate field if non-nil, zero value otherwise.

### GetSpiRemiseRateOk

`func (o *PaymentRequestsUpdate) GetSpiRemiseRateOk() (*float64, bool)`

GetSpiRemiseRateOk returns a tuple with the SpiRemiseRate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRemiseRate

`func (o *PaymentRequestsUpdate) SetSpiRemiseRate(v float64)`

SetSpiRemiseRate sets SpiRemiseRate field to given value.

### HasSpiRemiseRate

`func (o *PaymentRequestsUpdate) HasSpiRemiseRate() bool`

HasSpiRemiseRate returns a boolean if a field has been set.

### GetSpiTxId

`func (o *PaymentRequestsUpdate) GetSpiTxId() string`

GetSpiTxId returns the SpiTxId field if non-nil, zero value otherwise.

### GetSpiTxIdOk

`func (o *PaymentRequestsUpdate) GetSpiTxIdOk() (*string, bool)`

GetSpiTxIdOk returns a tuple with the SpiTxId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiTxId

`func (o *PaymentRequestsUpdate) SetSpiTxId(v string)`

SetSpiTxId sets SpiTxId field to given value.

### HasSpiTxId

`func (o *PaymentRequestsUpdate) HasSpiTxId() bool`

HasSpiTxId returns a boolean if a field has been set.

### GetStatus

`func (o *PaymentRequestsUpdate) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *PaymentRequestsUpdate) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *PaymentRequestsUpdate) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *PaymentRequestsUpdate) HasStatus() bool`

HasStatus returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


