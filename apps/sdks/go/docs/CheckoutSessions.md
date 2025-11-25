# CheckoutSessions

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AllowCouponCode** | Pointer to **bool** |  | [optional] 
**AllowQuantity** | Pointer to **bool** |  | [optional] 
**AllowedProviders** | Pointer to **string** |  | [optional] 
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**CancelUrl** | Pointer to **string** | URL/URI | [optional] 
**CheckoutSessionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**CreatedBy** | Pointer to **string** |  | [optional] [readonly] 
**CurrencyCode** | Pointer to **string** | Three-letter ISO currency code (e.g., XOF, USD, EUR) | [optional] 
**CustomerEmail** | Pointer to **string** | Email address | [optional] 
**CustomerId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**CustomerName** | Pointer to **string** |  | [optional] 
**CustomerPhone** | Pointer to **string** |  | [optional] 
**Environment** | Pointer to **string** |  | [optional] 
**ExpiresAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] 
**InstallmentPlanId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**IsPos** | Pointer to **bool** |  | [optional] 
**IsSpi** | Pointer to **bool** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PaymentLinkId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PaymentRequestId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PriceId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**ProductId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PublicDescription** | Pointer to **string** |  | [optional] 
**QrCodeData** | Pointer to **map[string]interface{}** |  | [optional] 
**QrCodeType** | Pointer to **string** |  | [optional] 
**Quantity** | Pointer to **float64** |  | [optional] 
**SpiAccountNumber** | Pointer to **string** |  | [optional] 
**SpiQrCodeId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Status** | Pointer to **string** | Current status of the resource | [optional] 
**SubscriptionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**SuccessUrl** | Pointer to **string** | URL/URI | [optional] 
**Title** | Pointer to **string** |  | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 

## Methods

### NewCheckoutSessions

`func NewCheckoutSessions() *CheckoutSessions`

NewCheckoutSessions instantiates a new CheckoutSessions object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCheckoutSessionsWithDefaults

`func NewCheckoutSessionsWithDefaults() *CheckoutSessions`

NewCheckoutSessionsWithDefaults instantiates a new CheckoutSessions object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAllowCouponCode

`func (o *CheckoutSessions) GetAllowCouponCode() bool`

GetAllowCouponCode returns the AllowCouponCode field if non-nil, zero value otherwise.

### GetAllowCouponCodeOk

`func (o *CheckoutSessions) GetAllowCouponCodeOk() (*bool, bool)`

GetAllowCouponCodeOk returns a tuple with the AllowCouponCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowCouponCode

`func (o *CheckoutSessions) SetAllowCouponCode(v bool)`

SetAllowCouponCode sets AllowCouponCode field to given value.

### HasAllowCouponCode

`func (o *CheckoutSessions) HasAllowCouponCode() bool`

HasAllowCouponCode returns a boolean if a field has been set.

### GetAllowQuantity

`func (o *CheckoutSessions) GetAllowQuantity() bool`

GetAllowQuantity returns the AllowQuantity field if non-nil, zero value otherwise.

### GetAllowQuantityOk

`func (o *CheckoutSessions) GetAllowQuantityOk() (*bool, bool)`

GetAllowQuantityOk returns a tuple with the AllowQuantity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowQuantity

`func (o *CheckoutSessions) SetAllowQuantity(v bool)`

SetAllowQuantity sets AllowQuantity field to given value.

### HasAllowQuantity

`func (o *CheckoutSessions) HasAllowQuantity() bool`

HasAllowQuantity returns a boolean if a field has been set.

### GetAllowedProviders

`func (o *CheckoutSessions) GetAllowedProviders() string`

GetAllowedProviders returns the AllowedProviders field if non-nil, zero value otherwise.

### GetAllowedProvidersOk

`func (o *CheckoutSessions) GetAllowedProvidersOk() (*string, bool)`

GetAllowedProvidersOk returns a tuple with the AllowedProviders field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowedProviders

`func (o *CheckoutSessions) SetAllowedProviders(v string)`

SetAllowedProviders sets AllowedProviders field to given value.

