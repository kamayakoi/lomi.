# PayoutMethods

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AccountName** | Pointer to **string** |  | [optional] 
**AccountNumber** | Pointer to **string** |  | [optional] 
**AutoWithdrawalDay** | Pointer to **float64** |  | [optional] 
**AutoWithdrawalEnabled** | Pointer to **bool** |  | [optional] 
**AutoWithdrawalLastRun** | Pointer to **string** |  | [optional] 
**AutoWithdrawalMethod** | Pointer to **string** |  | [optional] 
**AutoWithdrawalMobileProvider** | Pointer to **string** |  | [optional] 
**BankCode** | Pointer to **string** |  | [optional] 
**BankName** | Pointer to **string** |  | [optional] 
**BranchCode** | Pointer to **string** |  | [optional] 
**Country** | Pointer to **string** |  | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**IsDefault** | Pointer to **bool** |  | [optional] 
**IsSpiEnabled** | Pointer to **bool** |  | [optional] 
**IsUemoa** | Pointer to **bool** |  | [optional] 
**IsValid** | Pointer to **bool** |  | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PayoutMethodId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PayoutMethodType** | Pointer to **string** |  | [optional] 
**SpiAccountNumber** | Pointer to **string** |  | [optional] 
**SpiAliasMbno** | Pointer to **string** |  | [optional] 
**SpiAliasShid** | Pointer to **string** |  | [optional] 
**SpiAliasType** | Pointer to **string** |  | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 

## Methods

### NewPayoutMethods

`func NewPayoutMethods() *PayoutMethods`

NewPayoutMethods instantiates a new PayoutMethods object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPayoutMethodsWithDefaults

`func NewPayoutMethodsWithDefaults() *PayoutMethods`

NewPayoutMethodsWithDefaults instantiates a new PayoutMethods object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAccountName

`func (o *PayoutMethods) GetAccountName() string`

GetAccountName returns the AccountName field if non-nil, zero value otherwise.

### GetAccountNameOk

`func (o *PayoutMethods) GetAccountNameOk() (*string, bool)`

GetAccountNameOk returns a tuple with the AccountName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAccountName

`func (o *PayoutMethods) SetAccountName(v string)`

SetAccountName sets AccountName field to given value.

### HasAccountName

`func (o *PayoutMethods) HasAccountName() bool`

HasAccountName returns a boolean if a field has been set.

### GetAccountNumber

`func (o *PayoutMethods) GetAccountNumber() string`

GetAccountNumber returns the AccountNumber field if non-nil, zero value otherwise.

### GetAccountNumberOk

`func (o *PayoutMethods) GetAccountNumberOk() (*string, bool)`

GetAccountNumberOk returns a tuple with the AccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAccountNumber

`func (o *PayoutMethods) SetAccountNumber(v string)`

SetAccountNumber sets AccountNumber field to given value.

### HasAccountNumber

`func (o *PayoutMethods) HasAccountNumber() bool`

HasAccountNumber returns a boolean if a field has been set.

### GetAutoWithdrawalDay

`func (o *PayoutMethods) GetAutoWithdrawalDay() float64`

GetAutoWithdrawalDay returns the AutoWithdrawalDay field if non-nil, zero value otherwise.

### GetAutoWithdrawalDayOk

`func (o *PayoutMethods) GetAutoWithdrawalDayOk() (*float64, bool)`

GetAutoWithdrawalDayOk returns a tuple with the AutoWithdrawalDay field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAutoWithdrawalDay

`func (o *PayoutMethods) SetAutoWithdrawalDay(v float64)`

SetAutoWithdrawalDay sets AutoWithdrawalDay field to given value.

### HasAutoWithdrawalDay

`func (o *PayoutMethods) HasAutoWithdrawalDay() bool`

HasAutoWithdrawalDay returns a boolean if a field has been set.

### GetAutoWithdrawalEnabled

`func (o *PayoutMethods) GetAutoWithdrawalEnabled() bool`

GetAutoWithdrawalEnabled returns the AutoWithdrawalEnabled field if non-nil, zero value otherwise.

### GetAutoWithdrawalEnabledOk

`func (o *PayoutMethods) GetAutoWithdrawalEnabledOk() (*bool, bool)`

