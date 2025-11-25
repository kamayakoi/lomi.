# CheckoutSessionsUpdate

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

### NewCheckoutSessionsUpdate

`func NewCheckoutSessionsUpdate() *CheckoutSessionsUpdate`

NewCheckoutSessionsUpdate instantiates a new CheckoutSessionsUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCheckoutSessionsUpdateWithDefaults

`func NewCheckoutSessionsUpdateWithDefaults() *CheckoutSessionsUpdate`

NewCheckoutSessionsUpdateWithDefaults instantiates a new CheckoutSessionsUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAllowCouponCode

`func (o *CheckoutSessionsUpdate) GetAllowCouponCode() bool`

GetAllowCouponCode returns the AllowCouponCode field if non-nil, zero value otherwise.

### GetAllowCouponCodeOk

`func (o *CheckoutSessionsUpdate) GetAllowCouponCodeOk() (*bool, bool)`

GetAllowCouponCodeOk returns a tuple with the AllowCouponCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowCouponCode

`func (o *CheckoutSessionsUpdate) SetAllowCouponCode(v bool)`

SetAllowCouponCode sets AllowCouponCode field to given value.

### HasAllowCouponCode

`func (o *CheckoutSessionsUpdate) HasAllowCouponCode() bool`

HasAllowCouponCode returns a boolean if a field has been set.

### GetAllowQuantity

`func (o *CheckoutSessionsUpdate) GetAllowQuantity() bool`

GetAllowQuantity returns the AllowQuantity field if non-nil, zero value otherwise.

### GetAllowQuantityOk

`func (o *CheckoutSessionsUpdate) GetAllowQuantityOk() (*bool, bool)`

GetAllowQuantityOk returns a tuple with the AllowQuantity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowQuantity

`func (o *CheckoutSessionsUpdate) SetAllowQuantity(v bool)`

SetAllowQuantity sets AllowQuantity field to given value.

### HasAllowQuantity

`func (o *CheckoutSessionsUpdate) HasAllowQuantity() bool`

HasAllowQuantity returns a boolean if a field has been set.

### GetAllowedProviders

`func (o *CheckoutSessionsUpdate) GetAllowedProviders() string`

GetAllowedProviders returns the AllowedProviders field if non-nil, zero value otherwise.

### GetAllowedProvidersOk

`func (o *CheckoutSessionsUpdate) GetAllowedProvidersOk() (*string, bool)`

GetAllowedProvidersOk returns a tuple with the AllowedProviders field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAllowedProviders

`func (o *CheckoutSessionsUpdate) SetAllowedProviders(v string)`

SetAllowedProviders sets AllowedProviders field to given value.

### HasAllowedProviders

`func (o *CheckoutSessionsUpdate) HasAllowedProviders() bool`

HasAllowedProviders returns a boolean if a field has been set.

### GetAmount

