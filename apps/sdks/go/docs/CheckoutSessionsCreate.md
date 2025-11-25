# CheckoutSessionsCreate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AllowCouponCode** | Pointer to **bool** |  | [optional] 
**AllowQuantity** | Pointer to **bool** |  | [optional] 
**AllowedProviders** | Pointer to **string** |  | [optional] 
**Amount** | Pointer to **float64** | Amount in the smallest currency unit (e.g., cents for USD, same for XOF) | [optional] 
**CancelUrl** | Pointer to **string** | URL/URI | [optional] 
**CheckoutSessionId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**CurrencyCode** | Pointer to **string** | Three-letter ISO currency code (e.g., XOF, USD, EUR) | [optional] 
**CustomerEmail** | Pointer to **string** | Email address | [optional] 
**CustomerId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**CustomerName** | Pointer to **string** |  | [optional] 
**CustomerPhone** | Pointer to **string** |  | [optional] 
**ExpiresAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] 
**InstallmentPlanId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**IsPos** | Pointer to **bool** |  | [optional] 
**IsSpi** | Pointer to **bool** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
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

## Methods

### NewCheckoutSessionsCreate

`func NewCheckoutSessionsCreate() *CheckoutSessionsCreate`

NewCheckoutSessionsCreate instantiates a new CheckoutSessionsCreate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCheckoutSessionsCreateWithDefaults

`func NewCheckoutSessionsCreateWithDefaults() *CheckoutSessionsCreate`

NewCheckoutSessionsCreateWithDefaults instantiates a new CheckoutSessionsCreate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAllowCouponCode

`func (o *CheckoutSessionsCreate) GetAllowCouponCode() bool`

GetAllowCouponCode returns the AllowCouponCode field if non-nil, zero value otherwise.

### GetAllowCouponCodeOk

`func (o *CheckoutSessionsCreate) GetAllowCouponCodeOk() (*bool, bool)`

GetAllowCouponCodeOk returns a tuple with the AllowCouponCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowCouponCode

`func (o *CheckoutSessionsCreate) SetAllowCouponCode(v bool)`

SetAllowCouponCode sets AllowCouponCode field to given value.

### HasAllowCouponCode

`func (o *CheckoutSessionsCreate) HasAllowCouponCode() bool`

HasAllowCouponCode returns a boolean if a field has been set.

### GetAllowQuantity

`func (o *CheckoutSessionsCreate) GetAllowQuantity() bool`

GetAllowQuantity returns the AllowQuantity field if non-nil, zero value otherwise.

### GetAllowQuantityOk

`func (o *CheckoutSessionsCreate) GetAllowQuantityOk() (*bool, bool)`

GetAllowQuantityOk returns a tuple with the AllowQuantity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowQuantity

`func (o *CheckoutSessionsCreate) SetAllowQuantity(v bool)`

SetAllowQuantity sets AllowQuantity field to given value.

### HasAllowQuantity

`func (o *CheckoutSessionsCreate) HasAllowQuantity() bool`

HasAllowQuantity returns a boolean if a field has been set.

### GetAllowedProviders

`func (o *CheckoutSessionsCreate) GetAllowedProviders() string`

GetAllowedProviders returns the AllowedProviders field if non-nil, zero value otherwise.

### GetAllowedProvidersOk

`func (o *CheckoutSessionsCreate) GetAllowedProvidersOk() (*string, bool)`

GetAllowedProvidersOk returns a tuple with the AllowedProviders field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowedProviders

`func (o *CheckoutSessionsCreate) SetAllowedProviders(v string)`

SetAllowedProviders sets AllowedProviders field to given value.

### HasAllowedProviders

`func (o *CheckoutSessionsCreate) HasAllowedProviders() bool`

HasAllowedProviders returns a boolean if a field has been set.

### GetAmount

