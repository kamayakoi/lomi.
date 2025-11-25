# WebhooksUpdate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AuthorizedEvents** | Pointer to **string** |  | [optional] 
**IsActive** | Pointer to **bool** | Whether this resource is currently active | [optional] 
**LastPayload** | Pointer to **map[string]interface{}** |  | [optional] 
**LastResponseBody** | Pointer to **string** |  | [optional] 
**LastResponseStatus** | Pointer to **float64** |  | [optional] 
**LastTriggeredAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] 
**Metadata** | Pointer to **map[string]interface{}** | Set of key-value pairs for storing additional information | [optional] 
**RetryCount** | Pointer to **float64** |  | [optional] 
**SpiEventTypes** | Pointer to **string** |  | [optional] 
**SupportsSpi** | Pointer to **bool** |  | [optional] 
**Url** | Pointer to **string** | URL/URI | [optional] 
**VerificationToken** | Pointer to **string** |  | [optional] 
**WebhookId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 

## Methods

### NewWebhooksUpdate

`func NewWebhooksUpdate() *WebhooksUpdate`

NewWebhooksUpdate instantiates a new WebhooksUpdate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewWebhooksUpdateWithDefaults

`func NewWebhooksUpdateWithDefaults() *WebhooksUpdate`

NewWebhooksUpdateWithDefaults instantiates a new WebhooksUpdate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAuthorizedEvents

`func (o *WebhooksUpdate) GetAuthorizedEvents() string`

GetAuthorizedEvents returns the AuthorizedEvents field if non-nil, zero value otherwise.

### GetAuthorizedEventsOk

`func (o *WebhooksUpdate) GetAuthorizedEventsOk() (*string, bool)`

GetAuthorizedEventsOk returns a tuple with the AuthorizedEvents field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAuthorizedEvents

`func (o *WebhooksUpdate) SetAuthorizedEvents(v string)`

SetAuthorizedEvents sets AuthorizedEvents field to given value.

### HasAuthorizedEvents

`func (o *WebhooksUpdate) HasAuthorizedEvents() bool`

HasAuthorizedEvents returns a boolean if a field has been set.

### GetIsActive