`func (o *CheckoutSessionsUpdate) GetAmount() float64`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *CheckoutSessionsUpdate) GetAmountOk() (*float64, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *CheckoutSessionsUpdate) SetAmount(v float64)`

SetAmount sets Amount field to given value.

### HasAmount

`func (o *CheckoutSessionsUpdate) HasAmount() bool`

HasAmount returns a boolean if a field has been set.

### GetCancelUrl

`func (o *CheckoutSessionsUpdate) GetCancelUrl() string`

GetCancelUrl returns the CancelUrl field if non-nil, zero value otherwise.

### GetCancelUrlOk

`func (o *CheckoutSessionsUpdate) GetCancelUrlOk() (*string, bool)`

GetCancelUrlOk returns a tuple with the CancelUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCancelUrl

`func (o *CheckoutSessionsUpdate) SetCancelUrl(v string)`

SetCancelUrl sets CancelUrl field to given value.

### HasCancelUrl

`func (o *CheckoutSessionsUpdate) HasCancelUrl() bool`

HasCancelUrl returns a boolean if a field has been set.

### GetCheckoutSessionId

`func (o *CheckoutSessionsUpdate) GetCheckoutSessionId() string`

GetCheckoutSessionId returns the CheckoutSessionId field if non-nil, zero value otherwise.

### GetCheckoutSessionIdOk

`func (o *CheckoutSessionsUpdate) GetCheckoutSessionIdOk() (*string, bool)`

GetCheckoutSessionIdOk returns a tuple with the CheckoutSessionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCheckoutSessionId

`func (o *CheckoutSessionsUpdate) SetCheckoutSessionId(v string)`

SetCheckoutSessionId sets CheckoutSessionId field to given value.

### HasCheckoutSessionId

`func (o *CheckoutSessionsUpdate) HasCheckoutSessionId() bool`

HasCheckoutSessionId returns a boolean if a field has been set.

### GetCurrencyCode

`func (o *CheckoutSessionsUpdate) GetCurrencyCode() string`

GetCurrencyCode returns the CurrencyCode field if non-nil, zero value otherwise.

### GetCurrencyCodeOk

`func (o *CheckoutSessionsUpdate) GetCurrencyCodeOk() (*string, bool)`

GetCurrencyCodeOk returns a tuple with the CurrencyCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrencyCode

`func (o *CheckoutSessionsUpdate) SetCurrencyCode(v string)`

SetCurrencyCode sets CurrencyCode field to given value.

### HasCurrencyCode

`func (o *CheckoutSessionsUpdate) HasCurrencyCode() bool`

HasCurrencyCode returns a boolean if a field has been set.

### GetCustomerEmail

`func (o *CheckoutSessionsUpdate) GetCustomerEmail() string`

GetCustomerEmail returns the CustomerEmail field if non-nil, zero value otherwise.

### GetCustomerEmailOk

`func (o *CheckoutSessionsUpdate) GetCustomerEmailOk() (*string, bool)`

GetCustomerEmailOk returns a tuple with the CustomerEmail field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerEmail

`func (o *CheckoutSessionsUpdate) SetCustomerEmail(v string)`

SetCustomerEmail sets CustomerEmail field to given value.

### HasCustomerEmail

`func (o *CheckoutSessionsUpdate) HasCustomerEmail() bool`

HasCustomerEmail returns a boolean if a field has been set.

### GetCustomerId

`func (o *CheckoutSessionsUpdate) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *CheckoutSessionsUpdate) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *CheckoutSessionsUpdate) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *CheckoutSessionsUpdate) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetCustomerName

`func (o *CheckoutSessionsUpdate) GetCustomerName() string`

GetCustomerName returns the CustomerName field if non-nil, zero value otherwise.

### GetCustomerNameOk

`func (o *CheckoutSessionsUpdate) GetCustomerNameOk() (*string, bool)`

GetCustomerNameOk returns a tuple with the CustomerName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerName

`func (o *CheckoutSessionsUpdate) SetCustomerName(v string)`

SetCustomerName sets CustomerName field to given value.

### HasCustomerName

`func (o *CheckoutSessionsUpdate) HasCustomerName() bool`

HasCustomerName returns a boolean if a field has been set.

### GetCustomerPhone

`func (o *CheckoutSessionsUpdate) GetCustomerPhone() string`

GetCustomerPhone returns the CustomerPhone field if non-nil, zero value otherwise.

### GetCustomerPhoneOk

`func (o *CheckoutSessionsUpdate) GetCustomerPhoneOk() (*string, bool)`

GetCustomerPhoneOk returns a tuple with the CustomerPhone field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerPhone

`func (o *CheckoutSessionsUpdate) SetCustomerPhone(v string)`

SetCustomerPhone sets CustomerPhone field to given value.

### HasCustomerPhone

`func (o *CheckoutSessionsUpdate) HasCustomerPhone() bool`

HasCustomerPhone returns a boolean if a field has been set.

### GetExpiresAt

`func (o *CheckoutSessionsUpdate) GetExpiresAt() time.Time`

GetExpiresAt returns the ExpiresAt field if non-nil, zero value otherwise.

### GetExpiresAtOk

`func (o *CheckoutSessionsUpdate) GetExpiresAtOk() (*time.Time, bool)`