`func (o *CheckoutSessionsCreate) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *CheckoutSessionsCreate) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *CheckoutSessionsCreate) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *CheckoutSessionsCreate) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCancelUrl

`func (o *CheckoutSessionsCreate) GetCancelUrl() string`

GetCancelUrl returns the CancelUrl field if non-nil, zero value otherwise.

### GetCancelUrlOk

`func (o *CheckoutSessionsCreate) GetCancelUrlOk() (*string, bool)`

GetCancelUrlOk returns a tuple with the CancelUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCancelUrl

`func (o *CheckoutSessionsCreate) SetCancelUrl(v string)`

SetCancelUrl sets CancelUrl field to given value.

### HasCancelUrl

`func (o *CheckoutSessionsCreate) HasCancelUrl() bool`

HasCancelUrl returns a boolean if a field has been set.

### GetCheckoutSessionId

`func (o *CheckoutSessionsCreate) GetCheckoutSessionId() string`

GetCheckoutSessionId returns the CheckoutSessionId field if non-nil, zero value otherwise.

### GetCheckoutSessionIdOk

`func (o *CheckoutSessionsCreate) GetCheckoutSessionIdOk() (*string, bool)`

GetCheckoutSessionIdOk returns a tuple with the CheckoutSessionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCheckoutSessionId

`func (o *CheckoutSessionsCreate) SetCheckoutSessionId(v string)`

SetCheckoutSessionId sets CheckoutSessionId field to given value.

### HasCheckoutSessionId

`func (o *CheckoutSessionsCreate) HasCheckoutSessionId() bool`

HasCheckoutSessionId returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *CheckoutSessionsCreate) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *CheckoutSessionsCreate) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *CheckoutSessionsCreate) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *CheckoutSessionsCreate) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetCustomerEmail

`func (o *CheckoutSessionsCreate) GetCustomerEmail() string`

GetCustomerEmail returns the CustomerEmail field if non-nil, zero value otherwise.

### GetCustomerEmailOk

`func (o *CheckoutSessionsCreate) GetCustomerEmailOk() (*string, bool)`

GetCustomerEmailOk returns a tuple with the CustomerEmail field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerEmail

`func (o *CheckoutSessionsCreate) SetCustomerEmail(v string)`

SetCustomerEmail sets CustomerEmail field to given value.

### HasCustomerEmail

`func (o *CheckoutSessionsCreate) HasCustomerEmail() bool`

HasCustomerEmail returns a boolean if a field has been set.

### GetCustomerId

`func (o *CheckoutSessionsCreate) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *CheckoutSessionsCreate) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *CheckoutSessionsCreate) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *CheckoutSessionsCreate) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetCustomerName

`func (o *CheckoutSessionsCreate) GetCustomerName() string`

GetCustomerName returns the CustomerName field if non-nil, zero value otherwise.

### GetCustomerNameOk

`func (o *CheckoutSessionsCreate) GetCustomerNameOk() (*string, bool)`

GetCustomerNameOk returns a tuple with the CustomerName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerName

`func (o *CheckoutSessionsCreate) SetCustomerName(v string)`

SetCustomerName sets CustomerName field to given value.

### HasCustomerName

`func (o *CheckoutSessionsCreate) HasCustomerName() bool`

HasCustomerName returns a boolean if a field has been set.

### GetCustomerPhone

`func (o *CheckoutSessionsCreate) GetCustomerPhone() string`

GetCustomerPhone returns the CustomerPhone field if non-nil, zero value otherwise.

### GetCustomerPhoneOk

`func (o *CheckoutSessionsCreate) GetCustomerPhoneOk() (*string, bool)`

GetCustomerPhoneOk returns a tuple with the CustomerPhone field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerPhone

`func (o *CheckoutSessionsCreate) SetCustomerPhone(v string)`

SetCustomerPhone sets CustomerPhone field to given value.

### HasCustomerPhone

`func (o *CheckoutSessionsCreate) HasCustomerPhone() bool`

HasCustomerPhone returns a boolean if a field has been set.

### GetExpiresAt

