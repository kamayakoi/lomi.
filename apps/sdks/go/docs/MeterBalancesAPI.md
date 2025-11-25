# \MeterBalancesAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ListMeterBalances**](MeterBalancesAPI.md#ListMeterBalances) | **Get** /meter_balances | List meter balances
[**RetrieveMeterBalance**](MeterBalancesAPI.md#RetrieveMeterBalance) | **Get** /meter_balances/{balance_id} | Retrieve meter balance



## ListMeterBalances

> ListMeterBalances200Response ListMeterBalances(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List meter balances



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
	resp, r, err := apiClient.MeterBalancesAPI.ListMeterBalances(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MeterBalancesAPI.ListMeterBalances``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListMeterBalances`: ListMeterBalances200Response
	fmt.Fprintf(os.Stdout, "Response from `MeterBalancesAPI.ListMeterBalances`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListMeterBalancesRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListMeterBalances200Response**](ListMeterBalances200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrieveMeterBalance

> MeterBalances RetrieveMeterBalance(ctx, balanceId).Execute()

Retrieve meter balance



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
	balanceId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the meter balance

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.MeterBalancesAPI.RetrieveMeterBalance(context.Background(), balanceId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MeterBalancesAPI.RetrieveMeterBalance``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveMeterBalance`: MeterBalances
	fmt.Fprintf(os.Stdout, "Response from `MeterBalancesAPI.RetrieveMeterBalance`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**balanceId** | **string** | Unique identifier for the meter balance | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveMeterBalanceRequest struct via the builder pattern


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

