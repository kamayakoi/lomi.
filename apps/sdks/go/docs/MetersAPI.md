# \MetersAPI

All URIs are relative to *https://api.lomi.africa/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateMeter**](MetersAPI.md#CreateMeter) | **Post** /meters | Create meter
[**DeleteMeter**](MetersAPI.md#DeleteMeter) | **Delete** /meters/{meter_id} | Delete meter
[**ListMeters**](MetersAPI.md#ListMeters) | **Get** /meters | List meters
[**RetrieveMeter**](MetersAPI.md#RetrieveMeter) | **Get** /meters/{meter_id} | Retrieve meter
[**UpdateMeter**](MetersAPI.md#UpdateMeter) | **Patch** /meters/{meter_id} | Update meter



## CreateMeter

> Meters CreateMeter(ctx).MetersCreate(metersCreate).Execute()

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
	resp, r, err := apiClient.MetersAPI.CreateMeter(context.Background()).MetersCreate(metersCreate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MetersAPI.CreateMeter``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateMeter`: Meters
	fmt.Fprintf(os.Stdout, "Response from `MetersAPI.CreateMeter`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateMeterRequest struct via the builder pattern


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


## DeleteMeter

> DeleteMeter(ctx, meterId).Execute()

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
	meterId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the meter

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.MetersAPI.DeleteMeter(context.Background(), meterId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MetersAPI.DeleteMeter``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**meterId** | **string** | Unique identifier for the meter | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteMeterRequest struct via the builder pattern


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


## ListMeters

> ListMeters200Response ListMeters(ctx).Limit(limit).Offset(offset).Sort(sort).Execute()

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
	limit := int32(56) // int32 | Maximum number of items to return (1-100) (optional) (default to 20)
	offset := int32(56) // int32 | Number of items to skip for pagination (optional) (default to 0)
	sort := "created_at:desc" // string | Sort order. Format: `field:direction` (e.g., `created_at:desc`) (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.MetersAPI.ListMeters(context.Background()).Limit(limit).Offset(offset).Sort(sort).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MetersAPI.ListMeters``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListMeters`: ListMeters200Response
	fmt.Fprintf(os.Stdout, "Response from `MetersAPI.ListMeters`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListMetersRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** | Maximum number of items to return (1-100) | [default to 20]
 **offset** | **int32** | Number of items to skip for pagination | [default to 0]
 **sort** | **string** | Sort order. Format: &#x60;field:direction&#x60; (e.g., &#x60;created_at:desc&#x60;) | 

### Return type

[**ListMeters200Response**](ListMeters200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetrieveMeter

> Meters RetrieveMeter(ctx, meterId).Execute()

Retrieve meter



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
	meterId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the meter

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.MetersAPI.RetrieveMeter(context.Background(), meterId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MetersAPI.RetrieveMeter``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `RetrieveMeter`: Meters
	fmt.Fprintf(os.Stdout, "Response from `MetersAPI.RetrieveMeter`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**meterId** | **string** | Unique identifier for the meter | 

### Other Parameters

Other parameters are passed through a pointer to a apiRetrieveMeterRequest struct via the builder pattern


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


## UpdateMeter

> Meters UpdateMeter(ctx, meterId).MetersUpdate(metersUpdate).Execute()

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
	meterId := "38400000-8cf0-11bd-b23e-10b96e4ef00d" // string | Unique identifier for the meter
	metersUpdate := *openapiclient.NewMetersUpdate() // MetersUpdate | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.MetersAPI.UpdateMeter(context.Background(), meterId).MetersUpdate(metersUpdate).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `MetersAPI.UpdateMeter``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateMeter`: Meters
	fmt.Fprintf(os.Stdout, "Response from `MetersAPI.UpdateMeter`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**meterId** | **string** | Unique identifier for the meter | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateMeterRequest struct via the builder pattern


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

