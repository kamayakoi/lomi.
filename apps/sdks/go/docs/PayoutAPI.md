# \PayoutAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**PayoutsGet**](PayoutAPI.md#PayoutsGet) | **Get** /payouts | List payouts
[**PayoutsPayoutIdDelete**](PayoutAPI.md#PayoutsPayoutIdDelete) | **Delete** /payouts/{payout_id} | Delete payout
[**PayoutsPayoutIdGet**](PayoutAPI.md#PayoutsPayoutIdGet) | **Get** /payouts/{payout_id} | Get payout
[**PayoutsPayoutIdPatch**](PayoutAPI.md#PayoutsPayoutIdPatch) | **Patch** /payouts/{payout_id} | Update payout
[**PayoutsPost**](PayoutAPI.md#PayoutsPost) | **Post** /payouts | Create payout



## PayoutsGet

> PayoutsGet200Response PayoutsGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List payouts



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
	resp, r, err := apiClient.PayoutAPI.PayoutsGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutAPI.PayoutsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PayoutsGet`: PayoutsGet200Response
	fmt.Fprintf(os.Stdout, "Response from `PayoutAPI.PayoutsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiPayoutsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**PayoutsGet200Response**](PayoutsGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PayoutsPayoutIdDelete

> PayoutsPayoutIdDelete(ctx, payoutId).Execute()

Delete payout



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
	payoutId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The payout ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.PayoutAPI.PayoutsPayoutIdDelete(context.Background(), payoutId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutAPI.PayoutsPayoutIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**payoutId** | **string** | The payout ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiPayoutsPayoutIdDeleteRequest struct via the builder pattern


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


## PayoutsPayoutIdGet

> Payouts PayoutsPayoutIdGet(ctx, payoutId).Execute()

Get payout



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
	payoutId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The payout ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PayoutAPI.PayoutsPayoutIdGet(context.Background(), payoutId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutAPI.PayoutsPayoutIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PayoutsPayoutIdGet`: Payouts
	fmt.Fprintf(os.Stdout, "Response from `PayoutAPI.PayoutsPayoutIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**payoutId** | **string** | The payout ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiPayoutsPayoutIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**Payouts**](Payouts.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PayoutsPayoutIdPatch

> Payouts PayoutsPayoutIdPatch(ctx, payoutId).PayoutsUpdate(payoutsUpdate).Execute()

Update payout



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
	payoutId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The payout ID
	payoutsUpdate := *openapiclient.NewPayoutsUpdate() // PayoutsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PayoutAPI.PayoutsPayoutIdPatch(context.Background(), payoutId).PayoutsUpdate(payoutsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutAPI.PayoutsPayoutIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PayoutsPayoutIdPatch`: Payouts
	fmt.Fprintf(os.Stdout, "Response from `PayoutAPI.PayoutsPayoutIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**payoutId** | **string** | The payout ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiPayoutsPayoutIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **payoutsUpdate** | [**PayoutsUpdate**](PayoutsUpdate.md) |  | 

### Return type

[**Payouts**](Payouts.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PayoutsPost

> Payouts PayoutsPost(ctx).PayoutsCreate(payoutsCreate).Execute()

Create payout



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
	payoutsCreate := *openapiclient.NewPayoutsCreate() // PayoutsCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PayoutAPI.PayoutsPost(context.Background()).PayoutsCreate(payoutsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutAPI.PayoutsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PayoutsPost`: Payouts
	fmt.Fprintf(os.Stdout, "Response from `PayoutAPI.PayoutsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiPayoutsPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **payoutsCreate** | [**PayoutsCreate**](PayoutsCreate.md) |  | 

### Return type

[**Payouts**](Payouts.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

