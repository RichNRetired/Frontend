import React from "react";

interface ProductPriceProps {
  price: number;
  discount?: number;
}

export const ProductPrice: React.FC<ProductPriceProps> = ({
  price,
  discount,
}) => {
  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <div>
      {discount ? (
        <>
          <span className="text-gray-500 line-through">₹{price}</span>
          <span className="text-red-500 ml-2">
            ₹{discountedPrice.toFixed(2)}
          </span>
        </>
      ) : (
        <span>₹{price}</span>
      )}
    </div>
  );
};
