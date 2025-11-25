# \CheckoutSessionsAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateCheckoutSession**](CheckoutSessionsAPI.md#CreateCheckoutSession) | **Post** /checkout_sessions | Create checkout session
[**DeleteCheckoutSession**](CheckoutSessionsAPI.md#DeleteCheckoutSession) | **Delete** /checkout_sessions/{session_id} | Delete checkout session
[**ListCheckoutSessions**](CheckoutSessionsAPI.md#ListCheckoutSessions) | **Get** /checkout_sessions | List checkout sessions
[**RetrieveCheckoutSession**](CheckoutSessionsAPI.md#RetrieveCheckoutSession) | **Get** /checkout_sessions/{session_id} | Retrieve checkout session
[**UpdateCheckoutSession**](CheckoutSessionsAPI.md#UpdateCheckoutSession) | **Patch** /checkout_sessions/{session_id} | Update checkout session



## CreateCheckoutSession

> CheckoutSessions CreateCheckoutSession(ctx).CheckoutSessionsCreate(checkoutSessionsCreate).Execute()

Create checkout session



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
	checkoutSessionsCreate := *openapiclient.NewCheckoutSessionsCreate() // CheckoutSessionsCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CheckoutSessionsAPI.CreateCheckoutSession(context.Background()).CheckoutSessionsCreate(checkoutSessionsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutSessionsAPI.CreateCheckoutSession``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateCheckoutSession`: CheckoutSessions
	fmt.Fprintf(os.Stdout, "Response from `CheckoutSessionsAPI.CreateCheckoutSession`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateCheckoutSessionRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **checkoutSessionsCreate** | [**CheckoutSessionsCreate**](CheckoutSessionsCreate.md) |  | 

### Return type

[**CheckoutSessions**](CheckoutSessions.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DeleteCheckoutSession

> DeleteCheckoutSession(ctx, sessionId).Execute()

Delete checkout session



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
	sessionId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the checkout session

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.CheckoutSessionsAPI.DeleteCheckoutSession(context.Background(), sessionId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutSessionsAPI.DeleteCheckoutSession``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**sessionId** | **string** | Unique identifier for the checkout session | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteCheckoutSessionRequest struct via the builder pattern


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


## ListCheckoutSessions

> ListCheckoutSessions200Response ListCheckoutSessions(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List checkout sessions



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
	resp, r, err := apiClient.CheckoutSessionsAPI.ListCheckoutSessions(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutSessionsAPI.ListCheckoutSessions``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListCheckoutSessions`: ListCheckoutSessions200Response
	fmt.Fprintf(os.Stdout, "Response from `CheckoutSessionsAPI.ListCheckoutSessions`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListCheckoutSessionsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListCheckoutSessions200Response**](ListCheckoutSessions200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrieveCheckoutSession

> CheckoutSessions RetrieveCheckoutSession(ctx, sessionId).Execute()

Retrieve checkout session



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
	sessionId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the checkout session

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CheckoutSessionsAPI.RetrieveCheckoutSession(context.Background(), sessionId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutSessionsAPI.RetrieveCheckoutSession``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveCheckoutSession`: CheckoutSessions
	fmt.Fprintf(os.Stdout, "Response from `CheckoutSessionsAPI.RetrieveCheckoutSession`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**sessionId** | **string** | Unique identifier for the checkout session | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveCheckoutSessionRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**CheckoutSessions**](CheckoutSessions.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## UpdateCheckoutSession

> CheckoutSessions UpdateCheckoutSession(ctx, sessionId).CheckoutSessionsUpdate(checkoutSessionsUpdate).Execute()

Update checkout session



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
	sessionId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the checkout session
	checkoutSessionsUpdate := *openapiclient.NewCheckoutSessionsUpdate() // CheckoutSessionsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CheckoutSessionsAPI.UpdateCheckoutSession(context.Background(), sessionId).CheckoutSessionsUpdate(checkoutSessionsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutSessionsAPI.UpdateCheckoutSession``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateCheckoutSession`: CheckoutSessions
	fmt.Fprintf(os.Stdout, "Response from `CheckoutSessionsAPI.UpdateCheckoutSession`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**sessionId** | **string** | Unique identifier for the checkout session | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateCheckoutSessionRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **checkoutSessionsUpdate** | [**CheckoutSessionsUpdate**](CheckoutSessionsUpdate.md) |  | 

### Return type

[**CheckoutSessions**](CheckoutSessions.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

