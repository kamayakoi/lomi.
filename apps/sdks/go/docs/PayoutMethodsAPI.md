# \PayoutMethodsAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ListPayoutMethods**](PayoutMethodsAPI.md#ListPayoutMethods) | **Get** /payout_methods | List payout methods
[**RetrievePayoutMethod**](PayoutMethodsAPI.md#RetrievePayoutMethod) | **Get** /payout_methods/{payout_method_id} | Retrieve payout method



## ListPayoutMethods

> ListPayoutMethods200Response ListPayoutMethods(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List payout methods



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
	resp, r, err := apiClient.PayoutMethodsAPI.ListPayoutMethods(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutMethodsAPI.ListPayoutMethods``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListPayoutMethods`: ListPayoutMethods200Response
	fmt.Fprintf(os.Stdout, "Response from `PayoutMethodsAPI.ListPayoutMethods`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListPayoutMethodsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListPayoutMethods200Response**](ListPayoutMethods200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrievePayoutMethod

> PayoutMethods RetrievePayoutMethod(ctx, payoutMethodId).Execute()

Retrieve payout method



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
	payoutMethodId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the payout method

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PayoutMethodsAPI.RetrievePayoutMethod(context.Background(), payoutMethodId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PayoutMethodsAPI.RetrievePayoutMethod``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrievePayoutMethod`: PayoutMethods
	fmt.Fprintf(os.Stdout, "Response from `PayoutMethodsAPI.RetrievePayoutMethod`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**payoutMethodId** | **string** | Unique identifier for the payout method | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrievePayoutMethodRequest struct via the builder pattern


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

