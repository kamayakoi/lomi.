# Webhooks

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AuthorizedEvents** | Pointer to **string** |  | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**CreatedBy** | Pointer to **string** |  | [optional] [readonly] 
**DeletedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**Environment** | Pointer to **string** |  | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**LastPayload** | Pointer to **map[string]interface{}** |  | [optional] 
**LastResponseBody** | Pointer to **string** |  | [optional] 
**LastResponseStatus** | Pointer to **float64** |  | [optional] 
**LastTriggeredAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**RetryCount** | Pointer to **float64** |  | [optional] 
**SpiEventTypes** | Pointer to **string** |  | [optional] 
**SupportsSpi** | Pointer to **bool** |  | [optional] 
**UpdatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**Url** | Pointer to **string** | URL/URI | [optional] 
**VerificationToken** | Pointer to **string** |  | [optional] 
**WebhookId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 

## Methods

### NewWebhooks

`func NewWebhooks() *Webhooks`

NewWebhooks instantiates a new Webhooks object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewWebhooksWithDefaults

`func NewWebhooksWithDefaults() *Webhooks`

NewWebhooksWithDefaults instantiates a new Webhooks object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAuthorizedEvents

`func (o *Webhooks) GetAuthorizedEvents() string`

GetAuthorizedEvents returns the AuthorizedEvents field if non-nil, zero value otherwise.

### GetAuthorizedEventsOk

`func (o *Webhooks) GetAuthorizedEventsOk() (*string, bool)`

GetAuthorizedEventsOk returns a tuple with the AuthorizedEvents field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAuthorizedEvents

`func (o *Webhooks) SetAuthorizedEvents(v string)`

SetAuthorizedEvents sets AuthorizedEvents field to given value.

### HasAuthorizedEvents

`func (o *Webhooks) HasAuthorizedEvents() bool`

HasAuthorizedEvents returns a boolean if a field has been set.

### GetCreatedAt

`func (o *Webhooks) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *Webhooks) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *Webhooks) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *Webhooks) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetCreatedBy

`func (o *Webhooks) GetCreatedBy() string`

GetCreatedBy returns the CreatedBy field if non-nil, zero value otherwise.

### GetCreatedByOk

`func (o *Webhooks) GetCreatedByOk() (*string, bool)`

GetCreatedByOk returns a tuple with the CreatedBy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedBy

`func (o *Webhooks) SetCreatedBy(v string)`

SetCreatedBy sets CreatedBy field to given value.

### HasCreatedBy

`func (o *Webhooks) HasCreatedBy() bool`

HasCreatedBy returns a boolean if a field has been set.

### GetDeletedAt

`func (o *Webhooks) GetDeletedAt() time.Time`

GetDeletedAt returns the DeletedAt field if non-nil, zero value otherwise.

### GetDeletedAtOk

`func (o *Webhooks) GetDeletedAtOk() (*time.Time, bool)`

GetDeletedAtOk returns a tuple with the DeletedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDeletedAt

`func (o *Webhooks) SetDeletedAt(v time.Time)`

SetDeletedAt sets DeletedAt field to given value.

### HasDeletedAt

`func (o *Webhooks) HasDeletedAt() bool`

HasDeletedAt returns a boolean if a field has been set.

### GetEnvironment

`func (o *Webhooks) GetEnvironment() string`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *Webhooks) GetEnvironmentOk() (*string, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *Webhooks) SetEnvironment(v string)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *Webhooks) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetIsActive

`func (o *Webhooks) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *Webhooks) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *Webhooks) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *Webhooks) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetLastPayload

`func (o *Webhooks) GetLastPayload() map[string]interface{}`

GetLastPayload returns the LastPayload field if non-nil, zero value otherwise.

### GetLastPayloadOk

`func (o *Webhooks) GetLastPayloadOk() (*map[string]interface{}, bool)`

GetLastPayloadOk returns a tuple with the LastPayload field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastPayload

`func (o *Webhooks) SetLastPayload(v map[string]interface{})`

SetLastPayload sets LastPayload field to given value.

### HasLastPayload

`func (o *Webhooks) HasLastPayload() bool`

HasLastPayload returns a boolean if a field has been set.

### GetLastResponseBody

`func (o *Webhooks) GetLastResponseBody() string`

GetLastResponseBody returns the LastResponseBody field if non-nil, zero value otherwise.

### GetLastResponseBodyOk

`func (o *Webhooks) GetLastResponseBodyOk() (*string, bool)`

GetLastResponseBodyOk returns a tuple with the LastResponseBody field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastResponseBody

`func (o *Webhooks) SetLastResponseBody(v string)`

SetLastResponseBody sets LastResponseBody field to given value.

### HasLastResponseBody

`func (o *Webhooks) HasLastResponseBody() bool`

HasLastResponseBody returns a boolean if a field has been set.

### GetLastResponseStatus

`func (o *Webhooks) GetLastResponseStatus() float64`

GetLastResponseStatus returns the LastResponseStatus field if non-nil, zero value otherwise.

### GetLastResponseStatusOk