`func (o *WebhooksUpdate) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *WebhooksUpdate) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *WebhooksUpdate) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *WebhooksUpdate) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetLastPayload

`func (o *WebhooksUpdate) GetLastPayload() map[string]interface{}`

GetLastPayload returns the LastPayload field if non-nil, zero value otherwise.

### GetLastPayloadOk

`func (o *WebhooksUpdate) GetLastPayloadOk() (*map[string]interface{}, bool)`

GetLastPayloadOk returns a tuple with the LastPayload field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastPayload

`func (o *WebhooksUpdate) SetLastPayload(v map[string]interface{})`

SetLastPayload sets LastPayload field to given value.

### HasLastPayload

`func (o *WebhooksUpdate) HasLastPayload() bool`

HasLastPayload returns a boolean if a field has been set.

### GetLastResponseBody

`func (o *WebhooksUpdate) GetLastResponseBody() string`

GetLastResponseBody returns the LastResponseBody field if non-nil, zero value otherwise.

### GetLastResponseBodyOk

`func (o *WebhooksUpdate) GetLastResponseBodyOk() (*string, bool)`

GetLastResponseBodyOk returns a tuple with the LastResponseBody field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastResponseBody

`func (o *WebhooksUpdate) SetLastResponseBody(v string)`

SetLastResponseBody sets LastResponseBody field to given value.

### HasLastResponseBody

`func (o *WebhooksUpdate) HasLastResponseBody() bool`

HasLastResponseBody returns a boolean if a field has been set.

### GetLastResponseStatus

`func (o *WebhooksUpdate) GetLastResponseStatus() float64`

GetLastResponseStatus returns the LastResponseStatus field if non-nil, zero value otherwise.

### GetLastResponseStatusOk

`func (o *WebhooksUpdate) GetLastResponseStatusOk() (*float64, bool)`

GetLastResponseStatusOk returns a tuple with the LastResponseStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastResponseStatus

`func (o *WebhooksUpdate) SetLastResponseStatus(v float64)`

SetLastResponseStatus sets LastResponseStatus field to given value.

### HasLastResponseStatus

`func (o *WebhooksUpdate) HasLastResponseStatus() bool`

HasLastResponseStatus returns a boolean if a field has been set.

### GetLastTriggeredAt

`func (o *WebhooksUpdate) GetLastTriggeredAt() time.Time`

GetLastTriggeredAt returns the LastTriggeredAt field if non-nil, zero value otherwise.

### GetLastTriggeredAtOk

`func (o *WebhooksUpdate) GetLastTriggeredAtOk() (*time.Time, bool)`

GetLastTriggeredAtOk returns a tuple with the LastTriggeredAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastTriggeredAt

`func (o *WebhooksUpdate) SetLastTriggeredAt(v time.Time)`

SetLastTriggeredAt sets LastTriggeredAt field to given value.

### HasLastTriggeredAt

`func (o *WebhooksUpdate) HasLastTriggeredAt() bool`

HasLastTriggeredAt returns a boolean if a field has been set.

### GetMetadata

`func (o *WebhooksUpdate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *WebhooksUpdate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *WebhooksUpdate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *WebhooksUpdate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetRetryCount

`func (o *WebhooksUpdate) GetRetryCount() float64`

GetRetryCount returns the RetryCount field if non-nil, zero value otherwise.

### GetRetryCountOk

`func (o *WebhooksUpdate) GetRetryCountOk() (*float64, bool)`

GetRetryCountOk returns a tuple with the RetryCount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRetryCount

`func (o *WebhooksUpdate) SetRetryCount(v float64)`

SetRetryCount sets RetryCount field to given value.

### HasRetryCount

`func (o *WebhooksUpdate) HasRetryCount() bool`

HasRetryCount returns a boolean if a field has been set.

### GetSpiEventTypes

`func (o *WebhooksUpdate) GetSpiEventTypes() string`

GetSpiEventTypes returns the SpiEventTypes field if non-nil, zero value otherwise.

### GetSpiEventTypesOk

`func (o *WebhooksUpdate) GetSpiEventTypesOk() (*string, bool)`

GetSpiEventTypesOk returns a tuple with the SpiEventTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiEventTypes

`func (o *WebhooksUpdate) SetSpiEventTypes(v string)`

SetSpiEventTypes sets SpiEventTypes field to given value.

### HasSpiEventTypes

`func (o *WebhooksUpdate) HasSpiEventTypes() bool`

HasSpiEventTypes returns a boolean if a field has been set.

### GetSupportsSpi

`func (o *WebhooksUpdate) GetSupportsSpi() bool`

GetSupportsSpi returns the SupportsSpi field if non-nil, zero value otherwise.

### GetSupportsSpiOk

`func (o *WebhooksUpdate) GetSupportsSpiOk() (*bool, bool)`

GetSupportsSpiOk returns a tuple with the SupportsSpi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSupportsSpi

`func (o *WebhooksUpdate) SetSupportsSpi(v bool)`

SetSupportsSpi sets SupportsSpi field to given value.

### HasSupportsSpi

`func (o *WebhooksUpdate) HasSupportsSpi() bool`

HasSupportsSpi returns a boolean if a field has been set.

### GetUrl

`func (o *WebhooksUpdate) GetUrl() string`

GetUrl returns the Url field if non-nil, zero value otherwise.

### GetUrlOk

`func (o *WebhooksUpdate) GetUrlOk() (*string, bool)`

GetUrlOk returns a tuple with the Url field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUrl

`func (o *WebhooksUpdate) SetUrl(v string)`

SetUrl sets Url field to given value.

### HasUrl

`func (o *WebhooksUpdate) HasUrl() bool`

HasUrl returns a boolean if a field has been set.

### GetVerificationToken

`func (o *WebhooksUpdate) GetVerificationToken() string`

GetVerificationToken returns the VerificationToken field if non-nil, zero value otherwise.

### GetVerificationTokenOk

`func (o *WebhooksUpdate) GetVerificationTokenOk() (*string, bool)`

GetVerificationTokenOk returns a tuple with the VerificationToken field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetVerificationToken

`func (o *WebhooksUpdate) SetVerificationToken(v string)`

SetVerificationToken sets VerificationToken field to given value.

### HasVerificationToken

`func (o *WebhooksUpdate) HasVerificationToken() bool`

HasVerificationToken returns a boolean if a field has been set.

### GetWebhookId

`func (o *WebhooksUpdate) GetWebhookId() string`

GetWebhookId returns the WebhookId field if non-nil, zero value otherwise.

### GetWebhookIdOk

`func (o *WebhooksUpdate) GetWebhookIdOk() (*string, bool)`

GetWebhookIdOk returns a tuple with the WebhookId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWebhookId

`func (o *WebhooksUpdate) SetWebhookId(v string)`

SetWebhookId sets WebhookId field to given value.

### HasWebhookId

`func (o *WebhooksUpdate) HasWebhookId() bool`

HasWebhookId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


