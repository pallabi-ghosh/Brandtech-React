import data from '@/data/products.json';
import { Product } from '@/types';
import { ProductFilters } from './filters';

// Imported only from server components, so the catalog never reaches the
// client bundle.
const products = data.products as Product[];

export interface Facets {
  brands: string[];
  categories: string[];
  colors: string[];
  sizes: string[];
}

const LETTER_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

/**
 * Sizes are a mix of numbers (26, 32) and letters (S, XL) in products.json,
 * so every comparison goes through String() to keep the two comparable.
 */
function compareSizes(a: string, b: string): number {
  const na = Number(a);
  const nb = Number(b);
  const aIsNum = Number.isFinite(na);
  const bIsNum = Number.isFinite(nb);

  if (aIsNum && bIsNum) return na - nb;
  if (aIsNum) return -1;
  if (bIsNum) return 1;

  const ia = LETTER_SIZES.indexOf(a.toUpperCase());
  const ib = LETTER_SIZES.indexOf(b.toUpperCase());
  if (ia !== -1 && ib !== -1) return ia - ib;
  if (ia !== -1) return -1;
  if (ib !== -1) return 1;

  return a.localeCompare(b);
}

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: number): Product | undefined {
  if (!Number.isFinite(id)) return undefined;
  return products.find((product) => product.id === id);
}

export function getFacets(): Facets {
  const brands = new Set<string>();
  const categories = new Set<string>();
  const colors = new Set<string>();
  const sizes = new Set<string>();

  for (const product of products) {
    brands.add(product.brand);
    product.categories.forEach((category) => categories.add(category));
    if (product.color) colors.add(product.color);
    product.size.forEach((size) => sizes.add(String(size)));
  }

  return {
    brands: Array.from(brands).sort((a, b) => a.localeCompare(b)),
    categories: Array.from(categories).sort((a, b) => a.localeCompare(b)),
    colors: Array.from(colors).sort((a, b) => a.localeCompare(b)),
    sizes: Array.from(sizes).sort(compareSizes),
  };
}

export function productName(product: Product): string {
  return product.name.en || product.name.dk || 'Product';
}

export function filterProducts(filters: ProductFilters): Product[] {
  const query = filters.q.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      query === '' ||
      [product.name.en, product.name.dk, product.brand].some((field) =>
        field?.toLowerCase().includes(query)
      );

    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesCategory =
      !filters.category || product.categories.includes(filters.category);
    const matchesColor = !filters.color || product.color === filters.color;
    const matchesSize =
      !filters.size || product.size.some((size) => String(size) === filters.size);
    const matchesPrice =
      product.price >= filters.minPrice && product.price <= filters.maxPrice;

    return (
      matchesSearch &&
      matchesBrand &&
      matchesCategory &&
      matchesColor &&
      matchesSize &&
      matchesPrice
    );
  });
}
