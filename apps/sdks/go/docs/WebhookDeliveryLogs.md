# WebhookDeliveryLogs

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AttemptNumber** | Pointer to **float64** |  | [optional] 
**ComptePaye** | Pointer to **string** |  | [optional] 
**ComptePayeur** | Pointer to **string** |  | [optional] 
**CreatedAt** | Pointer to **time.Time** | ISO 8601 datetime | [optional] [readonly] 
**EventType** | Pointer to **string** |  | [optional] 
**Headers** | Pointer to **map[string]interface{}** |  | [optional] 
**IpAddress** | Pointer to **string** |  | [optional] 
**LogId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Montant** | Pointer to **float64** |  | [optional] 
**OrganizationId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Payload** | Pointer to **map[string]interface{}** |  | [optional] 
**RequestDurationMs** | Pointer to **float64** |  | [optional] 
**ResponseBody** | Pointer to **string** |  | [optional] 
**ResponseStatus** | Pointer to **float64** |  | [optional] 
**SpiEventCode** | Pointer to **string** |  | [optional] 
**SpiTxId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Success** | Pointer to **bool** |  | [optional] 
**UserAgent** | Pointer to **string** |  | [optional] 
**WebhookId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 

## Methods

### NewWebhookDeliveryLogs

`func NewWebhookDeliveryLogs() *WebhookDeliveryLogs`

NewWebhookDeliveryLogs instantiates a new WebhookDeliveryLogs object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewWebhookDeliveryLogsWithDefaults

`func NewWebhookDeliveryLogsWithDefaults() *WebhookDeliveryLogs`

NewWebhookDeliveryLogsWithDefaults instantiates a new WebhookDeliveryLogs object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAttemptNumber

`func (o *WebhookDeliveryLogs) GetAttemptNumber() float64`

GetAttemptNumber returns the AttemptNumber field if non-nil, zero value otherwise.

### GetAttemptNumberOk

`func (o *WebhookDeliveryLogs) GetAttemptNumberOk() (*float64, bool)`

GetAttemptNumberOk returns a tuple with the AttemptNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAttemptNumber

`func (o *WebhookDeliveryLogs) SetAttemptNumber(v float64)`

SetAttemptNumber sets AttemptNumber field to given value.

### HasAttemptNumber

`func (o *WebhookDeliveryLogs) HasAttemptNumber() bool`

HasAttemptNumber returns a boolean if a field has been set.

### GetComptePaye

`func (o *WebhookDeliveryLogs) GetComptePaye() string`

GetComptePaye returns the ComptePaye field if non-nil, zero value otherwise.

### GetComptePayeOk

`func (o *WebhookDeliveryLogs) GetComptePayeOk() (*string, bool)`

GetComptePayeOk returns a tuple with the ComptePaye field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetComptePaye

`func (o *WebhookDeliveryLogs) SetComptePaye(v string)`

SetComptePaye sets ComptePaye field to given value.

### HasComptePaye

`func (o *WebhookDeliveryLogs) HasComptePaye() bool`

HasComptePaye returns a boolean if a field has been set.

### GetComptePayeur

`func (o *WebhookDeliveryLogs) GetComptePayeur() string`

GetComptePayeur returns the ComptePayeur field if non-nil, zero value otherwise.

### GetComptePayeurOk

`func (o *WebhookDeliveryLogs) GetComptePayeurOk() (*string, bool)`

GetComptePayeurOk returns a tuple with the ComptePayeur field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetComptePayeur

`func (o *WebhookDeliveryLogs) SetComptePayeur(v string)`

SetComptePayeur sets ComptePayeur field to given value.

### HasComptePayeur

`func (o *WebhookDeliveryLogs) HasComptePayeur() bool`

HasComptePayeur returns a boolean if a field has been set.

### GetCreatedAt

