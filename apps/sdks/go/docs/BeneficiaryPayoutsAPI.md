# \BeneficiaryPayoutsAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateBeneficiaryPayout**](BeneficiaryPayoutsAPI.md#CreateBeneficiaryPayout) | **Post** /beneficiary_payouts | Create beneficiary payout
[**ListBeneficiaryPayouts**](BeneficiaryPayoutsAPI.md#ListBeneficiaryPayouts) | **Get** /beneficiary_payouts | List beneficiary payouts
[**RetrieveBeneficiaryPayout**](BeneficiaryPayoutsAPI.md#RetrieveBeneficiaryPayout) | **Get** /beneficiary_payouts/{payout_id} | Retrieve beneficiary payout



## CreateBeneficiaryPayout

> BeneficiaryPayouts CreateBeneficiaryPayout(ctx).BeneficiaryPayoutsCreate(beneficiaryPayoutsCreate).Execute()

Create beneficiary payout



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
	beneficiaryPayoutsCreate := *openapiclient.NewBeneficiaryPayoutsCreate() // BeneficiaryPayoutsCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.BeneficiaryPayoutsAPI.CreateBeneficiaryPayout(context.Background()).BeneficiaryPayoutsCreate(beneficiaryPayoutsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `BeneficiaryPayoutsAPI.CreateBeneficiaryPayout``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateBeneficiaryPayout`: BeneficiaryPayouts
	fmt.Fprintf(os.Stdout, "Response from `BeneficiaryPayoutsAPI.CreateBeneficiaryPayout`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateBeneficiaryPayoutRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **beneficiaryPayoutsCreate** | [**BeneficiaryPayoutsCreate**](BeneficiaryPayoutsCreate.md) |  | 

### Return type

[**BeneficiaryPayouts**](BeneficiaryPayouts.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListBeneficiaryPayouts

> ListBeneficiaryPayouts200Response ListBeneficiaryPayouts(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List beneficiary payouts



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
	resp, r, err := apiClient.BeneficiaryPayoutsAPI.ListBeneficiaryPayouts(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `BeneficiaryPayoutsAPI.ListBeneficiaryPayouts``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListBeneficiaryPayouts`: ListBeneficiaryPayouts200Response
	fmt.Fprintf(os.Stdout, "Response from `BeneficiaryPayoutsAPI.ListBeneficiaryPayouts`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListBeneficiaryPayoutsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListBeneficiaryPayouts200Response**](ListBeneficiaryPayouts200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrieveBeneficiaryPayout

> BeneficiaryPayouts RetrieveBeneficiaryPayout(ctx, payoutId).Execute()

Retrieve beneficiary payout



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
	payoutId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the beneficiary payout

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.BeneficiaryPayoutsAPI.RetrieveBeneficiaryPayout(context.Background(), payoutId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `BeneficiaryPayoutsAPI.RetrieveBeneficiaryPayout``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveBeneficiaryPayout`: BeneficiaryPayouts
	fmt.Fprintf(os.Stdout, "Response from `BeneficiaryPayoutsAPI.RetrieveBeneficiaryPayout`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**payoutId** | **string** | Unique identifier for the beneficiary payout | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveBeneficiaryPayoutRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**BeneficiaryPayouts**](BeneficiaryPayouts.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