GetAutoWithdrawalEnabledOk returns a tuple with the AutoWithdrawalEnabled field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAutoWithdrawalEnabled

`func (o *PayoutMethods) SetAutoWithdrawalEnabled(v bool)`

SetAutoWithdrawalEnabled sets AutoWithdrawalEnabled field to given value.

### HasAutoWithdrawalEnabled

`func (o *PayoutMethods) HasAutoWithdrawalEnabled() bool`

HasAutoWithdrawalEnabled returns a boolean if a field has been set.

### GetAutoWithdrawalLastRun

`func (o *PayoutMethods) GetAutoWithdrawalLastRun() string`

GetAutoWithdrawalLastRun returns the AutoWithdrawalLastRun field if non-nil, zero value otherwise.

### GetAutoWithdrawalLastRunOk

`func (o *PayoutMethods) GetAutoWithdrawalLastRunOk() (*string, bool)`

GetAutoWithdrawalLastRunOk returns a tuple with the AutoWithdrawalLastRun field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAutoWithdrawalLastRun

`func (o *PayoutMethods) SetAutoWithdrawalLastRun(v string)`

SetAutoWithdrawalLastRun sets AutoWithdrawalLastRun field to given value.

### HasAutoWithdrawalLastRun

`func (o *PayoutMethods) HasAutoWithdrawalLastRun() bool`

HasAutoWithdrawalLastRun returns a boolean if a field has been set.

### GetAutoWithdrawalMethod

`func (o *PayoutMethods) GetAutoWithdrawalMethod() string`

GetAutoWithdrawalMethod returns the AutoWithdrawalMethod field if non-nil, zero value otherwise.

### GetAutoWithdrawalMethodOk

`func (o *PayoutMethods) GetAutoWithdrawalMethodOk() (*string, bool)`

GetAutoWithdrawalMethodOk returns a tuple with the AutoWithdrawalMethod field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAutoWithdrawalMethod

`func (o *PayoutMethods) SetAutoWithdrawalMethod(v string)`

SetAutoWithdrawalMethod sets AutoWithdrawalMethod field to given value.

### HasAutoWithdrawalMethod

`func (o *PayoutMethods) HasAutoWithdrawalMethod() bool`

HasAutoWithdrawalMethod returns a boolean if a field has been set.

### GetAutoWithdrawalMobileProvider

`func (o *PayoutMethods) GetAutoWithdrawalMobileProvider() string`

GetAutoWithdrawalMobileProvider returns the AutoWithdrawalMobileProvider field if non-nil, zero value otherwise.

### GetAutoWithdrawalMobileProviderOk

`func (o *PayoutMethods) GetAutoWithdrawalMobileProviderOk() (*string, bool)`

GetAutoWithdrawalMobileProviderOk returns a tuple with the AutoWithdrawalMobileProvider field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAutoWithdrawalMobileProvider

`func (o *PayoutMethods) SetAutoWithdrawalMobileProvider(v string)`

SetAutoWithdrawalMobileProvider sets AutoWithdrawalMobileProvider field to given value.

### HasAutoWithdrawalMobileProvider

`func (o *PayoutMethods) HasAutoWithdrawalMobileProvider() bool`

HasAutoWithdrawalMobileProvider returns a boolean if a field has been set.

### GetBankCode

`func (o *PayoutMethods) GetBankCode() string`

GetBankCode returns the BankCode field if non-nil, zero value otherwise.

### GetBankCodeOk

`func (o *PayoutMethods) GetBankCodeOk() (*string, bool)`

GetBankCodeOk returns a tuple with the BankCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBankCode

`func (o *PayoutMethods) SetBankCode(v string)`

SetBankCode sets BankCode field to given value.

### HasBankCode

`func (o *PayoutMethods) HasBankCode() bool`

HasBankCode returns a boolean if a field has been set.

### GetBankName

`func (o *PayoutMethods) GetBankName() string`

GetBankName returns the BankName field if non-nil, zero value otherwise.

### GetBankNameOk

`func (o *PayoutMethods) GetBankNameOk() (*string, bool)`

GetBankNameOk returns a tuple with the BankName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBankName

`func (o *PayoutMethods) SetBankName(v string)`

SetBankName sets BankName field to given value.

### HasBankName

