import React, { useEffect, useState } from "react";

interface PDPImageGalleryProps {
  images?: Array<string | { imageUrl?: string | null }>;
  name: string;
}

const PDPImageGallery: React.FC<PDPImageGalleryProps> = ({ images, name }) => {
  const imageList =
    images && images.length > 0
      ? images
          .map((entry) =>
            typeof entry === "string" ? entry : (entry?.imageUrl ?? ""),
          )
          .filter(Boolean)
      : [];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [images]);

  if (imageList.length === 0) {
    return (
      <div className="bg-neutral-50 mt-20 rounded-2xl overflow-hidden aspect-square flex items-center justify-center border border-neutral-100">
        <div className="text-neutral-400 text-xs italic">
          No image available
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start mt-20 gap-3 md:gap-4">
      {imageList.length > 1 && (
        <div className="w-18 md:w-22 shrink-0">
          <div className="flex flex-col gap-2 max-h-120 overflow-y-auto pr-1">
            {imageList.map((image, idx) => {
              const isActive = idx === selectedImageIndex;
              return (
                <button
                  key={`${image}-${idx}`}
                  type="button"
                  aria-label={`View image ${idx + 1}`}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-full aspect-square overflow-hidden rounded-lg border transition-all ${
                    isActive
                      ? "border-black"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${name} thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 bg-neutral-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center border border-neutral-100 relative group touch-none">
        <img
          src={imageList[selectedImageIndex]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
        />
      </div>
    </div>
  );
};

export default PDPImageGallery;
