'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div>
      <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
        <div className="relative w-full aspect-square">
          <Image
            src={images[selectedImageIndex]}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              onClick={() => setSelectedImageIndex(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              className={`relative w-full aspect-square rounded border-2 overflow-hidden ${
                selectedImageIndex === index
                  ? 'border-blue-600'
                  : 'border-gray-300'
              }`}
            >
              <Image
                src={image}
                alt={`${name} ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
