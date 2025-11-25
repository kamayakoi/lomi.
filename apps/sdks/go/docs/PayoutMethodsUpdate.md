# PayoutMethodsUpdate

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
**IsDefault** | Pointer to **bool** |  | [optional] 
**IsSpiEnabled** | Pointer to **bool** |  | [optional] 
**IsUemoa** | Pointer to **bool** |  | [optional] 
**IsValid** | Pointer to **bool** |  | [optional] 
**PayoutMethodId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PayoutMethodType** | Pointer to **string** |  | [optional] 
**SpiAccountNumber** | Pointer to **string** |  | [optional] 
**SpiAliasMbno** | Pointer to **string** |  | [optional] 
**SpiAliasShid** | Pointer to **string** |  | [optional] 
**SpiAliasType** | Pointer to **string** |  | [optional] 

## Methods

### NewPayoutMethodsUpdate

`func NewPayoutMethodsUpdate() *PayoutMethodsUpdate`

NewPayoutMethodsUpdate instantiates a new PayoutMethodsUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPayoutMethodsUpdateWithDefaults

`func NewPayoutMethodsUpdateWithDefaults() *PayoutMethodsUpdate`

NewPayoutMethodsUpdateWithDefaults instantiates a new PayoutMethodsUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAccountName

`func (o *PayoutMethodsUpdate) GetAccountName() string`

GetAccountName returns the AccountName field if non-nil, zero value otherwise.

### GetAccountNameOk

`func (o *PayoutMethodsUpdate) GetAccountNameOk() (*string, bool)`

GetAccountNameOk returns a tuple with the AccountName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAccountName

`func (o *PayoutMethodsUpdate) SetAccountName(v string)`

SetAccountName sets AccountName field to given value.

### HasAccountName

`func (o *PayoutMethodsUpdate) HasAccountName() bool`

HasAccountName returns a boolean if a field has been set.

### GetAccountNumber

`func (o *PayoutMethodsUpdate) GetAccountNumber() string`

GetAccountNumber returns the AccountNumber field if non-nil, zero value otherwise.

### GetAccountNumberOk

`func (o *PayoutMethodsUpdate) GetAccountNumberOk() (*string, bool)`

GetAccountNumberOk returns a tuple with the AccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAccountNumber

`func (o *PayoutMethodsUpdate) SetAccountNumber(v string)`

SetAccountNumber sets AccountNumber field to given value.

### HasAccountNumber

`func (o *PayoutMethodsUpdate) HasAccountNumber() bool`

HasAccountNumber returns a boolean if a field has been set.

### GetAutoWithdrawalDay

`func (o *PayoutMethodsUpdate) GetAutoWithdrawalDay() float64`

GetAutoWithdrawalDay returns the AutoWithdrawalDay field if non-nil, zero value otherwise.

### GetAutoWithdrawalDayOk

`func (o *PayoutMethodsUpdate) GetAutoWithdrawalDayOk() (*float64, bool)`

GetAutoWithdrawalDayOk returns a tuple with the AutoWithdrawalDay field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAutoWithdrawalDay

`func (o *PayoutMethodsUpdate) SetAutoWithdrawalDay(v float64)`

SetAutoWithdrawalDay sets AutoWithdrawalDay field to given value.

### HasAutoWithdrawalDay

`func (o *PayoutMethodsUpdate) HasAutoWithdrawalDay() bool`

HasAutoWithdrawalDay returns a boolean if a field has been set.

### GetAutoWithdrawalEnabled

`func (o *PayoutMethodsUpdate) GetAutoWithdrawalEnabled() bool`

GetAutoWithdrawalEnabled returns the AutoWithdrawalEnabled field if non-nil, zero value otherwise.

### GetAutoWithdrawalEnabledOk

`func (o *PayoutMethodsUpdate) GetAutoWithdrawalEnabledOk() (*bool, bool)`

GetAutoWithdrawalEnabledOk returns a tuple with the AutoWithdrawalEnabled field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAutoWithdrawalEnabled

`func (o *PayoutMethodsUpdate) SetAutoWithdrawalEnabled(v bool)`

SetAutoWithdrawalEnabled sets AutoWithdrawalEnabled field to given value.

### HasAutoWithdrawalEnabled

