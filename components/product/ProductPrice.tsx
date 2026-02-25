import React from "react";

interface ProductPriceProps {
  price: number;
  discount?: number;
}

export const ProductPrice: React.FC<ProductPriceProps> = ({
  price,
  discount,
}) => {
  const safePrice = typeof price === "number" ? price : 0;
  const discountedPrice = discount
    ? safePrice * (1 - discount / 100)
    : safePrice;

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