GetExpiresAtOk returns a tuple with the ExpiresAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiresAt

`func (o *CheckoutSessionsUpdate) SetExpiresAt(v time.Time)`

SetExpiresAt sets ExpiresAt field to given value.

### HasExpiresAt

`func (o *CheckoutSessionsUpdate) HasExpiresAt() bool`

HasExpiresAt returns a boolean if a field has been set.

### GetInstallmentPlanId

`func (o *CheckoutSessionsUpdate) GetInstallmentPlanId() string`

GetInstallmentPlanId returns the InstallmentPlanId field if non-nil, zero value otherwise.

### GetInstallmentPlanIdOk

`func (o *CheckoutSessionsUpdate) GetInstallmentPlanIdOk() (*string, bool)`

GetInstallmentPlanIdOk returns a tuple with the InstallmentPlanId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInstallmentPlanId

`func (o *CheckoutSessionsUpdate) SetInstallmentPlanId(v string)`

SetInstallmentPlanId sets InstallmentPlanId field to given value.

### HasInstallmentPlanId

`func (o *CheckoutSessionsUpdate) HasInstallmentPlanId() bool`

HasInstallmentPlanId returns a boolean if a field has been set.

### GetIsPos

`func (o *CheckoutSessionsUpdate) GetIsPos() bool`

GetIsPos returns the IsPos field if non-nil, zero value otherwise.

### GetIsPosOk

`func (o *CheckoutSessionsUpdate) GetIsPosOk() (*bool, bool)`

GetIsPosOk returns a tuple with the IsPos field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsPos

`func (o *CheckoutSessionsUpdate) SetIsPos(v bool)`

SetIsPos sets IsPos field to given value.

### HasIsPos

`func (o *CheckoutSessionsUpdate) HasIsPos() bool`

HasIsPos returns a boolean if a field has been set.

### GetIsSpi

`func (o *CheckoutSessionsUpdate) GetIsSpi() bool`

GetIsSpi returns the IsSpi field if non-nil, zero value otherwise.

### GetIsSpiOk

`func (o *CheckoutSessionsUpdate) GetIsSpiOk() (*bool, bool)`

GetIsSpiOk returns a tuple with the IsSpi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsSpi

`func (o *CheckoutSessionsUpdate) SetIsSpi(v bool)`

SetIsSpi sets IsSpi field to given value.

### HasIsSpi

`func (o *CheckoutSessionsUpdate) HasIsSpi() bool`

HasIsSpi returns a boolean if a field has been set.

### GetMetadata

