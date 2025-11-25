# \InstallmentPaymentAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**InstallmentPaymentsGet**](InstallmentPaymentAPI.md#InstallmentPaymentsGet) | **Get** /installment_payments | List installment_payments
[**InstallmentPaymentsPaymentIdGet**](InstallmentPaymentAPI.md#InstallmentPaymentsPaymentIdGet) | **Get** /installment_payments/{payment_id} | Get installment_payment



## InstallmentPaymentsGet

> InstallmentPaymentsGet200Response InstallmentPaymentsGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List installment_payments



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
	resp, r, err := apiClient.InstallmentPaymentAPI.InstallmentPaymentsGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `InstallmentPaymentAPI.InstallmentPaymentsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `InstallmentPaymentsGet`: InstallmentPaymentsGet200Response
	fmt.Fprintf(os.Stdout, "Response from `InstallmentPaymentAPI.InstallmentPaymentsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiInstallmentPaymentsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**InstallmentPaymentsGet200Response**](InstallmentPaymentsGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## InstallmentPaymentsPaymentIdGet

> InstallmentPayments InstallmentPaymentsPaymentIdGet(ctx, paymentId).Execute()

Get installment_payment



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
	paymentId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The installment_payment ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.InstallmentPaymentAPI.InstallmentPaymentsPaymentIdGet(context.Background(), paymentId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `InstallmentPaymentAPI.InstallmentPaymentsPaymentIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `InstallmentPaymentsPaymentIdGet`: InstallmentPayments
	fmt.Fprintf(os.Stdout, "Response from `InstallmentPaymentAPI.InstallmentPaymentsPaymentIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**paymentId** | **string** | The installment_payment ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiInstallmentPaymentsPaymentIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**InstallmentPayments**](InstallmentPayments.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

