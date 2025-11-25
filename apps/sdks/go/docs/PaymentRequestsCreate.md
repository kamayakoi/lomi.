# PaymentRequestsCreate

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

### NewPaymentRequestsCreate

`func NewPaymentRequestsCreate() *PaymentRequestsCreate`

NewPaymentRequestsCreate instantiates a new PaymentRequestsCreate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPaymentRequestsCreateWithDefaults

`func NewPaymentRequestsCreateWithDefaults() *PaymentRequestsCreate`

NewPaymentRequestsCreateWithDefaults instantiates a new PaymentRequestsCreate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAmount

`func (o *PaymentRequestsCreate) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *PaymentRequestsCreate) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *PaymentRequestsCreate) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *PaymentRequestsCreate) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *PaymentRequestsCreate) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *PaymentRequestsCreate) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *PaymentRequestsCreate) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *PaymentRequestsCreate) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetCustomerId

`func (o *PaymentRequestsCreate) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *PaymentRequestsCreate) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *PaymentRequestsCreate) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *PaymentRequestsCreate) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetDescription

`func (o *PaymentRequestsCreate) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *PaymentRequestsCreate) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *PaymentRequestsCreate) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *PaymentRequestsCreate) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetExpiryDate

`func (o *PaymentRequestsCreate) GetExpiryDate() string`

GetExpiryDate returns the ExpiryDate field if non-nil, zero value otherwise.

### GetExpiryDateOk

`func (o *PaymentRequestsCreate) GetExpiryDateOk() (*string, bool)`

GetExpiryDateOk returns a tuple with the ExpiryDate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiryDate

`func (o *PaymentRequestsCreate) SetExpiryDate(v string)`

SetExpiryDate sets ExpiryDate field to given value.

### HasExpiryDate

`func (o *PaymentRequestsCreate) HasExpiryDate() bool`

HasExpiryDate returns a boolean if a field has been set.

### GetPaymentLink

`func (o *PaymentRequestsCreate) GetPaymentLink() string`

GetPaymentLink returns the PaymentLink field if non-nil, zero value otherwise.

### GetPaymentLinkOk

`func (o *PaymentRequestsCreate) GetPaymentLinkOk() (*string, bool)`

GetPaymentLinkOk returns a tuple with the PaymentLink field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentLink

`func (o *PaymentRequestsCreate) SetPaymentLink(v string)`

SetPaymentLink sets PaymentLink field to given value.

### HasPaymentLink

`func (o *PaymentRequestsCreate) HasPaymentLink() bool`

HasPaymentLink returns a boolean if a field has been set.

### GetPaymentReference

`func (o *PaymentRequestsCreate) GetPaymentReference() string`

GetPaymentReference returns the PaymentReference field if non-nil, zero value otherwise.

### GetPaymentReferenceOk

`func (o *PaymentRequestsCreate) GetPaymentReferenceOk() (*string, bool)`

GetPaymentReferenceOk returns a tuple with the PaymentReference field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentReference

`func (o *PaymentRequestsCreate) SetPaymentReference(v string)`

SetPaymentReference sets PaymentReference field to given value.

### HasPaymentReference

`func (o *PaymentRequestsCreate) HasPaymentReference() bool`

HasPaymentReference returns a boolean if a field has been set.

### GetSpiAccountNumber

`func (o *PaymentRequestsCreate) GetSpiAccountNumber() string`

GetSpiAccountNumber returns the SpiAccountNumber field if non-nil, zero value otherwise.

### GetSpiAccountNumberOk

`func (o *PaymentRequestsCreate) GetSpiAccountNumberOk() (*string, bool)`

GetSpiAccountNumberOk returns a tuple with the SpiAccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAccountNumber

`func (o *PaymentRequestsCreate) SetSpiAccountNumber(v string)`

SetSpiAccountNumber sets SpiAccountNumber field to given value.

### HasSpiAccountNumber

`func (o *PaymentRequestsCreate) HasSpiAccountNumber() bool`

HasSpiAccountNumber returns a boolean if a field has been set.

### GetSpiBulkInstructionId

`func (o *PaymentRequestsCreate) GetSpiBulkInstructionId() string`

GetSpiBulkInstructionId returns the SpiBulkInstructionId field if non-nil, zero value otherwise.

### GetSpiBulkInstructionIdOk

`func (o *PaymentRequestsCreate) GetSpiBulkInstructionIdOk() (*string, bool)`

GetSpiBulkInstructionIdOk returns a tuple with the SpiBulkInstructionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiBulkInstructionId

`func (o *PaymentRequestsCreate) SetSpiBulkInstructionId(v string)`

SetSpiBulkInstructionId sets SpiBulkInstructionId field to given value.

### HasSpiBulkInstructionId

`func (o *PaymentRequestsCreate) HasSpiBulkInstructionId() bool`

HasSpiBulkInstructionId returns a boolean if a field has been set.

### GetSpiConfirmation

`func (o *PaymentRequestsCreate) GetSpiConfirmation() bool`

GetSpiConfirmation returns the SpiConfirmation field if non-nil, zero value otherwise.

### GetSpiConfirmationOk

`func (o *PaymentRequestsCreate) GetSpiConfirmationOk() (*bool, bool)`

GetSpiConfirmationOk returns a tuple with the SpiConfirmation field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiConfirmation

`func (o *PaymentRequestsCreate) SetSpiConfirmation(v bool)`

SetSpiConfirmation sets SpiConfirmation field to given value.

### HasSpiConfirmation

`func (o *PaymentRequestsCreate) HasSpiConfirmation() bool`

HasSpiConfirmation returns a boolean if a field has been set.

### GetSpiDateEnvoi

`func (o *PaymentRequestsCreate) GetSpiDateEnvoi() string`

GetSpiDateEnvoi returns the SpiDateEnvoi field if non-nil, zero value otherwise.

### GetSpiDateEnvoiOk

`func (o *PaymentRequestsCreate) GetSpiDateEnvoiOk() (*string, bool)`

GetSpiDateEnvoiOk returns a tuple with the SpiDateEnvoi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateEnvoi

`func (o *PaymentRequestsCreate) SetSpiDateEnvoi(v string)`

SetSpiDateEnvoi sets SpiDateEnvoi field to given value.

### HasSpiDateEnvoi

`func (o *PaymentRequestsCreate) HasSpiDateEnvoi() bool`

HasSpiDateEnvoi returns a boolean if a field has been set.

### GetSpiDateIrrevocabilite

`func (o *PaymentRequestsCreate) GetSpiDateIrrevocabilite() string`

GetSpiDateIrrevocabilite returns the SpiDateIrrevocabilite field if non-nil, zero value otherwise.

### GetSpiDateIrrevocabiliteOk

`func (o *PaymentRequestsCreate) GetSpiDateIrrevocabiliteOk() (*string, bool)`

GetSpiDateIrrevocabiliteOk returns a tuple with the SpiDateIrrevocabilite field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateIrrevocabilite

`func (o *PaymentRequestsCreate) SetSpiDateIrrevocabilite(v string)`

SetSpiDateIrrevocabilite sets SpiDateIrrevocabilite field to given value.

### HasSpiDateIrrevocabilite

`func (o *PaymentRequestsCreate) HasSpiDateIrrevocabilite() bool`

HasSpiDateIrrevocabilite returns a boolean if a field has been set.

### GetSpiDateLimitePaiement

`func (o *PaymentRequestsCreate) GetSpiDateLimitePaiement() string`

GetSpiDateLimitePaiement returns the SpiDateLimitePaiement field if non-nil, zero value otherwise.

### GetSpiDateLimitePaiementOk

`func (o *PaymentRequestsCreate) GetSpiDateLimitePaiementOk() (*string, bool)`

GetSpiDateLimitePaiementOk returns a tuple with the SpiDateLimitePaiement field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateLimitePaiement

`func (o *PaymentRequestsCreate) SetSpiDateLimitePaiement(v string)`

SetSpiDateLimitePaiement sets SpiDateLimitePaiement field to given value.

### HasSpiDateLimitePaiement

`func (o *PaymentRequestsCreate) HasSpiDateLimitePaiement() bool`

HasSpiDateLimitePaiement returns a boolean if a field has been set.

### GetSpiDateLimiteReponse

`func (o *PaymentRequestsCreate) GetSpiDateLimiteReponse() string`

GetSpiDateLimiteReponse returns the SpiDateLimiteReponse field if non-nil, zero value otherwise.

### GetSpiDateLimiteReponseOk

`func (o *PaymentRequestsCreate) GetSpiDateLimiteReponseOk() (*string, bool)`

GetSpiDateLimiteReponseOk returns a tuple with the SpiDateLimiteReponse field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateLimiteReponse

`func (o *PaymentRequestsCreate) SetSpiDateLimiteReponse(v string)`

SetSpiDateLimiteReponse sets SpiDateLimiteReponse field to given value.

### HasSpiDateLimiteReponse

`func (o *PaymentRequestsCreate) HasSpiDateLimiteReponse() bool`

HasSpiDateLimiteReponse returns a boolean if a field has been set.

### GetSpiDateRejet

`func (o *PaymentRequestsCreate) GetSpiDateRejet() string`

GetSpiDateRejet returns the SpiDateRejet field if non-nil, zero value otherwise.

### GetSpiDateRejetOk

`func (o *PaymentRequestsCreate) GetSpiDateRejetOk() (*string, bool)`

GetSpiDateRejetOk returns a tuple with the SpiDateRejet field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateRejet

`func (o *PaymentRequestsCreate) SetSpiDateRejet(v string)`

SetSpiDateRejet sets SpiDateRejet field to given value.

### HasSpiDateRejet

`func (o *PaymentRequestsCreate) HasSpiDateRejet() bool`

HasSpiDateRejet returns a boolean if a field has been set.

### GetSpiDebitDiffere

`func (o *PaymentRequestsCreate) GetSpiDebitDiffere() bool`

GetSpiDebitDiffere returns the SpiDebitDiffere field if non-nil, zero value otherwise.

### GetSpiDebitDiffereOk

`func (o *PaymentRequestsCreate) GetSpiDebitDiffereOk() (*bool, bool)`

GetSpiDebitDiffereOk returns a tuple with the SpiDebitDiffere field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDebitDiffere

`func (o *PaymentRequestsCreate) SetSpiDebitDiffere(v bool)`

SetSpiDebitDiffere sets SpiDebitDiffere field to given value.

### HasSpiDebitDiffere

`func (o *PaymentRequestsCreate) HasSpiDebitDiffere() bool`

HasSpiDebitDiffere returns a boolean if a field has been set.

### GetSpiEnd2endId

`func (o *PaymentRequestsCreate) GetSpiEnd2endId() string`

GetSpiEnd2endId returns the SpiEnd2endId field if non-nil, zero value otherwise.

### GetSpiEnd2endIdOk

`func (o *PaymentRequestsCreate) GetSpiEnd2endIdOk() (*string, bool)`

GetSpiEnd2endIdOk returns a tuple with the SpiEnd2endId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiEnd2endId

`func (o *PaymentRequestsCreate) SetSpiEnd2endId(v string)`

SetSpiEnd2endId sets SpiEnd2endId field to given value.

### HasSpiEnd2endId

`func (o *PaymentRequestsCreate) HasSpiEnd2endId() bool`

HasSpiEnd2endId returns a boolean if a field has been set.

### GetSpiPayeurAlias

`func (o *PaymentRequestsCreate) GetSpiPayeurAlias() string`

GetSpiPayeurAlias returns the SpiPayeurAlias field if non-nil, zero value otherwise.

### GetSpiPayeurAliasOk

`func (o *PaymentRequestsCreate) GetSpiPayeurAliasOk() (*string, bool)`

GetSpiPayeurAliasOk returns a tuple with the SpiPayeurAlias field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPayeurAlias

`func (o *PaymentRequestsCreate) SetSpiPayeurAlias(v string)`

SetSpiPayeurAlias sets SpiPayeurAlias field to given value.

### HasSpiPayeurAlias

`func (o *PaymentRequestsCreate) HasSpiPayeurAlias() bool`

HasSpiPayeurAlias returns a boolean if a field has been set.

### GetSpiPayeurNom

`func (o *PaymentRequestsCreate) GetSpiPayeurNom() string`

GetSpiPayeurNom returns the SpiPayeurNom field if non-nil, zero value otherwise.

### GetSpiPayeurNomOk

`func (o *PaymentRequestsCreate) GetSpiPayeurNomOk() (*string, bool)`

GetSpiPayeurNomOk returns a tuple with the SpiPayeurNom field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPayeurNom

`func (o *PaymentRequestsCreate) SetSpiPayeurNom(v string)`

SetSpiPayeurNom sets SpiPayeurNom field to given value.

### HasSpiPayeurNom

`func (o *PaymentRequestsCreate) HasSpiPayeurNom() bool`

HasSpiPayeurNom returns a boolean if a field has been set.

### GetSpiPayeurPays

`func (o *PaymentRequestsCreate) GetSpiPayeurPays() string`

GetSpiPayeurPays returns the SpiPayeurPays field if non-nil, zero value otherwise.

### GetSpiPayeurPaysOk

`func (o *PaymentRequestsCreate) GetSpiPayeurPaysOk() (*string, bool)`

GetSpiPayeurPaysOk returns a tuple with the SpiPayeurPays field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPayeurPays

`func (o *PaymentRequestsCreate) SetSpiPayeurPays(v string)`

SetSpiPayeurPays sets SpiPayeurPays field to given value.

### HasSpiPayeurPays

`func (o *PaymentRequestsCreate) HasSpiPayeurPays() bool`

HasSpiPayeurPays returns a boolean if a field has been set.

### GetSpiPaymentRequestCategory

`func (o *PaymentRequestsCreate) GetSpiPaymentRequestCategory() string`

GetSpiPaymentRequestCategory returns the SpiPaymentRequestCategory field if non-nil, zero value otherwise.

### GetSpiPaymentRequestCategoryOk

`func (o *PaymentRequestsCreate) GetSpiPaymentRequestCategoryOk() (*string, bool)`

GetSpiPaymentRequestCategoryOk returns a tuple with the SpiPaymentRequestCategory field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentRequestCategory

`func (o *PaymentRequestsCreate) SetSpiPaymentRequestCategory(v string)`

SetSpiPaymentRequestCategory sets SpiPaymentRequestCategory field to given value.

### HasSpiPaymentRequestCategory

`func (o *PaymentRequestsCreate) HasSpiPaymentRequestCategory() bool`

HasSpiPaymentRequestCategory returns a boolean if a field has been set.

### GetSpiPaymentStatus

`func (o *PaymentRequestsCreate) GetSpiPaymentStatus() string`

GetSpiPaymentStatus returns the SpiPaymentStatus field if non-nil, zero value otherwise.

### GetSpiPaymentStatusOk

`func (o *PaymentRequestsCreate) GetSpiPaymentStatusOk() (*string, bool)`

GetSpiPaymentStatusOk returns a tuple with the SpiPaymentStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentStatus

`func (o *PaymentRequestsCreate) SetSpiPaymentStatus(v string)`

SetSpiPaymentStatus sets SpiPaymentStatus field to given value.

### HasSpiPaymentStatus

`func (o *PaymentRequestsCreate) HasSpiPaymentStatus() bool`

HasSpiPaymentStatus returns a boolean if a field has been set.

### GetSpiRefDocNumero

`func (o *PaymentRequestsCreate) GetSpiRefDocNumero() string`

GetSpiRefDocNumero returns the SpiRefDocNumero field if non-nil, zero value otherwise.

### GetSpiRefDocNumeroOk

`func (o *PaymentRequestsCreate) GetSpiRefDocNumeroOk() (*string, bool)`

GetSpiRefDocNumeroOk returns a tuple with the SpiRefDocNumero field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRefDocNumero

`func (o *PaymentRequestsCreate) SetSpiRefDocNumero(v string)`

SetSpiRefDocNumero sets SpiRefDocNumero field to given value.

### HasSpiRefDocNumero

`func (o *PaymentRequestsCreate) HasSpiRefDocNumero() bool`

HasSpiRefDocNumero returns a boolean if a field has been set.

### GetSpiRefDocType

`func (o *PaymentRequestsCreate) GetSpiRefDocType() string`

GetSpiRefDocType returns the SpiRefDocType field if non-nil, zero value otherwise.

### GetSpiRefDocTypeOk

`func (o *PaymentRequestsCreate) GetSpiRefDocTypeOk() (*string, bool)`

GetSpiRefDocTypeOk returns a tuple with the SpiRefDocType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRefDocType

`func (o *PaymentRequestsCreate) SetSpiRefDocType(v string)`

SetSpiRefDocType sets SpiRefDocType field to given value.

### HasSpiRefDocType

`func (o *PaymentRequestsCreate) HasSpiRefDocType() bool`

HasSpiRefDocType returns a boolean if a field has been set.

### GetSpiRejectionReason

`func (o *PaymentRequestsCreate) GetSpiRejectionReason() string`

GetSpiRejectionReason returns the SpiRejectionReason field if non-nil, zero value otherwise.

### GetSpiRejectionReasonOk

`func (o *PaymentRequestsCreate) GetSpiRejectionReasonOk() (*string, bool)`

GetSpiRejectionReasonOk returns a tuple with the SpiRejectionReason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRejectionReason

`func (o *PaymentRequestsCreate) SetSpiRejectionReason(v string)`

SetSpiRejectionReason sets SpiRejectionReason field to given value.

### HasSpiRejectionReason

`func (o *PaymentRequestsCreate) HasSpiRejectionReason() bool`

HasSpiRejectionReason returns a boolean if a field has been set.

### GetSpiRemiseAmount

`func (o *PaymentRequestsCreate) GetSpiRemiseAmount() float64`

GetSpiRemiseAmount returns the SpiRemiseAmount field if non-nil, zero value otherwise.

### GetSpiRemiseAmountOk

`func (o *PaymentRequestsCreate) GetSpiRemiseAmountOk() (*float64, bool)`

GetSpiRemiseAmountOk returns a tuple with the SpiRemiseAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRemiseAmount

`func (o *PaymentRequestsCreate) SetSpiRemiseAmount(v float64)`

SetSpiRemiseAmount sets SpiRemiseAmount field to given value.

### HasSpiRemiseAmount

`func (o *PaymentRequestsCreate) HasSpiRemiseAmount() bool`

HasSpiRemiseAmount returns a boolean if a field has been set.

### GetSpiRemiseRate

`func (o *PaymentRequestsCreate) GetSpiRemiseRate() float64`

GetSpiRemiseRate returns the SpiRemiseRate field if non-nil, zero value otherwise.

### GetSpiRemiseRateOk

`func (o *PaymentRequestsCreate) GetSpiRemiseRateOk() (*float64, bool)`

GetSpiRemiseRateOk returns a tuple with the SpiRemiseRate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRemiseRate

`func (o *PaymentRequestsCreate) SetSpiRemiseRate(v float64)`

SetSpiRemiseRate sets SpiRemiseRate field to given value.

### HasSpiRemiseRate

`func (o *PaymentRequestsCreate) HasSpiRemiseRate() bool`

HasSpiRemiseRate returns a boolean if a field has been set.

### GetSpiTxId

`func (o *PaymentRequestsCreate) GetSpiTxId() string`

GetSpiTxId returns the SpiTxId field if non-nil, zero value otherwise.

### GetSpiTxIdOk

`func (o *PaymentRequestsCreate) GetSpiTxIdOk() (*string, bool)`

GetSpiTxIdOk returns a tuple with the SpiTxId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiTxId

`func (o *PaymentRequestsCreate) SetSpiTxId(v string)`

SetSpiTxId sets SpiTxId field to given value.

### HasSpiTxId

`func (o *PaymentRequestsCreate) HasSpiTxId() bool`

HasSpiTxId returns a boolean if a field has been set.

### GetStatus

`func (o *PaymentRequestsCreate) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *PaymentRequestsCreate) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *PaymentRequestsCreate) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *PaymentRequestsCreate) HasStatus() bool`

HasStatus returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


