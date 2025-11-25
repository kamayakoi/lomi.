/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { discount_coupons } from '../models/discount_coupons';
import type { discount_coupons_create } from '../models/discount_coupons_create';
import type { discount_coupons_update } from '../models/discount_coupons_update';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DiscountCouponsService {
    /**
     * List discount coupons
     * Discount coupons - create and manage promotional codes
     * @returns any Successful response with paginated data
     * @throws ApiError
     */
    public static listDiscountCoupons({
        limit = 20,
        offset,
        sort,
    }: {
        /**
         * Maximum number of items to return (1-100)
         */
        limit?: number,
        /**
         * Number of items to skip for pagination
         */
        offset?: number,
        /**
         * Sort order. Format: `field:direction` (e.g., `created_at:desc`)
         */
        sort?: string,
    }): CancelablePromise<{
        data?: Array<discount_coupons>;
        pagination?: {
            /**
             * Number of items per page
             */
            limit?: number;
            /**
             * Number of items skipped
             */
            offset?: number;
            /**
             * Total number of items available
             */
            total?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discount_coupons',
            query: {
                'limit': limit,
                'offset': offset,
                'sort': sort,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Create discount coupon
     * Discount coupons - create and manage promotional codes
     * @returns discount_coupons Discount_coupon successfully created
     * @throws ApiError
     */
    public static createDiscountCoupon({
        requestBody,
    }: {
        requestBody: discount_coupons_create,
    }): CancelablePromise<discount_coupons> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/discount_coupons',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input`,
                401: `Unauthorized - Invalid or missing API key`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Retrieve discount coupon
     * Retrieve a specific discount coupon by its unique identifier.
     * @returns discount_coupons Discount_coupon retrieved successfully
     * @throws ApiError
     */
    public static retrieveDiscountCoupon({
        couponId,
    }: {
        /**
         * Unique identifier for the discount coupon
         */
        couponId: string,
    }): CancelablePromise<discount_coupons> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discount_coupons/{coupon_id}',
            path: {
                'coupon_id': couponId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update discount coupon
     * Update a specific discount coupon. Only provided fields will be updated.
     * @returns discount_coupons Discount_coupon successfully updated
     * @throws ApiError
     */
    public static updateDiscountCoupon({
        couponId,
        requestBody,
    }: {
        /**
         * Unique identifier for the discount coupon
         */
        couponId: string,
        requestBody: discount_coupons_update,
    }): CancelablePromise<discount_coupons> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/discount_coupons/{coupon_id}',
            path: {
                'coupon_id': couponId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Invalid input`,
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Delete discount coupon
     * Delete a specific discount coupon. This action cannot be undone.
     * @returns void
     * @throws ApiError
     */
    public static deleteDiscountCoupon({
        couponId,
    }: {
        /**
         * Unique identifier for the discount coupon
         */
        couponId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/discount_coupons/{coupon_id}',
            path: {
                'coupon_id': couponId,
            },
            errors: {
                401: `Unauthorized - Invalid or missing API key`,
                404: `Not found - Resource does not exist`,
                500: `Internal server error`,
            },
        });
    }
}
