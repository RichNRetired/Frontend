import type { CartItem } from "@/features/cart/cartSlice";

const GUEST_CART_STORAGE_KEY = "guest-cart";

type CartSourceItem = {
  cartItemId?: number | string | null;
  productId: number;
  variantId?: number | null;
  categoryId?: number | null;
  category?: { id?: number | null } | null;
  productName?: string | null;
  name?: string | null;
  price?: number | null;
  quantity?: number | null;
  imageUrl?: string | null;
  image?: string | null;
  color?: string | null;
  size?: string | null;
  mrp?: number | null;
  discountPercentage?: number | null;
};

export type AddToCartInput = {
  productId: number;
  variantId: number;
  qty: number;
  categoryId?: number;
  name: string;
  price: number;
  image?: string;
  color?: string;
  size?: string;
  mrp?: number;
  discountPercentage?: number;
};

export type GuestCartSummary = {
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  shippingCharges: number;
  discountAmount: number;
  finalAmount: number;
  appliedCoupon?: string;
  couponApplied: boolean;
  message?: string;
  totalItems: number;
  totalMrp: number;
  totalSavings: number;
};

const toNumber = (value: unknown, fallback = 0) => {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : fallback;
};

const toOptionalNumber = (value: unknown) => {
  const normalized = Number(value);
  return Number.isFinite(normalized) && normalized > 0 ? normalized : undefined;
};

export const hasStoredAccessToken = () => {
  const browserWindow = globalThis.window;

  if (browserWindow === undefined) {
    return false;
  }

  return Boolean(browserWindow.localStorage.getItem("accessToken"));
};

export const getGuestCartItemId = (productId: number, variantId: number) =>
  `guest-${productId}-${variantId}`;

export const normalizeCartItem = (item: CartSourceItem): CartItem => {
  const productId = toNumber(item.productId);
  const variantId = toNumber(item.variantId);

  return {
    id: String(item.cartItemId ?? getGuestCartItemId(productId, variantId)),
    productId,
    variantId,
    categoryId: toOptionalNumber(item.categoryId ?? item.category?.id),
    name: item.productName ?? item.name ?? "Product",
    price: toNumber(item.price),
    quantity: Math.max(1, toNumber(item.quantity, 1)),
    image: item.imageUrl ?? item.image ?? undefined,
    color: item.color ?? undefined,
    size: item.size ?? undefined,
    mrp: toOptionalNumber(item.mrp),
    discountPercentage: toOptionalNumber(item.discountPercentage),
  };
};

export const mapCartApiItemsToCartItems = (items: CartSourceItem[]) =>
  items.map((item) => normalizeCartItem(item));

export const getGuestCartItems = (): CartItem[] => {
  const browserWindow = globalThis.window;

  if (browserWindow === undefined) {
    return [];
  }

  try {
    const rawValue = browserWindow.localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) => normalizeCartItem(entry as CartSourceItem))
      .filter((item) => item.productId > 0 && item.variantId >= 0 && item.quantity > 0);
  } catch {
    return [];
  }
};

const writeGuestCartItems = (items: CartItem[]) => {
  const browserWindow = globalThis.window;

  if (browserWindow === undefined) {
    return items;
  }

  browserWindow.localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
  return items;
};

export const setGuestCartItems = (items: CartItem[]) => writeGuestCartItems(items);

export const addGuestCartItem = (input: AddToCartInput) => {
  const items = getGuestCartItems();
  const itemId = getGuestCartItemId(input.productId, input.variantId);
  const existingItem = items.find((item) => item.id === itemId);

  if (existingItem) {
    existingItem.quantity += Math.max(1, input.qty);
    existingItem.price = toNumber(input.price);
    existingItem.name = input.name;
    existingItem.image = input.image;
    existingItem.categoryId = input.categoryId;
    existingItem.color = input.color;
    existingItem.size = input.size;
    existingItem.mrp = toOptionalNumber(input.mrp);
    existingItem.discountPercentage = toOptionalNumber(input.discountPercentage);
  } else {
    items.push({
      id: itemId,
      productId: toNumber(input.productId),
      variantId: toNumber(input.variantId),
      categoryId: input.categoryId,
      name: input.name,
      price: toNumber(input.price),
      quantity: Math.max(1, toNumber(input.qty, 1)),
      image: input.image,
      color: input.color,
      size: input.size,
      mrp: toOptionalNumber(input.mrp),
      discountPercentage: toOptionalNumber(input.discountPercentage),
    });
  }

  return writeGuestCartItems(items);
};

export const updateGuestCartItemQuantity = (id: string, quantity: number) => {
  const items = getGuestCartItems().map((item) =>
    item.id === id
      ? {
          ...item,
          quantity: Math.max(1, toNumber(quantity, 1)),
        }
      : item,
  );

  return writeGuestCartItems(items);
};

export const removeGuestCartItem = (id: string) => {
  const items = getGuestCartItems().filter((item) => item.id !== id);
  return writeGuestCartItems(items);
};

export const clearGuestCart = () => {
  const browserWindow = globalThis.window;

  if (browserWindow === undefined) {
    return;
  }

  browserWindow.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
};

export const getGuestCartMergePayload = () =>
  getGuestCartItems()
    .filter((item) => item.productId > 0 && item.variantId > 0 && item.quantity > 0)
    .map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
    }));

export const createGuestCartSummary = (items: CartItem[]): GuestCartSummary => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalMrp = items.reduce(
    (sum, item) => sum + (item.mrp ?? item.price) * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalSavings = Math.max(0, totalMrp - subtotal);

  return {
    items,
    subtotal,
    taxAmount: 0,
    shippingCharges: 0,
    discountAmount: 0,
    finalAmount: subtotal,
    couponApplied: false,
    totalItems,
    totalMrp,
    totalSavings,
  };
};