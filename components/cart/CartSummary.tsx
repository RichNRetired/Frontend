import React from "react";

interface CartSummaryProps {
  subtotal: number;
  total: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, total }) => {
  return (
    <div className="border p-4 rounded">
      <h3 className="text-lg font-bold mb-2">Cart Summary</h3>
      <div className="flex justify-between">
        <span>Subtotal <span className="text-xs text-gray-400">(incl. taxes)</span>:</span>
        <span>₹{(subtotal ?? 0).toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Total:</span>
        <span>₹{(total ?? 0).toFixed(2)}</span>
      </div>
    </div>
  );
};