### HasAllowedProviders

`func (o *CheckoutSessions) HasAllowedProviders() bool`

HasAllowedProviders returns a boolean if a field has been set.

### GetAmount

`func (o *CheckoutSessions) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *CheckoutSessions) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *CheckoutSessions) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *CheckoutSessions) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCancelUrl

`func (o *CheckoutSessions) GetCancelUrl() string`

GetCancelUrl returns the CancelUrl field if non-nil, zero value otherwise.

### GetCancelUrlOk

`func (o *CheckoutSessions) GetCancelUrlOk() (*string, bool)`

GetCancelUrlOk returns a tuple with the CancelUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCancelUrl

`func (o *CheckoutSessions) SetCancelUrl(v string)`

SetCancelUrl sets CancelUrl field to given value.

### HasCancelUrl

`func (o *CheckoutSessions) HasCancelUrl() bool`

HasCancelUrl returns a boolean if a field has been set.

### GetCheckoutSessionId

`func (o *CheckoutSessions) GetCheckoutSessionId() string`

GetCheckoutSessionId returns the CheckoutSessionId field if non-nil, zero value otherwise.

### GetCheckoutSessionIdOk

`func (o *CheckoutSessions) GetCheckoutSessionIdOk() (*string, bool)`

GetCheckoutSessionIdOk returns a tuple with the CheckoutSessionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCheckoutSessionId

`func (o *CheckoutSessions) SetCheckoutSessionId(v string)`

SetCheckoutSessionId sets CheckoutSessionId field to given value.

### HasCheckoutSessionId

`func (o *CheckoutSessions) HasCheckoutSessionId() bool`

HasCheckoutSessionId returns a boolean if a field has been set.

### GetCreatedAt

`func (o *CheckoutSessions) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *CheckoutSessions) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *CheckoutSessions) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *CheckoutSessions) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetCreatedBy

`func (o *CheckoutSessions) GetCreatedBy() string`

GetCreatedBy returns the CreatedBy field if non-nil, zero value otherwise.

### GetCreatedByOk

`func (o *CheckoutSessions) GetCreatedByOk() (*string, bool)`

GetCreatedByOk returns a tuple with the CreatedBy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedBy

`func (o *CheckoutSessions) SetCreatedBy(v string)`

SetCreatedBy sets CreatedBy field to given value.

### HasCreatedBy

`func (o *CheckoutSessions) HasCreatedBy() bool`

HasCreatedBy returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *CheckoutSessions) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *CheckoutSessions) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *CheckoutSessions) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *CheckoutSessions) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetCustomerEmail

`func (o *CheckoutSessions) GetCustomerEmail() string`

GetCustomerEmail returns the CustomerEmail field if non-nil, zero value otherwise.

### GetCustomerEmailOk

`func (o *CheckoutSessions) GetCustomerEmailOk() (*string, bool)`

GetCustomerEmailOk returns a tuple with the CustomerEmail field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerEmail

`func (o *CheckoutSessions) SetCustomerEmail(v string)`

SetCustomerEmail sets CustomerEmail field to given value.

### HasCustomerEmail

`func (o *CheckoutSessions) HasCustomerEmail() bool`

HasCustomerEmail returns a boolean if a field has been set.

### GetCustomerId

