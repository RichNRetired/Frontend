"use client";

import React, { useState, useEffect, useMemo } from "react";
import { calculateTax } from "@/features/cart/cartUtils";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  useCheckoutMutation,
  usePlaceOrderMutation,
  useInitiatePaymentMutation,
} from "@/features/order/orderApi";
import { getCurrentUser } from "@/lib/auth";
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
} from "lucide-react";
import Link from "next/link";
import { sendEvent } from "@/services/analytics.service";

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

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedAddressId, setSelectedAddressId] = useState<
    number | string | null
  >(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null,
  );
  const [orderError, setOrderError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "COD" | "PREPAID" | "CARD" | "UPI"
  >("COD");
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  const { data: addresses = [], isLoading: addressesLoading, refetch: refetchAddresses } =
    useGetAddressesQuery();
  const { data: serviceableLocations = [], isLoading: locationsLoading } =
    useGetLocationsQuery();
  const [checkoutSummary, { isLoading: summaryLoading }] =
    useCheckoutMutation();
  const [placeOrder, { isLoading: placingOrder }] = usePlaceOrderMutation();
  const [initiatePayment, { isLoading: initiatingPayment }] =
    useInitiatePaymentMutation();

  const [checkoutData, setCheckoutData] = useState<
    import("@/features/order/orderTypes").CheckoutResponse | null
  >(null);

  // fetch summary whenever address/payment/cart changes
  useEffect(() => {
    if (!isAuthenticated) return;
    const req: import("@/features/order/orderTypes").CheckoutRequest = {
      addressId: selectedAddressId ? Number(selectedAddressId) : undefined,
      paymentMethod,
      cartId: user?.id ? Number(user.id) : undefined,
    };
    checkoutSummary(req)
      .unwrap()
      .then(setCheckoutData)
      .catch((err) => {
        console.warn("checkout summary error", err);
      });
  }, [isAuthenticated, selectedAddressId, paymentMethod, cartItems.length]);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const selectedLocation = useMemo(
    () =>
      selectedLocationId
        ? serviceableLocations.find((location) => location.id === selectedLocationId)
        : null,
    [selectedLocationId, serviceableLocations],
  );

  const filteredAddresses = useMemo(() => {
    const allAddresses = addresses as Address[];
    if (!selectedLocation) return allAddresses;

    return allAddresses.filter(
      (address) =>
        String(address.postalCode || "").trim() ===
        String(selectedLocation.pincode || "").trim(),
    );
  }, [addresses, selectedLocation]);

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

  if (cartItems.length === 0) {
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

  // compute totals locally but override with backend summary when available
  const subtotal = checkoutData?.subtotal ?? cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxAmount = checkoutData?.taxAmount ?? Math.round(calculateTax(subtotal, 0.1) * 100) / 100;
  const shippingCharges = checkoutData?.shippingCharges ?? (subtotal > 100 ? 0 : 10);
  const totalAmount = checkoutData?.totalAmount ?? subtotal + taxAmount + shippingCharges;

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      setOrderError("Please select a delivery address");
      return;
    }

    try {
      setOrderError(null);

      const result = await placeOrder({
        addressId: Number(selectedAddressId),
        paymentMethod: (paymentMethod === "COD" ? "COD" : "PREPAID") as string,
      }).unwrap();

      if (result.requiresPayment) {
        const user = globalThis.window === undefined ? null : getCurrentUser();
        const payResp = await initiatePayment({
          orderId: result.orderId,
          amount: result.totalAmount,
          currency: "INR",
          customerName: user?.name || (user?.fullName ?? "") || "",
          customerEmail: user?.email || "",
          customerPhone: user?.phone || "",
        }).unwrap();
        sessionStorage.setItem(
          `payment_init_${result.orderId}`,
          JSON.stringify(payResp),
        );
        router.push(`/checkout/payment?orderId=${result.orderId}`);
        return;
      }

      sendEvent("checkout_completed", {
        orderId: result.orderId,
        totalAmount: result.totalAmount,
        itemCount: cartItems.length,
      }); // event name kept same for analytics consistency

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
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold tracking-tighter">
                  01
                </span>
                <h2 className="text-[11px] md:text-sm font-bold uppercase tracking-[0.2em] text-black">
                  Shipping Address
                </h2>
              </div>

              <div className="mb-6 md:mb-8">
                <label
                  htmlFor="delivery-location"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2"
                >
                  Delivery Location
                </label>
                <select
                  id="delivery-location"
                  value={selectedLocationId ?? ""}
                  onChange={(e) => {
                    const nextId = e.target.value ? Number(e.target.value) : null;
                    setSelectedLocationId(nextId);
                  }}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-black"
                  disabled={locationsLoading}
                >
                  <option value="">
                    {locationsLoading
                      ? "Loading serviceable locations..."
                      : "All serviceable locations"}
                  </option>
                  {serviceableLocations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.city}, {location.state} ({location.pincode})
                    </option>
                  ))}
                </select>
                {selectedLocation && (
                  <p className="mt-2 text-[11px] text-neutral-500">
                    Delivery in {selectedLocation.deliveryDays} days • COD {selectedLocation.codAvailable ? "available" : "not available"}
                  </p>
                )}
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
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6 flex justify-between">
                    Your Order <span>({cartItems.length})</span>
                  </h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                    {cartItems.map((item) => (
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

                <div className="space-y-4 pt-6 border-t border-neutral-50 mb-8">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-neutral-400 font-light uppercase tracking-tighter">
                      Subtotal
                    </span>
                    <span className="text-black font-medium">
                      ₹{subtotal.toLocaleString()}
                    </span>
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
                      {shippingCharges === 0
                        ? "Complimentary"
                        : `₹${shippingCharges}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-neutral-400 font-light uppercase tracking-tighter">
                      Tax (10%)
                    </span>
                    <span className="text-black font-medium">
                      ₹{taxAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-6 flex justify-between items-end">
                    <span className="text-[10px] text-black font-bold uppercase tracking-[0.2em]">
                      Total
                    </span>
                    <span className="text-3xl font-light tracking-tighter text-black">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

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
                    summaryLoading || placingOrder || initiatingPayment || !selectedAddressId ||
                    (!!checkoutData && !checkoutData.isValidForCheckout) ||
                    (!!checkoutData && !checkoutData.isDeliveryAvailable) ||
                    (!!checkoutData && paymentMethod === "COD" && !checkoutData.isCodAvailable)
                  }
                  className="w-full group relative overflow-hidden bg-black text-white py-5 md:py-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-neutral-800 disabled:opacity-20 transition-all shadow-2xl shadow-black/20"
                >
                  <div className="flex items-center justify-center gap-3">
                    {placingOrder || initiatingPayment ? (
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
