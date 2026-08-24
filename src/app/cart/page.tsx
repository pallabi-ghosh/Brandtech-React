'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/cartStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      alert('Order placed successfully!');
      clearCart();
      setIsCheckingOut(false);
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.images[0]}
                      alt={item.name.en || item.name.dk || 'Product'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      href={`/product/${item.id}`}
                      className="font-semibold hover:text-blue-600"
                    >
                      {item.name.en || item.name.dk}
                    </Link>
                    <p className="text-sm text-gray-600">
                      {item.brand} • Size: {item.selectedSize}
                    </p>
                    {item.selectedColor && (
                      <p className="text-sm text-gray-600">
                        Color: {item.selectedColor}
                      </p>
                    )}
                    <p className="font-semibold mt-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 border border-gray-300 rounded">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  ${(getTotalPrice() * 1.1).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 mb-4"
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <Link
              href="/"
              className="block text-center text-blue-600 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
