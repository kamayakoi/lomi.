# \WebhookAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**WebhooksGet**](WebhookAPI.md#WebhooksGet) | **Get** /webhooks | List webhooks
[**WebhooksPost**](WebhookAPI.md#WebhooksPost) | **Post** /webhooks | Create webhook
[**WebhooksWebhookIdDelete**](WebhookAPI.md#WebhooksWebhookIdDelete) | **Delete** /webhooks/{webhook_id} | Delete webhook
[**WebhooksWebhookIdGet**](WebhookAPI.md#WebhooksWebhookIdGet) | **Get** /webhooks/{webhook_id} | Get webhook
[**WebhooksWebhookIdPatch**](WebhookAPI.md#WebhooksWebhookIdPatch) | **Patch** /webhooks/{webhook_id} | Update webhook



## WebhooksGet

> WebhooksGet200Response WebhooksGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List webhooks



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/lomiafrica/lomi-go-sdk"
)

func main() {
	limit := int32(56) // int32 | Maximum number of items to return (optional) (default to 20)
	offset := int32(56) // int32 | Number of items to skip (optional) (default to 0)
	sort := "sort_example" // string | Sort order (e.g., created_at:desc) (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.WebhookAPI.WebhooksGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhookAPI.WebhooksGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `WebhooksGet`: WebhooksGet200Response
	fmt.Fprintf(os.Stdout, "Response from `WebhookAPI.WebhooksGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiWebhooksGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**WebhooksGet200Response**](WebhooksGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## WebhooksPost

> Webhooks WebhooksPost(ctx).WebhooksCreate(webhooksCreate).Execute()

Create webhook



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/lomiafrica/lomi-go-sdk"
)

func main() {
	webhooksCreate := *openapiclient.NewWebhooksCreate() // WebhooksCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.WebhookAPI.WebhooksPost(context.Background()).WebhooksCreate(webhooksCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhookAPI.WebhooksPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `WebhooksPost`: Webhooks
	fmt.Fprintf(os.Stdout, "Response from `WebhookAPI.WebhooksPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiWebhooksPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **webhooksCreate** | [**WebhooksCreate**](WebhooksCreate.md) |  | 

### Return type

[**Webhooks**](Webhooks.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## WebhooksWebhookIdDelete

> WebhooksWebhookIdDelete(ctx, webhookId).Execute()

Delete webhook



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/lomiafrica/lomi-go-sdk"
)

func main() {
	webhookId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The webhook ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.WebhookAPI.WebhooksWebhookIdDelete(context.Background(), webhookId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhookAPI.WebhooksWebhookIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**webhookId** | **string** | The webhook ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiWebhooksWebhookIdDeleteRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

 (empty response body)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## WebhooksWebhookIdGet

> Webhooks WebhooksWebhookIdGet(ctx, webhookId).Execute()

Get webhook



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/lomiafrica/lomi-go-sdk"
)

func main() {
	webhookId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The webhook ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.WebhookAPI.WebhooksWebhookIdGet(context.Background(), webhookId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhookAPI.WebhooksWebhookIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `WebhooksWebhookIdGet`: Webhooks
	fmt.Fprintf(os.Stdout, "Response from `WebhookAPI.WebhooksWebhookIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**webhookId** | **string** | The webhook ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiWebhooksWebhookIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**Webhooks**](Webhooks.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## WebhooksWebhookIdPatch

> Webhooks WebhooksWebhookIdPatch(ctx, webhookId).WebhooksUpdate(webhooksUpdate).Execute()

Update webhook



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/lomiafrica/lomi-go-sdk"
)

func main() {
	webhookId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The webhook ID
	webhooksUpdate := *openapiclient.NewWebhooksUpdate() // WebhooksUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.WebhookAPI.WebhooksWebhookIdPatch(context.Background(), webhookId).WebhooksUpdate(webhooksUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhookAPI.WebhooksWebhookIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `WebhooksWebhookIdPatch`: Webhooks
	fmt.Fprintf(os.Stdout, "Response from `WebhookAPI.WebhooksWebhookIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**webhookId** | **string** | The webhook ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiWebhooksWebhookIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **webhooksUpdate** | [**WebhooksUpdate**](WebhooksUpdate.md) |  | 

### Return type

[**Webhooks**](Webhooks.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