`func (o *CheckoutSessions) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *CheckoutSessions) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *CheckoutSessions) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *CheckoutSessions) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetCustomerName

`func (o *CheckoutSessions) GetCustomerName() string`

GetCustomerName returns the CustomerName field if non-nil, zero value otherwise.

### GetCustomerNameOk

`func (o *CheckoutSessions) GetCustomerNameOk() (*string, bool)`

GetCustomerNameOk returns a tuple with the CustomerName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerName

`func (o *CheckoutSessions) SetCustomerName(v string)`

SetCustomerName sets CustomerName field to given value.

### HasCustomerName

`func (o *CheckoutSessions) HasCustomerName() bool`

HasCustomerName returns a boolean if a field has been set.

### GetCustomerPhone

`func (o *CheckoutSessions) GetCustomerPhone() string`

GetCustomerPhone returns the CustomerPhone field if non-nil, zero value otherwise.

### GetCustomerPhoneOk

`func (o *CheckoutSessions) GetCustomerPhoneOk() (*string, bool)`

GetCustomerPhoneOk returns a tuple with the CustomerPhone field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerPhone

`func (o *CheckoutSessions) SetCustomerPhone(v string)`

SetCustomerPhone sets CustomerPhone field to given value.

### HasCustomerPhone

`func (o *CheckoutSessions) HasCustomerPhone() bool`

HasCustomerPhone returns a boolean if a field has been set.

### GetEnvironment

`func (o *CheckoutSessions) GetEnvironment() string`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *CheckoutSessions) GetEnvironmentOk() (*string, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *CheckoutSessions) SetEnvironment(v string)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *CheckoutSessions) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetExpiresAt

`func (o *CheckoutSessions) GetExpiresAt() time.Time`

GetExpiresAt returns the ExpiresAt field if non-nil, zero value otherwise.

### GetExpiresAtOk

`func (o *CheckoutSessions) GetExpiresAtOk() (*time.Time, bool)`

GetExpiresAtOk returns a tuple with the ExpiresAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiresAt

`func (o *CheckoutSessions) SetExpiresAt(v time.Time)`

SetExpiresAt sets ExpiresAt field to given value.

### HasExpiresAt

`func (o *CheckoutSessions) HasExpiresAt() bool`

HasExpiresAt returns a boolean if a field has been set.

### GetInstallmentPlanId

`func (o *CheckoutSessions) GetInstallmentPlanId() string`

GetInstallmentPlanId returns the InstallmentPlanId field if non-nil, zero value otherwise.

### GetInstallmentPlanIdOk

`func (o *CheckoutSessions) GetInstallmentPlanIdOk() (*string, bool)`

GetInstallmentPlanIdOk returns a tuple with the InstallmentPlanId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInstallmentPlanId

`func (o *CheckoutSessions) SetInstallmentPlanId(v string)`

SetInstallmentPlanId sets InstallmentPlanId field to given value.

### HasInstallmentPlanId

`func (o *CheckoutSessions) HasInstallmentPlanId() bool`

HasInstallmentPlanId returns a boolean if a field has been set.

### GetIsPos

`func (o *CheckoutSessions) GetIsPos() bool`

GetIsPos returns the IsPos field if non-nil, zero value otherwise.

### GetIsPosOk

`func (o *CheckoutSessions) GetIsPosOk() (*bool, bool)`

GetIsPosOk returns a tuple with the IsPos field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsPos

`func (o *CheckoutSessions) SetIsPos(v bool)`

SetIsPos sets IsPos field to given value.

### HasIsPos

`func (o *CheckoutSessions) HasIsPos() bool`

HasIsPos returns a boolean if a field has been set.

### GetIsSpi

`func (o *CheckoutSessions) GetIsSpi() bool`

GetIsSpi returns the IsSpi field if non-nil, zero value otherwise.

### GetIsSpiOk

`func (o *CheckoutSessions) GetIsSpiOk() (*bool, bool)`

GetIsSpiOk returns a tuple with the IsSpi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsSpi

`func (o *CheckoutSessions) SetIsSpi(v bool)`

SetIsSpi sets IsSpi field to given value.

### HasIsSpi

`func (o *CheckoutSessions) HasIsSpi() bool`

HasIsSpi returns a boolean if a field has been set.

### GetMetadata

`func (o *CheckoutSessions) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *CheckoutSessions) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *CheckoutSessions) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *CheckoutSessions) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetOrganizationId

