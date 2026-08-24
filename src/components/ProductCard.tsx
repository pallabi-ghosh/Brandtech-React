import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productName = product.name.en || product.name.dk || 'Product';
  const isOutOfStock =
    typeof product.stock === 'number' && product.stock === 0;

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={productName}
            fill
            className="object-cover hover:scale-105 transition duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}

          {typeof product.stock === 'number' && product.stock < 5 && !isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Only {product.stock} left!
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-1">{product.brand}</p>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {productName}
          </h3>

          {product.color && (
            <p className="text-xs text-gray-600 mb-2">
              Color: {product.color}
            </p>
          )}

          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>

            {product.size && product.size.length > 0 && (
              <span className="text-xs text-gray-500">
                {product.size.length} sizes
              </span>
            )}
          </div>

          {/* Stock Info */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              {typeof product.stock === 'number'
                ? product.stock > 0
                  ? `${product.stock} in stock`
                  : 'Out of stock'
                : product.stock}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
