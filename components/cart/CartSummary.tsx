import React from "react";

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  tax,
  total,
}) => {
  return (
    <div className="border p-4 rounded">
      <h3 className="text-lg font-bold mb-2">Cart Summary</h3>
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax:</span>
        <span>₹{tax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Total:</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
};
