# CustomersCreate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Address** | Pointer to **string** |  | [optional] 
**City** | Pointer to **string** |  | [optional] 
**Country** | Pointer to **string** |  | [optional] 
**Email** | Pointer to **string** | Email address | [optional] 
**IsBusiness** | Pointer to **bool** |  | [optional] 
**IsDeleted** | Pointer to **bool** | Soft deletion flag | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**Name** | Pointer to **string** |  | [optional] 
**PhoneNumber** | Pointer to **string** |  | [optional] 
**PostalCode** | Pointer to **string** |  | [optional] 
**SpiAliasMbno** | Pointer to **string** |  | [optional] 
**SpiAliasShid** | Pointer to **string** |  | [optional] 
**SpiPrimaryAlias** | Pointer to **string** |  | [optional] 
**WhatsappNumber** | Pointer to **string** |  | [optional] 

## Methods

### NewCustomersCreate

`func NewCustomersCreate() *CustomersCreate`

NewCustomersCreate instantiates a new CustomersCreate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCustomersCreateWithDefaults

`func NewCustomersCreateWithDefaults() *CustomersCreate`

NewCustomersCreateWithDefaults instantiates a new CustomersCreate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAddress

`func (o *CustomersCreate) GetAddress() string`

GetAddress returns the Address field if non-nil, zero value otherwise.

### GetAddressOk

`func (o *CustomersCreate) GetAddressOk() (*string, bool)`

GetAddressOk returns a tuple with the Address field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAddress

`func (o *CustomersCreate) SetAddress(v string)`

SetAddress sets Address field to given value.

### HasAddress

`func (o *CustomersCreate) HasAddress() bool`

HasAddress returns a boolean if a field has been set.

### GetCity

`func (o *CustomersCreate) GetCity() string`

GetCity returns the City field if non-nil, zero value otherwise.

### GetCityOk

`func (o *CustomersCreate) GetCityOk() (*string, bool)`

GetCityOk returns a tuple with the City field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCity

`func (o *CustomersCreate) SetCity(v string)`

SetCity sets City field to given value.

### HasCity

`func (o *CustomersCreate) HasCity() bool`

HasCity returns a boolean if a field has been set.

### GetCountry

`func (o *CustomersCreate) GetCountry() string`

GetCountry returns the Country field if non-nil, zero value otherwise.

### GetCountryOk

`func (o *CustomersCreate) GetCountryOk() (*string, bool)`

GetCountryOk returns a tuple with the Country field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountry

`func (o *CustomersCreate) SetCountry(v string)`

SetCountry sets Country field to given value.

### HasCountry

`func (o *CustomersCreate) HasCountry() bool`

HasCountry returns a boolean if a field has been set.

### GetEmail

`func (o *CustomersCreate) GetEmail() string`

GetEmail returns the Email field if non-nil, zero value otherwise.

### GetEmailOk

`func (o *CustomersCreate) GetEmailOk() (*string, bool)`

GetEmailOk returns a tuple with the Email field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEmail

`func (o *CustomersCreate) SetEmail(v string)`

SetEmail sets Email field to given value.

### HasEmail

`func (o *CustomersCreate) HasEmail() bool`

HasEmail returns a boolean if a field has been set.

### GetIsBusiness

`func (o *CustomersCreate) GetIsBusiness() bool`

GetIsBusiness returns the IsBusiness field if non-nil, zero value otherwise.

### GetIsBusinessOk

`func (o *CustomersCreate) GetIsBusinessOk() (*bool, bool)`

GetIsBusinessOk returns a tuple with the IsBusiness field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsBusiness

`func (o *CustomersCreate) SetIsBusiness(v bool)`

SetIsBusiness sets IsBusiness field to given value.

### HasIsBusiness

`func (o *CustomersCreate) HasIsBusiness() bool`

HasIsBusiness returns a boolean if a field has been set.

### GetIsDeleted

`func (o *CustomersCreate) GetIsDeleted() bool`

GetIsDeleted returns the IsDeleted field if non-nil, zero value otherwise.

### GetIsDeletedOk

`func (o *CustomersCreate) GetIsDeletedOk() (*bool, bool)`

GetIsDeletedOk returns a tuple with the IsDeleted field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsDeleted

`func (o *CustomersCreate) SetIsDeleted(v bool)`

SetIsDeleted sets IsDeleted field to given value.

### HasIsDeleted

`func (o *CustomersCreate) HasIsDeleted() bool`

HasIsDeleted returns a boolean if a field has been set.

### GetMetadata

