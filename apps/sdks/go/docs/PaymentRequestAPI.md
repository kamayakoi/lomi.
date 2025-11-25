# \PaymentRequestAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**PaymentRequestsGet**](PaymentRequestAPI.md#PaymentRequestsGet) | **Get** /payment_requests | List payment_requests
[**PaymentRequestsPost**](PaymentRequestAPI.md#PaymentRequestsPost) | **Post** /payment_requests | Create payment_request
[**PaymentRequestsRequestIdDelete**](PaymentRequestAPI.md#PaymentRequestsRequestIdDelete) | **Delete** /payment_requests/{request_id} | Delete payment_request
[**PaymentRequestsRequestIdGet**](PaymentRequestAPI.md#PaymentRequestsRequestIdGet) | **Get** /payment_requests/{request_id} | Get payment_request
[**PaymentRequestsRequestIdPatch**](PaymentRequestAPI.md#PaymentRequestsRequestIdPatch) | **Patch** /payment_requests/{request_id} | Update payment_request



## PaymentRequestsGet

> PaymentRequestsGet200Response PaymentRequestsGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List payment_requests



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
	resp, r, err := apiClient.PaymentRequestAPI.PaymentRequestsGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentRequestAPI.PaymentRequestsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PaymentRequestsGet`: PaymentRequestsGet200Response
	fmt.Fprintf(os.Stdout, "Response from `PaymentRequestAPI.PaymentRequestsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiPaymentRequestsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**PaymentRequestsGet200Response**](PaymentRequestsGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PaymentRequestsPost

> PaymentRequests PaymentRequestsPost(ctx).PaymentRequestsCreate(paymentRequestsCreate).Execute()

Create payment_request



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
	paymentRequestsCreate := *openapiclient.NewPaymentRequestsCreate() // PaymentRequestsCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PaymentRequestAPI.PaymentRequestsPost(context.Background()).PaymentRequestsCreate(paymentRequestsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentRequestAPI.PaymentRequestsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PaymentRequestsPost`: PaymentRequests
	fmt.Fprintf(os.Stdout, "Response from `PaymentRequestAPI.PaymentRequestsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiPaymentRequestsPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentRequestsCreate** | [**PaymentRequestsCreate**](PaymentRequestsCreate.md) |  | 

### Return type

[**PaymentRequests**](PaymentRequests.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PaymentRequestsRequestIdDelete

> PaymentRequestsRequestIdDelete(ctx, requestId).Execute()

Delete payment_request



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
	requestId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The payment_request ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.PaymentRequestAPI.PaymentRequestsRequestIdDelete(context.Background(), requestId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentRequestAPI.PaymentRequestsRequestIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**requestId** | **string** | The payment_request ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiPaymentRequestsRequestIdDeleteRequest struct via the builder pattern


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


## PaymentRequestsRequestIdGet

> PaymentRequests PaymentRequestsRequestIdGet(ctx, requestId).Execute()

Get payment_request



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
	requestId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The payment_request ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PaymentRequestAPI.PaymentRequestsRequestIdGet(context.Background(), requestId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentRequestAPI.PaymentRequestsRequestIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PaymentRequestsRequestIdGet`: PaymentRequests
	fmt.Fprintf(os.Stdout, "Response from `PaymentRequestAPI.PaymentRequestsRequestIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**requestId** | **string** | The payment_request ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiPaymentRequestsRequestIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**PaymentRequests**](PaymentRequests.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PaymentRequestsRequestIdPatch

> PaymentRequests PaymentRequestsRequestIdPatch(ctx, requestId).PaymentRequestsUpdate(paymentRequestsUpdate).Execute()

Update payment_request



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
	requestId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The payment_request ID
	paymentRequestsUpdate := *openapiclient.NewPaymentRequestsUpdate() // PaymentRequestsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PaymentRequestAPI.PaymentRequestsRequestIdPatch(context.Background(), requestId).PaymentRequestsUpdate(paymentRequestsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PaymentRequestAPI.PaymentRequestsRequestIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PaymentRequestsRequestIdPatch`: PaymentRequests
	fmt.Fprintf(os.Stdout, "Response from `PaymentRequestAPI.PaymentRequestsRequestIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**requestId** | **string** | The payment_request ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiPaymentRequestsRequestIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **paymentRequestsUpdate** | [**PaymentRequestsUpdate**](PaymentRequestsUpdate.md) |  | 

### Return type

[**PaymentRequests**](PaymentRequests.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