`func (o *CheckoutSessionsCreate) GetExpiresAt() time.Time`

GetExpiresAt returns the ExpiresAt field if non-nil, zero value otherwise.

### GetExpiresAtOk

`func (o *CheckoutSessionsCreate) GetExpiresAtOk() (*time.Time, bool)`

GetExpiresAtOk returns a tuple with the ExpiresAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiresAt

`func (o *CheckoutSessionsCreate) SetExpiresAt(v time.Time)`

SetExpiresAt sets ExpiresAt field to given value.

### HasExpiresAt

`func (o *CheckoutSessionsCreate) HasExpiresAt() bool`

HasExpiresAt returns a boolean if a field has been set.

### GetInstallmentPlanId

`func (o *CheckoutSessionsCreate) GetInstallmentPlanId() string`

GetInstallmentPlanId returns the InstallmentPlanId field if non-nil, zero value otherwise.

### GetInstallmentPlanIdOk

`func (o *CheckoutSessionsCreate) GetInstallmentPlanIdOk() (*string, bool)`

GetInstallmentPlanIdOk returns a tuple with the InstallmentPlanId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInstallmentPlanId

`func (o *CheckoutSessionsCreate) SetInstallmentPlanId(v string)`

SetInstallmentPlanId sets InstallmentPlanId field to given value.

### HasInstallmentPlanId

`func (o *CheckoutSessionsCreate) HasInstallmentPlanId() bool`

HasInstallmentPlanId returns a boolean if a field has been set.

### GetIsPos

`func (o *CheckoutSessionsCreate) GetIsPos() bool`

GetIsPos returns the IsPos field if non-nil, zero value otherwise.

### GetIsPosOk

`func (o *CheckoutSessionsCreate) GetIsPosOk() (*bool, bool)`

GetIsPosOk returns a tuple with the IsPos field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsPos

`func (o *CheckoutSessionsCreate) SetIsPos(v bool)`

SetIsPos sets IsPos field to given value.

### HasIsPos

`func (o *CheckoutSessionsCreate) HasIsPos() bool`

HasIsPos returns a boolean if a field has been set.

### GetIsSpi

`func (o *CheckoutSessionsCreate) GetIsSpi() bool`

GetIsSpi returns the IsSpi field if non-nil, zero value otherwise.

### GetIsSpiOk

`func (o *CheckoutSessionsCreate) GetIsSpiOk() (*bool, bool)`

GetIsSpiOk returns a tuple with the IsSpi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsSpi

`func (o *CheckoutSessionsCreate) SetIsSpi(v bool)`

SetIsSpi sets IsSpi field to given value.

### HasIsSpi

`func (o *CheckoutSessionsCreate) HasIsSpi() bool`

HasIsSpi returns a boolean if a field has been set.

### GetMetadata