`func (o *Webhooks) GetLastResponseStatusOk() (*float64, bool)`

GetLastResponseStatusOk returns a tuple with the LastResponseStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastResponseStatus

`func (o *Webhooks) SetLastResponseStatus(v float64)`

SetLastResponseStatus sets LastResponseStatus field to given value.

### HasLastResponseStatus

`func (o *Webhooks) HasLastResponseStatus() bool`

HasLastResponseStatus returns a boolean if a field has been set.

### GetLastTriggeredAt

`func (o *Webhooks) GetLastTriggeredAt() time.Time`

GetLastTriggeredAt returns the LastTriggeredAt field if non-nil, zero value otherwise.

### GetLastTriggeredAtOk

`func (o *Webhooks) GetLastTriggeredAtOk() (*time.Time, bool)`

GetLastTriggeredAtOk returns a tuple with the LastTriggeredAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastTriggeredAt

`func (o *Webhooks) SetLastTriggeredAt(v time.Time)`

SetLastTriggeredAt sets LastTriggeredAt field to given value.

### HasLastTriggeredAt

`func (o *Webhooks) HasLastTriggeredAt() bool`

HasLastTriggeredAt returns a boolean if a field has been set.

### GetMetadata

`func (o *Webhooks) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *Webhooks) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *Webhooks) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *Webhooks) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetOrganizationId

`func (o *Webhooks) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *Webhooks) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *Webhooks) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *Webhooks) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetRetryCount

`func (o *Webhooks) GetRetryCount() float64`

GetRetryCount returns the RetryCount field if non-nil, zero value otherwise.

### GetRetryCountOk

`func (o *Webhooks) GetRetryCountOk() (*float64, bool)`

GetRetryCountOk returns a tuple with the RetryCount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRetryCount

`func (o *Webhooks) SetRetryCount(v float64)`

SetRetryCount sets RetryCount field to given value.

### HasRetryCount

`func (o *Webhooks) HasRetryCount() bool`

HasRetryCount returns a boolean if a field has been set.

### GetSpiEventTypes

`func (o *Webhooks) GetSpiEventTypes() string`

GetSpiEventTypes returns the SpiEventTypes field if non-nil, zero value otherwise.

### GetSpiEventTypesOk

`func (o *Webhooks) GetSpiEventTypesOk() (*string, bool)`

GetSpiEventTypesOk returns a tuple with the SpiEventTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiEventTypes

`func (o *Webhooks) SetSpiEventTypes(v string)`

SetSpiEventTypes sets SpiEventTypes field to given value.

### HasSpiEventTypes

`func (o *Webhooks) HasSpiEventTypes() bool`

HasSpiEventTypes returns a boolean if a field has been set.

### GetSupportsSpi

`func (o *Webhooks) GetSupportsSpi() bool`

GetSupportsSpi returns the SupportsSpi field if non-nil, zero value otherwise.

### GetSupportsSpiOk

`func (o *Webhooks) GetSupportsSpiOk() (*bool, bool)`

GetSupportsSpiOk returns a tuple with the SupportsSpi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSupportsSpi

`func (o *Webhooks) SetSupportsSpi(v bool)`

SetSupportsSpi sets SupportsSpi field to given value.

### HasSupportsSpi

`func (o *Webhooks) HasSupportsSpi() bool`

HasSupportsSpi returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *Webhooks) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *Webhooks) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *Webhooks) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *Webhooks) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.

### GetUrl

`func (o *Webhooks) GetUrl() string`

GetUrl returns the Url field if non-nil, zero value otherwise.

### GetUrlOk

`func (o *Webhooks) GetUrlOk() (*string, bool)`

GetUrlOk returns a tuple with the Url field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUrl

`func (o *Webhooks) SetUrl(v string)`

SetUrl sets Url field to given value.

### HasUrl

`func (o *Webhooks) HasUrl() bool`

HasUrl returns a boolean if a field has been set.

### GetVerificationToken

`func (o *Webhooks) GetVerificationToken() string`

GetVerificationToken returns the VerificationToken field if non-nil, zero value otherwise.

### GetVerificationTokenOk

`func (o *Webhooks) GetVerificationTokenOk() (*string, bool)`

GetVerificationTokenOk returns a tuple with the VerificationToken field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetVerificationToken

`func (o *Webhooks) SetVerificationToken(v string)`

SetVerificationToken sets VerificationToken field to given value.

### HasVerificationToken

`func (o *Webhooks) HasVerificationToken() bool`

HasVerificationToken returns a boolean if a field has been set.

### GetWebhookId

`func (o *Webhooks) GetWebhookId() string`

GetWebhookId returns the WebhookId field if non-nil, zero value otherwise.

### GetWebhookIdOk

`func (o *Webhooks) GetWebhookIdOk() (*string, bool)`

GetWebhookIdOk returns a tuple with the WebhookId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWebhookId

`func (o *Webhooks) SetWebhookId(v string)`

SetWebhookId sets WebhookId field to given value.

### HasWebhookId

`func (o *Webhooks) HasWebhookId() bool`

HasWebhookId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


