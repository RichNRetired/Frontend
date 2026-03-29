"use client";

import React, { useState, useEffect, useMemo } from "react";
import { calculateTax } from "@/features/cart/cartUtils";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  useCheckoutMutation,
  useBuyNowCheckoutMutation,
  usePlaceOrderCheckoutMutation,
  usePlaceOrderMutation,
  useInitiatePaymentMutation,
  useValidateCouponMutation,
  useGetAvailableCouponsQuery,
  useApplyCouponToOrderMutation,
  useRemoveCouponFromOrderMutation,
  useCancelOrderMutation,
} from "@/features/order/orderApi";
import type {
  AppliedCouponResponse,
  CancelOrderRequest,
  CheckoutRequest,
  CheckoutResponse,
  CouponValidationRequest,
  CouponValidationResponse,
  OrderItem,
  PlacedOrderResponse,
} from "@/features/order/orderTypes";
import { getCurrentUser } from "@/lib/auth";
import { buildInitiatePaymentRequest } from "@/lib/razorpay";
import { useGetAddressesQuery } from "@/features/user/userApi";
import { useGetLocationsQuery } from "@/features/location/locationApi";
import { AddAddressModal } from "@/components/checkout/AddAddressModal";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CreditCard,
  Truck,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
  Plus,
  LogIn,
  TicketPercent,
  X,
} from "lucide-react";
import Link from "next/link";
import { sendEvent } from "@/services/analytics.service";
import {
  getActiveBuyNowItem,
  readBuyNowState,
  updateBuyNowStatus,
  type BuyNowItem,
} from "@/lib/buy-now";

interface Address {
  id: number | string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  addressType?: "Home" | "Work";
  default?: boolean;
}

function resolveNumericUserId(...candidates: unknown[]): number | undefined {
  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return undefined;
}

function resolveBooleanCandidate(...candidates: unknown[]): boolean | undefined {
  return candidates.find((value) => typeof value === "boolean");
}

function readUserField<T>(userValue: unknown, fieldName: string): T | undefined {
  if (!userValue || typeof userValue !== "object" || !(fieldName in userValue)) {
    return undefined;
  }

  return (userValue as Record<string, T | undefined>)[fieldName];
}

async function fetchCategoryIdsForProducts(productIds: number[]) {
  const entries = await Promise.all(
    productIds.map(async (productId) => {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          return [productId, undefined] as const;
        }

        const productDetails = await response.json();
        const categoryId = Number(
          productDetails?.category?.id ?? productDetails?.categoryId,
        );

        return [
          productId,
          Number.isFinite(categoryId) && categoryId > 0 ? categoryId : undefined,
        ] as const;
      } catch (error) {
        console.error("Failed to resolve category for coupon payload", error);
        return [productId, undefined] as const;
      }
    }),
  );

  return Object.fromEntries(entries) as Record<number, number | undefined>;
}

function createCouponPayload({
  couponCode,
  orderAmount,
  cartItems,
  paymentMethod,
  userId,
  isFirstOrder,
  isNewUser,
}: {
  couponCode: string;
  orderAmount: number;
  cartItems: Array<{ productId: number; categoryId?: number }>;
  paymentMethod: string;
  userId?: number;
  isFirstOrder?: boolean;
  isNewUser?: boolean;
}): CouponValidationRequest {
  const productIds = Array.from(
    new Set(
      cartItems
        .map((item) => Number(item.productId))
        .filter((productId) => Number.isFinite(productId) && productId > 0),
    ),
  );
  const categoryIds = Array.from(
    new Set(
      cartItems
        .map((item) => Number(item.categoryId))
        .filter((categoryId) => Number.isFinite(categoryId) && categoryId > 0),
    ),
  );
  const payload: CouponValidationRequest = {
    couponCode,
    orderAmount,
    productIds,
    categoryIds,
    paymentMethod,
  };

  if (userId !== undefined) {
    payload.userId = userId;
  }

  if (typeof isFirstOrder === "boolean") {
    payload.isFirstOrder = isFirstOrder;
  }

  if (typeof isNewUser === "boolean") {
    payload.isNewUser = isNewUser;
  }

  return payload;
}

type MutationTrigger<TArg, TResult> = (arg: TArg) => {
  unwrap: () => Promise<TResult>;
};

