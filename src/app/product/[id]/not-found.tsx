import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    </div>
  );
}
