import ProductCard from '@/components/ProductCard';
import Filters from '@/components/Filters';
import SearchBar from '@/components/SearchBar';
import { filterProducts, getFacets } from '@/lib/products';
import { parseFilters, SearchParams } from '@/lib/filters';

export default function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = parseFilters(searchParams);
  const facets = getFacets();
  const filteredProducts = filterProducts(filters);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Fashion &amp; Style</h1>
          <p className="text-xl text-blue-100">
            Discover premium products from top brands
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar filters={filters} />

        <div className="flex gap-8 mt-8">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <Filters facets={facets} filters={filters} />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Products ({filteredProducts.length})
              </h2>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found matching your criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
