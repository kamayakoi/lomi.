# WebhookDeliveryLogsCreate

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AttemptNumber** | Pointer to **float64** |  | [optional] 
**ComptePaye** | Pointer to **string** |  | [optional] 
**ComptePayeur** | Pointer to **string** |  | [optional] 
**EventType** | Pointer to **string** |  | [optional] 
**Headers** | Pointer to **map[string]interface{}** |  | [optional] 
**IpAddress** | Pointer to **string** |  | [optional] 
**LogId** | Pointer to **string** | Unique identifier (UUID format) | [optional] 
**Montant** | Pointer to **float64** |  | [optional] 
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

### NewWebhookDeliveryLogsCreate

`func NewWebhookDeliveryLogsCreate() *WebhookDeliveryLogsCreate`

NewWebhookDeliveryLogsCreate instantiates a new WebhookDeliveryLogsCreate object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewWebhookDeliveryLogsCreateWithDefaults

`func NewWebhookDeliveryLogsCreateWithDefaults() *WebhookDeliveryLogsCreate`

NewWebhookDeliveryLogsCreateWithDefaults instantiates a new WebhookDeliveryLogsCreate object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAttemptNumber

`func (o *WebhookDeliveryLogsCreate) GetAttemptNumber() float64`

GetAttemptNumber returns the AttemptNumber field if non-nil, zero value otherwise.

### GetAttemptNumberOk

`func (o *WebhookDeliveryLogsCreate) GetAttemptNumberOk() (*float64, bool)`

GetAttemptNumberOk returns a tuple with the AttemptNumber field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAttemptNumber

`func (o *WebhookDeliveryLogsCreate) SetAttemptNumber(v float64)`

SetAttemptNumber sets AttemptNumber field to given value.

### HasAttemptNumber

`func (o *WebhookDeliveryLogsCreate) HasAttemptNumber() bool`

HasAttemptNumber returns a boolean if a field has been set.

### GetComptePaye

`func (o *WebhookDeliveryLogsCreate) GetComptePaye() string`

GetComptePaye returns the ComptePaye field if non-nil, zero value otherwise.

### GetComptePayeOk

`func (o *WebhookDeliveryLogsCreate) GetComptePayeOk() (*string, bool)`

GetComptePayeOk returns a tuple with the ComptePaye field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetComptePaye

`func (o *WebhookDeliveryLogsCreate) SetComptePaye(v string)`

SetComptePaye sets ComptePaye field to given value.

### HasComptePaye

`func (o *WebhookDeliveryLogsCreate) HasComptePaye() bool`

HasComptePaye returns a boolean if a field has been set.

### GetComptePayeur

`func (o *WebhookDeliveryLogsCreate) GetComptePayeur() string`

GetComptePayeur returns the ComptePayeur field if non-nil, zero value otherwise.

### GetComptePayeurOk

`func (o *WebhookDeliveryLogsCreate) GetComptePayeurOk() (*string, bool)`

GetComptePayeurOk returns a tuple with the ComptePayeur field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetComptePayeur

`func (o *WebhookDeliveryLogsCreate) SetComptePayeur(v string)`

SetComptePayeur sets ComptePayeur field to given value.

### HasComptePayeur

`func (o *WebhookDeliveryLogsCreate) HasComptePayeur() bool`

HasComptePayeur returns a boolean if a field has been set.

### GetEventType

`func (o *WebhookDeliveryLogsCreate) GetEventType() string`

GetEventType returns the EventType field if non-nil, zero value otherwise.

### GetEventTypeOk

`func (o *WebhookDeliveryLogsCreate) GetEventTypeOk() (*string, bool)`

GetEventTypeOk returns a tuple with the EventType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventType

`func (o *WebhookDeliveryLogsCreate) SetEventType(v string)`

SetEventType sets EventType field to given value.

### HasEventType

`func (o *WebhookDeliveryLogsCreate) HasEventType() bool`

HasEventType returns a boolean if a field has been set.

### GetHeaders

`func (o *WebhookDeliveryLogsCreate) GetHeaders() map[string]interface{}`

GetHeaders returns the Headers field if non-nil, zero value otherwise.

### GetHeadersOk

`func (o *WebhookDeliveryLogsCreate) GetHeadersOk() (*map[string]interface{}, bool)`

