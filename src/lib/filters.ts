export const PRICE_MIN = 0;
export const PRICE_MAX = 1000;

export interface ProductFilters {
  q: string;
  brand: string | null;
  category: string | null;
  color: string | null;
  size: string | null;
  minPrice: number;
  maxPrice: number;
}

export type SearchParams = { [key: string]: string | string[] | undefined };

function one(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && raw.length > 0 ? raw : null;
}

function price(value: string | string[] | undefined, fallback: number): number {
  const raw = one(value);
  const parsed = raw === null ? NaN : Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(PRICE_MAX, Math.max(PRICE_MIN, parsed));
}

export function parseFilters(searchParams: SearchParams): ProductFilters {
  const min = price(searchParams.minPrice, PRICE_MIN);
  const max = price(searchParams.maxPrice, PRICE_MAX);

  return {
    q: one(searchParams.q) ?? '',
    brand: one(searchParams.brand),
    category: one(searchParams.category),
    color: one(searchParams.color),
    size: one(searchParams.size),
    minPrice: Math.min(min, max),
    maxPrice: Math.max(min, max),
  };
}

/** Builds the `/` URL for the current filters with `patch` applied. */
export function buildQuery(
  filters: ProductFilters,
  patch: Partial<ProductFilters>
): string {
  const next = { ...filters, ...patch };
  const params = new URLSearchParams();

  if (next.q) params.set('q', next.q);
  if (next.brand) params.set('brand', next.brand);
  if (next.category) params.set('category', next.category);
  if (next.color) params.set('color', next.color);
  if (next.size) params.set('size', next.size);
  if (next.minPrice !== PRICE_MIN) params.set('minPrice', String(next.minPrice));
  if (next.maxPrice !== PRICE_MAX) params.set('maxPrice', String(next.maxPrice));

  const query = params.toString();
  return query ? `/?${query}` : '/';
}

export function hasActiveFilters(filters: ProductFilters): boolean {
  return (
    filters.q !== '' ||
    filters.brand !== null ||
    filters.category !== null ||
    filters.color !== null ||
    filters.size !== null ||
    filters.minPrice !== PRICE_MIN ||
    filters.maxPrice !== PRICE_MAX
  );
}