`func (o *CheckoutSessionsUpdate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *CheckoutSessionsUpdate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *CheckoutSessionsUpdate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *CheckoutSessionsUpdate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetPaymentLinkId

`func (o *CheckoutSessionsUpdate) GetPaymentLinkId() string`

GetPaymentLinkId returns the PaymentLinkId field if non-nil, zero value otherwise.

### GetPaymentLinkIdOk

`func (o *CheckoutSessionsUpdate) GetPaymentLinkIdOk() (*string, bool)`

GetPaymentLinkIdOk returns a tuple with the PaymentLinkId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentLinkId

`func (o *CheckoutSessionsUpdate) SetPaymentLinkId(v string)`

SetPaymentLinkId sets PaymentLinkId field to given value.

### HasPaymentLinkId

`func (o *CheckoutSessionsUpdate) HasPaymentLinkId() bool`

HasPaymentLinkId returns a boolean if a field has been set.

### GetPaymentRequestId

`func (o *CheckoutSessionsUpdate) GetPaymentRequestId() string`

GetPaymentRequestId returns the PaymentRequestId field if non-nil, zero value otherwise.

### GetPaymentRequestIdOk

`func (o *CheckoutSessionsUpdate) GetPaymentRequestIdOk() (*string, bool)`

GetPaymentRequestIdOk returns a tuple with the PaymentRequestId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentRequestId

`func (o *CheckoutSessionsUpdate) SetPaymentRequestId(v string)`

SetPaymentRequestId sets PaymentRequestId field to given value.

### HasPaymentRequestId

`func (o *CheckoutSessionsUpdate) HasPaymentRequestId() bool`

HasPaymentRequestId returns a boolean if a field has been set.

### GetPriceId

`func (o *CheckoutSessionsUpdate) GetPriceId() string`

GetPriceId returns the PriceId field if non-nil, zero value otherwise.

### GetPriceIdOk

`func (o *CheckoutSessionsUpdate) GetPriceIdOk() (*string, bool)`

GetPriceIdOk returns a tuple with the PriceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriceId

`func (o *CheckoutSessionsUpdate) SetPriceId(v string)`

SetPriceId sets PriceId field to given value.

### HasPriceId

`func (o *CheckoutSessionsUpdate) HasPriceId() bool`

HasPriceId returns a boolean if a field has been set.

### GetProductId

`func (o *CheckoutSessionsUpdate) GetProductId() string`

GetProductId returns the ProductId field if non-nil, zero value otherwise.

### GetProductIdOk

`func (o *CheckoutSessionsUpdate) GetProductIdOk() (*string, bool)`

GetProductIdOk returns a tuple with the ProductId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProductId

`func (o *CheckoutSessionsUpdate) SetProductId(v string)`

SetProductId sets ProductId field to given value.

### HasProductId

`func (o *CheckoutSessionsUpdate) HasProductId() bool`

HasProductId returns a boolean if a field has been set.

### GetPublicDescription

`func (o *CheckoutSessionsUpdate) GetPublicDescription() string`

GetPublicDescription returns the PublicDescription field if non-nil, zero value otherwise.

### GetPublicDescriptionOk

`func (o *CheckoutSessionsUpdate) GetPublicDescriptionOk() (*string, bool)`

GetPublicDescriptionOk returns a tuple with the PublicDescription field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPublicDescription

`func (o *CheckoutSessionsUpdate) SetPublicDescription(v string)`

SetPublicDescription sets PublicDescription field to given value.

### HasPublicDescription

`func (o *CheckoutSessionsUpdate) HasPublicDescription() bool`

HasPublicDescription returns a boolean if a field has been set.

### GetQrCodeData

`func (o *CheckoutSessionsUpdate) GetQrCodeData() map[string]interface{}`

GetQrCodeData returns the QrCodeData field if non-nil, zero value otherwise.

### GetQrCodeDataOk

`func (o *CheckoutSessionsUpdate) GetQrCodeDataOk() (*map[string]interface{}, bool)`

GetQrCodeDataOk returns a tuple with the QrCodeData field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQrCodeData

`func (o *CheckoutSessionsUpdate) SetQrCodeData(v map[string]interface{})`

SetQrCodeData sets QrCodeData field to given value.

### HasQrCodeData

`func (o *CheckoutSessionsUpdate) HasQrCodeData() bool`

HasQrCodeData returns a boolean if a field has been set.

### GetQrCodeType

`func (o *CheckoutSessionsUpdate) GetQrCodeType() string`

GetQrCodeType returns the QrCodeType field if non-nil, zero value otherwise.

### GetQrCodeTypeOk

`func (o *CheckoutSessionsUpdate) GetQrCodeTypeOk() (*string, bool)`

GetQrCodeTypeOk returns a tuple with the QrCodeType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQrCodeType

`func (o *CheckoutSessionsUpdate) SetQrCodeType(v string)`

SetQrCodeType sets QrCodeType field to given value.

### HasQrCodeType

`func (o *CheckoutSessionsUpdate) HasQrCodeType() bool`

HasQrCodeType returns a boolean if a field has been set.

### GetQuantity

`func (o *CheckoutSessionsUpdate) GetQuantity() float64`

GetQuantity returns the Quantity field if non-nil, zero value otherwise.

### GetQuantityOk

`func (o *CheckoutSessionsUpdate) GetQuantityOk() (*float64, bool)`

GetQuantityOk returns a tuple with the Quantity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQuantity

`func (o *CheckoutSessionsUpdate) SetQuantity(v float64)`

SetQuantity sets Quantity field to given value.

### HasQuantity

`func (o *CheckoutSessionsUpdate) HasQuantity() bool`

HasQuantity returns a boolean if a field has been set.

### GetSpiAccountNumber

`func (o *CheckoutSessionsUpdate) GetSpiAccountNumber() string`

GetSpiAccountNumber returns the SpiAccountNumber field if non-nil, zero value otherwise.

### GetSpiAccountNumberOk

`func (o *CheckoutSessionsUpdate) GetSpiAccountNumberOk() (*string, bool)`

GetSpiAccountNumberOk returns a tuple with the SpiAccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAccountNumber

`func (o *CheckoutSessionsUpdate) SetSpiAccountNumber(v string)`

SetSpiAccountNumber sets SpiAccountNumber field to given value.

### HasSpiAccountNumber

`func (o *CheckoutSessionsUpdate) HasSpiAccountNumber() bool`

HasSpiAccountNumber returns a boolean if a field has been set.

### GetSpiQrCodeId

`func (o *CheckoutSessionsUpdate) GetSpiQrCodeId() string`

GetSpiQrCodeId returns the SpiQrCodeId field if non-nil, zero value otherwise.

### GetSpiQrCodeIdOk

`func (o *CheckoutSessionsUpdate) GetSpiQrCodeIdOk() (*string, bool)`

GetSpiQrCodeIdOk returns a tuple with the SpiQrCodeId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiQrCodeId

`func (o *CheckoutSessionsUpdate) SetSpiQrCodeId(v string)`

SetSpiQrCodeId sets SpiQrCodeId field to given value.

### HasSpiQrCodeId

`func (o *CheckoutSessionsUpdate) HasSpiQrCodeId() bool`

HasSpiQrCodeId returns a boolean if a field has been set.

### GetStatus

`func (o *CheckoutSessionsUpdate) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *CheckoutSessionsUpdate) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *CheckoutSessionsUpdate) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *CheckoutSessionsUpdate) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetSubscriptionId

