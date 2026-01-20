import React from "react";

interface ProductSizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export const ProductSizeSelector: React.FC<ProductSizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSizeChange,
}) => {
  return (
    <div>
      <label className="block mb-2">Size:</label>
      <select
        value={selectedSize}
        onChange={(e) => onSizeChange(e.target.value)}
        className="border p-2 rounded"
      >
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};