`func (o *PayoutMethodsUpdate) HasAutoWithdrawalEnabled() bool`

HasAutoWithdrawalEnabled returns a boolean if a field has been set.

### GetAutoWithdrawalLastRun

`func (o *PayoutMethodsUpdate) GetAutoWithdrawalLastRun() string`

GetAutoWithdrawalLastRun returns the AutoWithdrawalLastRun field if non-nil, zero value otherwise.

### GetAutoWithdrawalLastRunOk

`func (o *PayoutMethodsUpdate) GetAutoWithdrawalLastRunOk() (*string, bool)`

GetAutoWithdrawalLastRunOk returns a tuple with the AutoWithdrawalLastRun field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAutoWithdrawalLastRun

`func (o *PayoutMethodsUpdate) SetAutoWithdrawalLastRun(v string)`

SetAutoWithdrawalLastRun sets AutoWithdrawalLastRun field to given value.

### HasAutoWithdrawalLastRun

`func (o *PayoutMethodsUpdate) HasAutoWithdrawalLastRun() bool`

HasAutoWithdrawalLastRun returns a boolean if a field has been set.

### GetAutoWithdrawalMethod

`func (o *PayoutMethodsUpdate) GetAutoWithdrawalMethod() string`

GetAutoWithdrawalMethod returns the AutoWithdrawalMethod field if non-nil, zero value otherwise.

### GetAutoWithdrawalMethodOk

`func (o *PayoutMethodsUpdate) GetAutoWithdrawalMethodOk() (*string, bool)`

GetAutoWithdrawalMethodOk returns a tuple with the AutoWithdrawalMethod field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAutoWithdrawalMethod

`func (o *PayoutMethodsUpdate) SetAutoWithdrawalMethod(v string)`

SetAutoWithdrawalMethod sets AutoWithdrawalMethod field to given value.

### HasAutoWithdrawalMethod

`func (o *PayoutMethodsUpdate) HasAutoWithdrawalMethod() bool`

HasAutoWithdrawalMethod returns a boolean if a field has been set.

### GetAutoWithdrawalMobileProvider

`func (o *PayoutMethodsUpdate) GetAutoWithdrawalMobileProvider() string`

GetAutoWithdrawalMobileProvider returns the AutoWithdrawalMobileProvider field if non-nil, zero value otherwise.

### GetAutoWithdrawalMobileProviderOk

`func (o *PayoutMethodsUpdate) GetAutoWithdrawalMobileProviderOk() (*string, bool)`

GetAutoWithdrawalMobileProviderOk returns a tuple with the AutoWithdrawalMobileProvider field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAutoWithdrawalMobileProvider

`func (o *PayoutMethodsUpdate) SetAutoWithdrawalMobileProvider(v string)`

SetAutoWithdrawalMobileProvider sets AutoWithdrawalMobileProvider field to given value.

### HasAutoWithdrawalMobileProvider

`func (o *PayoutMethodsUpdate) HasAutoWithdrawalMobileProvider() bool`

HasAutoWithdrawalMobileProvider returns a boolean if a field has been set.

### GetBankCode

`func (o *PayoutMethodsUpdate) GetBankCode() string`

GetBankCode returns the BankCode field if non-nil, zero value otherwise.

### GetBankCodeOk

`func (o *PayoutMethodsUpdate) GetBankCodeOk() (*string, bool)`

GetBankCodeOk returns a tuple with the BankCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBankCode

`func (o *PayoutMethodsUpdate) SetBankCode(v string)`

SetBankCode sets BankCode field to given value.

### HasBankCode

`func (o *PayoutMethodsUpdate) HasBankCode() bool`

HasBankCode returns a boolean if a field has been set.

### GetBankName

`func (o *PayoutMethodsUpdate) GetBankName() string`

GetBankName returns the BankName field if non-nil, zero value otherwise.

### GetBankNameOk

`func (o *PayoutMethodsUpdate) GetBankNameOk() (*string, bool)`

GetBankNameOk returns a tuple with the BankName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBankName

`func (o *PayoutMethodsUpdate) SetBankName(v string)`

SetBankName sets BankName field to given value.

### HasBankName

`func (o *PayoutMethodsUpdate) HasBankName() bool`

HasBankName returns a boolean if a field has been set.

### GetBranchCode

