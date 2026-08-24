import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/ProductGallery';
import ProductPurchasePanel from '@/components/ProductPurchasePanel';
import { getAllProducts, getProductById, productName } from '@/lib/products';

interface ProductDetailProps {
  params: { id: string };
}

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ id: String(product.id) }));
}

export function generateMetadata({ params }: ProductDetailProps): Metadata {
  const product = getProductById(Number(params.id));

  if (!product) {
    return { title: 'Product Not Found — Brandtech' };
  }

  const name = productName(product);
  const description = `${name} by ${product.brand}. $${product.price.toFixed(
    2
  )}. Available in ${product.size.join(', ')}.`;

  return {
    title: `${name} — ${product.brand} | Brandtech`,
    description,
    openGraph: {
      title: `${name} — ${product.brand}`,
      description,
      images: product.images.length > 0 ? [product.images[0]] : undefined,
      type: 'website',
    },
  };
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const product = getProductById(Number(params.id));

  if (!product) {
    notFound();
  }

  const name = productName(product);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-6 inline-block"
        >
          ← Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ProductGallery images={product.images} name={name} />

          {/* Details */}
          <div>
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold mb-4">{name}</h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500">
                  {typeof product.stock === 'number'
                    ? product.stock > 0
                      ? `${product.stock} in stock`
                      : 'Out of stock'
                    : product.stock}
                </span>
              </div>

              {product.color && (
                <p className="text-gray-700 mb-6">
                  <strong>Color:</strong> {product.color}
                </p>
              )}
            </div>

            <ProductPurchasePanel product={product} />

            {/* Product Info */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Product Information</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Brand:</strong> {product.brand}
                </p>
                <p>
                  <strong>Available Sizes:</strong> {product.size.join(', ')}
                </p>
                <p>
                  <strong>Categories:</strong>{' '}
                  {product.categories.slice(0, 3).join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
