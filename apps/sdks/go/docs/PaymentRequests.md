# PaymentRequests

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**CreatedBy** | Pointer to **string** |  | [optional] [readonly] 
**CurrencyCode** | Pointer to **string** | Three-letter ISO currency code (e.g., XOF, USD, EUR) | [optional] 
**CustomerId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Description** | Pointer to **string** |  | [optional] 
**Environment** | Pointer to **string** |  | [optional] 
**ExpiryDate** | Pointer to **string** |  | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PaymentLink** | Pointer to **string** |  | [optional] 
**PaymentReference** | Pointer to **string** |  | [optional] 
**RequestId** | Pointer to **string** | Unique identifier (UUID format) | [optional] [readonly] 
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
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 

## Methods

### NewPaymentRequests

`func NewPaymentRequests() *PaymentRequests`

NewPaymentRequests instantiates a new PaymentRequests object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPaymentRequestsWithDefaults

`func NewPaymentRequestsWithDefaults() *PaymentRequests`

NewPaymentRequestsWithDefaults instantiates a new PaymentRequests object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAmount

`func (o *PaymentRequests) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *PaymentRequests) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *PaymentRequests) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *PaymentRequests) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCreatedAt

`func (o *PaymentRequests) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *PaymentRequests) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *PaymentRequests) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *PaymentRequests) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetCreatedBy

`func (o *PaymentRequests) GetCreatedBy() string`

GetCreatedBy returns the CreatedBy field if non-nil, zero value otherwise.

### GetCreatedByOk

`func (o *PaymentRequests) GetCreatedByOk() (*string, bool)`

GetCreatedByOk returns a tuple with the CreatedBy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedBy

`func (o *PaymentRequests) SetCreatedBy(v string)`

SetCreatedBy sets CreatedBy field to given value.

### HasCreatedBy

`func (o *PaymentRequests) HasCreatedBy() bool`

HasCreatedBy returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *PaymentRequests) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *PaymentRequests) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *PaymentRequests) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *PaymentRequests) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetCustomerId

`func (o *PaymentRequests) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *PaymentRequests) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *PaymentRequests) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *PaymentRequests) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetDescription

`func (o *PaymentRequests) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *PaymentRequests) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *PaymentRequests) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *PaymentRequests) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetEnvironment

`func (o *PaymentRequests) GetEnvironment() string`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *PaymentRequests) GetEnvironmentOk() (*string, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *PaymentRequests) SetEnvironment(v string)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *PaymentRequests) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetExpiryDate

`func (o *PaymentRequests) GetExpiryDate() string`

GetExpiryDate returns the ExpiryDate field if non-nil, zero value otherwise.

### GetExpiryDateOk

`func (o *PaymentRequests) GetExpiryDateOk() (*string, bool)`

GetExpiryDateOk returns a tuple with the ExpiryDate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiryDate

`func (o *PaymentRequests) SetExpiryDate(v string)`

SetExpiryDate sets ExpiryDate field to given value.

### HasExpiryDate

`func (o *PaymentRequests) HasExpiryDate() bool`

HasExpiryDate returns a boolean if a field has been set.

### GetOrganizationId

