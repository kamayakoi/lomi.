# SpiAccountAliases

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AccountNumber** | Pointer to **string** |  | [optional] 
**AliasId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**AliasKey** | Pointer to **string** |  | [optional] 
**AliasType** | Pointer to **string** |  | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**IsDefault** | Pointer to **bool** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 

## Methods

### NewSpiAccountAliases

`func NewSpiAccountAliases() *SpiAccountAliases`

NewSpiAccountAliases instantiates a new SpiAccountAliases object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSpiAccountAliasesWithDefaults

`func NewSpiAccountAliasesWithDefaults() *SpiAccountAliases`

NewSpiAccountAliasesWithDefaults instantiates a new SpiAccountAliases object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAccountNumber

`func (o *SpiAccountAliases) GetAccountNumber() string`

GetAccountNumber returns the AccountNumber field if non-nil, zero value otherwise.

### GetAccountNumberOk

`func (o *SpiAccountAliases) GetAccountNumberOk() (*string, bool)`

GetAccountNumberOk returns a tuple with the AccountNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAccountNumber

`func (o *SpiAccountAliases) SetAccountNumber(v string)`

SetAccountNumber sets AccountNumber field to given value.

### HasAccountNumber

`func (o *SpiAccountAliases) HasAccountNumber() bool`

HasAccountNumber returns a boolean if a field has been set.

### GetAliasId

`func (o *SpiAccountAliases) GetAliasId() string`

GetAliasId returns the AliasId field if non-nil, zero value otherwise.

### GetAliasIdOk

`func (o *SpiAccountAliases) GetAliasIdOk() (*string, bool)`

GetAliasIdOk returns a tuple with the AliasId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAliasId

`func (o *SpiAccountAliases) SetAliasId(v string)`

SetAliasId sets AliasId field to given value.

### HasAliasId

`func (o *SpiAccountAliases) HasAliasId() bool`

HasAliasId returns a boolean if a field has been set.

### GetAliasKey

`func (o *SpiAccountAliases) GetAliasKey() string`

GetAliasKey returns the AliasKey field if non-nil, zero value otherwise.

### GetAliasKeyOk

`func (o *SpiAccountAliases) GetAliasKeyOk() (*string, bool)`

GetAliasKeyOk returns a tuple with the AliasKey field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAliasKey

`func (o *SpiAccountAliases) SetAliasKey(v string)`

SetAliasKey sets AliasKey field to given value.

### HasAliasKey

`func (o *SpiAccountAliases) HasAliasKey() bool`

HasAliasKey returns a boolean if a field has been set.

### GetAliasType

`func (o *SpiAccountAliases) GetAliasType() string`

GetAliasType returns the AliasType field if non-nil, zero value otherwise.

### GetAliasTypeOk

`func (o *SpiAccountAliases) GetAliasTypeOk() (*string, bool)`

GetAliasTypeOk returns a tuple with the AliasType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAliasType

`func (o *SpiAccountAliases) SetAliasType(v string)`

SetAliasType sets AliasType field to given value.

### HasAliasType

`func (o *SpiAccountAliases) HasAliasType() bool`

HasAliasType returns a boolean if a field has been set.

### GetCreatedAt

`func (o *SpiAccountAliases) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *SpiAccountAliases) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *SpiAccountAliases) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *SpiAccountAliases) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetIsActive

`func (o *SpiAccountAliases) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *SpiAccountAliases) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *SpiAccountAliases) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *SpiAccountAliases) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetIsDefault

`func (o *SpiAccountAliases) GetIsDefault() bool`

GetIsDefault returns the IsDefault field if non-nil, zero value otherwise.

### GetIsDefaultOk

`func (o *SpiAccountAliases) GetIsDefaultOk() (*bool, bool)`

GetIsDefaultOk returns a tuple with the IsDefault field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsDefault

`func (o *SpiAccountAliases) SetIsDefault(v bool)`

SetIsDefault sets IsDefault field to given value.

### HasIsDefault

`func (o *SpiAccountAliases) HasIsDefault() bool`

HasIsDefault returns a boolean if a field has been set.

### GetMetadata

`func (o *SpiAccountAliases) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *SpiAccountAliases) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *SpiAccountAliases) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *SpiAccountAliases) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetOrganizationId

`func (o *SpiAccountAliases) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *SpiAccountAliases) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *SpiAccountAliases) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *SpiAccountAliases) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *SpiAccountAliases) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *SpiAccountAliases) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *SpiAccountAliases) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *SpiAccountAliases) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