`func (o *PayoutMethods) HasBankName() bool`

HasBankName returns a boolean if a field has been set.

### GetBranchCode

`func (o *PayoutMethods) GetBranchCode() string`

GetBranchCode returns the BranchCode field if non-nil, zero value otherwise.

### GetBranchCodeOk

`func (o *PayoutMethods) GetBranchCodeOk() (*string, bool)`

GetBranchCodeOk returns a tuple with the BranchCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBranchCode

`func (o *PayoutMethods) SetBranchCode(v string)`

SetBranchCode sets BranchCode field to given value.

### HasBranchCode

`func (o *PayoutMethods) HasBranchCode() bool`

HasBranchCode returns a boolean if a field has been set.

### GetCountry

`func (o *PayoutMethods) GetCountry() string`

GetCountry returns the Country field if non-nil, zero value otherwise.

### GetCountryOk

`func (o *PayoutMethods) GetCountryOk() (*string, bool)`

GetCountryOk returns a tuple with the Country field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountry

`func (o *PayoutMethods) SetCountry(v string)`

SetCountry sets Country field to given value.

### HasCountry

`func (o *PayoutMethods) HasCountry() bool`

HasCountry returns a boolean if a field has been set.

### GetCreatedAt

`func (o *PayoutMethods) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *PayoutMethods) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *PayoutMethods) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *PayoutMethods) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetIsDefault

`func (o *PayoutMethods) GetIsDefault() bool`

GetIsDefault returns the IsDefault field if non-nil, zero value otherwise.

### GetIsDefaultOk

`func (o *PayoutMethods) GetIsDefaultOk() (*bool, bool)`

GetIsDefaultOk returns a tuple with the IsDefault field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsDefault

`func (o *PayoutMethods) SetIsDefault(v bool)`

SetIsDefault sets IsDefault field to given value.

### HasIsDefault

`func (o *PayoutMethods) HasIsDefault() bool`

HasIsDefault returns a boolean if a field has been set.

### GetIsSpiEnabled

`func (o *PayoutMethods) GetIsSpiEnabled() bool`

GetIsSpiEnabled returns the IsSpiEnabled field if non-nil, zero value otherwise.

### GetIsSpiEnabledOk

`func (o *PayoutMethods) GetIsSpiEnabledOk() (*bool, bool)`

GetIsSpiEnabledOk returns a tuple with the IsSpiEnabled field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsSpiEnabled

`func (o *PayoutMethods) SetIsSpiEnabled(v bool)`

SetIsSpiEnabled sets IsSpiEnabled field to given value.

### HasIsSpiEnabled

`func (o *PayoutMethods) HasIsSpiEnabled() bool`

HasIsSpiEnabled returns a boolean if a field has been set.

### GetIsUemoa

`func (o *PayoutMethods) GetIsUemoa() bool`

GetIsUemoa returns the IsUemoa field if non-nil, zero value otherwise.

### GetIsUemoaOk

`func (o *PayoutMethods) GetIsUemoaOk() (*bool, bool)`

GetIsUemoaOk returns a tuple with the IsUemoa field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsUemoa

`func (o *PayoutMethods) SetIsUemoa(v bool)`

SetIsUemoa sets IsUemoa field to given value.

### HasIsUemoa

`func (o *PayoutMethods) HasIsUemoa() bool`

HasIsUemoa returns a boolean if a field has been set.

### GetIsValid

`func (o *PayoutMethods) GetIsValid() bool`

GetIsValid returns the IsValid field if non-nil, zero value otherwise.

### GetIsValidOk

`func (o *PayoutMethods) GetIsValidOk() (*bool, bool)`

GetIsValidOk returns a tuple with the IsValid field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsValid

`func (o *PayoutMethods) SetIsValid(v bool)`

SetIsValid sets IsValid field to given value.

### HasIsValid

`func (o *PayoutMethods) HasIsValid() bool`

HasIsValid returns a boolean if a field has been set.

### GetOrganizationId

`func (o *PayoutMethods) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *PayoutMethods) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *PayoutMethods) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *PayoutMethods) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetPayoutMethodId

`func (o *PayoutMethods) GetPayoutMethodId() string`

GetPayoutMethodId returns the PayoutMethodId field if non-nil, zero value otherwise.

