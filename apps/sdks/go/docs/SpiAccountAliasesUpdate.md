# SpiAccountAliasesUpdate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AccountNumber** | Pointer to **string** |  | [optional] 
**AliasId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**AliasKey** | Pointer to **string** |  | [optional] 
**AliasType** | Pointer to **string** |  | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**IsDefault** | Pointer to **bool** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 

## Methods

### NewSpiAccountAliasesUpdate

`func NewSpiAccountAliasesUpdate() *SpiAccountAliasesUpdate`

NewSpiAccountAliasesUpdate instantiates a new SpiAccountAliasesUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSpiAccountAliasesUpdateWithDefaults

`func NewSpiAccountAliasesUpdateWithDefaults() *SpiAccountAliasesUpdate`

NewSpiAccountAliasesUpdateWithDefaults instantiates a new SpiAccountAliasesUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAccountNumber

`func (o *SpiAccountAliasesUpdate) GetAccountNumber() string`

GetAccountNumber returns the AccountNumber field if non-nil, zero value otherwise.

### GetAccountNumberOk

`func (o *SpiAccountAliasesUpdate) GetAccountNumberOk() (*string, bool)`

GetAccountNumberOk returns a tuple with the AccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAccountNumber

`func (o *SpiAccountAliasesUpdate) SetAccountNumber(v string)`

SetAccountNumber sets AccountNumber field to given value.

### HasAccountNumber

`func (o *SpiAccountAliasesUpdate) HasAccountNumber() bool`

HasAccountNumber returns a boolean if a field has been set.

### GetAliasId

`func (o *SpiAccountAliasesUpdate) GetAliasId() string`

GetAliasId returns the AliasId field if non-nil, zero value otherwise.

### GetAliasIdOk

`func (o *SpiAccountAliasesUpdate) GetAliasIdOk() (*string, bool)`

GetAliasIdOk returns a tuple with the AliasId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAliasId

`func (o *SpiAccountAliasesUpdate) SetAliasId(v string)`

SetAliasId sets AliasId field to given value.

### HasAliasId

`func (o *SpiAccountAliasesUpdate) HasAliasId() bool`

HasAliasId returns a boolean if a field has been set.

### GetAliasKey

`func (o *SpiAccountAliasesUpdate) GetAliasKey() string`

GetAliasKey returns the AliasKey field if non-nil, zero value otherwise.

### GetAliasKeyOk

`func (o *SpiAccountAliasesUpdate) GetAliasKeyOk() (*string, bool)`

GetAliasKeyOk returns a tuple with the AliasKey field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAliasKey

`func (o *SpiAccountAliasesUpdate) SetAliasKey(v string)`

SetAliasKey sets AliasKey field to given value.

### HasAliasKey

`func (o *SpiAccountAliasesUpdate) HasAliasKey() bool`

HasAliasKey returns a boolean if a field has been set.

### GetAliasType

`func (o *SpiAccountAliasesUpdate) GetAliasType() string`

GetAliasType returns the AliasType field if non-nil, zero value otherwise.

### GetAliasTypeOk

`func (o *SpiAccountAliasesUpdate) GetAliasTypeOk() (*string, bool)`

GetAliasTypeOk returns a tuple with the AliasType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAliasType

`func (o *SpiAccountAliasesUpdate) SetAliasType(v string)`

SetAliasType sets AliasType field to given value.

### HasAliasType

`func (o *SpiAccountAliasesUpdate) HasAliasType() bool`

HasAliasType returns a boolean if a field has been set.

### GetIsActive

`func (o *SpiAccountAliasesUpdate) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *SpiAccountAliasesUpdate) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *SpiAccountAliasesUpdate) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *SpiAccountAliasesUpdate) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetIsDefault

`func (o *SpiAccountAliasesUpdate) GetIsDefault() bool`

GetIsDefault returns the IsDefault field if non-nil, zero value otherwise.

### GetIsDefaultOk

`func (o *SpiAccountAliasesUpdate) GetIsDefaultOk() (*bool, bool)`

GetIsDefaultOk returns a tuple with the IsDefault field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsDefault

`func (o *SpiAccountAliasesUpdate) SetIsDefault(v bool)`

SetIsDefault sets IsDefault field to given value.

### HasIsDefault

`func (o *SpiAccountAliasesUpdate) HasIsDefault() bool`

HasIsDefault returns a boolean if a field has been set.

### GetMetadata

`func (o *SpiAccountAliasesUpdate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *SpiAccountAliasesUpdate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *SpiAccountAliasesUpdate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *SpiAccountAliasesUpdate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