`func (o *WebhookDeliveryLogs) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *WebhookDeliveryLogs) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *WebhookDeliveryLogs) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *WebhookDeliveryLogs) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetEventType

`func (o *WebhookDeliveryLogs) GetEventType() string`

GetEventType returns the EventType field if non-nil, zero value otherwise.

### GetEventTypeOk

`func (o *WebhookDeliveryLogs) GetEventTypeOk() (*string, bool)`

GetEventTypeOk returns a tuple with the EventType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventType

`func (o *WebhookDeliveryLogs) SetEventType(v string)`

SetEventType sets EventType field to given value.

### HasEventType

`func (o *WebhookDeliveryLogs) HasEventType() bool`

HasEventType returns a boolean if a field has been set.

### GetHeaders

`func (o *WebhookDeliveryLogs) GetHeaders() map[string]interface{}`

GetHeaders returns the Headers field if non-nil, zero value otherwise.

### GetHeadersOk

`func (o *WebhookDeliveryLogs) GetHeadersOk() (*map[string]interface{}, bool)`

GetHeadersOk returns a tuple with the Headers field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetHeaders

`func (o *WebhookDeliveryLogs) SetHeaders(v map[string]interface{})`

SetHeaders sets Headers field to given value.

### HasHeaders

`func (o *WebhookDeliveryLogs) HasHeaders() bool`

HasHeaders returns a boolean if a field has been set.

### GetIpAddress

`func (o *WebhookDeliveryLogs) GetIpAddress() string`

GetIpAddress returns the IpAddress field if non-nil, zero value otherwise.

### GetIpAddressOk

`func (o *WebhookDeliveryLogs) GetIpAddressOk() (*string, bool)`

GetIpAddressOk returns a tuple with the IpAddress field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIpAddress

`func (o *WebhookDeliveryLogs) SetIpAddress(v string)`

SetIpAddress sets IpAddress field to given value.

### HasIpAddress

`func (o *WebhookDeliveryLogs) HasIpAddress() bool`

HasIpAddress returns a boolean if a field has been set.

### GetLogId

`func (o *WebhookDeliveryLogs) GetLogId() string`

GetLogId returns the LogId field if non-nil, zero value otherwise.

### GetLogIdOk

`func (o *WebhookDeliveryLogs) GetLogIdOk() (*string, bool)`

GetLogIdOk returns a tuple with the LogId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLogId

`func (o *WebhookDeliveryLogs) SetLogId(v string)`

SetLogId sets LogId field to given value.

### HasLogId

`func (o *WebhookDeliveryLogs) HasLogId() bool`

HasLogId returns a boolean if a field has been set.

### GetMontant

`func (o *WebhookDeliveryLogs) GetMontant() float64`

GetMontant returns the Montant field if non-nil, zero value otherwise.

### GetMontantOk

`func (o *WebhookDeliveryLogs) GetMontantOk() (*float64, bool)`

GetMontantOk returns a tuple with the Montant field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMontant

`func (o *WebhookDeliveryLogs) SetMontant(v float64)`

SetMontant sets Montant field to given value.

### HasMontant

`func (o *WebhookDeliveryLogs) HasMontant() bool`

HasMontant returns a boolean if a field has been set.

### GetOrganizationId

`func (o *WebhookDeliveryLogs) GetOrganizationId() string`

GetOrganizationId returns the OrganizationId field if non-nil, zero value otherwise.

### GetOrganizationIdOk

`func (o *WebhookDeliveryLogs) GetOrganizationIdOk() (*string, bool)`

GetOrganizationIdOk returns a tuple with the OrganizationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganizationId

`func (o *WebhookDeliveryLogs) SetOrganizationId(v string)`

SetOrganizationId sets OrganizationId field to given value.

### HasOrganizationId

`func (o *WebhookDeliveryLogs) HasOrganizationId() bool`

HasOrganizationId returns a boolean if a field has been set.

### GetPayload

`func (o *WebhookDeliveryLogs) GetPayload() map[string]interface{}`

GetPayload returns the Payload field if non-nil, zero value otherwise.

### GetPayloadOk

`func (o *WebhookDeliveryLogs) GetPayloadOk() (*map[string]interface{}, bool)`

GetPayloadOk returns a tuple with the Payload field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayload

`func (o *WebhookDeliveryLogs) SetPayload(v map[string]interface{})`

SetPayload sets Payload field to given value.

### HasPayload

`func (o *WebhookDeliveryLogs) HasPayload() bool`

HasPayload returns a boolean if a field has been set.

### GetRequestDurationMs

`func (o *WebhookDeliveryLogs) GetRequestDurationMs() float64`

GetRequestDurationMs returns the RequestDurationMs field if non-nil, zero value otherwise.

### GetRequestDurationMsOk

`func (o *WebhookDeliveryLogs) GetRequestDurationMsOk() (*float64, bool)`

GetRequestDurationMsOk returns a tuple with the RequestDurationMs field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRequestDurationMs

`func (o *WebhookDeliveryLogs) SetRequestDurationMs(v float64)`

SetRequestDurationMs sets RequestDurationMs field to given value.

### HasRequestDurationMs

`func (o *WebhookDeliveryLogs) HasRequestDurationMs() bool`

HasRequestDurationMs returns a boolean if a field has been set.

### GetResponseBody

`func (o *WebhookDeliveryLogs) GetResponseBody() string`

GetResponseBody returns the ResponseBody field if non-nil, zero value otherwise.

### GetResponseBodyOk

`func (o *WebhookDeliveryLogs) GetResponseBodyOk() (*string, bool)`

GetResponseBodyOk returns a tuple with the ResponseBody field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetResponseBody

`func (o *WebhookDeliveryLogs) SetResponseBody(v string)`

SetResponseBody sets ResponseBody field to given value.

### HasResponseBody

`func (o *WebhookDeliveryLogs) HasResponseBody() bool`

HasResponseBody returns a boolean if a field has been set.

### GetResponseStatus

`func (o *WebhookDeliveryLogs) GetResponseStatus() float64`

GetResponseStatus returns the ResponseStatus field if non-nil, zero value otherwise.

### GetResponseStatusOk

`func (o *WebhookDeliveryLogs) GetResponseStatusOk() (*float64, bool)`

GetResponseStatusOk returns a tuple with the ResponseStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetResponseStatus

`func (o *WebhookDeliveryLogs) SetResponseStatus(v float64)`

SetResponseStatus sets ResponseStatus field to given value.

### HasResponseStatus

`func (o *WebhookDeliveryLogs) HasResponseStatus() bool`

HasResponseStatus returns a boolean if a field has been set.

### GetSpiEventCode

`func (o *WebhookDeliveryLogs) GetSpiEventCode() string`

GetSpiEventCode returns the SpiEventCode field if non-nil, zero value otherwise.

### GetSpiEventCodeOk

`func (o *WebhookDeliveryLogs) GetSpiEventCodeOk() (*string, bool)`

GetSpiEventCodeOk returns a tuple with the SpiEventCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiEventCode

`func (o *WebhookDeliveryLogs) SetSpiEventCode(v string)`

SetSpiEventCode sets SpiEventCode field to given value.

### HasSpiEventCode

`func (o *WebhookDeliveryLogs) HasSpiEventCode() bool`

HasSpiEventCode returns a boolean if a field has been set.

### GetSpiTxId

`func (o *WebhookDeliveryLogs) GetSpiTxId() string`

GetSpiTxId returns the SpiTxId field if non-nil, zero value otherwise.

### GetSpiTxIdOk

`func (o *WebhookDeliveryLogs) GetSpiTxIdOk() (*string, bool)`

GetSpiTxIdOk returns a tuple with the SpiTxId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiTxId

`func (o *WebhookDeliveryLogs) SetSpiTxId(v string)`

SetSpiTxId sets SpiTxId field to given value.

### HasSpiTxId

`func (o *WebhookDeliveryLogs) HasSpiTxId() bool`

HasSpiTxId returns a boolean if a field has been set.

### GetSuccess

`func (o *WebhookDeliveryLogs) GetSuccess() bool`

GetSuccess returns the Success field if non-nil, zero value otherwise.

### GetSuccessOk

`func (o *WebhookDeliveryLogs) GetSuccessOk() (*bool, bool)`

GetSuccessOk returns a tuple with the Success field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccess

`func (o *WebhookDeliveryLogs) SetSuccess(v bool)`

SetSuccess sets Success field to given value.

### HasSuccess

`func (o *WebhookDeliveryLogs) HasSuccess() bool`

HasSuccess returns a boolean if a field has been set.

### GetUserAgent

`func (o *WebhookDeliveryLogs) GetUserAgent() string`

GetUserAgent returns the UserAgent field if non-nil, zero value otherwise.

### GetUserAgentOk

`func (o *WebhookDeliveryLogs) GetUserAgentOk() (*string, bool)`

GetUserAgentOk returns a tuple with the UserAgent field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUserAgent

`func (o *WebhookDeliveryLogs) SetUserAgent(v string)`

SetUserAgent sets UserAgent field to given value.

### HasUserAgent

`func (o *WebhookDeliveryLogs) HasUserAgent() bool`

HasUserAgent returns a boolean if a field has been set.

### GetWebhookId

`func (o *WebhookDeliveryLogs) GetWebhookId() string`

GetWebhookId returns the WebhookId field if non-nil, zero value otherwise.

### GetWebhookIdOk

`func (o *WebhookDeliveryLogs) GetWebhookIdOk() (*string, bool)`

GetWebhookIdOk returns a tuple with the WebhookId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWebhookId

`func (o *WebhookDeliveryLogs) SetWebhookId(v string)`

SetWebhookId sets WebhookId field to given value.

### HasWebhookId

`func (o *WebhookDeliveryLogs) HasWebhookId() bool`

HasWebhookId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


