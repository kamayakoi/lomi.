# Customers

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Address** | Pointer to **string** |  | [optional] 
**City** | Pointer to **string** |  | [optional] 
**Country** | Pointer to **string** |  | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**CreatedBy** | Pointer to **string** |  | [optional] [readonly] 
**CustomerId** | Pointer to **string** | Unique identifier (UUID format) | [optional] [readonly] 
**DeletedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**Email** | Pointer to **string** | Email address | [optional] 
**Environment** | Pointer to **string** |  | [optional] 
**IsBusiness** | Pointer to **bool** |  | [optional] 
**IsDeleted** | Pointer to **bool** | Soft deletion flag | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**Name** | Pointer to **string** |  | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**PhoneNumber** | Pointer to **string** |  | [optional] 
**PostalCode** | Pointer to **string** |  | [optional] 
**SpiAliasMbno** | Pointer to **string** |  | [optional] 
**SpiAliasShid** | Pointer to **string** |  | [optional] 
**SpiPrimaryAlias** | Pointer to **string** |  | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**WhatsappNumber** | Pointer to **string** |  | [optional] 

## Methods

### NewCustomers

`func NewCustomers() *Customers`

NewCustomers instantiates a new Customers object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCustomersWithDefaults

`func NewCustomersWithDefaults() *Customers`

NewCustomersWithDefaults instantiates a new Customers object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAddress

`func (o *Customers) GetAddress() string`

GetAddress returns the Address field if non-nil, zero value otherwise.

### GetAddressOk

`func (o *Customers) GetAddressOk() (*string, bool)`

GetAddressOk returns a tuple with the Address field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAddress

`func (o *Customers) SetAddress(v string)`

SetAddress sets Address field to given value.

### HasAddress

`func (o *Customers) HasAddress() bool`

HasAddress returns a boolean if a field has been set.

### GetCity

`func (o *Customers) GetCity() string`

GetCity returns the City field if non-nil, zero value otherwise.

### GetCityOk

`func (o *Customers) GetCityOk() (*string, bool)`

GetCityOk returns a tuple with the City field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCity

`func (o *Customers) SetCity(v string)`

SetCity sets City field to given value.

### HasCity

`func (o *Customers) HasCity() bool`

HasCity returns a boolean if a field has been set.

### GetCountry

`func (o *Customers) GetCountry() string`

GetCountry returns the Country field if non-nil, zero value otherwise.

### GetCountryOk

`func (o *Customers) GetCountryOk() (*string, bool)`

GetCountryOk returns a tuple with the Country field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountry

`func (o *Customers) SetCountry(v string)`

SetCountry sets Country field to given value.

### HasCountry

`func (o *Customers) HasCountry() bool`

HasCountry returns a boolean if a field has been set.

### GetCreatedAt

`func (o *Customers) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *Customers) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *Customers) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *Customers) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetCreatedBy

`func (o *Customers) GetCreatedBy() string`

GetCreatedBy returns the CreatedBy field if non-nil, zero value otherwise.

### GetCreatedByOk

`func (o *Customers) GetCreatedByOk() (*string, bool)`

GetCreatedByOk returns a tuple with the CreatedBy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedBy

`func (o *Customers) SetCreatedBy(v string)`

SetCreatedBy sets CreatedBy field to given value.

### HasCreatedBy

`func (o *Customers) HasCreatedBy() bool`

HasCreatedBy returns a boolean if a field has been set.

### GetCustomerId

`func (o *Customers) GetCustomerId() string`

GetCustomerId returns the CustomerId field if non-nil, zero value otherwise.

### GetCustomerIdOk

`func (o *Customers) GetCustomerIdOk() (*string, bool)`

GetCustomerIdOk returns a tuple with the CustomerId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustomerId

`func (o *Customers) SetCustomerId(v string)`

SetCustomerId sets CustomerId field to given value.

### HasCustomerId

`func (o *Customers) HasCustomerId() bool`

HasCustomerId returns a boolean if a field has been set.

### GetDeletedAt

`func (o *Customers) GetDeletedAt() time.Time`

GetDeletedAt returns the DeletedAt field if non-nil, zero value otherwise.

### GetDeletedAtOk

`func (o *Customers) GetDeletedAtOk() (*time.Time, bool)`

GetDeletedAtOk returns a tuple with the DeletedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDeletedAt

`func (o *Customers) SetDeletedAt(v time.Time)`

SetDeletedAt sets DeletedAt field to given value.

### HasDeletedAt

`func (o *Customers) HasDeletedAt() bool`

HasDeletedAt returns a boolean if a field has been set.

### GetEmail

`func (o *Customers) GetEmail() string`

GetEmail returns the Email field if non-nil, zero value otherwise.

### GetEmailOk

`func (o *Customers) GetEmailOk() (*string, bool)`

GetEmailOk returns a tuple with the Email field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEmail

`func (o *Customers) SetEmail(v string)`

SetEmail sets Email field to given value.

### HasEmail

`func (o *Customers) HasEmail() bool`

HasEmail returns a boolean if a field has been set.

### GetEnvironment

`func (o *Customers) GetEnvironment() string`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *Customers) GetEnvironmentOk() (*string, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *Customers) SetEnvironment(v string)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *Customers) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetIsBusiness

`func (o *Customers) GetIsBusiness() bool`

GetIsBusiness returns the IsBusiness field if non-nil, zero value otherwise.

### GetIsBusinessOk

`func (o *Customers) GetIsBusinessOk() (*bool, bool)`

GetIsBusinessOk returns a tuple with the IsBusiness field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsBusiness

`func (o *Customers) SetIsBusiness(v bool)`

SetIsBusiness sets IsBusiness field to given value.

### HasIsBusiness

`func (o *Customers) HasIsBusiness() bool`

HasIsBusiness returns a boolean if a field has been set.

### GetIsDeleted

`func (o *Customers) GetIsDeleted() bool`

GetIsDeleted returns the IsDeleted field if non-nil, zero value otherwise.

### GetIsDeletedOk

`func (o *Customers) GetIsDeletedOk() (*bool, bool)`

GetIsDeletedOk returns a tuple with the IsDeleted field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsDeleted

`func (o *Customers) SetIsDeleted(v bool)`

SetIsDeleted sets IsDeleted field to given value.

### HasIsDeleted

`func (o *Customers) HasIsDeleted() bool`

HasIsDeleted returns a boolean if a field has been set.

### GetMetadata

`func (o *Customers) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *Customers) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *Customers) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *Customers) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetName

`func (o *Customers) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *Customers) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *Customers) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *Customers) HasName() bool`

HasName returns a boolean if a field has been set.

### GetOrganizationId

`func (o *Customers) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *Customers) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *Customers) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *Customers) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetPhoneNumber

`func (o *Customers) GetPhoneNumber() string`

GetPhoneNumber returns the PhoneNumber field if non-nil, zero value otherwise.

### GetPhoneNumberOk

`func (o *Customers) GetPhoneNumberOk() (*string, bool)`

GetPhoneNumberOk returns a tuple with the PhoneNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPhoneNumber

`func (o *Customers) SetPhoneNumber(v string)`

SetPhoneNumber sets PhoneNumber field to given value.

### HasPhoneNumber

`func (o *Customers) HasPhoneNumber() bool`

HasPhoneNumber returns a boolean if a field has been set.

### GetPostalCode

`func (o *Customers) GetPostalCode() string`

GetPostalCode returns the PostalCode field if non-nil, zero value otherwise.

### GetPostalCodeOk

`func (o *Customers) GetPostalCodeOk() (*string, bool)`

GetPostalCodeOk returns a tuple with the PostalCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPostalCode

`func (o *Customers) SetPostalCode(v string)`

SetPostalCode sets PostalCode field to given value.

### HasPostalCode

`func (o *Customers) HasPostalCode() bool`

HasPostalCode returns a boolean if a field has been set.

### GetSpiAliasMbno

`func (o *Customers) GetSpiAliasMbno() string`

GetSpiAliasMbno returns the SpiAliasMbno field if non-nil, zero value otherwise.

### GetSpiAliasMbnoOk

`func (o *Customers) GetSpiAliasMbnoOk() (*string, bool)`

GetSpiAliasMbnoOk returns a tuple with the SpiAliasMbno field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAliasMbno

`func (o *Customers) SetSpiAliasMbno(v string)`

SetSpiAliasMbno sets SpiAliasMbno field to given value.

### HasSpiAliasMbno

`func (o *Customers) HasSpiAliasMbno() bool`

HasSpiAliasMbno returns a boolean if a field has been set.

### GetSpiAliasShid

`func (o *Customers) GetSpiAliasShid() string`

GetSpiAliasShid returns the SpiAliasShid field if non-nil, zero value otherwise.

### GetSpiAliasShidOk

`func (o *Customers) GetSpiAliasShidOk() (*string, bool)`

GetSpiAliasShidOk returns a tuple with the SpiAliasShid field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiAliasShid

`func (o *Customers) SetSpiAliasShid(v string)`

SetSpiAliasShid sets SpiAliasShid field to given value.

### HasSpiAliasShid

`func (o *Customers) HasSpiAliasShid() bool`

HasSpiAliasShid returns a boolean if a field has been set.

### GetSpiPrimaryAlias

`func (o *Customers) GetSpiPrimaryAlias() string`

GetSpiPrimaryAlias returns the SpiPrimaryAlias field if non-nil, zero value otherwise.

### GetSpiPrimaryAliasOk

`func (o *Customers) GetSpiPrimaryAliasOk() (*string, bool)`

GetSpiPrimaryAliasOk returns a tuple with the SpiPrimaryAlias field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiPrimaryAlias

`func (o *Customers) SetSpiPrimaryAlias(v string)`

SetSpiPrimaryAlias sets SpiPrimaryAlias field to given value.

### HasSpiPrimaryAlias

`func (o *Customers) HasSpiPrimaryAlias() bool`

HasSpiPrimaryAlias returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *Customers) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *Customers) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *Customers) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *Customers) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.

### GetWhatsappNumber

`func (o *Customers) GetWhatsappNumber() string`

GetWhatsappNumber returns the WhatsappNumber field if non-nil, zero value otherwise.

### GetWhatsappNumberOk

`func (o *Customers) GetWhatsappNumberOk() (*string, bool)`

GetWhatsappNumberOk returns a tuple with the WhatsappNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWhatsappNumber

`func (o *Customers) SetWhatsappNumber(v string)`

SetWhatsappNumber sets WhatsappNumber field to given value.

### HasWhatsappNumber

`func (o *Customers) HasWhatsappNumber() bool`

HasWhatsappNumber returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


