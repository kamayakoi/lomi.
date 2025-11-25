# \MeterBalanceAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**MeterBalancesBalanceIdGet**](MeterBalanceAPI.md#MeterBalancesBalanceIdGet) | **Get** /meter_balances/{balance_id} | Get meter_balance
[**MeterBalancesGet**](MeterBalanceAPI.md#MeterBalancesGet) | **Get** /meter_balances | List meter_balances



## MeterBalancesBalanceIdGet

> MeterBalances MeterBalancesBalanceIdGet(ctx, balanceId).Execute()

Get meter_balance



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
	balanceId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The meter_balance ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.MeterBalanceAPI.MeterBalancesBalanceIdGet(context.Background(), balanceId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MeterBalanceAPI.MeterBalancesBalanceIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `MeterBalancesBalanceIdGet`: MeterBalances
	fmt.Fprintf(os.Stdout, "Response from `MeterBalanceAPI.MeterBalancesBalanceIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**balanceId** | **string** | The meter_balance ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiMeterBalancesBalanceIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**MeterBalances**](MeterBalances.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## MeterBalancesGet

> MeterBalancesGet200Response MeterBalancesGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List meter_balances



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
	resp, r, err := apiClient.MeterBalanceAPI.MeterBalancesGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MeterBalanceAPI.MeterBalancesGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `MeterBalancesGet`: MeterBalancesGet200Response
	fmt.Fprintf(os.Stdout, "Response from `MeterBalanceAPI.MeterBalancesGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiMeterBalancesGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**MeterBalancesGet200Response**](MeterBalancesGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