`func (o *CheckoutSessionsCreate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *CheckoutSessionsCreate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *CheckoutSessionsCreate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *CheckoutSessionsCreate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetPaymentLinkId

`func (o *CheckoutSessionsCreate) GetPaymentLinkId() string`

GetPaymentLinkId returns the PaymentLinkId field if non-nil, zero value otherwise.

### GetPaymentLinkIdOk

`func (o *CheckoutSessionsCreate) GetPaymentLinkIdOk() (*string, bool)`

GetPaymentLinkIdOk returns a tuple with the PaymentLinkId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentLinkId

`func (o *CheckoutSessionsCreate) SetPaymentLinkId(v string)`

SetPaymentLinkId sets PaymentLinkId field to given value.

### HasPaymentLinkId

`func (o *CheckoutSessionsCreate) HasPaymentLinkId() bool`

HasPaymentLinkId returns a boolean if a field has been set.

### GetPaymentRequestId

`func (o *CheckoutSessionsCreate) GetPaymentRequestId() string`

GetPaymentRequestId returns the PaymentRequestId field if non-nil, zero value otherwise.

### GetPaymentRequestIdOk

`func (o *CheckoutSessionsCreate) GetPaymentRequestIdOk() (*string, bool)`

GetPaymentRequestIdOk returns a tuple with the PaymentRequestId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentRequestId

`func (o *CheckoutSessionsCreate) SetPaymentRequestId(v string)`

SetPaymentRequestId sets PaymentRequestId field to given value.

### HasPaymentRequestId

`func (o *CheckoutSessionsCreate) HasPaymentRequestId() bool`

HasPaymentRequestId returns a boolean if a field has been set.

### GetPriceId

`func (o *CheckoutSessionsCreate) GetPriceId() string`

GetPriceId returns the PriceId field if non-nil, zero value otherwise.

### GetPriceIdOk

`func (o *CheckoutSessionsCreate) GetPriceIdOk() (*string, bool)`

GetPriceIdOk returns a tuple with the PriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriceId

`func (o *CheckoutSessionsCreate) SetPriceId(v string)`

SetPriceId sets PriceId field to given value.

### HasPriceId

`func (o *CheckoutSessionsCreate) HasPriceId() bool`

HasPriceId returns a boolean if a field has been set.

### GetProductId

`func (o *CheckoutSessionsCreate) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *CheckoutSessionsCreate) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *CheckoutSessionsCreate) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *CheckoutSessionsCreate) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetPublicDescription

`func (o *CheckoutSessionsCreate) GetPublicDescription() string`

GetPublicDescription returns the PublicDescription field if non-nil, zero value otherwise.

### GetPublicDescriptionOk

`func (o *CheckoutSessionsCreate) GetPublicDescriptionOk() (*string, bool)`

GetPublicDescriptionOk returns a tuple with the PublicDescription field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPublicDescription

`func (o *CheckoutSessionsCreate) SetPublicDescription(v string)`

SetPublicDescription sets PublicDescription field to given value.

### HasPublicDescription

`func (o *CheckoutSessionsCreate) HasPublicDescription() bool`

HasPublicDescription returns a boolean if a field has been set.

### GetQrCodeData

`func (o *CheckoutSessionsCreate) GetQrCodeData() map[string]interface{}`

GetQrCodeData returns the QrCodeData field if non-nil, zero value otherwise.

### GetQrCodeDataOk

`func (o *CheckoutSessionsCreate) GetQrCodeDataOk() (*map[string]interface{}, bool)`

GetQrCodeDataOk returns a tuple with the QrCodeData field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQrCodeData

`func (o *CheckoutSessionsCreate) SetQrCodeData(v map[string]interface{})`

SetQrCodeData sets QrCodeData field to given value.

### HasQrCodeData

`func (o *CheckoutSessionsCreate) HasQrCodeData() bool`

HasQrCodeData returns a boolean if a field has been set.

### GetQrCodeType

`func (o *CheckoutSessionsCreate) GetQrCodeType() string`

GetQrCodeType returns the QrCodeType field if non-nil, zero value otherwise.

### GetQrCodeTypeOk

`func (o *CheckoutSessionsCreate) GetQrCodeTypeOk() (*string, bool)`

GetQrCodeTypeOk returns a tuple with the QrCodeType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQrCodeType

`func (o *CheckoutSessionsCreate) SetQrCodeType(v string)`

SetQrCodeType sets QrCodeType field to given value.

### HasQrCodeType

`func (o *CheckoutSessionsCreate) HasQrCodeType() bool`

HasQrCodeType returns a boolean if a field has been set.

### GetQuantity

`func (o *CheckoutSessionsCreate) GetQuantity() float64`

GetQuantity returns the Quantity field if non-nil, zero value otherwise.

### GetQuantityOk

`func (o *CheckoutSessionsCreate) GetQuantityOk() (*float64, bool)`

GetQuantityOk returns a tuple with the Quantity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQuantity

`func (o *CheckoutSessionsCreate) SetQuantity(v float64)`