### GetPayoutMethodIdOk

`func (o *PayoutMethods) GetPayoutMethodIdOk() (*string, bool)`

GetPayoutMethodIdOk returns a tuple with the PayoutMethodId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayoutMethodId

`func (o *PayoutMethods) SetPayoutMethodId(v string)`

SetPayoutMethodId sets PayoutMethodId field to given value.

### HasPayoutMethodId

`func (o *PayoutMethods) HasPayoutMethodId() bool`

HasPayoutMethodId returns a boolean if a field has been set.

### GetPayoutMethodType

`func (o *PayoutMethods) GetPayoutMethodType() string`

GetPayoutMethodType returns the PayoutMethodType field if non-nil, zero value otherwise.

### GetPayoutMethodTypeOk

`func (o *PayoutMethods) GetPayoutMethodTypeOk() (*string, bool)`

GetPayoutMethodTypeOk returns a tuple with the PayoutMethodType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayoutMethodType

`func (o *PayoutMethods) SetPayoutMethodType(v string)`

SetPayoutMethodType sets PayoutMethodType field to given value.

### HasPayoutMethodType

`func (o *PayoutMethods) HasPayoutMethodType() bool`

HasPayoutMethodType returns a boolean if a field has been set.

### GetSpiAccountNumber

`func (o *PayoutMethods) GetSpiAccountNumber() string`

GetSpiAccountNumber returns the SpiAccountNumber field if non-nil, zero value otherwise.

### GetSpiAccountNumberOk

`func (o *PayoutMethods) GetSpiAccountNumberOk() (*string, bool)`

GetSpiAccountNumberOk returns a tuple with the SpiAccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAccountNumber

`func (o *PayoutMethods) SetSpiAccountNumber(v string)`

SetSpiAccountNumber sets SpiAccountNumber field to given value.

### HasSpiAccountNumber

`func (o *PayoutMethods) HasSpiAccountNumber() bool`

HasSpiAccountNumber returns a boolean if a field has been set.

### GetSpiAliasMbno

`func (o *PayoutMethods) GetSpiAliasMbno() string`

GetSpiAliasMbno returns the SpiAliasMbno field if non-nil, zero value otherwise.

### GetSpiAliasMbnoOk

`func (o *PayoutMethods) GetSpiAliasMbnoOk() (*string, bool)`

GetSpiAliasMbnoOk returns a tuple with the SpiAliasMbno field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAliasMbno

`func (o *PayoutMethods) SetSpiAliasMbno(v string)`

SetSpiAliasMbno sets SpiAliasMbno field to given value.

### HasSpiAliasMbno

`func (o *PayoutMethods) HasSpiAliasMbno() bool`

HasSpiAliasMbno returns a boolean if a field has been set.

### GetSpiAliasShid

`func (o *PayoutMethods) GetSpiAliasShid() string`

GetSpiAliasShid returns the SpiAliasShid field if non-nil, zero value otherwise.

### GetSpiAliasShidOk

`func (o *PayoutMethods) GetSpiAliasShidOk() (*string, bool)`

GetSpiAliasShidOk returns a tuple with the SpiAliasShid field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAliasShid

`func (o *PayoutMethods) SetSpiAliasShid(v string)`

SetSpiAliasShid sets SpiAliasShid field to given value.

### HasSpiAliasShid

`func (o *PayoutMethods) HasSpiAliasShid() bool`

HasSpiAliasShid returns a boolean if a field has been set.

### GetSpiAliasType

`func (o *PayoutMethods) GetSpiAliasType() string`

GetSpiAliasType returns the SpiAliasType field if non-nil, zero value otherwise.

### GetSpiAliasTypeOk

`func (o *PayoutMethods) GetSpiAliasTypeOk() (*string, bool)`

GetSpiAliasTypeOk returns a tuple with the SpiAliasType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAliasType

`func (o *PayoutMethods) SetSpiAliasType(v string)`

SetSpiAliasType sets SpiAliasType field to given value.

### HasSpiAliasType

`func (o *PayoutMethods) HasSpiAliasType() bool`

HasSpiAliasType returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *PayoutMethods) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *PayoutMethods) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *PayoutMethods) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *PayoutMethods) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


