'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  buildQuery,
  hasActiveFilters,
  PRICE_MAX,
  PRICE_MIN,
  ProductFilters,
} from '@/lib/filters';
import { Facets } from '@/lib/products';

interface FiltersProps {
  facets: Facets;
  filters: ProductFilters;
}

type FilterKey = 'brand' | 'category' | 'price' | 'color' | 'size';

export default function Filters({ facets, filters }: FiltersProps) {
  const router = useRouter();

  const [expandedFilters, setExpandedFilters] = useState<
    Record<FilterKey, boolean>
  >({
    brand: true,
    category: true,
    price: true,
    color: false,
    size: false,
  });

  const [range, setRange] = useState<[number, number]>([
    filters.minPrice,
    filters.maxPrice,
  ]);

  // Follow the URL when it changes from outside the sliders (back button,
  // "Clear all"), then push slider movement back out on a debounce.
  useEffect(() => {
    setRange([filters.minPrice, filters.maxPrice]);
  }, [filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    if (range[0] === filters.minPrice && range[1] === filters.maxPrice) return;

    const timer = setTimeout(() => {
      router.replace(
        buildQuery(filters, { minPrice: range[0], maxPrice: range[1] }),
        { scroll: false }
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [range, filters, router]);

  const toggleFilter = (filter: FilterKey) => {
    setExpandedFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const select = (patch: Partial<ProductFilters>) => {
    router.push(buildQuery(filters, patch), { scroll: false });
  };

  const section = (
    key: FilterKey,
    title: string,
    body: React.ReactNode
  ) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <button
        onClick={() => toggleFilter(key)}
        aria-expanded={expandedFilters[key]}
        className="flex justify-between items-center w-full mb-3"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-gray-500">{expandedFilters[key] ? '−' : '+'}</span>
      </button>

      {expandedFilters[key] && body}
    </div>
  );

  const radioGroup = (
    name: FilterKey,
    allLabel: string,
    values: string[],
    selected: string | null,
    format?: (value: string) => string,
    labelClassName?: string
  ) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
        <input
          type="radio"
          name={name}
          checked={selected === null}
          onChange={() => select({ [name]: null } as Partial<ProductFilters>)}
          className="w-4 h-4"
        />
        <span className="text-sm">{allLabel}</span>
      </label>

      {values.map((value) => (
        <label
          key={value}
          className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
        >
          <input
            type="radio"
            name={name}
            checked={selected === value}
            onChange={() => select({ [name]: value } as Partial<ProductFilters>)}
            className="w-4 h-4"
          />
          <span className={labelClassName ?? 'text-sm'}>
            {format ? format(value) : value}
          </span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="sticky top-4 space-y-6">
      {hasActiveFilters(filters) && (
        <button
          onClick={() => router.push('/', { scroll: false })}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear all filters
        </button>
      )}

      {section(
        'brand',
        'Brand',
        radioGroup('brand', 'All Brands', facets.brands, filters.brand)
      )}

      {section(
        'price',
        'Price',
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 block mb-2">
              Min: ${range[0]}
            </label>
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              value={range[0]}
              onChange={(e) =>
                setRange([Number(e.target.value), range[1]])
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-2">
              Max: ${range[1]}
            </label>
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              value={range[1]}
              onChange={(e) =>
                setRange([range[0], Number(e.target.value)])
              }
              className="w-full"
            />
          </div>

          <button
            onClick={() => setRange([PRICE_MIN, PRICE_MAX])}
            className="text-sm text-blue-600 hover:underline"
          >
            Reset
          </button>
        </div>
      )}

      {facets.categories.length > 0 &&
        section(
          'category',
          'Category',
          radioGroup(
            'category',
            'All Categories',
            facets.categories.slice(0, 8),
            filters.category,
            (value) => value.replace(/_/g, ' '),
            'text-sm capitalize'
          )
        )}

      {facets.colors.length > 0 &&
        section(
          'color',
          'Color',
          radioGroup('color', 'All Colors', facets.colors, filters.color)
        )}

      {facets.sizes.length > 0 &&
        section(
          'size',
          'Size',
          radioGroup('size', 'All Sizes', facets.sizes, filters.size)
        )}
    </div>
  );
}
