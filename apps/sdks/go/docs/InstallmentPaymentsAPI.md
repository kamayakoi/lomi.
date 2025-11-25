# \InstallmentPaymentsAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ListInstallmentPayments**](InstallmentPaymentsAPI.md#ListInstallmentPayments) | **Get** /installment_payments | List installment payments
[**RetrieveInstallmentPayment**](InstallmentPaymentsAPI.md#RetrieveInstallmentPayment) | **Get** /installment_payments/{payment_id} | Retrieve installment payment



## ListInstallmentPayments

> ListInstallmentPayments200Response ListInstallmentPayments(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List installment payments



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
	resp, r, err := apiClient.InstallmentPaymentsAPI.ListInstallmentPayments(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `InstallmentPaymentsAPI.ListInstallmentPayments``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListInstallmentPayments`: ListInstallmentPayments200Response
	fmt.Fprintf(os.Stdout, "Response from `InstallmentPaymentsAPI.ListInstallmentPayments`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListInstallmentPaymentsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListInstallmentPayments200Response**](ListInstallmentPayments200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrieveInstallmentPayment

> InstallmentPayments RetrieveInstallmentPayment(ctx, paymentId).Execute()

Retrieve installment payment



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
	paymentId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the installment payment

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.InstallmentPaymentsAPI.RetrieveInstallmentPayment(context.Background(), paymentId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `InstallmentPaymentsAPI.RetrieveInstallmentPayment``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveInstallmentPayment`: InstallmentPayments
	fmt.Fprintf(os.Stdout, "Response from `InstallmentPaymentsAPI.RetrieveInstallmentPayment`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**paymentId** | **string** | Unique identifier for the installment payment | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveInstallmentPaymentRequest struct via the builder pattern


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

