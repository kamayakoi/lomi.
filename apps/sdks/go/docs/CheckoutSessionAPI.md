# \CheckoutSessionAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CheckoutSessionsGet**](CheckoutSessionAPI.md#CheckoutSessionsGet) | **Get** /checkout_sessions | List checkout_sessions
[**CheckoutSessionsPost**](CheckoutSessionAPI.md#CheckoutSessionsPost) | **Post** /checkout_sessions | Create checkout_session
[**CheckoutSessionsSessionIdDelete**](CheckoutSessionAPI.md#CheckoutSessionsSessionIdDelete) | **Delete** /checkout_sessions/{session_id} | Delete checkout_session
[**CheckoutSessionsSessionIdGet**](CheckoutSessionAPI.md#CheckoutSessionsSessionIdGet) | **Get** /checkout_sessions/{session_id} | Get checkout_session
[**CheckoutSessionsSessionIdPatch**](CheckoutSessionAPI.md#CheckoutSessionsSessionIdPatch) | **Patch** /checkout_sessions/{session_id} | Update checkout_session



## CheckoutSessionsGet

> CheckoutSessionsGet200Response CheckoutSessionsGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List checkout_sessions



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
	resp, r, err := apiClient.CheckoutSessionAPI.CheckoutSessionsGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutSessionAPI.CheckoutSessionsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CheckoutSessionsGet`: CheckoutSessionsGet200Response
	fmt.Fprintf(os.Stdout, "Response from `CheckoutSessionAPI.CheckoutSessionsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCheckoutSessionsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**CheckoutSessionsGet200Response**](CheckoutSessionsGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## CheckoutSessionsPost

> CheckoutSessions CheckoutSessionsPost(ctx).CheckoutSessionsCreate(checkoutSessionsCreate).Execute()

Create checkout_session



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
	resp, r, err := apiClient.CheckoutSessionAPI.CheckoutSessionsPost(context.Background()).CheckoutSessionsCreate(checkoutSessionsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutSessionAPI.CheckoutSessionsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CheckoutSessionsPost`: CheckoutSessions
	fmt.Fprintf(os.Stdout, "Response from `CheckoutSessionAPI.CheckoutSessionsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCheckoutSessionsPostRequest struct via the builder pattern


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


## CheckoutSessionsSessionIdDelete

> CheckoutSessionsSessionIdDelete(ctx, sessionId).Execute()

Delete checkout_session



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
	sessionId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The checkout_session ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.CheckoutSessionAPI.CheckoutSessionsSessionIdDelete(context.Background(), sessionId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutSessionAPI.CheckoutSessionsSessionIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**sessionId** | **string** | The checkout_session ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiCheckoutSessionsSessionIdDeleteRequest struct via the builder pattern


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


## CheckoutSessionsSessionIdGet

> CheckoutSessions CheckoutSessionsSessionIdGet(ctx, sessionId).Execute()

Get checkout_session



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
	sessionId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The checkout_session ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CheckoutSessionAPI.CheckoutSessionsSessionIdGet(context.Background(), sessionId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutSessionAPI.CheckoutSessionsSessionIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CheckoutSessionsSessionIdGet`: CheckoutSessions
	fmt.Fprintf(os.Stdout, "Response from `CheckoutSessionAPI.CheckoutSessionsSessionIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**sessionId** | **string** | The checkout_session ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiCheckoutSessionsSessionIdGetRequest struct via the builder pattern


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


## CheckoutSessionsSessionIdPatch

> CheckoutSessions CheckoutSessionsSessionIdPatch(ctx, sessionId).CheckoutSessionsUpdate(checkoutSessionsUpdate).Execute()

Update checkout_session



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
	sessionId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The checkout_session ID
	checkoutSessionsUpdate := *openapiclient.NewCheckoutSessionsUpdate() // CheckoutSessionsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CheckoutSessionAPI.CheckoutSessionsSessionIdPatch(context.Background(), sessionId).CheckoutSessionsUpdate(checkoutSessionsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CheckoutSessionAPI.CheckoutSessionsSessionIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CheckoutSessionsSessionIdPatch`: CheckoutSessions
	fmt.Fprintf(os.Stdout, "Response from `CheckoutSessionAPI.CheckoutSessionsSessionIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**sessionId** | **string** | The checkout_session ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiCheckoutSessionsSessionIdPatchRequest struct via the builder pattern


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