GetHeadersOk returns a tuple with the Headers field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetHeaders

`func (o *WebhookDeliveryLogsCreate) SetHeaders(v map[string]interface{})`

SetHeaders sets Headers field to given value.

### HasHeaders

`func (o *WebhookDeliveryLogsCreate) HasHeaders() bool`

HasHeaders returns a boolean if a field has been set.

### GetIpAddress

`func (o *WebhookDeliveryLogsCreate) GetIpAddress() string`

GetIpAddress returns the IpAddress field if non-nil, zero value otherwise.

### GetIpAddressOk

`func (o *WebhookDeliveryLogsCreate) GetIpAddressOk() (*string, bool)`

GetIpAddressOk returns a tuple with the IpAddress field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIpAddress

`func (o *WebhookDeliveryLogsCreate) SetIpAddress(v string)`

SetIpAddress sets IpAddress field to given value.

### HasIpAddress

`func (o *WebhookDeliveryLogsCreate) HasIpAddress() bool`

HasIpAddress returns a boolean if a field has been set.

### GetLogId

`func (o *WebhookDeliveryLogsCreate) GetLogId() string`

GetLogId returns the LogId field if non-nil, zero value otherwise.

### GetLogIdOk

`func (o *WebhookDeliveryLogsCreate) GetLogIdOk() (*string, bool)`

GetLogIdOk returns a tuple with the LogId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLogId

`func (o *WebhookDeliveryLogsCreate) SetLogId(v string)`

SetLogId sets LogId field to given value.

### HasLogId

`func (o *WebhookDeliveryLogsCreate) HasLogId() bool`

HasLogId returns a boolean if a field has been set.

### GetMontant

`func (o *WebhookDeliveryLogsCreate) GetMontant() float64`

GetMontant returns the Montant field if non-nil, zero value otherwise.

### GetMontantOk

`func (o *WebhookDeliveryLogsCreate) GetMontantOk() (*float64, bool)`

GetMontantOk returns a tuple with the Montant field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMontant

`func (o *WebhookDeliveryLogsCreate) SetMontant(v float64)`

SetMontant sets Montant field to given value.

### HasMontant

`func (o *WebhookDeliveryLogsCreate) HasMontant() bool`

HasMontant returns a boolean if a field has been set.

### GetPayload

`func (o *WebhookDeliveryLogsCreate) GetPayload() map[string]interface{}`

GetPayload returns the Payload field if non-nil, zero value otherwise.

### GetPayloadOk

`func (o *WebhookDeliveryLogsCreate) GetPayloadOk() (*map[string]interface{}, bool)`

GetPayloadOk returns a tuple with the Payload field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayload

`func (o *WebhookDeliveryLogsCreate) SetPayload(v map[string]interface{})`

SetPayload sets Payload field to given value.

### HasPayload

`func (o *WebhookDeliveryLogsCreate) HasPayload() bool`

HasPayload returns a boolean if a field has been set.

### GetRequestDurationMs

`func (o *WebhookDeliveryLogsCreate) GetRequestDurationMs() float64`

GetRequestDurationMs returns the RequestDurationMs field if non-nil, zero value otherwise.

### GetRequestDurationMsOk

`func (o *WebhookDeliveryLogsCreate) GetRequestDurationMsOk() (*float64, bool)`

GetRequestDurationMsOk returns a tuple with the RequestDurationMs field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRequestDurationMs

`func (o *WebhookDeliveryLogsCreate) SetRequestDurationMs(v float64)`

SetRequestDurationMs sets RequestDurationMs field to given value.

### HasRequestDurationMs

`func (o *WebhookDeliveryLogsCreate) HasRequestDurationMs() bool`

HasRequestDurationMs returns a boolean if a field has been set.

### GetResponseBody

`func (o *WebhookDeliveryLogsCreate) GetResponseBody() string`

GetResponseBody returns the ResponseBody field if non-nil, zero value otherwise.

### GetResponseBodyOk

`func (o *WebhookDeliveryLogsCreate) GetResponseBodyOk() (*string, bool)`

GetResponseBodyOk returns a tuple with the ResponseBody field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetResponseBody

`func (o *WebhookDeliveryLogsCreate) SetResponseBody(v string)`

SetResponseBody sets ResponseBody field to given value.

### HasResponseBody

