# 🛒 Cart API Implementation Guide

## Overview

All cart APIs are now fully implemented following the official API specification with proper error handling, state management, and user feedback.

## API Endpoints Reference

### 1️⃣ GET /api/cart

**Get all cart items**

```typescript
// In any component:
import { useGetCartQuery } from '@/features/cart/cartApi';

function MyComponent() {
  const { data: cartItems, isLoading, error } = useGetCartQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading cart</div>;

  return (
    <div>
      {cartItems?.map(item => (
        <div key={item.cartId}>
          {item.productName}: {item.quantity}x ₹{item.price}
        </div>
      ))}
    </div>
  );
}
```

### 2️⃣ POST /api/cart/add?productId=X&qty=Y

**Add product to cart**

```typescript
import { useAddToCartMutation } from '@/features/cart/cartApi';
import { useDispatch } from 'react-redux';
import { addItem } from '@/features/cart/cartSlice';

function AddToCartButton({ productId, productName, price }) {
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const dispatch = useDispatch();

  const handleAdd = async () => {
    try {
      await addToCart({ productId, qty: 1 }).unwrap();
      // Update local Redux state
      dispatch(addItem({
        id: String(productId),
        name: productName,
        price: price,
        quantity: 1,
      }));
      alert('Product added to cart!');
    } catch (error: any) {
      const msg = error?.data?.message || 'Failed to add to cart';
      alert(msg);
    }
  };

  return (
    <button onClick={handleAdd} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### 3️⃣ PUT /api/cart/{cartId}?qty=X

**Update cart item quantity**

```typescript
import { useUpdateCartItemMutation } from '@/features/cart/cartApi';
import { useDispatch } from 'react-redux';
import { updateQuantity } from '@/features/cart/cartSlice';

function QuantitySelector({ cartId, currentQty }) {
  const [updateCart, { isLoading }] = useUpdateCartItemMutation();
  const dispatch = useDispatch();

  const handleUpdate = async (newQty: number) => {
    if (newQty <= 0) return;

    try {
      await updateCart({ cartId, qty: newQty }).unwrap();
      // Update Redux state
      dispatch(updateQuantity({ id: String(cartId), quantity: newQty }));
    } catch (error: any) {
      const msg = error?.data?.message || 'Failed to update quantity';
      alert(msg);
    }
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => handleUpdate(currentQty - 1)} disabled={isLoading}>
        -
      </button>
      <span>{currentQty}</span>
      <button onClick={() => handleUpdate(currentQty + 1)} disabled={isLoading}>
        +
      </button>
    </div>
  );
}
```

### 4️⃣ DELETE /api/cart/{cartId}

**Remove item from cart**

```typescript
import { useRemoveFromCartMutation } from '@/features/cart/cartApi';
import { useDispatch } from 'react-redux';
import { removeItem } from '@/features/cart/cartSlice';

function RemoveButton({ cartId }) {
  const [removeFromCart, { isLoading }] = useRemoveFromCartMutation();
  const dispatch = useDispatch();

  const handleRemove = async () => {
    if (!confirm('Remove this item?')) return;

    try {
      await removeFromCart(cartId).unwrap();
      // Update Redux state
      dispatch(removeItem(String(cartId)));
      alert('Item removed');
    } catch (error: any) {
      const msg = error?.data?.message || 'Failed to remove item';
      alert(msg);
    }
  };

  return (
    <button onClick={handleRemove} disabled={isLoading}>
      {isLoading ? 'Removing...' : 'Remove'}
    </button>
  );
}
```

### 5️⃣ POST /api/cart/merge

**Merge guest cart with authenticated user cart**

```typescript
import { useMergeCartMutation } from "@/features/cart/cartApi";

function LoginHandler() {
  const [mergeCart] = useMergeCartMutation();

  const handleAfterLogin = async (guestCartItems: any[]) => {
    try {
      const mergePayload = guestCartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await mergeCart(mergePayload).unwrap();
      alert("Cart merged successfully!");
      // Refetch cart items
    } catch (error: any) {
      const msg = error?.data?.message || "Failed to merge cart";
      console.error(msg);
    }
  };

  return null;
}
```

## Using the useCart Hook

Comprehensive hook that handles all cart operations:

```typescript
import { useCart } from '@/hooks/useCart';