async function validateCouponPreview({
  couponCode,
  validateCoupon,
  buildCouponPayload,
  couponContextSignature,
  setCouponCode,
  setCouponError,
  setCouponMessage,
  setAppliedCouponPreview,
  setAppliedCouponContextSignature,
}: {
  couponCode: string;
  validateCoupon: MutationTrigger<CouponValidationRequest, CouponValidationResponse>;
  buildCouponPayload: (nextCode?: string) => Promise<CouponValidationRequest>;
  couponContextSignature: string;
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;
  setCouponError: React.Dispatch<React.SetStateAction<string | null>>;
  setCouponMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setAppliedCouponPreview: React.Dispatch<
    React.SetStateAction<CouponValidationResponse | null>
  >;
  setAppliedCouponContextSignature: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}) {
  const normalizedCode = couponCode.trim().toUpperCase();

  if (!normalizedCode) {
    setCouponError("Enter a coupon code.");
    setCouponMessage(null);
    setAppliedCouponPreview(null);
    return;
  }

  try {
    setCouponError(null);
    setCouponMessage(null);

    const validation = await validateCoupon(
      await buildCouponPayload(normalizedCode),
    ).unwrap();

    if (!validation.valid) {
      setAppliedCouponPreview(null);
      setAppliedCouponContextSignature(null);
      setCouponError(validation.message || "Coupon is not valid for this order.");
      return;
    }

    setCouponCode(validation.coupon?.code || normalizedCode);
    setAppliedCouponPreview(validation);
    setAppliedCouponContextSignature(couponContextSignature);
    setCouponMessage(validation.message || "Coupon applied successfully.");
  } catch (err: any) {
    setAppliedCouponPreview(null);
    setAppliedCouponContextSignature(null);
    setCouponError(
      err?.data?.message || err?.message || "Unable to validate coupon.",
    );
  }
}

async function finalizeOrderCoupon({
  order,
  appliedCouponPreview,
  couponCode,
  buildCouponPayload,
  applyCouponToOrder,
  cancelOrder,
}: {
  order: PlacedOrderResponse;
  appliedCouponPreview: CouponValidationResponse | null;
  couponCode: string;
  buildCouponPayload: (nextCode?: string) => Promise<CouponValidationRequest>;
  applyCouponToOrder: MutationTrigger<
    { orderId: number; body: CouponValidationRequest },
    AppliedCouponResponse
  >;
  cancelOrder: MutationTrigger<CancelOrderRequest, unknown>;
}) {
  if (!appliedCouponPreview?.valid) {
    return order.totalAmount;
  }

  try {
    const couponResult = await applyCouponToOrder({
      orderId: order.orderId,
      body: await buildCouponPayload(
        appliedCouponPreview.coupon?.code || couponCode,
      ),
    }).unwrap();

    if (!couponResult.wasSuccessful) {
      throw new Error(
        couponResult.failureReason || "Coupon could not be applied to this order.",
      );
    }

    return (
      couponResult.order?.totalAmount ??
      appliedCouponPreview.finalAmount ??
      order.totalAmount
    );
  } catch (couponErr: any) {
    try {
      await cancelOrder({ orderId: order.orderId }).unwrap();
    } catch (cancelErr) {
      console.error("Failed to cancel order after coupon error", cancelErr);
    }

    throw new Error(
      couponErr?.data?.message ||
        couponErr?.message ||
        "Coupon couldn't be applied. The order was cancelled, please try again.",
    );
  }
}

function CouponPanel(props: Readonly<{
  couponCode: string;
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;
  validatingCoupon: boolean;
  applyingCoupon: boolean;
  onApplyCoupon: (nextCode?: string) => Promise<void>;
  appliedCouponPreview: CouponValidationResponse | null;
  clearCouponPreview: (message?: string, clearCode?: boolean) => void;
  couponError: string | null;
  couponMessage: string | null;
  availableCoupons: Array<{
    id: number;
    code: string;
    description: string;
    maxDiscountAmount: number;
    discountValue: number;
  }>;
  availableCouponsLoading: boolean;
}>) {
  const {
    couponCode,
    setCouponCode,
    validatingCoupon,
    applyingCoupon,
    onApplyCoupon,
    appliedCouponPreview,
    clearCouponPreview,
    couponError,
    couponMessage,
    availableCoupons,
    availableCouponsLoading,
  } = props;

  return (
    <div className="mb-8 rounded-3xl border border-neutral-100 bg-neutral-50/60 p-5 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Coupon
          </p>
          <p className="mt-1 text-sm text-black font-medium">
            Apply a code before you confirm the order.
          </p>
        </div>
        <TicketPercent size={18} className="text-black" />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value.toUpperCase());
          }}
          placeholder="ENTER COUPON"
          className="flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm uppercase tracking-[0.12em] text-black placeholder:text-neutral-300"
        />
        <Button
          type="button"
          onClick={() => void onApplyCoupon()}
          disabled={validatingCoupon || applyingCoupon || !couponCode.trim()}
          className="rounded-2xl bg-black px-5 text-[10px] uppercase tracking-[0.2em] text-white hover:bg-neutral-800 disabled:opacity-40"
        >
          {validatingCoupon ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
        </Button>
      </div>

      <AppliedCouponNotice
        appliedCouponPreview={appliedCouponPreview}
        couponCode={couponCode}
        clearCouponPreview={clearCouponPreview}
      />

      {couponError ? (
        <p className="mt-3 text-[11px] text-red-600">{couponError}</p>
      ) : null}

      {!couponError && couponMessage ? (
        <p className="mt-3 text-[11px] text-neutral-500">{couponMessage}</p>
      ) : null}

      <AvailableCouponList
        availableCoupons={availableCoupons}
        availableCouponsLoading={availableCouponsLoading}
        onApplyCoupon={onApplyCoupon}
      />
    </div>
  );
}

