# \DiscountCouponAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**DiscountCouponsCouponIdDelete**](DiscountCouponAPI.md#DiscountCouponsCouponIdDelete) | **Delete** /discount_coupons/{coupon_id} | Delete discount_coupon
[**DiscountCouponsCouponIdGet**](DiscountCouponAPI.md#DiscountCouponsCouponIdGet) | **Get** /discount_coupons/{coupon_id} | Get discount_coupon
[**DiscountCouponsCouponIdPatch**](DiscountCouponAPI.md#DiscountCouponsCouponIdPatch) | **Patch** /discount_coupons/{coupon_id} | Update discount_coupon
[**DiscountCouponsGet**](DiscountCouponAPI.md#DiscountCouponsGet) | **Get** /discount_coupons | List discount_coupons
[**DiscountCouponsPost**](DiscountCouponAPI.md#DiscountCouponsPost) | **Post** /discount_coupons | Create discount_coupon



## DiscountCouponsCouponIdDelete

> DiscountCouponsCouponIdDelete(ctx, couponId).Execute()

Delete discount_coupon



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
	couponId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The discount_coupon ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.DiscountCouponAPI.DiscountCouponsCouponIdDelete(context.Background(), couponId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DiscountCouponAPI.DiscountCouponsCouponIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**couponId** | **string** | The discount_coupon ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiDiscountCouponsCouponIdDeleteRequest struct via the builder pattern


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


## DiscountCouponsCouponIdGet

> DiscountCoupons DiscountCouponsCouponIdGet(ctx, couponId).Execute()

Get discount_coupon



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
	couponId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The discount_coupon ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DiscountCouponAPI.DiscountCouponsCouponIdGet(context.Background(), couponId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DiscountCouponAPI.DiscountCouponsCouponIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `DiscountCouponsCouponIdGet`: DiscountCoupons
	fmt.Fprintf(os.Stdout, "Response from `DiscountCouponAPI.DiscountCouponsCouponIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**couponId** | **string** | The discount_coupon ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiDiscountCouponsCouponIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**DiscountCoupons**](DiscountCoupons.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DiscountCouponsCouponIdPatch

> DiscountCoupons DiscountCouponsCouponIdPatch(ctx, couponId).DiscountCouponsUpdate(discountCouponsUpdate).Execute()

Update discount_coupon



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
	couponId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The discount_coupon ID
	discountCouponsUpdate := *openapiclient.NewDiscountCouponsUpdate() // DiscountCouponsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DiscountCouponAPI.DiscountCouponsCouponIdPatch(context.Background(), couponId).DiscountCouponsUpdate(discountCouponsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DiscountCouponAPI.DiscountCouponsCouponIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `DiscountCouponsCouponIdPatch`: DiscountCoupons
	fmt.Fprintf(os.Stdout, "Response from `DiscountCouponAPI.DiscountCouponsCouponIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**couponId** | **string** | The discount_coupon ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiDiscountCouponsCouponIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **discountCouponsUpdate** | [**DiscountCouponsUpdate**](DiscountCouponsUpdate.md) |  | 

### Return type

[**DiscountCoupons**](DiscountCoupons.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DiscountCouponsGet

> DiscountCouponsGet200Response DiscountCouponsGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List discount_coupons



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
	resp, r, err := apiClient.DiscountCouponAPI.DiscountCouponsGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DiscountCouponAPI.DiscountCouponsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `DiscountCouponsGet`: DiscountCouponsGet200Response
	fmt.Fprintf(os.Stdout, "Response from `DiscountCouponAPI.DiscountCouponsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiDiscountCouponsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**DiscountCouponsGet200Response**](DiscountCouponsGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DiscountCouponsPost

> DiscountCoupons DiscountCouponsPost(ctx).DiscountCouponsCreate(discountCouponsCreate).Execute()

Create discount_coupon



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
	discountCouponsCreate := *openapiclient.NewDiscountCouponsCreate() // DiscountCouponsCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DiscountCouponAPI.DiscountCouponsPost(context.Background()).DiscountCouponsCreate(discountCouponsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DiscountCouponAPI.DiscountCouponsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `DiscountCouponsPost`: DiscountCoupons
	fmt.Fprintf(os.Stdout, "Response from `DiscountCouponAPI.DiscountCouponsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiDiscountCouponsPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **discountCouponsCreate** | [**DiscountCouponsCreate**](DiscountCouponsCreate.md) |  | 

### Return type

[**DiscountCoupons**](DiscountCoupons.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