`func (o *PayoutMethodsUpdate) GetBranchCode() string`

GetBranchCode returns the BranchCode field if non-nil, zero value otherwise.

### GetBranchCodeOk

`func (o *PayoutMethodsUpdate) GetBranchCodeOk() (*string, bool)`

GetBranchCodeOk returns a tuple with the BranchCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBranchCode

`func (o *PayoutMethodsUpdate) SetBranchCode(v string)`

SetBranchCode sets BranchCode field to given value.

### HasBranchCode

`func (o *PayoutMethodsUpdate) HasBranchCode() bool`

HasBranchCode returns a boolean if a field has been set.

### GetCountry

`func (o *PayoutMethodsUpdate) GetCountry() string`

GetCountry returns the Country field if non-nil, zero value otherwise.

### GetCountryOk

`func (o *PayoutMethodsUpdate) GetCountryOk() (*string, bool)`

GetCountryOk returns a tuple with the Country field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountry

`func (o *PayoutMethodsUpdate) SetCountry(v string)`

SetCountry sets Country field to given value.

### HasCountry

`func (o *PayoutMethodsUpdate) HasCountry() bool`

HasCountry returns a boolean if a field has been set.

### GetIsDefault

`func (o *PayoutMethodsUpdate) GetIsDefault() bool`

GetIsDefault returns the IsDefault field if non-nil, zero value otherwise.

### GetIsDefaultOk

`func (o *PayoutMethodsUpdate) GetIsDefaultOk() (*bool, bool)`

GetIsDefaultOk returns a tuple with the IsDefault field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsDefault

`func (o *PayoutMethodsUpdate) SetIsDefault(v bool)`

SetIsDefault sets IsDefault field to given value.

### HasIsDefault

`func (o *PayoutMethodsUpdate) HasIsDefault() bool`

HasIsDefault returns a boolean if a field has been set.

### GetIsSpiEnabled

`func (o *PayoutMethodsUpdate) GetIsSpiEnabled() bool`

GetIsSpiEnabled returns the IsSpiEnabled field if non-nil, zero value otherwise.

### GetIsSpiEnabledOk

`func (o *PayoutMethodsUpdate) GetIsSpiEnabledOk() (*bool, bool)`

GetIsSpiEnabledOk returns a tuple with the IsSpiEnabled field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsSpiEnabled

`func (o *PayoutMethodsUpdate) SetIsSpiEnabled(v bool)`

SetIsSpiEnabled sets IsSpiEnabled field to given value.

### HasIsSpiEnabled

`func (o *PayoutMethodsUpdate) HasIsSpiEnabled() bool`

HasIsSpiEnabled returns a boolean if a field has been set.

### GetIsUemoa

`func (o *PayoutMethodsUpdate) GetIsUemoa() bool`

GetIsUemoa returns the IsUemoa field if non-nil, zero value otherwise.

### GetIsUemoaOk

`func (o *PayoutMethodsUpdate) GetIsUemoaOk() (*bool, bool)`

GetIsUemoaOk returns a tuple with the IsUemoa field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsUemoa

`func (o *PayoutMethodsUpdate) SetIsUemoa(v bool)`

SetIsUemoa sets IsUemoa field to given value.

### HasIsUemoa

`func (o *PayoutMethodsUpdate) HasIsUemoa() bool`

HasIsUemoa returns a boolean if a field has been set.

### GetIsValid

`func (o *PayoutMethodsUpdate) GetIsValid() bool`

GetIsValid returns the IsValid field if non-nil, zero value otherwise.

### GetIsValidOk

`func (o *PayoutMethodsUpdate) GetIsValidOk() (*bool, bool)`

GetIsValidOk returns a tuple with the IsValid field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsValid

`func (o *PayoutMethodsUpdate) SetIsValid(v bool)`

SetIsValid sets IsValid field to given value.

### HasIsValid

`func (o *PayoutMethodsUpdate) HasIsValid() bool`

HasIsValid returns a boolean if a field has been set.

### GetPayoutMethodId

`func (o *PayoutMethodsUpdate) GetPayoutMethodId() string`

GetPayoutMethodId returns the PayoutMethodId field if non-nil, zero value otherwise.

### GetPayoutMethodIdOk

`func (o *PayoutMethodsUpdate) GetPayoutMethodIdOk() (*string, bool)`

