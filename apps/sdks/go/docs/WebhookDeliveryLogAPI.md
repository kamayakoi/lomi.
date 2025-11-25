# \WebhookDeliveryLogAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**WebhookDeliveryLogsGet**](WebhookDeliveryLogAPI.md#WebhookDeliveryLogsGet) | **Get** /webhook_delivery_logs | List webhook_delivery_logs
[**WebhookDeliveryLogsLogIdGet**](WebhookDeliveryLogAPI.md#WebhookDeliveryLogsLogIdGet) | **Get** /webhook_delivery_logs/{log_id} | Get webhook_delivery_log



## WebhookDeliveryLogsGet

> WebhookDeliveryLogsGet200Response WebhookDeliveryLogsGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List webhook_delivery_logs



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
	resp, r, err := apiClient.WebhookDeliveryLogAPI.WebhookDeliveryLogsGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhookDeliveryLogAPI.WebhookDeliveryLogsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `WebhookDeliveryLogsGet`: WebhookDeliveryLogsGet200Response
	fmt.Fprintf(os.Stdout, "Response from `WebhookDeliveryLogAPI.WebhookDeliveryLogsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiWebhookDeliveryLogsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**WebhookDeliveryLogsGet200Response**](WebhookDeliveryLogsGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## WebhookDeliveryLogsLogIdGet

> WebhookDeliveryLogs WebhookDeliveryLogsLogIdGet(ctx, logId).Execute()

Get webhook_delivery_log



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
	logId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The webhook_delivery_log ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.WebhookDeliveryLogAPI.WebhookDeliveryLogsLogIdGet(context.Background(), logId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhookDeliveryLogAPI.WebhookDeliveryLogsLogIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `WebhookDeliveryLogsLogIdGet`: WebhookDeliveryLogs
	fmt.Fprintf(os.Stdout, "Response from `WebhookDeliveryLogAPI.WebhookDeliveryLogsLogIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**logId** | **string** | The webhook_delivery_log ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiWebhookDeliveryLogsLogIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**WebhookDeliveryLogs**](WebhookDeliveryLogs.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

