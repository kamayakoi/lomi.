# \MeterAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**MetersGet**](MeterAPI.md#MetersGet) | **Get** /meters | List meters
[**MetersMeterIdDelete**](MeterAPI.md#MetersMeterIdDelete) | **Delete** /meters/{meter_id} | Delete meter
[**MetersMeterIdGet**](MeterAPI.md#MetersMeterIdGet) | **Get** /meters/{meter_id} | Get meter
[**MetersMeterIdPatch**](MeterAPI.md#MetersMeterIdPatch) | **Patch** /meters/{meter_id} | Update meter
[**MetersPost**](MeterAPI.md#MetersPost) | **Post** /meters | Create meter



## MetersGet

> MetersGet200Response MetersGet(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

List meters



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
	resp, r, err := apiClient.MeterAPI.MetersGet(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MeterAPI.MetersGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `MetersGet`: MetersGet200Response
	fmt.Fprintf(os.Stdout, "Response from `MeterAPI.MetersGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiMetersGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return | [default to 20]
 **offset** | **int32** | Number of items to skip | [default to 0]
 **sort** | **string** | Sort order (e.g., created_at:desc) | 

### Return type

[**MetersGet200Response**](MetersGet200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## MetersMeterIdDelete

> MetersMeterIdDelete(ctx, meterId).Execute()

Delete meter



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
	meterId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The meter ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.MeterAPI.MetersMeterIdDelete(context.Background(), meterId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MeterAPI.MetersMeterIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**meterId** | **string** | The meter ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiMetersMeterIdDeleteRequest struct via the builder pattern


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


## MetersMeterIdGet

> Meters MetersMeterIdGet(ctx, meterId).Execute()

Get meter



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
	meterId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The meter ID

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.MeterAPI.MetersMeterIdGet(context.Background(), meterId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MeterAPI.MetersMeterIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `MetersMeterIdGet`: Meters
	fmt.Fprintf(os.Stdout, "Response from `MeterAPI.MetersMeterIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**meterId** | **string** | The meter ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiMetersMeterIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**Meters**](Meters.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## MetersMeterIdPatch

> Meters MetersMeterIdPatch(ctx, meterId).MetersUpdate(metersUpdate).Execute()

Update meter



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
	meterId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | The meter ID
	metersUpdate := *openapiclient.NewMetersUpdate() // MetersUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.MeterAPI.MetersMeterIdPatch(context.Background(), meterId).MetersUpdate(metersUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MeterAPI.MetersMeterIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `MetersMeterIdPatch`: Meters
	fmt.Fprintf(os.Stdout, "Response from `MeterAPI.MetersMeterIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**meterId** | **string** | The meter ID | 

### Other Parameters

Other parameters are passed through a pointer to a apiMetersMeterIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **metersUpdate** | [**MetersUpdate**](MetersUpdate.md) |  | 

### Return type

[**Meters**](Meters.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## MetersPost

> Meters MetersPost(ctx).MetersCreate(metersCreate).Execute()

Create meter



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
	metersCreate := *openapiclient.NewMetersCreate() // MetersCreate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.MeterAPI.MetersPost(context.Background()).MetersCreate(metersCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MeterAPI.MetersPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `MetersPost`: Meters
	fmt.Fprintf(os.Stdout, "Response from `MeterAPI.MetersPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiMetersPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **metersCreate** | [**MetersCreate**](MetersCreate.md) |  | 

### Return type

[**Meters**](Meters.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

