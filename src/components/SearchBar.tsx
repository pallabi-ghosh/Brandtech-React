'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildQuery, ProductFilters } from '@/lib/filters';

interface SearchBarProps {
  filters: ProductFilters;
}

export default function SearchBar({ filters }: SearchBarProps) {
  const router = useRouter();
  // Seeded from the URL once; typing owns it from then on, so a re-render
  // triggered by our own navigation can't clobber in-flight keystrokes.
  const [term, setTerm] = useState(filters.q);

  useEffect(() => {
    if (term === filters.q) return;

    const timer = setTimeout(() => {
      router.replace(buildQuery(filters, { q: term }), { scroll: false });
    }, 300);

    return () => clearTimeout(timer);
  }, [term, filters, router]);

  return (
    <div className="mb-6">
      <div className="relative">
        <svg
          className="absolute left-3 top-3 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          placeholder="Search products, brands..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {term && (
          <button
            onClick={() => setTerm('')}
            aria-label="Clear search"
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
