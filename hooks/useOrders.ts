"use client";

import { useState } from "react";
import {
    useGetMyOrdersQuery,
    useGetOrderDetailsQuery,
    useCancelOrderMutation,
    useReorderOrderMutation,
    useRequestReturnMutation,
} from "@/features/order/orderApi";
import { Order, ReturnRequest } from "@/features/order/orderTypes";

export const useOrders = (page: number = 0, size: number = 10) => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Queries
    const {
        data: ordersData,
        isLoading: ordersLoading,
        error: ordersError,
        refetch: refetchOrders,
    } = useGetMyOrdersQuery({ page, size });

    // Mutations
    const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
    const [reorderOrder, { isLoading: reordering }] = useReorderOrderMutation();
    const [requestReturn, { isLoading: returningItem }] = useRequestReturnMutation();

    const handleCancelOrder = async (orderId: number): Promise<boolean> => {
        try {
            setError(null);
            setSuccess(null);
            await cancelOrder(orderId).unwrap();
            setSuccess("Order cancelled successfully");
            await refetchOrders();
            return true;
        } catch (err: any) {
            const errorMsg = err?.data?.message || "Failed to cancel order";
            setError(errorMsg);
            console.error("Cancel order error:", errorMsg);
            return false;
        }
    };

    const handleReorderOrder = async (
        orderId: number,
    ): Promise<Order | null> => {
        try {
            setError(null);
            setSuccess(null);
            const result = await reorderOrder(orderId).unwrap();
            setSuccess("Order recreated successfully. Proceeding to checkout...");
            return result;
        } catch (err: any) {
            const errorMsg =
                err?.data?.message || "Failed to recreate order";
            setError(errorMsg);
            console.error("Reorder error:", errorMsg);
            return null;
        }
    };

    const handleRequestReturn = async (
        returnData: ReturnRequest,
    ): Promise<boolean> => {
        try {
            setError(null);
            setSuccess(null);
            await requestReturn(returnData).unwrap();
            setSuccess("Return request submitted successfully");
            await refetchOrders();
            return true;
        } catch (err: any) {
            const errorMsg = err?.data?.message || "Failed to request return";
            setError(errorMsg);
            console.error("Return error:", errorMsg);
            return false;
        }
    };

    return {
        // State
        orders: ordersData?.content || [],
        totalElements: ordersData?.totalElements || 0,
        totalPages: ordersData?.totalPages || 0,
        currentPage: page,
        isLoading: ordersLoading,
        error: error || ordersError,
        success,

        // Loading states
        cancelling,
        reordering,
        returningItem,

        // Mutations
        cancelOrder: handleCancelOrder,
        reorderOrder: handleReorderOrder,
        requestReturn: handleRequestReturn,

        // Utilities
        refetch: refetchOrders,
        clearError: () => setError(null),
        clearSuccess: () => setSuccess(null),
    };
};

export const useOrderDetails = (orderId: number) => {
    const [error, setError] = useState<string | null>(null);
    const { data: order, isLoading, error: queryError, refetch } = useGetOrderDetailsQuery(
        orderId,
    );
    const [requestReturn, { isLoading: returningItem }] = useRequestReturnMutation();

    const handleRequestReturn = async (
        returnData: ReturnRequest,
    ): Promise<boolean> => {
        try {
            setError(null);
            await requestReturn(returnData).unwrap();
            await refetch();
            return true;
        } catch (err: any) {
            const errorMsg = err?.data?.message || "Failed to request return";
            setError(errorMsg);
            console.error("Return error:", errorMsg);
            return false;
        }
    };

    return {
        order,
        isLoading,
        error: error || queryError,
        refetch,
        returningItem,
        requestReturn: handleRequestReturn,
        clearError: () => setError(null),
    };
};
