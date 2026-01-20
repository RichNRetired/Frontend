import React from "react";

interface ProductGalleryProps {
  images: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Product ${index + 1}`}
          className="w-full h-48 object-cover"
        />
      ))}
    </div>
  );
};