`func (o *PaymentRequests) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *PaymentRequests) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *PaymentRequests) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *PaymentRequests) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetPaymentLink

`func (o *PaymentRequests) GetPaymentLink() string`

GetPaymentLink returns the PaymentLink field if non-nil, zero value otherwise.

### GetPaymentLinkOk

`func (o *PaymentRequests) GetPaymentLinkOk() (*string, bool)`

GetPaymentLinkOk returns a tuple with the PaymentLink field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentLink

`func (o *PaymentRequests) SetPaymentLink(v string)`

SetPaymentLink sets PaymentLink field to given value.

### HasPaymentLink

`func (o *PaymentRequests) HasPaymentLink() bool`

HasPaymentLink returns a boolean if a field has been set.

### GetPaymentReference

`func (o *PaymentRequests) GetPaymentReference() string`

GetPaymentReference returns the PaymentReference field if non-nil, zero value otherwise.

### GetPaymentReferenceOk

`func (o *PaymentRequests) GetPaymentReferenceOk() (*string, bool)`

GetPaymentReferenceOk returns a tuple with the PaymentReference field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentReference

`func (o *PaymentRequests) SetPaymentReference(v string)`

SetPaymentReference sets PaymentReference field to given value.

### HasPaymentReference

`func (o *PaymentRequests) HasPaymentReference() bool`

HasPaymentReference returns a boolean if a field has been set.

### GetRequestId

`func (o *PaymentRequests) GetRequestId() string`

GetRequestId returns the RequestId field if non-nil, zero value otherwise.

### GetRequestIdOk

`func (o *PaymentRequests) GetRequestIdOk() (*string, bool)`

GetRequestIdOk returns a tuple with the RequestId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRequestId

`func (o *PaymentRequests) SetRequestId(v string)`

SetRequestId sets RequestId field to given value.

### HasRequestId

`func (o *PaymentRequests) HasRequestId() bool`

HasRequestId returns a boolean if a field has been set.

### GetSpiAccountNumber

`func (o *PaymentRequests) GetSpiAccountNumber() string`

GetSpiAccountNumber returns the SpiAccountNumber field if non-nil, zero value otherwise.

### GetSpiAccountNumberOk

`func (o *PaymentRequests) GetSpiAccountNumberOk() (*string, bool)`

GetSpiAccountNumberOk returns a tuple with the SpiAccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAccountNumber

`func (o *PaymentRequests) SetSpiAccountNumber(v string)`

SetSpiAccountNumber sets SpiAccountNumber field to given value.

### HasSpiAccountNumber

`func (o *PaymentRequests) HasSpiAccountNumber() bool`

HasSpiAccountNumber returns a boolean if a field has been set.

### GetSpiBulkInstructionId

`func (o *PaymentRequests) GetSpiBulkInstructionId() string`

GetSpiBulkInstructionId returns the SpiBulkInstructionId field if non-nil, zero value otherwise.

### GetSpiBulkInstructionIdOk

`func (o *PaymentRequests) GetSpiBulkInstructionIdOk() (*string, bool)`

GetSpiBulkInstructionIdOk returns a tuple with the SpiBulkInstructionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiBulkInstructionId

`func (o *PaymentRequests) SetSpiBulkInstructionId(v string)`

SetSpiBulkInstructionId sets SpiBulkInstructionId field to given value.

### HasSpiBulkInstructionId

`func (o *PaymentRequests) HasSpiBulkInstructionId() bool`

HasSpiBulkInstructionId returns a boolean if a field has been set.

### GetSpiConfirmation

`func (o *PaymentRequests) GetSpiConfirmation() bool`

GetSpiConfirmation returns the SpiConfirmation field if non-nil, zero value otherwise.

### GetSpiConfirmationOk

`func (o *PaymentRequests) GetSpiConfirmationOk() (*bool, bool)`

GetSpiConfirmationOk returns a tuple with the SpiConfirmation field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiConfirmation

`func (o *PaymentRequests) SetSpiConfirmation(v bool)`

SetSpiConfirmation sets SpiConfirmation field to given value.

### HasSpiConfirmation

`func (o *PaymentRequests) HasSpiConfirmation() bool`

HasSpiConfirmation returns a boolean if a field has been set.

### GetSpiDateEnvoi

`func (o *PaymentRequests) GetSpiDateEnvoi() string`

GetSpiDateEnvoi returns the SpiDateEnvoi field if non-nil, zero value otherwise.

### GetSpiDateEnvoiOk

`func (o *PaymentRequests) GetSpiDateEnvoiOk() (*string, bool)`

GetSpiDateEnvoiOk returns a tuple with the SpiDateEnvoi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateEnvoi

`func (o *PaymentRequests) SetSpiDateEnvoi(v string)`

SetSpiDateEnvoi sets SpiDateEnvoi field to given value.

### HasSpiDateEnvoi

`func (o *PaymentRequests) HasSpiDateEnvoi() bool`

HasSpiDateEnvoi returns a boolean if a field has been set.

### GetSpiDateIrrevocabilite

`func (o *PaymentRequests) GetSpiDateIrrevocabilite() string`

GetSpiDateIrrevocabilite returns the SpiDateIrrevocabilite field if non-nil, zero value otherwise.

### GetSpiDateIrrevocabiliteOk

`func (o *PaymentRequests) GetSpiDateIrrevocabiliteOk() (*string, bool)`

GetSpiDateIrrevocabiliteOk returns a tuple with the SpiDateIrrevocabilite field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateIrrevocabilite

`func (o *PaymentRequests) SetSpiDateIrrevocabilite(v string)`

SetSpiDateIrrevocabilite sets SpiDateIrrevocabilite field to given value.

### HasSpiDateIrrevocabilite

`func (o *PaymentRequests) HasSpiDateIrrevocabilite() bool`

HasSpiDateIrrevocabilite returns a boolean if a field has been set.

### GetSpiDateLimitePaiement

`func (o *PaymentRequests) GetSpiDateLimitePaiement() string`

GetSpiDateLimitePaiement returns the SpiDateLimitePaiement field if non-nil, zero value otherwise.

### GetSpiDateLimitePaiementOk

`func (o *PaymentRequests) GetSpiDateLimitePaiementOk() (*string, bool)`

GetSpiDateLimitePaiementOk returns a tuple with the SpiDateLimitePaiement field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateLimitePaiement

`func (o *PaymentRequests) SetSpiDateLimitePaiement(v string)`

SetSpiDateLimitePaiement sets SpiDateLimitePaiement field to given value.

### HasSpiDateLimitePaiement

`func (o *PaymentRequests) HasSpiDateLimitePaiement() bool`

HasSpiDateLimitePaiement returns a boolean if a field has been set.

### GetSpiDateLimiteReponse

`func (o *PaymentRequests) GetSpiDateLimiteReponse() string`

GetSpiDateLimiteReponse returns the SpiDateLimiteReponse field if non-nil, zero value otherwise.

### GetSpiDateLimiteReponseOk

`func (o *PaymentRequests) GetSpiDateLimiteReponseOk() (*string, bool)`

GetSpiDateLimiteReponseOk returns a tuple with the SpiDateLimiteReponse field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateLimiteReponse

`func (o *PaymentRequests) SetSpiDateLimiteReponse(v string)`

SetSpiDateLimiteReponse sets SpiDateLimiteReponse field to given value.

### HasSpiDateLimiteReponse

`func (o *PaymentRequests) HasSpiDateLimiteReponse() bool`

HasSpiDateLimiteReponse returns a boolean if a field has been set.

### GetSpiDateRejet

`func (o *PaymentRequests) GetSpiDateRejet() string`

GetSpiDateRejet returns the SpiDateRejet field if non-nil, zero value otherwise.

### GetSpiDateRejetOk

`func (o *PaymentRequests) GetSpiDateRejetOk() (*string, bool)`

GetSpiDateRejetOk returns a tuple with the SpiDateRejet field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDateRejet

`func (o *PaymentRequests) SetSpiDateRejet(v string)`

SetSpiDateRejet sets SpiDateRejet field to given value.

### HasSpiDateRejet

`func (o *PaymentRequests) HasSpiDateRejet() bool`

HasSpiDateRejet returns a boolean if a field has been set.

### GetSpiDebitDiffere

`func (o *PaymentRequests) GetSpiDebitDiffere() bool`

GetSpiDebitDiffere returns the SpiDebitDiffere field if non-nil, zero value otherwise.

### GetSpiDebitDiffereOk

`func (o *PaymentRequests) GetSpiDebitDiffereOk() (*bool, bool)`

GetSpiDebitDiffereOk returns a tuple with the SpiDebitDiffere field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiDebitDiffere

`func (o *PaymentRequests) SetSpiDebitDiffere(v bool)`

SetSpiDebitDiffere sets SpiDebitDiffere field to given value.

### HasSpiDebitDiffere

`func (o *PaymentRequests) HasSpiDebitDiffere() bool`

HasSpiDebitDiffere returns a boolean if a field has been set.

### GetSpiEnd2endId

`func (o *PaymentRequests) GetSpiEnd2endId() string`

GetSpiEnd2endId returns the SpiEnd2endId field if non-nil, zero value otherwise.

### GetSpiEnd2endIdOk

`func (o *PaymentRequests) GetSpiEnd2endIdOk() (*string, bool)`

GetSpiEnd2endIdOk returns a tuple with the SpiEnd2endId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiEnd2endId

`func (o *PaymentRequests) SetSpiEnd2endId(v string)`

SetSpiEnd2endId sets SpiEnd2endId field to given value.

### HasSpiEnd2endId

`func (o *PaymentRequests) HasSpiEnd2endId() bool`

HasSpiEnd2endId returns a boolean if a field has been set.

### GetSpiPayeurAlias

`func (o *PaymentRequests) GetSpiPayeurAlias() string`

GetSpiPayeurAlias returns the SpiPayeurAlias field if non-nil, zero value otherwise.

### GetSpiPayeurAliasOk

`func (o *PaymentRequests) GetSpiPayeurAliasOk() (*string, bool)`

GetSpiPayeurAliasOk returns a tuple with the SpiPayeurAlias field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPayeurAlias

`func (o *PaymentRequests) SetSpiPayeurAlias(v string)`

SetSpiPayeurAlias sets SpiPayeurAlias field to given value.

### HasSpiPayeurAlias

`func (o *PaymentRequests) HasSpiPayeurAlias() bool`

HasSpiPayeurAlias returns a boolean if a field has been set.

### GetSpiPayeurNom

`func (o *PaymentRequests) GetSpiPayeurNom() string`

GetSpiPayeurNom returns the SpiPayeurNom field if non-nil, zero value otherwise.

### GetSpiPayeurNomOk

`func (o *PaymentRequests) GetSpiPayeurNomOk() (*string, bool)`

GetSpiPayeurNomOk returns a tuple with the SpiPayeurNom field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPayeurNom

`func (o *PaymentRequests) SetSpiPayeurNom(v string)`

SetSpiPayeurNom sets SpiPayeurNom field to given value.

### HasSpiPayeurNom

`func (o *PaymentRequests) HasSpiPayeurNom() bool`

HasSpiPayeurNom returns a boolean if a field has been set.

### GetSpiPayeurPays

`func (o *PaymentRequests) GetSpiPayeurPays() string`

GetSpiPayeurPays returns the SpiPayeurPays field if non-nil, zero value otherwise.

### GetSpiPayeurPaysOk

`func (o *PaymentRequests) GetSpiPayeurPaysOk() (*string, bool)`

GetSpiPayeurPaysOk returns a tuple with the SpiPayeurPays field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPayeurPays

`func (o *PaymentRequests) SetSpiPayeurPays(v string)`

SetSpiPayeurPays sets SpiPayeurPays field to given value.

### HasSpiPayeurPays

`func (o *PaymentRequests) HasSpiPayeurPays() bool`

HasSpiPayeurPays returns a boolean if a field has been set.

### GetSpiPaymentRequestCategory

`func (o *PaymentRequests) GetSpiPaymentRequestCategory() string`

GetSpiPaymentRequestCategory returns the SpiPaymentRequestCategory field if non-nil, zero value otherwise.

### GetSpiPaymentRequestCategoryOk

`func (o *PaymentRequests) GetSpiPaymentRequestCategoryOk() (*string, bool)`

GetSpiPaymentRequestCategoryOk returns a tuple with the SpiPaymentRequestCategory field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentRequestCategory

`func (o *PaymentRequests) SetSpiPaymentRequestCategory(v string)`

SetSpiPaymentRequestCategory sets SpiPaymentRequestCategory field to given value.

### HasSpiPaymentRequestCategory

`func (o *PaymentRequests) HasSpiPaymentRequestCategory() bool`

HasSpiPaymentRequestCategory returns a boolean if a field has been set.

### GetSpiPaymentStatus

`func (o *PaymentRequests) GetSpiPaymentStatus() string`

GetSpiPaymentStatus returns the SpiPaymentStatus field if non-nil, zero value otherwise.

### GetSpiPaymentStatusOk

`func (o *PaymentRequests) GetSpiPaymentStatusOk() (*string, bool)`

GetSpiPaymentStatusOk returns a tuple with the SpiPaymentStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPaymentStatus

`func (o *PaymentRequests) SetSpiPaymentStatus(v string)`

SetSpiPaymentStatus sets SpiPaymentStatus field to given value.

### HasSpiPaymentStatus

`func (o *PaymentRequests) HasSpiPaymentStatus() bool`

HasSpiPaymentStatus returns a boolean if a field has been set.

### GetSpiRefDocNumero

`func (o *PaymentRequests) GetSpiRefDocNumero() string`

GetSpiRefDocNumero returns the SpiRefDocNumero field if non-nil, zero value otherwise.

### GetSpiRefDocNumeroOk

`func (o *PaymentRequests) GetSpiRefDocNumeroOk() (*string, bool)`

GetSpiRefDocNumeroOk returns a tuple with the SpiRefDocNumero field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRefDocNumero

`func (o *PaymentRequests) SetSpiRefDocNumero(v string)`

SetSpiRefDocNumero sets SpiRefDocNumero field to given value.

### HasSpiRefDocNumero

`func (o *PaymentRequests) HasSpiRefDocNumero() bool`

HasSpiRefDocNumero returns a boolean if a field has been set.

### GetSpiRefDocType

`func (o *PaymentRequests) GetSpiRefDocType() string`

GetSpiRefDocType returns the SpiRefDocType field if non-nil, zero value otherwise.

### GetSpiRefDocTypeOk

`func (o *PaymentRequests) GetSpiRefDocTypeOk() (*string, bool)`

GetSpiRefDocTypeOk returns a tuple with the SpiRefDocType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRefDocType

`func (o *PaymentRequests) SetSpiRefDocType(v string)`

SetSpiRefDocType sets SpiRefDocType field to given value.

### HasSpiRefDocType

`func (o *PaymentRequests) HasSpiRefDocType() bool`

HasSpiRefDocType returns a boolean if a field has been set.

### GetSpiRejectionReason

`func (o *PaymentRequests) GetSpiRejectionReason() string`

GetSpiRejectionReason returns the SpiRejectionReason field if non-nil, zero value otherwise.

### GetSpiRejectionReasonOk

`func (o *PaymentRequests) GetSpiRejectionReasonOk() (*string, bool)`

GetSpiRejectionReasonOk returns a tuple with the SpiRejectionReason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRejectionReason

`func (o *PaymentRequests) SetSpiRejectionReason(v string)`

SetSpiRejectionReason sets SpiRejectionReason field to given value.

### HasSpiRejectionReason

`func (o *PaymentRequests) HasSpiRejectionReason() bool`

HasSpiRejectionReason returns a boolean if a field has been set.

### GetSpiRemiseAmount

`func (o *PaymentRequests) GetSpiRemiseAmount() float64`

GetSpiRemiseAmount returns the SpiRemiseAmount field if non-nil, zero value otherwise.

### GetSpiRemiseAmountOk

`func (o *PaymentRequests) GetSpiRemiseAmountOk() (*float64, bool)`

GetSpiRemiseAmountOk returns a tuple with the SpiRemiseAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRemiseAmount

`func (o *PaymentRequests) SetSpiRemiseAmount(v float64)`

SetSpiRemiseAmount sets SpiRemiseAmount field to given value.

### HasSpiRemiseAmount

`func (o *PaymentRequests) HasSpiRemiseAmount() bool`

HasSpiRemiseAmount returns a boolean if a field has been set.

### GetSpiRemiseRate

`func (o *PaymentRequests) GetSpiRemiseRate() float64`

GetSpiRemiseRate returns the SpiRemiseRate field if non-nil, zero value otherwise.

### GetSpiRemiseRateOk

`func (o *PaymentRequests) GetSpiRemiseRateOk() (*float64, bool)`

GetSpiRemiseRateOk returns a tuple with the SpiRemiseRate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiRemiseRate

`func (o *PaymentRequests) SetSpiRemiseRate(v float64)`

SetSpiRemiseRate sets SpiRemiseRate field to given value.

### HasSpiRemiseRate

`func (o *PaymentRequests) HasSpiRemiseRate() bool`

HasSpiRemiseRate returns a boolean if a field has been set.

### GetSpiTxId

`func (o *PaymentRequests) GetSpiTxId() string`

GetSpiTxId returns the SpiTxId field if non-nil, zero value otherwise.

### GetSpiTxIdOk

`func (o *PaymentRequests) GetSpiTxIdOk() (*string, bool)`

GetSpiTxIdOk returns a tuple with the SpiTxId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiTxId

`func (o *PaymentRequests) SetSpiTxId(v string)`

SetSpiTxId sets SpiTxId field to given value.

### HasSpiTxId

`func (o *PaymentRequests) HasSpiTxId() bool`

HasSpiTxId returns a boolean if a field has been set.

### GetStatus

`func (o *PaymentRequests) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *PaymentRequests) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *PaymentRequests) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *PaymentRequests) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *PaymentRequests) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *PaymentRequests) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *PaymentRequests) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *PaymentRequests) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


