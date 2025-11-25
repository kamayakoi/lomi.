# \PayoutMethodAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**PayoutMethodsGet**](PayoutMethodAPI.md#PayoutMethodsGet) | **Get** /payout_methods | List payout_methods
[**PayoutMethodsPayoutMethodIdGet**](PayoutMethodAPI.md#PayoutMethodsPayoutMethodIdGet) | **Get** /payout_methods/{payout_method_id} | Get payout_method



## PayoutMethodsGet

> PayoutMethodsGet200Response PayoutMethodsGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List payout_methods



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
	resp, r, err := apiClient.PayoutMethodAPI.PayoutMethodsGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutMethodAPI.PayoutMethodsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PayoutMethodsGet`: PayoutMethodsGet200Response
	fmt.Fprintf(os.Stdout, "Response from `PayoutMethodAPI.PayoutMethodsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiPayoutMethodsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**PayoutMethodsGet200Response**](PayoutMethodsGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PayoutMethodsPayoutMethodIdGet

> PayoutMethods PayoutMethodsPayoutMethodIdGet(ctx, payoutMethodId).Execute()

Get payout_method



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
	payoutMethodId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The payout_method ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PayoutMethodAPI.PayoutMethodsPayoutMethodIdGet(context.Background(), payoutMethodId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutMethodAPI.PayoutMethodsPayoutMethodIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PayoutMethodsPayoutMethodIdGet`: PayoutMethods
	fmt.Fprintf(os.Stdout, "Response from `PayoutMethodAPI.PayoutMethodsPayoutMethodIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**payoutMethodId** | **string** | The payout_method ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiPayoutMethodsPayoutMethodIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**PayoutMethods**](PayoutMethods.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