`func (o *CustomersCreate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *CustomersCreate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *CustomersCreate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *CustomersCreate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetName

`func (o *CustomersCreate) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *CustomersCreate) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *CustomersCreate) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *CustomersCreate) HasName() bool`

HasName returns a boolean if a field has been set.

### GetPhoneNumber

`func (o *CustomersCreate) GetPhoneNumber() string`

GetPhoneNumber returns the PhoneNumber field if non-nil, zero value otherwise.

### GetPhoneNumberOk

`func (o *CustomersCreate) GetPhoneNumberOk() (*string, bool)`

GetPhoneNumberOk returns a tuple with the PhoneNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPhoneNumber

`func (o *CustomersCreate) SetPhoneNumber(v string)`

SetPhoneNumber sets PhoneNumber field to given value.

### HasPhoneNumber

`func (o *CustomersCreate) HasPhoneNumber() bool`

HasPhoneNumber returns a boolean if a field has been set.

### GetPostalCode

`func (o *CustomersCreate) GetPostalCode() string`

GetPostalCode returns the PostalCode field if non-nil, zero value otherwise.

### GetPostalCodeOk

`func (o *CustomersCreate) GetPostalCodeOk() (*string, bool)`

GetPostalCodeOk returns a tuple with the PostalCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPostalCode

`func (o *CustomersCreate) SetPostalCode(v string)`

SetPostalCode sets PostalCode field to given value.

### HasPostalCode

`func (o *CustomersCreate) HasPostalCode() bool`

HasPostalCode returns a boolean if a field has been set.

### GetSpiAliasMbno

`func (o *CustomersCreate) GetSpiAliasMbno() string`

GetSpiAliasMbno returns the SpiAliasMbno field if non-nil, zero value otherwise.

### GetSpiAliasMbnoOk

`func (o *CustomersCreate) GetSpiAliasMbnoOk() (*string, bool)`

GetSpiAliasMbnoOk returns a tuple with the SpiAliasMbno field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAliasMbno

`func (o *CustomersCreate) SetSpiAliasMbno(v string)`

SetSpiAliasMbno sets SpiAliasMbno field to given value.

### HasSpiAliasMbno

`func (o *CustomersCreate) HasSpiAliasMbno() bool`

HasSpiAliasMbno returns a boolean if a field has been set.

### GetSpiAliasShid

`func (o *CustomersCreate) GetSpiAliasShid() string`

GetSpiAliasShid returns the SpiAliasShid field if non-nil, zero value otherwise.

### GetSpiAliasShidOk

`func (o *CustomersCreate) GetSpiAliasShidOk() (*string, bool)`

GetSpiAliasShidOk returns a tuple with the SpiAliasShid field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAliasShid

`func (o *CustomersCreate) SetSpiAliasShid(v string)`

SetSpiAliasShid sets SpiAliasShid field to given value.

### HasSpiAliasShid

`func (o *CustomersCreate) HasSpiAliasShid() bool`

HasSpiAliasShid returns a boolean if a field has been set.

### GetSpiPrimaryAlias

`func (o *CustomersCreate) GetSpiPrimaryAlias() string`

GetSpiPrimaryAlias returns the SpiPrimaryAlias field if non-nil, zero value otherwise.

### GetSpiPrimaryAliasOk

`func (o *CustomersCreate) GetSpiPrimaryAliasOk() (*string, bool)`

GetSpiPrimaryAliasOk returns a tuple with the SpiPrimaryAlias field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPrimaryAlias

`func (o *CustomersCreate) SetSpiPrimaryAlias(v string)`

SetSpiPrimaryAlias sets SpiPrimaryAlias field to given value.

### HasSpiPrimaryAlias

`func (o *CustomersCreate) HasSpiPrimaryAlias() bool`

HasSpiPrimaryAlias returns a boolean if a field has been set.

### GetWhatsappNumber

`func (o *CustomersCreate) GetWhatsappNumber() string`

GetWhatsappNumber returns the WhatsappNumber field if non-nil, zero value otherwise.

### GetWhatsappNumberOk

`func (o *CustomersCreate) GetWhatsappNumberOk() (*string, bool)`

GetWhatsappNumberOk returns a tuple with the WhatsappNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWhatsappNumber

`func (o *CustomersCreate) SetWhatsappNumber(v string)`

SetWhatsappNumber sets WhatsappNumber field to given value.

### HasWhatsappNumber

`func (o *CustomersCreate) HasWhatsappNumber() bool`

HasWhatsappNumber returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


