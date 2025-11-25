# WebhooksCreate

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

### NewWebhooksCreate

`func NewWebhooksCreate() *WebhooksCreate`

NewWebhooksCreate instantiates a new WebhooksCreate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewWebhooksCreateWithDefaults

`func NewWebhooksCreateWithDefaults() *WebhooksCreate`

NewWebhooksCreateWithDefaults instantiates a new WebhooksCreate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAuthorizedEvents

`func (o *WebhooksCreate) GetAuthorizedEvents() string`

GetAuthorizedEvents returns the AuthorizedEvents field if non-nil, zero value otherwise.

### GetAuthorizedEventsOk

`func (o *WebhooksCreate) GetAuthorizedEventsOk() (*string, bool)`

GetAuthorizedEventsOk returns a tuple with the AuthorizedEvents field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAuthorizedEvents

`func (o *WebhooksCreate) SetAuthorizedEvents(v string)`

SetAuthorizedEvents sets AuthorizedEvents field to given value.

### HasAuthorizedEvents

`func (o *WebhooksCreate) HasAuthorizedEvents() bool`

HasAuthorizedEvents returns a boolean if a field has been set.

### GetIsActive

`func (o *WebhooksCreate) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *WebhooksCreate) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *WebhooksCreate) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *WebhooksCreate) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetLastPayload

`func (o *WebhooksCreate) GetLastPayload() map[string]interface{}`

GetLastPayload returns the LastPayload field if non-nil, zero value otherwise.

### GetLastPayloadOk

`func (o *WebhooksCreate) GetLastPayloadOk() (*map[string]interface{}, bool)`

GetLastPayloadOk returns a tuple with the LastPayload field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastPayload

`func (o *WebhooksCreate) SetLastPayload(v map[string]interface{})`

SetLastPayload sets LastPayload field to given value.

### HasLastPayload

`func (o *WebhooksCreate) HasLastPayload() bool`

HasLastPayload returns a boolean if a field has been set.

### GetLastResponseBody

`func (o *WebhooksCreate) GetLastResponseBody() string`

GetLastResponseBody returns the LastResponseBody field if non-nil, zero value otherwise.

### GetLastResponseBodyOk

`func (o *WebhooksCreate) GetLastResponseBodyOk() (*string, bool)`

GetLastResponseBodyOk returns a tuple with the LastResponseBody field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastResponseBody

`func (o *WebhooksCreate) SetLastResponseBody(v string)`

SetLastResponseBody sets LastResponseBody field to given value.

### HasLastResponseBody

`func (o *WebhooksCreate) HasLastResponseBody() bool`

HasLastResponseBody returns a boolean if a field has been set.

### GetLastResponseStatus

`func (o *WebhooksCreate) GetLastResponseStatus() float64`

GetLastResponseStatus returns the LastResponseStatus field if non-nil, zero value otherwise.

### GetLastResponseStatusOk

`func (o *WebhooksCreate) GetLastResponseStatusOk() (*float64, bool)`

GetLastResponseStatusOk returns a tuple with the LastResponseStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastResponseStatus

`func (o *WebhooksCreate) SetLastResponseStatus(v float64)`

SetLastResponseStatus sets LastResponseStatus field to given value.

### HasLastResponseStatus

`func (o *WebhooksCreate) HasLastResponseStatus() bool`

HasLastResponseStatus returns a boolean if a field has been set.

### GetLastTriggeredAt

`func (o *WebhooksCreate) GetLastTriggeredAt() time.Time`

GetLastTriggeredAt returns the LastTriggeredAt field if non-nil, zero value otherwise.

### GetLastTriggeredAtOk

`func (o *WebhooksCreate) GetLastTriggeredAtOk() (*time.Time, bool)`

GetLastTriggeredAtOk returns a tuple with the LastTriggeredAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastTriggeredAt

`func (o *WebhooksCreate) SetLastTriggeredAt(v time.Time)`

SetLastTriggeredAt sets LastTriggeredAt field to given value.

### HasLastTriggeredAt

`func (o *WebhooksCreate) HasLastTriggeredAt() bool`

HasLastTriggeredAt returns a boolean if a field has been set.

### GetMetadata

`func (o *WebhooksCreate) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *WebhooksCreate) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *WebhooksCreate) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *WebhooksCreate) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetRetryCount

`func (o *WebhooksCreate) GetRetryCount() float64`

GetRetryCount returns the RetryCount field if non-nil, zero value otherwise.

### GetRetryCountOk

`func (o *WebhooksCreate) GetRetryCountOk() (*float64, bool)`

GetRetryCountOk returns a tuple with the RetryCount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRetryCount

`func (o *WebhooksCreate) SetRetryCount(v float64)`

SetRetryCount sets RetryCount field to given value.

### HasRetryCount

`func (o *WebhooksCreate) HasRetryCount() bool`

HasRetryCount returns a boolean if a field has been set.

### GetSpiEventTypes

`func (o *WebhooksCreate) GetSpiEventTypes() string`

GetSpiEventTypes returns the SpiEventTypes field if non-nil, zero value otherwise.

### GetSpiEventTypesOk

`func (o *WebhooksCreate) GetSpiEventTypesOk() (*string, bool)`

GetSpiEventTypesOk returns a tuple with the SpiEventTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiEventTypes

`func (o *WebhooksCreate) SetSpiEventTypes(v string)`

SetSpiEventTypes sets SpiEventTypes field to given value.

### HasSpiEventTypes

`func (o *WebhooksCreate) HasSpiEventTypes() bool`

HasSpiEventTypes returns a boolean if a field has been set.

### GetSupportsSpi

`func (o *WebhooksCreate) GetSupportsSpi() bool`

GetSupportsSpi returns the SupportsSpi field if non-nil, zero value otherwise.

### GetSupportsSpiOk

`func (o *WebhooksCreate) GetSupportsSpiOk() (*bool, bool)`

GetSupportsSpiOk returns a tuple with the SupportsSpi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSupportsSpi

`func (o *WebhooksCreate) SetSupportsSpi(v bool)`

SetSupportsSpi sets SupportsSpi field to given value.

### HasSupportsSpi

`func (o *WebhooksCreate) HasSupportsSpi() bool`

HasSupportsSpi returns a boolean if a field has been set.

### GetUrl

`func (o *WebhooksCreate) GetUrl() string`

GetUrl returns the Url field if non-nil, zero value otherwise.

### GetUrlOk

`func (o *WebhooksCreate) GetUrlOk() (*string, bool)`

GetUrlOk returns a tuple with the Url field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUrl

`func (o *WebhooksCreate) SetUrl(v string)`

SetUrl sets Url field to given value.

### HasUrl

`func (o *WebhooksCreate) HasUrl() bool`

HasUrl returns a boolean if a field has been set.

### GetVerificationToken

`func (o *WebhooksCreate) GetVerificationToken() string`

GetVerificationToken returns the VerificationToken field if non-nil, zero value otherwise.

### GetVerificationTokenOk

`func (o *WebhooksCreate) GetVerificationTokenOk() (*string, bool)`

GetVerificationTokenOk returns a tuple with the VerificationToken field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetVerificationToken

`func (o *WebhooksCreate) SetVerificationToken(v string)`

SetVerificationToken sets VerificationToken field to given value.

### HasVerificationToken

`func (o *WebhooksCreate) HasVerificationToken() bool`

HasVerificationToken returns a boolean if a field has been set.

### GetWebhookId

`func (o *WebhooksCreate) GetWebhookId() string`

GetWebhookId returns the WebhookId field if non-nil, zero value otherwise.

### GetWebhookIdOk

`func (o *WebhooksCreate) GetWebhookIdOk() (*string, bool)`

GetWebhookIdOk returns a tuple with the WebhookId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWebhookId

`func (o *WebhooksCreate) SetWebhookId(v string)`

SetWebhookId sets WebhookId field to given value.

### HasWebhookId

`func (o *WebhooksCreate) HasWebhookId() bool`

HasWebhookId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


