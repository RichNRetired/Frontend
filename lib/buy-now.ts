export interface BuyNowItem {
  productId: number;
  variantId: number;
  quantity: number;
  categoryId?: number;
  name: string;
  price: number;
  image?: string;
  size?: string;
  color?: string;
}

export type BuyNowStatus = "checkout" | "payment" | "restore-pending" | "completed";

export interface BuyNowState {
  item: BuyNowItem;
  status: BuyNowStatus;
  createdAt: number;
}

const BUY_NOW_STORAGE_KEY = "rich.buy-now.state";

function isBrowser() {
  return globalThis.window != null;
}

function isValidBuyNowItem(value: unknown): value is BuyNowItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<BuyNowItem>;

  return (
    Number.isFinite(candidate.productId) &&
    Number(candidate.productId) > 0 &&
    Number.isFinite(candidate.variantId) &&
    Number(candidate.variantId) > 0 &&
    Number.isFinite(candidate.quantity) &&
    Number(candidate.quantity) > 0 &&
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    Number.isFinite(candidate.price)
  );
}

export function readBuyNowState(): BuyNowState | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const rawValue = globalThis.localStorage.getItem(BUY_NOW_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<BuyNowState>;

    if (
      !parsedValue ||
      !isValidBuyNowItem(parsedValue.item) ||
      !parsedValue.status ||
      !["checkout", "payment", "restore-pending", "completed"].includes(
        parsedValue.status,
      )
    ) {
      globalThis.localStorage.removeItem(BUY_NOW_STORAGE_KEY);
      return null;
    }

    return {
      item: parsedValue.item,
      status: parsedValue.status,
      createdAt:
        Number.isFinite(parsedValue.createdAt) && Number(parsedValue.createdAt) > 0
          ? Number(parsedValue.createdAt)
          : Date.now(),
    };
  } catch {
    globalThis.localStorage.removeItem(BUY_NOW_STORAGE_KEY);
    return null;
  }
}

export function writeBuyNowState(state: BuyNowState) {
  if (!isBrowser()) {
    return;
  }

  globalThis.localStorage.setItem(BUY_NOW_STORAGE_KEY, JSON.stringify(state));
}

export function startBuyNowCheckout(item: BuyNowItem) {
  writeBuyNowState({
    item,
    status: "checkout",
    createdAt: Date.now(),
  });
}

export function updateBuyNowStatus(status: BuyNowStatus) {
  const currentState = readBuyNowState();

  if (!currentState) {
    return;
  }

  writeBuyNowState({
    ...currentState,
    status,
  });
}

export function clearBuyNowState() {
  if (!isBrowser()) {
    return;
  }

  globalThis.localStorage.removeItem(BUY_NOW_STORAGE_KEY);
}

export function getActiveBuyNowItem() {
  return readBuyNowState()?.item ?? null;
}