`func (o *CheckoutSessionsUpdate) GetSubscriptionId() string`

GetSubscriptionId returns the SubscriptionId field if non-nil, zero value otherwise.

### GetSubscriptionIdOk

`func (o *CheckoutSessionsUpdate) GetSubscriptionIdOk() (*string, bool)`

GetSubscriptionIdOk returns a tuple with the SubscriptionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubscriptionId

`func (o *CheckoutSessionsUpdate) SetSubscriptionId(v string)`

SetSubscriptionId sets SubscriptionId field to given value.

### HasSubscriptionId

`func (o *CheckoutSessionsUpdate) HasSubscriptionId() bool`

HasSubscriptionId returns a boolean if a field has been set.

### GetSuccessUrl

`func (o *CheckoutSessionsUpdate) GetSuccessUrl() string`

GetSuccessUrl returns the SuccessUrl field if non-nil, zero value otherwise.

### GetSuccessUrlOk

`func (o *CheckoutSessionsUpdate) GetSuccessUrlOk() (*string, bool)`

GetSuccessUrlOk returns a tuple with the SuccessUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccessUrl

`func (o *CheckoutSessionsUpdate) SetSuccessUrl(v string)`

SetSuccessUrl sets SuccessUrl field to given value.

### HasSuccessUrl

`func (o *CheckoutSessionsUpdate) HasSuccessUrl() bool`

HasSuccessUrl returns a boolean if a field has been set.

### GetTitle

`func (o *CheckoutSessionsUpdate) GetTitle() string`

GetTitle returns the Title field if non-nil, zero value otherwise.

### GetTitleOk

`func (o *CheckoutSessionsUpdate) GetTitleOk() (*string, bool)`

GetTitleOk returns a tuple with the Title field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTitle

`func (o *CheckoutSessionsUpdate) SetTitle(v string)`

SetTitle sets Title field to given value.

### HasTitle

`func (o *CheckoutSessionsUpdate) HasTitle() bool`

HasTitle returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


