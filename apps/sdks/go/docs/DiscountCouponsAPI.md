# \DiscountCouponsAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateDiscountCoupon**](DiscountCouponsAPI.md#CreateDiscountCoupon) | **Post** /discount_coupons | Create discount coupon
[**DeleteDiscountCoupon**](DiscountCouponsAPI.md#DeleteDiscountCoupon) | **Delete** /discount_coupons/{coupon_id} | Delete discount coupon
[**ListDiscountCoupons**](DiscountCouponsAPI.md#ListDiscountCoupons) | **Get** /discount_coupons | List discount coupons
[**RetrieveDiscountCoupon**](DiscountCouponsAPI.md#RetrieveDiscountCoupon) | **Get** /discount_coupons/{coupon_id} | Retrieve discount coupon
[**UpdateDiscountCoupon**](DiscountCouponsAPI.md#UpdateDiscountCoupon) | **Patch** /discount_coupons/{coupon_id} | Update discount coupon



## CreateDiscountCoupon

> DiscountCoupons CreateDiscountCoupon(ctx).DiscountCouponsCreate(discountCouponsCreate).Execute()

Create discount coupon



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
	resp, r, err := apiClient.DiscountCouponsAPI.CreateDiscountCoupon(context.Background()).DiscountCouponsCreate(discountCouponsCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DiscountCouponsAPI.CreateDiscountCoupon``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateDiscountCoupon`: DiscountCoupons
	fmt.Fprintf(os.Stdout, "Response from `DiscountCouponsAPI.CreateDiscountCoupon`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateDiscountCouponRequest struct via the builder pattern


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


## DeleteDiscountCoupon

> DeleteDiscountCoupon(ctx, couponId).Execute()

Delete discount coupon



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
	couponId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the discount coupon

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.DiscountCouponsAPI.DeleteDiscountCoupon(context.Background(), couponId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DiscountCouponsAPI.DeleteDiscountCoupon``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**couponId** | **string** | Unique identifier for the discount coupon | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteDiscountCouponRequest struct via the builder pattern


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


## ListDiscountCoupons

> ListDiscountCoupons200Response ListDiscountCoupons(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List discount coupons



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
	resp, r, err := apiClient.DiscountCouponsAPI.ListDiscountCoupons(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DiscountCouponsAPI.ListDiscountCoupons``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListDiscountCoupons`: ListDiscountCoupons200Response
	fmt.Fprintf(os.Stdout, "Response from `DiscountCouponsAPI.ListDiscountCoupons`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListDiscountCouponsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListDiscountCoupons200Response**](ListDiscountCoupons200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrieveDiscountCoupon

> DiscountCoupons RetrieveDiscountCoupon(ctx, couponId).Execute()

Retrieve discount coupon



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
	couponId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the discount coupon

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DiscountCouponsAPI.RetrieveDiscountCoupon(context.Background(), couponId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DiscountCouponsAPI.RetrieveDiscountCoupon``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveDiscountCoupon`: DiscountCoupons
	fmt.Fprintf(os.Stdout, "Response from `DiscountCouponsAPI.RetrieveDiscountCoupon`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**couponId** | **string** | Unique identifier for the discount coupon | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveDiscountCouponRequest struct via the builder pattern


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


## UpdateDiscountCoupon

> DiscountCoupons UpdateDiscountCoupon(ctx, couponId).DiscountCouponsUpdate(discountCouponsUpdate).Execute()

Update discount coupon



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
	couponId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the discount coupon
	discountCouponsUpdate := *openapiclient.NewDiscountCouponsUpdate() // DiscountCouponsUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DiscountCouponsAPI.UpdateDiscountCoupon(context.Background(), couponId).DiscountCouponsUpdate(discountCouponsUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DiscountCouponsAPI.UpdateDiscountCoupon``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateDiscountCoupon`: DiscountCoupons
	fmt.Fprintf(os.Stdout, "Response from `DiscountCouponsAPI.UpdateDiscountCoupon`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**couponId** | **string** | Unique identifier for the discount coupon | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateDiscountCouponRequest struct via the builder pattern


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

