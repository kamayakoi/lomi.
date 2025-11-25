# \WebhookDeliveryLogsAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ListWebhookDeliveryLogs**](WebhookDeliveryLogsAPI.md#ListWebhookDeliveryLogs) | **Get** /webhook_delivery_logs | List webhook delivery logs
[**RetrieveWebhookDeliveryLog**](WebhookDeliveryLogsAPI.md#RetrieveWebhookDeliveryLog) | **Get** /webhook_delivery_logs/{log_id} | Retrieve webhook delivery log



## ListWebhookDeliveryLogs

> ListWebhookDeliveryLogs200Response ListWebhookDeliveryLogs(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List webhook delivery logs



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
	limit := int32(56) // int32 | Maximum number of items to return (1-100) (optional) (default to 20)
	offset := int32(56) // int32 | Number of items to skip for pagination (optional) (default to 0)
	sort := "created_at:desc" // string | Sort order. Format: `field:direction` (e.g., `created_at:desc`) (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.WebhookDeliveryLogsAPI.ListWebhookDeliveryLogs(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhookDeliveryLogsAPI.ListWebhookDeliveryLogs``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListWebhookDeliveryLogs`: ListWebhookDeliveryLogs200Response
	fmt.Fprintf(os.Stdout, "Response from `WebhookDeliveryLogsAPI.ListWebhookDeliveryLogs`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListWebhookDeliveryLogsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListWebhookDeliveryLogs200Response**](ListWebhookDeliveryLogs200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrieveWebhookDeliveryLog

> WebhookDeliveryLogs RetrieveWebhookDeliveryLog(ctx, logId).Execute()

Retrieve webhook delivery log



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
	logId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the webhook delivery log

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.WebhookDeliveryLogsAPI.RetrieveWebhookDeliveryLog(context.Background(), logId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhookDeliveryLogsAPI.RetrieveWebhookDeliveryLog``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveWebhookDeliveryLog`: WebhookDeliveryLogs
	fmt.Fprintf(os.Stdout, "Response from `WebhookDeliveryLogsAPI.RetrieveWebhookDeliveryLog`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**logId** | **string** | Unique identifier for the webhook delivery log | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveWebhookDeliveryLogRequest struct via the builder pattern


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