SetQuantity sets Quantity field to given value.

### HasQuantity

`func (o *CheckoutSessionsCreate) HasQuantity() bool`

HasQuantity returns a boolean if a field has been set.

### GetSpiAccountNumber

`func (o *CheckoutSessionsCreate) GetSpiAccountNumber() string`

GetSpiAccountNumber returns the SpiAccountNumber field if non-nil, zero value otherwise.

### GetSpiAccountNumberOk

`func (o *CheckoutSessionsCreate) GetSpiAccountNumberOk() (*string, bool)`

GetSpiAccountNumberOk returns a tuple with the SpiAccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAccountNumber

`func (o *CheckoutSessionsCreate) SetSpiAccountNumber(v string)`

SetSpiAccountNumber sets SpiAccountNumber field to given value.

### HasSpiAccountNumber

`func (o *CheckoutSessionsCreate) HasSpiAccountNumber() bool`

HasSpiAccountNumber returns a boolean if a field has been set.

### GetSpiQrCodeId

`func (o *CheckoutSessionsCreate) GetSpiQrCodeId() string`

GetSpiQrCodeId returns the SpiQrCodeId field if non-nil, zero value otherwise.

### GetSpiQrCodeIdOk

`func (o *CheckoutSessionsCreate) GetSpiQrCodeIdOk() (*string, bool)`

GetSpiQrCodeIdOk returns a tuple with the SpiQrCodeId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiQrCodeId

`func (o *CheckoutSessionsCreate) SetSpiQrCodeId(v string)`

SetSpiQrCodeId sets SpiQrCodeId field to given value.

### HasSpiQrCodeId

`func (o *CheckoutSessionsCreate) HasSpiQrCodeId() bool`

HasSpiQrCodeId returns a boolean if a field has been set.

### GetStatus

`func (o *CheckoutSessionsCreate) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *CheckoutSessionsCreate) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *CheckoutSessionsCreate) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *CheckoutSessionsCreate) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetSubscriptionId

`func (o *CheckoutSessionsCreate) GetSubscriptionId() string`

GetSubscriptionId returns the SubscriptionId field if non-nil, zero value otherwise.

### GetSubscriptionIdOk

`func (o *CheckoutSessionsCreate) GetSubscriptionIdOk() (*string, bool)`

GetSubscriptionIdOk returns a tuple with the SubscriptionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubscriptionId

`func (o *CheckoutSessionsCreate) SetSubscriptionId(v string)`

SetSubscriptionId sets SubscriptionId field to given value.

### HasSubscriptionId

`func (o *CheckoutSessionsCreate) HasSubscriptionId() bool`

HasSubscriptionId returns a boolean if a field has been set.

### GetSuccessUrl

`func (o *CheckoutSessionsCreate) GetSuccessUrl() string`

GetSuccessUrl returns the SuccessUrl field if non-nil, zero value otherwise.

### GetSuccessUrlOk

`func (o *CheckoutSessionsCreate) GetSuccessUrlOk() (*string, bool)`

GetSuccessUrlOk returns a tuple with the SuccessUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccessUrl

`func (o *CheckoutSessionsCreate) SetSuccessUrl(v string)`

SetSuccessUrl sets SuccessUrl field to given value.

### HasSuccessUrl

`func (o *CheckoutSessionsCreate) HasSuccessUrl() bool`

HasSuccessUrl returns a boolean if a field has been set.

### GetTitle

`func (o *CheckoutSessionsCreate) GetTitle() string`

GetTitle returns the Title field if non-nil, zero value otherwise.

### GetTitleOk

`func (o *CheckoutSessionsCreate) GetTitleOk() (*string, bool)`

GetTitleOk returns a tuple with the Title field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTitle

`func (o *CheckoutSessionsCreate) SetTitle(v string)`

SetTitle sets Title field to given value.

### HasTitle

`func (o *CheckoutSessionsCreate) HasTitle() bool`

HasTitle returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


