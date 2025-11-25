# \SubscriptionAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**SubscriptionsGet**](SubscriptionAPI.md#SubscriptionsGet) | **Get** /subscriptions | List subscriptions
[**SubscriptionsPost**](SubscriptionAPI.md#SubscriptionsPost) | **Post** /subscriptions | Create subscription
[**SubscriptionsSubscriptionIdDelete**](SubscriptionAPI.md#SubscriptionsSubscriptionIdDelete) | **Delete** /subscriptions/{subscription_id} | Delete subscription
[**SubscriptionsSubscriptionIdGet**](SubscriptionAPI.md#SubscriptionsSubscriptionIdGet) | **Get** /subscriptions/{subscription_id} | Get subscription
[**SubscriptionsSubscriptionIdPatch**](SubscriptionAPI.md#SubscriptionsSubscriptionIdPatch) | **Patch** /subscriptions/{subscription_id} | Update subscription



## SubscriptionsGet

> SubscriptionsGet200Response SubscriptionsGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List subscriptions



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
	resp, r, err := apiClient.SubscriptionAPI.SubscriptionsGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SubscriptionAPI.SubscriptionsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SubscriptionsGet`: SubscriptionsGet200Response
	fmt.Fprintf(os.Stdout, "Response from `SubscriptionAPI.SubscriptionsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiSubscriptionsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**SubscriptionsGet200Response**](SubscriptionsGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## SubscriptionsPost

> Subscriptions SubscriptionsPost(ctx).SubscriptionsCreate(subscriptionsCreate).Execute()

Create subscription



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
	subscriptionsCreate := *openapiclient.NewSubscriptionsCreate() // SubscriptionsCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SubscriptionAPI.SubscriptionsPost(context.Background()).SubscriptionsCreate(subscriptionsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SubscriptionAPI.SubscriptionsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SubscriptionsPost`: Subscriptions
	fmt.Fprintf(os.Stdout, "Response from `SubscriptionAPI.SubscriptionsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiSubscriptionsPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **subscriptionsCreate** | [**SubscriptionsCreate**](SubscriptionsCreate.md) |  | 

### Return type

[**Subscriptions**](Subscriptions.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## SubscriptionsSubscriptionIdDelete

> SubscriptionsSubscriptionIdDelete(ctx, subscriptionId).Execute()

Delete subscription



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
	subscriptionId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The subscription ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.SubscriptionAPI.SubscriptionsSubscriptionIdDelete(context.Background(), subscriptionId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SubscriptionAPI.SubscriptionsSubscriptionIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**subscriptionId** | **string** | The subscription ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiSubscriptionsSubscriptionIdDeleteRequest struct via the builder pattern


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


## SubscriptionsSubscriptionIdGet

> Subscriptions SubscriptionsSubscriptionIdGet(ctx, subscriptionId).Execute()

Get subscription



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
	subscriptionId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The subscription ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SubscriptionAPI.SubscriptionsSubscriptionIdGet(context.Background(), subscriptionId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SubscriptionAPI.SubscriptionsSubscriptionIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SubscriptionsSubscriptionIdGet`: Subscriptions
	fmt.Fprintf(os.Stdout, "Response from `SubscriptionAPI.SubscriptionsSubscriptionIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**subscriptionId** | **string** | The subscription ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiSubscriptionsSubscriptionIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**Subscriptions**](Subscriptions.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## SubscriptionsSubscriptionIdPatch

> Subscriptions SubscriptionsSubscriptionIdPatch(ctx, subscriptionId).SubscriptionsUpdate(subscriptionsUpdate).Execute()

Update subscription



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
	subscriptionId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The subscription ID
	subscriptionsUpdate := *openapiclient.NewSubscriptionsUpdate() // SubscriptionsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SubscriptionAPI.SubscriptionsSubscriptionIdPatch(context.Background(), subscriptionId).SubscriptionsUpdate(subscriptionsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SubscriptionAPI.SubscriptionsSubscriptionIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SubscriptionsSubscriptionIdPatch`: Subscriptions
	fmt.Fprintf(os.Stdout, "Response from `SubscriptionAPI.SubscriptionsSubscriptionIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**subscriptionId** | **string** | The subscription ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiSubscriptionsSubscriptionIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **subscriptionsUpdate** | [**SubscriptionsUpdate**](SubscriptionsUpdate.md) |  | 

### Return type

[**Subscriptions**](Subscriptions.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

