# \CoreAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateCustomer**](CoreAPI.md#CreateCustomer) | **Post** /customers | Create customer
[**CreatePaymentRequest**](CoreAPI.md#CreatePaymentRequest) | **Post** /payment_requests | Create payment request
[**CreateRefund**](CoreAPI.md#CreateRefund) | **Post** /refunds | Create refund
[**DeleteCustomer**](CoreAPI.md#DeleteCustomer) | **Delete** /customers/{customer_id} | Delete customer
[**DeletePaymentRequest**](CoreAPI.md#DeletePaymentRequest) | **Delete** /payment_requests/{request_id} | Delete payment request
[**DeleteRefund**](CoreAPI.md#DeleteRefund) | **Delete** /refunds/{refund_id} | Delete refund
[**ListCustomers**](CoreAPI.md#ListCustomers) | **Get** /customers | List customers
[**ListPaymentRequests**](CoreAPI.md#ListPaymentRequests) | **Get** /payment_requests | List payment requests
[**ListRefunds**](CoreAPI.md#ListRefunds) | **Get** /refunds | List refunds
[**ListTransactions**](CoreAPI.md#ListTransactions) | **Get** /transactions | List transactions
[**RetrieveCustomer**](CoreAPI.md#RetrieveCustomer) | **Get** /customers/{customer_id} | Retrieve customer
[**RetrievePaymentRequest**](CoreAPI.md#RetrievePaymentRequest) | **Get** /payment_requests/{request_id} | Retrieve payment request
[**RetrieveRefund**](CoreAPI.md#RetrieveRefund) | **Get** /refunds/{refund_id} | Retrieve refund
[**RetrieveTransaction**](CoreAPI.md#RetrieveTransaction) | **Get** /transactions/{transaction_id} | Retrieve transaction
[**UpdateCustomer**](CoreAPI.md#UpdateCustomer) | **Patch** /customers/{customer_id} | Update customer
[**UpdatePaymentRequest**](CoreAPI.md#UpdatePaymentRequest) | **Patch** /payment_requests/{request_id} | Update payment request
[**UpdateRefund**](CoreAPI.md#UpdateRefund) | **Patch** /refunds/{refund_id} | Update refund



## CreateCustomer

> Customers CreateCustomer(ctx).CustomersCreate(customersCreate).Execute()

Create customer



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
	customersCreate := *openapiclient.NewCustomersCreate() // CustomersCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CoreAPI.CreateCustomer(context.Background()).CustomersCreate(customersCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.CreateCustomer``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateCustomer`: Customers
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.CreateCustomer`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateCustomerRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **customersCreate** | [**CustomersCreate**](CustomersCreate.md) |  | 

### Return type

[**Customers**](Customers.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## CreatePaymentRequest

> PaymentRequests CreatePaymentRequest(ctx).PaymentRequestsCreate(paymentRequestsCreate).Execute()

Create payment request



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
	resp, r, err := apiClient.CoreAPI.CreatePaymentRequest(context.Background()).PaymentRequestsCreate(paymentRequestsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.CreatePaymentRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreatePaymentRequest`: PaymentRequests
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.CreatePaymentRequest`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreatePaymentRequestRequest struct via the builder pattern


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


## CreateRefund

> Refunds CreateRefund(ctx).RefundsCreate(refundsCreate).Execute()

Create refund



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
	refundsCreate := *openapiclient.NewRefundsCreate() // RefundsCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CoreAPI.CreateRefund(context.Background()).RefundsCreate(refundsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.CreateRefund``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateRefund`: Refunds
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.CreateRefund`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateRefundRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **refundsCreate** | [**RefundsCreate**](RefundsCreate.md) |  | 

### Return type

[**Refunds**](Refunds.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DeleteCustomer

> DeleteCustomer(ctx, customerId).Execute()

Delete customer



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
	customerId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the customer

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.CoreAPI.DeleteCustomer(context.Background(), customerId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.DeleteCustomer``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**customerId** | **string** | Unique identifier for the customer | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteCustomerRequest struct via the builder pattern


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


## DeletePaymentRequest

> DeletePaymentRequest(ctx, requestId).Execute()

Delete payment request



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
	requestId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the payment request

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.CoreAPI.DeletePaymentRequest(context.Background(), requestId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.DeletePaymentRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**requestId** | **string** | Unique identifier for the payment request | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeletePaymentRequestRequest struct via the builder pattern


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


## DeleteRefund

> DeleteRefund(ctx, refundId).Execute()

Delete refund



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
	refundId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the refund

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.CoreAPI.DeleteRefund(context.Background(), refundId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.DeleteRefund``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**refundId** | **string** | Unique identifier for the refund | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteRefundRequest struct via the builder pattern


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


## ListCustomers

> ListCustomers200Response ListCustomers(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List customers



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
	resp, r, err := apiClient.CoreAPI.ListCustomers(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.ListCustomers``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListCustomers`: ListCustomers200Response
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.ListCustomers`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListCustomersRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListCustomers200Response**](ListCustomers200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListPaymentRequests

> ListPaymentRequests200Response ListPaymentRequests(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List payment requests



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
	resp, r, err := apiClient.CoreAPI.ListPaymentRequests(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.ListPaymentRequests``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListPaymentRequests`: ListPaymentRequests200Response
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.ListPaymentRequests`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListPaymentRequestsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListPaymentRequests200Response**](ListPaymentRequests200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListRefunds

> ListRefunds200Response ListRefunds(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List refunds



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
	resp, r, err := apiClient.CoreAPI.ListRefunds(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.ListRefunds``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListRefunds`: ListRefunds200Response
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.ListRefunds`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListRefundsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListRefunds200Response**](ListRefunds200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListTransactions

> ListTransactions200Response ListTransactions(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List transactions



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
	resp, r, err := apiClient.CoreAPI.ListTransactions(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.ListTransactions``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListTransactions`: ListTransactions200Response
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.ListTransactions`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListTransactionsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListTransactions200Response**](ListTransactions200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrieveCustomer

> Customers RetrieveCustomer(ctx, customerId).Execute()

Retrieve customer



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
	customerId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the customer

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CoreAPI.RetrieveCustomer(context.Background(), customerId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.RetrieveCustomer``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveCustomer`: Customers
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.RetrieveCustomer`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**customerId** | **string** | Unique identifier for the customer | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveCustomerRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**Customers**](Customers.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrievePaymentRequest

> PaymentRequests RetrievePaymentRequest(ctx, requestId).Execute()

Retrieve payment request



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
	requestId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the payment request

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CoreAPI.RetrievePaymentRequest(context.Background(), requestId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.RetrievePaymentRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrievePaymentRequest`: PaymentRequests
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.RetrievePaymentRequest`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**requestId** | **string** | Unique identifier for the payment request | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrievePaymentRequestRequest struct via the builder pattern


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


## RetrieveRefund

> Refunds RetrieveRefund(ctx, refundId).Execute()

Retrieve refund



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
	refundId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the refund

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CoreAPI.RetrieveRefund(context.Background(), refundId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.RetrieveRefund``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveRefund`: Refunds
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.RetrieveRefund`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**refundId** | **string** | Unique identifier for the refund | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveRefundRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**Refunds**](Refunds.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrieveTransaction

> Transactions RetrieveTransaction(ctx, transactionId).Execute()

Retrieve transaction



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
	transactionId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the transaction

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CoreAPI.RetrieveTransaction(context.Background(), transactionId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.RetrieveTransaction``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveTransaction`: Transactions
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.RetrieveTransaction`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**transactionId** | **string** | Unique identifier for the transaction | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveTransactionRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**Transactions**](Transactions.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## UpdateCustomer

> Customers UpdateCustomer(ctx, customerId).CustomersUpdate(customersUpdate).Execute()

Update customer



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
	customerId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the customer
	customersUpdate := *openapiclient.NewCustomersUpdate() // CustomersUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CoreAPI.UpdateCustomer(context.Background(), customerId).CustomersUpdate(customersUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.UpdateCustomer``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateCustomer`: Customers
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.UpdateCustomer`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**customerId** | **string** | Unique identifier for the customer | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateCustomerRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **customersUpdate** | [**CustomersUpdate**](CustomersUpdate.md) |  | 

### Return type

[**Customers**](Customers.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## UpdatePaymentRequest

> PaymentRequests UpdatePaymentRequest(ctx, requestId).PaymentRequestsUpdate(paymentRequestsUpdate).Execute()

Update payment request



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
	requestId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the payment request
	paymentRequestsUpdate := *openapiclient.NewPaymentRequestsUpdate() // PaymentRequestsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CoreAPI.UpdatePaymentRequest(context.Background(), requestId).PaymentRequestsUpdate(paymentRequestsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.UpdatePaymentRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdatePaymentRequest`: PaymentRequests
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.UpdatePaymentRequest`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**requestId** | **string** | Unique identifier for the payment request | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdatePaymentRequestRequest struct via the builder pattern


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


## UpdateRefund

> Refunds UpdateRefund(ctx, refundId).RefundsUpdate(refundsUpdate).Execute()

Update refund



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
	refundId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the refund
	refundsUpdate := *openapiclient.NewRefundsUpdate() // RefundsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CoreAPI.UpdateRefund(context.Background(), refundId).RefundsUpdate(refundsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CoreAPI.UpdateRefund``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateRefund`: Refunds
	fmt.Fprintf(os.Stdout, "Response from `CoreAPI.UpdateRefund`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**refundId** | **string** | Unique identifier for the refund | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateRefundRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **refundsUpdate** | [**RefundsUpdate**](RefundsUpdate.md) |  | 

### Return type

[**Refunds**](Refunds.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