`func (o *CheckoutSessions) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *CheckoutSessions) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *CheckoutSessions) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *CheckoutSessions) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetPaymentLinkId

`func (o *CheckoutSessions) GetPaymentLinkId() string`

GetPaymentLinkId returns the PaymentLinkId field if non-nil, zero value otherwise.

### GetPaymentLinkIdOk

`func (o *CheckoutSessions) GetPaymentLinkIdOk() (*string, bool)`

GetPaymentLinkIdOk returns a tuple with the PaymentLinkId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentLinkId

`func (o *CheckoutSessions) SetPaymentLinkId(v string)`

SetPaymentLinkId sets PaymentLinkId field to given value.

### HasPaymentLinkId

`func (o *CheckoutSessions) HasPaymentLinkId() bool`

HasPaymentLinkId returns a boolean if a field has been set.

### GetPaymentRequestId

`func (o *CheckoutSessions) GetPaymentRequestId() string`

GetPaymentRequestId returns the PaymentRequestId field if non-nil, zero value otherwise.

### GetPaymentRequestIdOk

`func (o *CheckoutSessions) GetPaymentRequestIdOk() (*string, bool)`

GetPaymentRequestIdOk returns a tuple with the PaymentRequestId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentRequestId

`func (o *CheckoutSessions) SetPaymentRequestId(v string)`

SetPaymentRequestId sets PaymentRequestId field to given value.

### HasPaymentRequestId

`func (o *CheckoutSessions) HasPaymentRequestId() bool`

HasPaymentRequestId returns a boolean if a field has been set.

### GetPriceId

`func (o *CheckoutSessions) GetPriceId() string`

GetPriceId returns the PriceId field if non-nil, zero value otherwise.

### GetPriceIdOk

`func (o *CheckoutSessions) GetPriceIdOk() (*string, bool)`

GetPriceIdOk returns a tuple with the PriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriceId

`func (o *CheckoutSessions) SetPriceId(v string)`

SetPriceId sets PriceId field to given value.

### HasPriceId

`func (o *CheckoutSessions) HasPriceId() bool`

HasPriceId returns a boolean if a field has been set.

### GetProductId

`func (o *CheckoutSessions) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *CheckoutSessions) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *CheckoutSessions) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *CheckoutSessions) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetPublicDescription

`func (o *CheckoutSessions) GetPublicDescription() string`

GetPublicDescription returns the PublicDescription field if non-nil, zero value otherwise.

### GetPublicDescriptionOk

`func (o *CheckoutSessions) GetPublicDescriptionOk() (*string, bool)`

GetPublicDescriptionOk returns a tuple with the PublicDescription field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPublicDescription

`func (o *CheckoutSessions) SetPublicDescription(v string)`

SetPublicDescription sets PublicDescription field to given value.

### HasPublicDescription

`func (o *CheckoutSessions) HasPublicDescription() bool`

HasPublicDescription returns a boolean if a field has been set.

### GetQrCodeData

`func (o *CheckoutSessions) GetQrCodeData() map[string]interface{}`

GetQrCodeData returns the QrCodeData field if non-nil, zero value otherwise.

### GetQrCodeDataOk

`func (o *CheckoutSessions) GetQrCodeDataOk() (*map[string]interface{}, bool)`

GetQrCodeDataOk returns a tuple with the QrCodeData field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQrCodeData

`func (o *CheckoutSessions) SetQrCodeData(v map[string]interface{})`

SetQrCodeData sets QrCodeData field to given value.

### HasQrCodeData

`func (o *CheckoutSessions) HasQrCodeData() bool`

HasQrCodeData returns a boolean if a field has been set.

### GetQrCodeType

`func (o *CheckoutSessions) GetQrCodeType() string`

GetQrCodeType returns the QrCodeType field if non-nil, zero value otherwise.

### GetQrCodeTypeOk

`func (o *CheckoutSessions) GetQrCodeTypeOk() (*string, bool)`

GetQrCodeTypeOk returns a tuple with the QrCodeType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQrCodeType

`func (o *CheckoutSessions) SetQrCodeType(v string)`

SetQrCodeType sets QrCodeType field to given value.

### HasQrCodeType

`func (o *CheckoutSessions) HasQrCodeType() bool`

HasQrCodeType returns a boolean if a field has been set.

### GetQuantity

`func (o *CheckoutSessions) GetQuantity() float64`

GetQuantity returns the Quantity field if non-nil, zero value otherwise.