function AppliedCouponNotice(props: Readonly<{
  appliedCouponPreview: CouponValidationResponse | null;
  couponCode: string;
  clearCouponPreview: (message?: string, clearCode?: boolean) => void;
}>) {
  const { appliedCouponPreview, couponCode, clearCouponPreview } = props;

  if (!appliedCouponPreview?.valid) {
    return null;
  }

  return (
    <div className="mt-4 flex items-start justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
          {appliedCouponPreview.coupon?.code || couponCode}
        </p>
        <p className="mt-1 text-sm text-emerald-900">
          Save ₹{appliedCouponPreview.discountAmount.toLocaleString()} on this order.
        </p>
        {appliedCouponPreview.warnings?.length ? (
          <p className="mt-1 text-[11px] text-emerald-700">
            {appliedCouponPreview.warnings.join(" ")}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => clearCouponPreview(undefined, true)}
        className="rounded-full p-1 text-emerald-700 hover:bg-emerald-100"
        aria-label="Remove coupon"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function AvailableCouponList(props: Readonly<{
  availableCoupons: Array<{
    id: number;
    code: string;
    description: string;
    maxDiscountAmount: number;
    discountValue: number;
  }>;
  availableCouponsLoading: boolean;
  onApplyCoupon: (nextCode?: string) => Promise<void>;
}>) {
  const { availableCoupons, availableCouponsLoading, onApplyCoupon } = props;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
          Available Coupons
        </p>
        {availableCouponsLoading ? (
          <Loader2 size={12} className="animate-spin text-neutral-400" />
        ) : null}
      </div>

      {availableCoupons.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {availableCoupons.slice(0, 4).map((coupon) => (
            <button
              key={coupon.id}
              type="button"
              onClick={() => void onApplyCoupon(coupon.code)}
              className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-left transition-colors hover:border-black"
            >
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-black">
                {coupon.code}
              </span>
              <span className="mt-1 block text-[11px] text-neutral-500">
                {coupon.description || `Save up to ₹${coupon.maxDiscountAmount || coupon.discountValue}`}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-[11px] text-neutral-400">
          No coupon suggestions available for this order amount yet.
        </p>
      )}
    </div>
  );
}

function SummaryBreakdown(props: Readonly<{
  subtotal: number;
  shippingCharges: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
}>) {
  const { subtotal, shippingCharges, taxAmount, discountAmount, totalAmount } = props;

  return (
    <div className="space-y-4 pt-6 border-t border-neutral-50 mb-8">
      <div className="flex justify-between text-[12px]">
        <span className="text-neutral-400 font-light uppercase tracking-tighter">
          Subtotal
        </span>
        <span className="text-black font-medium">₹{subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-[12px]">
        <span className="text-neutral-400 font-light uppercase tracking-tighter">
          Shipping
        </span>
        <span
          className={
            shippingCharges === 0
              ? "text-green-600 font-medium"
              : "text-black font-medium"
          }
        >
          {shippingCharges === 0 ? "Complimentary" : `₹${shippingCharges}`}
        </span>
      </div>
      <div className="flex justify-between text-[12px]">
        <span className="text-neutral-400 font-light uppercase tracking-tighter">
          Tax (10%)
        </span>
        <span className="text-black font-medium">₹{taxAmount.toLocaleString()}</span>
      </div>
      {discountAmount > 0 ? (
        <div className="flex justify-between text-[12px]">
          <span className="text-neutral-400 font-light uppercase tracking-tighter">
            Coupon Discount
          </span>
          <span className="text-emerald-600 font-medium">
            -₹{discountAmount.toLocaleString()}
          </span>
        </div>
      ) : null}
      <div className="pt-6 flex justify-between items-end">
        <span className="text-[10px] text-black font-bold uppercase tracking-[0.2em]">
          Total
        </span>
        <span className="text-3xl font-light tracking-tighter text-black">
          ₹{totalAmount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const storedUser = useMemo(() => {
    try {
      return getCurrentUser();
    } catch {
      return null;
    }
  }, []);

  const [selectedAddressId, setSelectedAddressId] = useState<
    number | string | null
  >(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "COD" | "PREPAID" | "CARD" | "UPI"
  >("COD");
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCouponPreview, setAppliedCouponPreview] =
    useState<CouponValidationResponse | null>(null);
  const [appliedCouponContextSignature, setAppliedCouponContextSignature] =
    useState<string | null>(null);
  const [categoryIdsByProductId, setCategoryIdsByProductId] = useState<
    Record<number, number | undefined>
  >({});
  const [buyNowItem, setBuyNowItem] = useState<BuyNowItem | null>(null);

  const { data: addresses = [], isLoading: addressesLoading, refetch: refetchAddresses } =
    useGetAddressesQuery();
  useGetLocationsQuery();
  const [checkoutSummary, { isLoading: summaryLoading }] =
    useCheckoutMutation();
  const [buyNowCheckoutSummary, { isLoading: buyNowSummaryLoading }] =
    useBuyNowCheckoutMutation();
  const [placeOrderCheckout, { isLoading: placingBuyNowOrder }] =
    usePlaceOrderCheckoutMutation();
  const [placeOrder, { isLoading: placingOrder }] = usePlaceOrderMutation();
  const [initiatePayment, { isLoading: initiatingPayment }] =
    useInitiatePaymentMutation();
  const [validateCoupon, { isLoading: validatingCoupon }] =
    useValidateCouponMutation();
  const [applyCouponToOrder, { isLoading: applyingCoupon }] =
    useApplyCouponToOrderMutation();
  const [removeCouponFromOrder] = useRemoveCouponFromOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();

  const [checkoutData, setCheckoutData] = useState<
    CheckoutResponse | null
  >(null);
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState<number | null>(null);
  const isBuyNowMode = buyNowItem !== null;
  const checkoutItems = useMemo(
    () =>
      buyNowItem
        ? [
            {
              id: `buy-now-${buyNowItem.productId}-${buyNowItem.variantId}`,
              productId: buyNowItem.productId,
              variantId: buyNowItem.variantId,
              categoryId: buyNowItem.categoryId,
              name: buyNowItem.name,
              price: buyNowItem.price,
              quantity: buyNowItem.quantity,
              image: buyNowItem.image,
            },
          ]
        : cartItems,
    [buyNowItem, cartItems],
  );
  const cartSignature = useMemo(
    () =>
      checkoutItems
        .map(
          (item) =>
            `${item.id}:${item.productId}:${item.variantId}:${item.quantity}:${item.price}`,
        )
        .join("|"),
    [checkoutItems],
  );
  const normalizedPaymentMethod = paymentMethod === "COD" ? "COD" : "PREPAID";
  const isCheckoutSummaryLoading = summaryLoading || buyNowSummaryLoading;
  const resolvedUserId = useMemo(
    () =>
      resolveNumericUserId(
        readUserField<number>(user, "id"),
        readUserField<number>(user, "userId"),
        readUserField<number>(storedUser, "id"),
        readUserField<number>(storedUser, "userId"),
      ),
    [storedUser, user],
  );
  const inferredIsFirstOrder = useMemo(() => {
    return resolveBooleanCandidate(
      readUserField<boolean>(user, "isFirstOrder"),
      readUserField<boolean>(storedUser, "isFirstOrder"),
    );
  }, [storedUser, user]);
  const inferredIsNewUser = useMemo(() => {
    return resolveBooleanCandidate(
      readUserField<boolean>(user, "isNewUser"),
      readUserField<boolean>(storedUser, "isNewUser"),
    );
  }, [storedUser, user]);
  const subtotal = checkoutData?.subtotal ?? checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxAmount = checkoutData?.taxAmount ?? Math.round(calculateTax(subtotal, 0.1) * 100) / 100;
  const shippingCharges = checkoutData?.shippingCharges ?? (subtotal > 100 ? 0 : 10);
  const orderAmountBeforeCoupon = subtotal + taxAmount + shippingCharges;
  const discountAmount = appliedCouponPreview?.valid
    ? appliedCouponPreview.discountAmount
    : 0;
  const totalAmount = appliedCouponPreview?.valid
    ? appliedCouponPreview.finalAmount
    : orderAmountBeforeCoupon;
  const couponContextSignature = useMemo(
    () =>
      [
        selectedAddressId ?? "none",
        normalizedPaymentMethod,
        cartSignature,
        subtotal,
        taxAmount,
        shippingCharges,
      ].join("::"),
    [
      cartSignature,
      normalizedPaymentMethod,
      selectedAddressId,
      shippingCharges,
      subtotal,
      taxAmount,
    ],
  );
  const { data: availableCoupons = [], isFetching: availableCouponsLoading } =
    useGetAvailableCouponsQuery(orderAmountBeforeCoupon, {
      skip: !isAuthenticated || orderAmountBeforeCoupon <= 0,
    });

  useEffect(() => {
    setBuyNowItem(getActiveBuyNowItem());
  }, []);

  useEffect(() => {
    if (!isBuyNowMode) {
      return;
    }

    updateBuyNowStatus("checkout");

    return () => {
      const currentState = readBuyNowState();

      if (!currentState) {
        return;
      }

      if (currentState.status !== "payment" && currentState.status !== "completed") {
        updateBuyNowStatus("restore-pending");
      }
    };
  }, [isBuyNowMode]);

  const buildCouponPayload = async (
    nextCode?: string,
  ): Promise<CouponValidationRequest> => {
    const cartItemsForCoupon = checkoutItems as Array<{
      productId: number;
      categoryId?: number;
    }>;
    const missingProductIds = Array.from(
      new Set(
        cartItemsForCoupon
          .filter((item) => {
            const productId = Number(item.productId);
            const directCategoryId = Number(item.categoryId);
            const cachedCategoryId = Number(categoryIdsByProductId[productId]);

            return (
              Number.isFinite(productId) &&
              productId > 0 &&
              !(Number.isFinite(directCategoryId) && directCategoryId > 0) &&
              !(Number.isFinite(cachedCategoryId) && cachedCategoryId > 0)
            );
          })
          .map((item) => Number(item.productId)),
      ),
    );

    let resolvedCategoryIds = categoryIdsByProductId;

    if (missingProductIds.length > 0) {
      const fetchedCategoryIds = await fetchCategoryIdsForProducts(missingProductIds);

      resolvedCategoryIds = {
        ...categoryIdsByProductId,
        ...fetchedCategoryIds,
      };

      setCategoryIdsByProductId((current) => ({
        ...current,
        ...fetchedCategoryIds,
      }));
    }

    return createCouponPayload({
      couponCode: (nextCode ?? couponCode).trim(),
      orderAmount: orderAmountBeforeCoupon,
      cartItems: cartItemsForCoupon.map((item) => ({
        productId: item.productId,
        categoryId:
          item.categoryId ?? resolvedCategoryIds[Number(item.productId)],
      })),
      paymentMethod: normalizedPaymentMethod,
      userId: resolvedUserId,
      isFirstOrder: inferredIsFirstOrder,
      isNewUser: inferredIsNewUser,
    });
  };

  useEffect(() => {
    const cartItemsForCoupon = checkoutItems as Array<{
      productId: number;
      categoryId?: number;
    }>;
    const missingProductIds = Array.from(
      new Set(
        cartItemsForCoupon
          .filter((item) => {
            const productId = Number(item.productId);
            const directCategoryId = Number(item.categoryId);
            const cachedCategoryId = Number(categoryIdsByProductId[productId]);

            return (
              Number.isFinite(productId) &&
              productId > 0 &&
              !(Number.isFinite(directCategoryId) && directCategoryId > 0) &&
              !(Number.isFinite(cachedCategoryId) && cachedCategoryId > 0)
            );
          })
          .map((item) => Number(item.productId)),
      ),
    );

    if (missingProductIds.length === 0) {
      return;
    }

    let isCancelled = false;

    void fetchCategoryIdsForProducts(missingProductIds).then((fetchedCategoryIds) => {
      if (isCancelled) return;

      setCategoryIdsByProductId((current) => ({
        ...current,
        ...fetchedCategoryIds,
      }));
    });

    return () => {
      isCancelled = true;
    };
  }, [categoryIdsByProductId, checkoutItems]);

  const handleApplyCoupon = async (nextCode?: string) => {
    await validateCouponPreview({
      couponCode: nextCode ?? couponCode,
      validateCoupon,
      buildCouponPayload,
      couponContextSignature,
      setCouponCode,
      setCouponError,
      setCouponMessage,
      setAppliedCouponPreview,
      setAppliedCouponContextSignature,
    });
  };

  const clearCouponPreview = (message?: string, clearCode = false) => {
    if (clearCode) {
      setCouponCode("");
    }
    // If the coupon was already applied to a placed order (e.g. prepaid flow waiting for payment),
    // call the backend to remove it so the order total resets correctly.
    if (lastPlacedOrderId !== null) {
      void removeCouponFromOrder(lastPlacedOrderId);
    }
    setAppliedCouponPreview(null);
    setAppliedCouponContextSignature(null);
    setCouponError(null);
    setCouponMessage(message || null);
  };

  // fetch summary whenever address/payment/cart changes
  useEffect(() => {
    if (!isAuthenticated) return;

    const numericAddressId = selectedAddressId ? Number(selectedAddressId) : undefined;

    if (!numericAddressId || !Number.isFinite(numericAddressId) || numericAddressId <= 0) {
      setCheckoutData(null);
      return;
    }

    if (isBuyNowMode) {
      if (!buyNowItem) {
        setCheckoutData(null);
        return;
      }

      buyNowCheckoutSummary({
        productId: buyNowItem.productId,
        variantId: buyNowItem.variantId,
        quantity: buyNowItem.quantity,
        addressId: numericAddressId,
        paymentMethod: normalizedPaymentMethod,
      })
        .unwrap()
        .then((response) => {
          setCheckoutData({
            subtotal: response.subtotal,
            taxAmount: response.taxAmount,
            shippingCharges: response.shippingCharges,
            discountAmount: response.discountAmount,
            totalAmount: response.totalAmount,
            items: [
              {
                category: undefined,
                categoryId: undefined,
                cartId: 0,
                productId: response.productId,
                productName: response.productName,
                imageUrl: response.productImage,
                variantId: response.variantId,
                size: response.size,
                color: response.color,
                quantity: response.quantity,
                price: response.price,
                mrp: response.mrp,
                discountPercentage: response.discountPercentage,
                subtotal: response.subtotal,
              } as OrderItem,
            ],
            totalItems: response.quantity,
            deliveryAddress: response.deliveryAddress ?? {
              addressLine1: "",
              city: "",
              state: "",
              postalCode: "",
              country: "",
            },
            deliveryDays: response.deliveryDays ?? 0,
            expectedDelivery: response.expectedDelivery ?? "",
            isDeliveryAvailable: true,
            paymentMethod: response.paymentMethod,
            requiresPayment: response.requiresPayment,
            paymentMessage: response.requiresPayment
              ? "Prepaid payment required to place this order."
              : "",
            isCodAvailable: response.isCodAvailable ?? true,
            cartId: 0,
            isValidForCheckout: response.isValid,
            validationErrors: response.validationErrors,
          });
        })
        .catch((err) => {
          console.warn("buy now checkout summary error", err);
        });

      return;
    }

    const req: CheckoutRequest = {
      addressId: numericAddressId,
      paymentMethod: normalizedPaymentMethod,
    };

    checkoutSummary(req)
      .unwrap()
      .then(setCheckoutData)
      .catch((err) => {
        console.warn("checkout summary error", err);
      });
  }, [
    cartSignature,
    buyNowCheckoutSummary,
    buyNowItem,
    checkoutSummary,
    isAuthenticated,
    isBuyNowMode,
    normalizedPaymentMethod,
    selectedAddressId,
  ]);

  useEffect(() => {
    if (!appliedCouponPreview || appliedCouponContextSignature === couponContextSignature) {
      return;
    }

    setAppliedCouponPreview(null);
    setAppliedCouponContextSignature(null);
    setCouponError(null);
    setCouponMessage("Coupon cleared because checkout details changed. Apply it again.");
  }, [
    appliedCouponContextSignature,
    appliedCouponPreview,
    couponContextSignature,
  ]);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const filteredAddresses = useMemo(() => {
    return addresses as Address[];
  }, [addresses]);

  useEffect(() => {
    if (!filteredAddresses.length) {
      setSelectedAddressId(null);
      return;
    }

    const selectedAddressStillVisible = filteredAddresses.some(
      (address) => address.id === selectedAddressId,
    );

    if (!selectedAddressId || !selectedAddressStillVisible) {
      const defaultAddr = filteredAddresses.find((a) => a.default);
      setSelectedAddressId(defaultAddr?.id || filteredAddresses[0]?.id || null);
    }
  }, [filteredAddresses, selectedAddressId]);

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-neutral-50 rounded-full">
              <LogIn size={32} className="text-neutral-400" />
            </div>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-black mb-3">
            Login Required
          </h1>
          <p className="text-neutral-600 text-sm mb-8 leading-relaxed">
            You need to be logged in to complete your purchase.
          </p>
          <Link href="/login">
            <Button className="w-full py-6 text-[11px] uppercase tracking-[0.2em] bg-black text-white hover:bg-neutral-900">
              Login to Continue
            </Button>
          </Link>
          <Link href="/register" className="block mt-4">
            <button className="w-full py-6 text-[11px] uppercase tracking-[0.2em] border border-neutral-800 text-black hover:bg-neutral-50 transition-colors">
              Create New Account
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-neutral-50 rounded-full">
              <ShoppingBag size={32} className="text-neutral-400" />
            </div>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-black mb-3">
            Your collection is empty
          </h1>
          <Link href="/">
            <Button className="mt-4 w-full py-6 text-[11px] uppercase tracking-[0.2em] bg-black text-white">
              Return to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      setOrderError("Please select a delivery address");
      return;
    }

    try {
      setOrderError(null);

      const result = isBuyNowMode && buyNowItem
        ? await placeOrderCheckout({
            productId: buyNowItem.productId,
            variantId: buyNowItem.variantId,
            quantity: buyNowItem.quantity,
            addressId: Number(selectedAddressId),
            paymentMethod: normalizedPaymentMethod,
          }).unwrap()
        : await placeOrder({
            addressId: Number(selectedAddressId),
            paymentMethod: normalizedPaymentMethod,
          }).unwrap();

      setLastPlacedOrderId(result.orderId);

      const finalTotalAmount = await finalizeOrderCoupon({
        order: result,
        appliedCouponPreview,
        couponCode,
        buildCouponPayload,
        applyCouponToOrder,
        cancelOrder,
      });

      if (result.requiresPayment) {
        if (isBuyNowMode) {
          updateBuyNowStatus("payment");
        }

        const currentUser = globalThis.window === undefined ? null : getCurrentUser();
        const payResp = await initiatePayment(buildInitiatePaymentRequest({
          orderId: result.orderId,
          amount: finalTotalAmount,
          receipt: `order-${result.orderId}-${Date.now()}`,
          currentUser,
        })).unwrap();
        sessionStorage.setItem(
          `payment_init_${result.orderId}`,
          JSON.stringify(payResp),
        );
        router.push(`/checkout/payment?orderId=${result.orderId}`);
        return;
      }

      sendEvent("checkout_completed", {
        orderId: result.orderId,
        totalAmount: finalTotalAmount,
        itemCount: checkoutItems.length,
        couponCode: appliedCouponPreview?.coupon?.code || undefined,
      }); // event name kept same for analytics consistency

      if (isBuyNowMode) {
        updateBuyNowStatus("completed");
      }

      sessionStorage.setItem("lastOrderId", String(result.orderId));
      router.push(`/checkout/success?orderId=${result.orderId}`);
    } catch (err: any) {
      setOrderError(err?.data?.message || err?.message || "Checkout failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-neutral-400 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.2em]">
              Back
            </span>
          </Link>
          <div className="text-sm md:text-lg font-light text-black tracking-[0.3em] uppercase">
            Checkout
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <ShieldCheck size={16} className="text-black" />
            <span className="hidden md:inline text-[10px] uppercase tracking-widest font-medium">
              Secure
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* LEFT: Shipping & Payment */}
          <div className="lg:col-span-7 space-y-12 md:space-y-16">
            {/* Step 1: Address */}
            <section>
              <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold tracking-tighter">
                    01
                  </span>
                  <h2 className="text-[11px] md:text-sm font-bold uppercase tracking-[0.2em] text-black">
                    Shipping Address
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddAddressModalOpen(true)}
                  className="inline-flex items-center gap-2 self-start rounded-full border border-neutral-200 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:border-black hover:bg-neutral-50 md:self-auto"
                >
                  <Plus size={14} /> Add Address
                </button>
              </div>

              {addressesLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-neutral-200" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {filteredAddresses.map((address) => (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => setSelectedAddressId(address.id)}
                        className={`group relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-500 ${
                          selectedAddressId === address.id
                            ? "border-black bg-white shadow-xl shadow-black/5 ring-1 ring-black"
                            : "border-neutral-100 bg-white hover:border-neutral-300"
                        }`}
                      >
                        <p className="font-bold text-black text-xs md:text-sm mb-1 uppercase tracking-tight">
                          {address.addressLine1}
                        </p>
                        <p className="text-[11px] md:text-xs text-neutral-500 leading-relaxed font-light">
                          {address.addressLine2 && `${address.addressLine2}, `}
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        {address.default && (
                          <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-neutral-300" />
                        )}
                      </button>
                    ))}

                  </div>

                  {!filteredAddresses.length && (
                    <div className="sm:col-span-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-500">
                      <p className="mb-4">No saved addresses found for this delivery location.</p>
                      <button
                        onClick={() => setIsAddAddressModalOpen(true)}
                        className="inline-flex items-center gap-2 text-black font-semibold text-sm hover:underline"
                      >
                        <Plus size={16} /> Add an address
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Step 2: Payment */}
            <section>
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold tracking-tighter">
                  02
                </span>
                <h2 className="text-[11px] md:text-sm font-bold uppercase tracking-[0.2em] text-black">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "PREPAID",
                    label: "Instant Payment",
                    desc: "Cards, UPI, NetBanking",
                    icon: <CreditCard size={18} />,
                  },
                  {
                    id: "COD",
                    label: "Cash on Delivery",
                    desc: "Pay on Arrival",
                    icon: <Truck size={18} />,
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-5 md:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      paymentMethod === method.id
                        ? "border-black bg-white shadow-lg"
                        : "border-neutral-100 bg-neutral-50/50 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2.5 rounded-xl ${paymentMethod === method.id ? "bg-black text-white" : "bg-white text-neutral-400 border border-neutral-100"}`}
                      >
                        {method.icon}
                      </div>
                      <div>
                        <p className="font-bold text-[11px] md:text-[12px] uppercase tracking-widest text-black">
                          {method.label}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-0.5 font-light">
                          {method.desc}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === method.id ? "border-black" : "border-neutral-300"}`}
                    >
                      {paymentMethod === method.id && (
                        <div className="w-2 h-2 rounded-full bg-black" />
                      )}
                    </div>
                    <input
                      type="radio"
                      className="hidden"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id as any)}
                    />
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: Order Summary & Product Images */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-neutral-100">
                {/* Product List - Now visible on Mobile too */}
                <div className="mb-10">
                  {isBuyNowMode && (
                    <p className="mb-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                      Buy Now checkout
                    </p>
                  )}
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6 flex justify-between">
                    Your Order <span>({checkoutItems.length})</span>
                  </h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                    {checkoutItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 items-center group"
                      >
                        <div className="relative w-16 h-20 md:w-20 md:h-24 bg-neutral-50 overflow-hidden rounded-xl border border-neutral-100 shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-1 right-1 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-bold uppercase tracking-tight text-black truncate">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-widest">
                            Unit: ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs font-semibold text-black">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <CouponPanel
                  couponCode={couponCode}
                  setCouponCode={(nextValue) => {
                    setCouponCode(nextValue);
                    setCouponError(null);
                    setCouponMessage(null);
                  }}
                  validatingCoupon={validatingCoupon}
                  applyingCoupon={applyingCoupon}
                  onApplyCoupon={handleApplyCoupon}
                  appliedCouponPreview={appliedCouponPreview}
                  clearCouponPreview={clearCouponPreview}
                  couponError={couponError}
                  couponMessage={couponMessage}
                  availableCoupons={availableCoupons}
                  availableCouponsLoading={availableCouponsLoading}
                />

                <SummaryBreakdown
                  subtotal={subtotal}
                  shippingCharges={shippingCharges}
                  taxAmount={taxAmount}
                  discountAmount={discountAmount}
                  totalAmount={totalAmount}
                />

                {orderError && (
                  <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase tracking-tight">
                    <AlertCircle size={14} /> {orderError}
                  </div>
                )}

                {checkoutData && !checkoutData.isValidForCheckout && checkoutData.validationErrors.length > 0 && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-xl text-yellow-800 text-[10px] font-bold uppercase tracking-tight">
                    {checkoutData.validationErrors.join(", ")}
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={
                    isCheckoutSummaryLoading || placingOrder || placingBuyNowOrder || initiatingPayment || validatingCoupon || applyingCoupon || !selectedAddressId ||
                    (!!checkoutData && !checkoutData.isValidForCheckout) ||
                    (!!checkoutData && !checkoutData.isDeliveryAvailable) ||
                    (!!checkoutData && paymentMethod === "COD" && !checkoutData.isCodAvailable)
                  }
                  className="w-full group relative overflow-hidden bg-black text-white py-5 md:py-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-neutral-800 disabled:opacity-20 transition-all shadow-2xl shadow-black/20"
                >
                  <div className="flex items-center justify-center gap-3">
                    {placingOrder || placingBuyNowOrder || initiatingPayment || applyingCoupon ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        Confirm Order
                        <ChevronRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </div>
                </button>

                <div className="mt-8 pt-8 border-t border-neutral-50 flex justify-center gap-6">
                  <div className="flex flex-col items-center gap-1 opacity-30 grayscale hover:opacity-100 transition-opacity">
                    <ShieldCheck size={18} className="text-black" />
                    <span className="text-[8px] text-black  font-bold uppercase tracking-widest">
                      Protected
                    </span>
                  </div>
                </div>
              </div>

              <p className="hidden md:block text-[9px] text-neutral-400 text-center mt-6 px-10 leading-relaxed uppercase tracking-[0.2em]">
                By completing your order, you agree to the Rich&Retired Terms of
                Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        onAddressAdded={() => {
          refetchAddresses();
          setIsAddAddressModalOpen(false);
        }}
      />
    </div>
  );
}
