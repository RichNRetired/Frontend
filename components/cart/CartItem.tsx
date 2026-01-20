import React from "react";

interface CartItemProps {
  name: string;
  price: number;
  quantity: number;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  name,
  price,
  quantity,
  onRemove,
}) => {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <div>
        <h4 className="font-bold">{name}</h4>
        <p>
          ₹{price} x {quantity}
        </p>
      </div>
      <button onClick={onRemove} className="text-red-500">
        Remove
      </button>
    </div>
  );
};
