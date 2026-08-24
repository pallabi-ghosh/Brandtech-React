'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/store/cartStore';
import { Product } from '@/types';

interface ProductPurchasePanelProps {
  product: Product;
}

export default function ProductPurchasePanel({
  product,
}: ProductPurchasePanelProps) {
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | number | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const isOutOfStock =
    typeof product.stock === 'number' && product.stock === 0;

  const handleAddToCart = () => {
    if (selectedSize === null) {
      setError('Please select a size');
      return;
    }

    setError(null);
    addItem(product, quantity, selectedSize, product.color);
    setAddedToCart(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      {/* Size Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">Select Size</label>
        <div className="flex flex-wrap gap-2">
          {product.size.map((size) => (
            <button
              key={size}
              onClick={() => {
                setSelectedSize(size);
                setError(null);
              }}
              className={`px-4 py-2 border rounded ${
                selectedSize === size
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      {/* Quantity Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">Quantity</label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
            className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            −
          </button>
          <span className="text-lg font-semibold w-8 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            aria-label="Increase quantity"
            className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`w-full py-3 rounded-lg font-semibold text-white text-lg mb-4 transition ${
          addedToCart
            ? 'bg-green-600'
            : isOutOfStock
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
      </button>
    </>
  );
}