### GetQuantityOk

`func (o *CheckoutSessions) GetQuantityOk() (*float64, bool)`

GetQuantityOk returns a tuple with the Quantity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQuantity

`func (o *CheckoutSessions) SetQuantity(v float64)`

SetQuantity sets Quantity field to given value.

### HasQuantity

`func (o *CheckoutSessions) HasQuantity() bool`

HasQuantity returns a boolean if a field has been set.

### GetSpiAccountNumber

`func (o *CheckoutSessions) GetSpiAccountNumber() string`

GetSpiAccountNumber returns the SpiAccountNumber field if non-nil, zero value otherwise.

### GetSpiAccountNumberOk

`func (o *CheckoutSessions) GetSpiAccountNumberOk() (*string, bool)`

GetSpiAccountNumberOk returns a tuple with the SpiAccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAccountNumber

`func (o *CheckoutSessions) SetSpiAccountNumber(v string)`

SetSpiAccountNumber sets SpiAccountNumber field to given value.

### HasSpiAccountNumber

`func (o *CheckoutSessions) HasSpiAccountNumber() bool`

HasSpiAccountNumber returns a boolean if a field has been set.

### GetSpiQrCodeId

`func (o *CheckoutSessions) GetSpiQrCodeId() string`

GetSpiQrCodeId returns the SpiQrCodeId field if non-nil, zero value otherwise.

### GetSpiQrCodeIdOk

`func (o *CheckoutSessions) GetSpiQrCodeIdOk() (*string, bool)`

GetSpiQrCodeIdOk returns a tuple with the SpiQrCodeId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiQrCodeId

`func (o *CheckoutSessions) SetSpiQrCodeId(v string)`

SetSpiQrCodeId sets SpiQrCodeId field to given value.

### HasSpiQrCodeId

`func (o *CheckoutSessions) HasSpiQrCodeId() bool`

HasSpiQrCodeId returns a boolean if a field has been set.

### GetStatus

`func (o *CheckoutSessions) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *CheckoutSessions) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *CheckoutSessions) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *CheckoutSessions) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetSubscriptionId

`func (o *CheckoutSessions) GetSubscriptionId() string`

GetSubscriptionId returns the SubscriptionId field if non-nil, zero value otherwise.

### GetSubscriptionIdOk

`func (o *CheckoutSessions) GetSubscriptionIdOk() (*string, bool)`

GetSubscriptionIdOk returns a tuple with the SubscriptionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubscriptionId

`func (o *CheckoutSessions) SetSubscriptionId(v string)`

SetSubscriptionId sets SubscriptionId field to given value.

### HasSubscriptionId

`func (o *CheckoutSessions) HasSubscriptionId() bool`

HasSubscriptionId returns a boolean if a field has been set.

### GetSuccessUrl

`func (o *CheckoutSessions) GetSuccessUrl() string`

GetSuccessUrl returns the SuccessUrl field if non-nil, zero value otherwise.

### GetSuccessUrlOk

`func (o *CheckoutSessions) GetSuccessUrlOk() (*string, bool)`

GetSuccessUrlOk returns a tuple with the SuccessUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccessUrl

`func (o *CheckoutSessions) SetSuccessUrl(v string)`

SetSuccessUrl sets SuccessUrl field to given value.

### HasSuccessUrl

`func (o *CheckoutSessions) HasSuccessUrl() bool`

HasSuccessUrl returns a boolean if a field has been set.

### GetTitle

`func (o *CheckoutSessions) GetTitle() string`

GetTitle returns the Title field if non-nil, zero value otherwise.

### GetTitleOk

`func (o *CheckoutSessions) GetTitleOk() (*string, bool)`

GetTitleOk returns a tuple with the Title field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTitle

`func (o *CheckoutSessions) SetTitle(v string)`

SetTitle sets Title field to given value.

### HasTitle

`func (o *CheckoutSessions) HasTitle() bool`

HasTitle returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *CheckoutSessions) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *CheckoutSessions) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *CheckoutSessions) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *CheckoutSessions) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


