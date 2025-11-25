# \PayoutsAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreatePayout**](PayoutsAPI.md#CreatePayout) | **Post** /payouts | Create payout
[**DeletePayout**](PayoutsAPI.md#DeletePayout) | **Delete** /payouts/{payout_id} | Delete payout
[**ListPayouts**](PayoutsAPI.md#ListPayouts) | **Get** /payouts | List payouts
[**RetrievePayout**](PayoutsAPI.md#RetrievePayout) | **Get** /payouts/{payout_id} | Retrieve payout
[**UpdatePayout**](PayoutsAPI.md#UpdatePayout) | **Patch** /payouts/{payout_id} | Update payout



## CreatePayout

> Payouts CreatePayout(ctx).PayoutsCreate(payoutsCreate).Execute()

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
	resp, r, err := apiClient.PayoutsAPI.CreatePayout(context.Background()).PayoutsCreate(payoutsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutsAPI.CreatePayout``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreatePayout`: Payouts
	fmt.Fprintf(os.Stdout, "Response from `PayoutsAPI.CreatePayout`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreatePayoutRequest struct via the builder pattern


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


## DeletePayout

> DeletePayout(ctx, payoutId).Execute()

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
	payoutId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the payout

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.PayoutsAPI.DeletePayout(context.Background(), payoutId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutsAPI.DeletePayout``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**payoutId** | **string** | Unique identifier for the payout | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeletePayoutRequest struct via the builder pattern


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


## ListPayouts

> ListPayouts200Response ListPayouts(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

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
	limit := int32(56) // int32 | Maximum number of items to return (1-100) (optional) (default to 20)
	offset := int32(56) // int32 | Number of items to skip for pagination (optional) (default to 0)
	sort := "created_at:desc" // string | Sort order. Format: `field:direction` (e.g., `created_at:desc`) (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PayoutsAPI.ListPayouts(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutsAPI.ListPayouts``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListPayouts`: ListPayouts200Response
	fmt.Fprintf(os.Stdout, "Response from `PayoutsAPI.ListPayouts`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListPayoutsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListPayouts200Response**](ListPayouts200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrievePayout

> Payouts RetrievePayout(ctx, payoutId).Execute()

Retrieve payout



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
	payoutId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the payout

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PayoutsAPI.RetrievePayout(context.Background(), payoutId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutsAPI.RetrievePayout``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrievePayout`: Payouts
	fmt.Fprintf(os.Stdout, "Response from `PayoutsAPI.RetrievePayout`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**payoutId** | **string** | Unique identifier for the payout | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrievePayoutRequest struct via the builder pattern


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


## UpdatePayout

> Payouts UpdatePayout(ctx, payoutId).PayoutsUpdate(payoutsUpdate).Execute()

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
	payoutId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the payout
	payoutsUpdate := *openapiclient.NewPayoutsUpdate() // PayoutsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PayoutsAPI.UpdatePayout(context.Background(), payoutId).PayoutsUpdate(payoutsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutsAPI.UpdatePayout``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdatePayout`: Payouts
	fmt.Fprintf(os.Stdout, "Response from `PayoutsAPI.UpdatePayout`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**payoutId** | **string** | Unique identifier for the payout | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdatePayoutRequest struct via the builder pattern


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