GetPayoutMethodIdOk returns a tuple with the PayoutMethodId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayoutMethodId

`func (o *PayoutMethodsUpdate) SetPayoutMethodId(v string)`

SetPayoutMethodId sets PayoutMethodId field to given value.

### HasPayoutMethodId

`func (o *PayoutMethodsUpdate) HasPayoutMethodId() bool`

HasPayoutMethodId returns a boolean if a field has been set.

### GetPayoutMethodType

`func (o *PayoutMethodsUpdate) GetPayoutMethodType() string`

GetPayoutMethodType returns the PayoutMethodType field if non-nil, zero value otherwise.

### GetPayoutMethodTypeOk

`func (o *PayoutMethodsUpdate) GetPayoutMethodTypeOk() (*string, bool)`

GetPayoutMethodTypeOk returns a tuple with the PayoutMethodType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayoutMethodType

`func (o *PayoutMethodsUpdate) SetPayoutMethodType(v string)`

SetPayoutMethodType sets PayoutMethodType field to given value.

### HasPayoutMethodType

`func (o *PayoutMethodsUpdate) HasPayoutMethodType() bool`

HasPayoutMethodType returns a boolean if a field has been set.

### GetSpiAccountNumber

`func (o *PayoutMethodsUpdate) GetSpiAccountNumber() string`

GetSpiAccountNumber returns the SpiAccountNumber field if non-nil, zero value otherwise.

### GetSpiAccountNumberOk

`func (o *PayoutMethodsUpdate) GetSpiAccountNumberOk() (*string, bool)`

GetSpiAccountNumberOk returns a tuple with the SpiAccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAccountNumber

`func (o *PayoutMethodsUpdate) SetSpiAccountNumber(v string)`

SetSpiAccountNumber sets SpiAccountNumber field to given value.

### HasSpiAccountNumber

`func (o *PayoutMethodsUpdate) HasSpiAccountNumber() bool`

HasSpiAccountNumber returns a boolean if a field has been set.

### GetSpiAliasMbno

`func (o *PayoutMethodsUpdate) GetSpiAliasMbno() string`

GetSpiAliasMbno returns the SpiAliasMbno field if non-nil, zero value otherwise.

### GetSpiAliasMbnoOk

`func (o *PayoutMethodsUpdate) GetSpiAliasMbnoOk() (*string, bool)`

GetSpiAliasMbnoOk returns a tuple with the SpiAliasMbno field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAliasMbno

`func (o *PayoutMethodsUpdate) SetSpiAliasMbno(v string)`

SetSpiAliasMbno sets SpiAliasMbno field to given value.

### HasSpiAliasMbno

`func (o *PayoutMethodsUpdate) HasSpiAliasMbno() bool`

HasSpiAliasMbno returns a boolean if a field has been set.

### GetSpiAliasShid

`func (o *PayoutMethodsUpdate) GetSpiAliasShid() string`

GetSpiAliasShid returns the SpiAliasShid field if non-nil, zero value otherwise.

### GetSpiAliasShidOk

`func (o *PayoutMethodsUpdate) GetSpiAliasShidOk() (*string, bool)`

GetSpiAliasShidOk returns a tuple with the SpiAliasShid field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAliasShid

`func (o *PayoutMethodsUpdate) SetSpiAliasShid(v string)`

SetSpiAliasShid sets SpiAliasShid field to given value.

### HasSpiAliasShid

`func (o *PayoutMethodsUpdate) HasSpiAliasShid() bool`

HasSpiAliasShid returns a boolean if a field has been set.

### GetSpiAliasType

`func (o *PayoutMethodsUpdate) GetSpiAliasType() string`

GetSpiAliasType returns the SpiAliasType field if non-nil, zero value otherwise.

### GetSpiAliasTypeOk

`func (o *PayoutMethodsUpdate) GetSpiAliasTypeOk() (*string, bool)`

GetSpiAliasTypeOk returns a tuple with the SpiAliasType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAliasType

`func (o *PayoutMethodsUpdate) SetSpiAliasType(v string)`

SetSpiAliasType sets SpiAliasType field to given value.

### HasSpiAliasType

`func (o *PayoutMethodsUpdate) HasSpiAliasType() bool`

HasSpiAliasType returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


