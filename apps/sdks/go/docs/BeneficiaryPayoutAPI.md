# \BeneficiaryPayoutAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**BeneficiaryPayoutsGet**](BeneficiaryPayoutAPI.md#BeneficiaryPayoutsGet) | **Get** /beneficiary_payouts | List beneficiary_payouts
[**BeneficiaryPayoutsPayoutIdGet**](BeneficiaryPayoutAPI.md#BeneficiaryPayoutsPayoutIdGet) | **Get** /beneficiary_payouts/{payout_id} | Get beneficiary_payout
[**BeneficiaryPayoutsPost**](BeneficiaryPayoutAPI.md#BeneficiaryPayoutsPost) | **Post** /beneficiary_payouts | Create beneficiary_payout



## BeneficiaryPayoutsGet

> BeneficiaryPayoutsGet200Response BeneficiaryPayoutsGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List beneficiary_payouts



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
	resp, r, err := apiClient.BeneficiaryPayoutAPI.BeneficiaryPayoutsGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `BeneficiaryPayoutAPI.BeneficiaryPayoutsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `BeneficiaryPayoutsGet`: BeneficiaryPayoutsGet200Response
	fmt.Fprintf(os.Stdout, "Response from `BeneficiaryPayoutAPI.BeneficiaryPayoutsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiBeneficiaryPayoutsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**BeneficiaryPayoutsGet200Response**](BeneficiaryPayoutsGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## BeneficiaryPayoutsPayoutIdGet

> BeneficiaryPayouts BeneficiaryPayoutsPayoutIdGet(ctx, payoutId).Execute()

Get beneficiary_payout



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
	payoutId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The beneficiary_payout ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.BeneficiaryPayoutAPI.BeneficiaryPayoutsPayoutIdGet(context.Background(), payoutId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `BeneficiaryPayoutAPI.BeneficiaryPayoutsPayoutIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `BeneficiaryPayoutsPayoutIdGet`: BeneficiaryPayouts
	fmt.Fprintf(os.Stdout, "Response from `BeneficiaryPayoutAPI.BeneficiaryPayoutsPayoutIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**payoutId** | **string** | The beneficiary_payout ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiBeneficiaryPayoutsPayoutIdGetRequest struct via the builder pattern


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


## BeneficiaryPayoutsPost

> BeneficiaryPayouts BeneficiaryPayoutsPost(ctx).BeneficiaryPayoutsCreate(beneficiaryPayoutsCreate).Execute()

Create beneficiary_payout



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
	resp, r, err := apiClient.BeneficiaryPayoutAPI.BeneficiaryPayoutsPost(context.Background()).BeneficiaryPayoutsCreate(beneficiaryPayoutsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `BeneficiaryPayoutAPI.BeneficiaryPayoutsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `BeneficiaryPayoutsPost`: BeneficiaryPayouts
	fmt.Fprintf(os.Stdout, "Response from `BeneficiaryPayoutAPI.BeneficiaryPayoutsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiBeneficiaryPayoutsPostRequest struct via the builder pattern


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