`func (o *WebhookDeliveryLogsCreate) HasResponseBody() bool`

HasResponseBody returns a boolean if a field has been set.

### GetResponseStatus

`func (o *WebhookDeliveryLogsCreate) GetResponseStatus() float64`

GetResponseStatus returns the ResponseStatus field if non-nil, zero value otherwise.

### GetResponseStatusOk

`func (o *WebhookDeliveryLogsCreate) GetResponseStatusOk() (*float64, bool)`

GetResponseStatusOk returns a tuple with the ResponseStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetResponseStatus

`func (o *WebhookDeliveryLogsCreate) SetResponseStatus(v float64)`

SetResponseStatus sets ResponseStatus field to given value.

### HasResponseStatus

`func (o *WebhookDeliveryLogsCreate) HasResponseStatus() bool`

HasResponseStatus returns a boolean if a field has been set.

### GetSpiEventCode

`func (o *WebhookDeliveryLogsCreate) GetSpiEventCode() string`

GetSpiEventCode returns the SpiEventCode field if non-nil, zero value otherwise.

### GetSpiEventCodeOk

`func (o *WebhookDeliveryLogsCreate) GetSpiEventCodeOk() (*string, bool)`

GetSpiEventCodeOk returns a tuple with the SpiEventCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiEventCode

`func (o *WebhookDeliveryLogsCreate) SetSpiEventCode(v string)`

SetSpiEventCode sets SpiEventCode field to given value.

### HasSpiEventCode

`func (o *WebhookDeliveryLogsCreate) HasSpiEventCode() bool`

HasSpiEventCode returns a boolean if a field has been set.

### GetSpiTxId

`func (o *WebhookDeliveryLogsCreate) GetSpiTxId() string`

GetSpiTxId returns the SpiTxId field if non-nil, zero value otherwise.

### GetSpiTxIdOk

`func (o *WebhookDeliveryLogsCreate) GetSpiTxIdOk() (*string, bool)`

GetSpiTxIdOk returns a tuple with the SpiTxId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSpiTxId

`func (o *WebhookDeliveryLogsCreate) SetSpiTxId(v string)`

SetSpiTxId sets SpiTxId field to given value.

### HasSpiTxId

`func (o *WebhookDeliveryLogsCreate) HasSpiTxId() bool`

HasSpiTxId returns a boolean if a field has been set.

### GetSuccess

`func (o *WebhookDeliveryLogsCreate) GetSuccess() bool`

GetSuccess returns the Success field if non-nil, zero value otherwise.

### GetSuccessOk

`func (o *WebhookDeliveryLogsCreate) GetSuccessOk() (*bool, bool)`

GetSuccessOk returns a tuple with the Success field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccess

`func (o *WebhookDeliveryLogsCreate) SetSuccess(v bool)`

SetSuccess sets Success field to given value.

### HasSuccess

`func (o *WebhookDeliveryLogsCreate) HasSuccess() bool`

HasSuccess returns a boolean if a field has been set.

### GetUserAgent

`func (o *WebhookDeliveryLogsCreate) GetUserAgent() string`

GetUserAgent returns the UserAgent field if non-nil, zero value otherwise.

### GetUserAgentOk

`func (o *WebhookDeliveryLogsCreate) GetUserAgentOk() (*string, bool)`

GetUserAgentOk returns a tuple with the UserAgent field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUserAgent

`func (o *WebhookDeliveryLogsCreate) SetUserAgent(v string)`

SetUserAgent sets UserAgent field to given value.

### HasUserAgent

`func (o *WebhookDeliveryLogsCreate) HasUserAgent() bool`

HasUserAgent returns a boolean if a field has been set.

### GetWebhookId

`func (o *WebhookDeliveryLogsCreate) GetWebhookId() string`

GetWebhookId returns the WebhookId field if non-nil, zero value otherwise.

### GetWebhookIdOk

`func (o *WebhookDeliveryLogsCreate) GetWebhookIdOk() (*string, bool)`

GetWebhookIdOk returns a tuple with the WebhookId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWebhookId

`func (o *WebhookDeliveryLogsCreate) SetWebhookId(v string)`

SetWebhookId sets WebhookId field to given value.

### HasWebhookId

`func (o *WebhookDeliveryLogsCreate) HasWebhookId() bool`

HasWebhookId returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