function MyCartComponent() {
  const {
    items,           // Cart items array
    isLoading,       // Cart loading state
    isAdding,        // Add operation loading
    isUpdating,      // Update operation loading
    isRemoving,      // Remove operation loading
    addToCart,       // Add to cart function
    updateQuantity,  // Update quantity function
    removeFromCart,  // Remove item function
    mergeCart,       // Merge cart function
    refetch,         // Refetch cart data
  } = useCart();

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>₹{item.price} x {item.quantity}</p>
          <button
            onClick={() => updateQuantity(Number(item.id), item.quantity + 1)}
            disabled={isUpdating}
          >
            Increase
          </button>
          <button
            onClick={() => removeFromCart(Number(item.id))}
            disabled={isRemoving}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

All mutations return detailed error objects:

```typescript
try {
  await addToCart({ productId: 101, qty: 2 }).unwrap();
} catch (error: any) {
  // Error structure:
  // error.data.message - Server error message
  // error.status - HTTP status code
  // error.originalStatus - Original status

  const errorMsg = error?.data?.message || "Operation failed";
  console.error(errorMsg);
}
```

## HTTP Status Codes

| Code | Meaning              |
| ---- | -------------------- |
| 200  | Success              |
| 204  | Success (No Content) |
| 400  | Bad Request          |
| 401  | Unauthorized         |
| 404  | Resource Not Found   |
| 500  | Server Error         |

## Response Examples

### GET /api/cart

```json
[
  {
    "cartId": 1,
    "productId": 101,
    "productName": "Premium T-Shirt",
    "imageUrl": "https://cdn.example.com/image.jpg",
    "price": 999.99,
    "quantity": 2,
    "totalPrice": 1999.98
  }
]
```

### POST /api/cart/add

```json
{
  "message": "Product added to cart"
}
```

### PUT /api/cart/{cartId}

```json
{
  "message": "Cart item updated"
}
```

### DELETE /api/cart/{cartId}

```json
{
  "message": "Item removed from cart"
}
```

### POST /api/cart/merge

```json
{
  "message": "Cart merged successfully"
}
```

## Best Practices

✅ **DO:**

- Always await `.unwrap()` on mutations to catch errors
- Update Redux state after successful API calls
- Show loading states during operations
- Handle errors gracefully with user-friendly messages
- Refetch cart after critical operations if needed

❌ **DON'T:**

- Make multiple simultaneous API calls for same item
- Skip error handling in catch blocks
- Forget to update local state after API success
- Bypass authentication headers

## Implementation Status

✅ All 5 cart endpoints implemented
✅ RTK Query with automatic cache invalidation
✅ Redux state synchronization
✅ Error handling and validation
✅ TypeScript types included
✅ Loading states for all operations
✅ Authentication headers automatically included

## Files Modified

- `features/cart/cartApi.ts` - RTK Query API definitions
- `store/index.ts` - Added cartApi to store
- `app/cart/page.tsx` - Cart page with full functionality
- `components/product/ProductCard.tsx` - Quick add to cart
- `components/product/ProductDetailsClient.tsx` - Product detail add to cart
- `hooks/useCart.ts` - Custom hook for cart operations
- `services/cart-operations.ts` - Helper service for validation

## Testing the APIs

```bash
# 1. Add product to cart
curl -X POST 'http://localhost:3000/api/cart/add?productId=101&qty=2' \
  -H 'Cookie: session=...'

# 2. Get cart items
curl -X GET 'http://localhost:3000/api/cart' \
  -H 'Cookie: session=...'

# 3. Update quantity
curl -X PUT 'http://localhost:3000/api/cart/1?qty=3' \
  -H 'Cookie: session=...'

# 4. Remove item
curl -X DELETE 'http://localhost:3000/api/cart/1' \
  -H 'Cookie: session=...'

# 5. Merge cart
curl -X POST 'http://localhost:3000/api/cart/merge' \
  -H 'Content-Type: application/json' \
  -d '[{"productId": 101, "quantity": 2}]' \
  -H 'Cookie: session=...'
```
