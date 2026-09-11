import path from 'path';
import { LocalIndex } from 'vectra';
import ollama from 'ollama';
import productsData from '@/data/products.json';

const INDEX_DIR = path.join(process.cwd(), 'rag_index');

// ── Tool definitions (sent to Ollama so it knows what it can call) ──────────

export const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'searchFAQ',
      description: 'Search the FAQ knowledge base for questions about shipping, returns, sizing, store policies, and general information.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'The question or topic to search for' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'searchProducts',
      description: 'Search the product catalogue by color, price range, size, category, or brand.',
      parameters: {
        type: 'object',
        properties: {
          color:     { type: 'string',  description: 'Filter by color, e.g. "red", "black"' },
          maxPrice:  { type: 'number',  description: 'Maximum price in DKK' },
          minPrice:  { type: 'number',  description: 'Minimum price in DKK' },
          size:      { type: 'string',  description: 'Filter by size, e.g. "S", "M", "L"' },
          category:  { type: 'string',  description: 'Filter by category keyword, e.g. "women", "men"' },
          brand:     { type: 'string',  description: 'Filter by brand name, e.g. "Vero Moda", "Jack & Jones"' },
          name:      { type: 'string',  description: 'Filter by product name keyword, e.g. "jacket", "dress", "jeans"' },
          inStockOnly: { type: 'boolean', description: 'Only return products that are in stock' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'checkStock',
      description: 'Check the stock level for a specific product by its ID.',
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'number', description: 'The product ID to check' },
        },
        required: ['productId'],
      },
    },
  },
];

// ── Tool implementations ────────────────────────────────────────────────────

export async function searchFAQ({ query }: { query: string }): Promise<string> {
  try {
    const index = new LocalIndex(INDEX_DIR);
    const embRes = await ollama.embed({ model: 'nomic-embed-text', input: query });
    const results = await index.queryItems(embRes.embeddings[0], query, 4);
    if (!results.length) return 'No relevant FAQ entries found.';
    return results.map((r: any) => r.item.metadata.text).join('\n\n');
  } catch (e) {
    return `FAQ search failed: ${e}`;
  }
}

export function searchProducts({
  color, maxPrice, minPrice, size, category, brand, name, inStockOnly,
}: {
  color?: string; maxPrice?: number; minPrice?: number;
  size?: string; category?: string; brand?: string; name?: string; inStockOnly?: boolean;
}): string {
  let products = (productsData as any).products as any[];

  if (color)       products = products.filter(p => p.color?.toLowerCase().includes(color.toLowerCase()));
  if (maxPrice)    products = products.filter(p => p.price <= maxPrice);
  if (minPrice)    products = products.filter(p => p.price >= minPrice);
  if (size)        products = products.filter(p => Array.isArray(p.size) && p.size.includes(size.toUpperCase()));
  if (category)    products = products.filter(p => p.categories.some((c: string) => c.includes(category.toLowerCase())));
  if (inStockOnly) products = products.filter(p => Number(p.stock) > 0);
  if (brand)       products = products.filter(p => p.brand?.toLowerCase().includes(brand.toLowerCase()));
  if (name)        products = products.filter(p => {
    const n = (p.name.dk || p.name.en || '').toLowerCase();
    return n.includes(name.toLowerCase());
  });

  if (!products.length) return 'No products match those filters.';

  return products.slice(0, 5).map(p => {
    const name = p.name.dk || p.name.en || 'Unnamed';
    const image = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '';
    const link = `http://localhost:3000/product/${p.id}`;
    return `ID:${p.id} | ${p.brand} | ${name} | ${p.price} DKK | Color: ${p.color || 'N/A'} | Sizes: ${Array.isArray(p.size) ? p.size.join(',') : p.size} | Stock: ${p.stock} | Image: ${image} | Link: ${link}`;
  }).join('\n');
}

export function checkStock({ productId }: { productId: number }): string {
  const product = (productsData as any).products.find((p: any) => p.id === productId);
  if (!product) return `Product ID ${productId} not found.`;
  const name = product.name.dk || product.name.en || 'Unnamed';
  const stock = Number(product.stock);
  const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '';
  const link = `http://localhost:3000/product/${productId}`;
  return stock > 0
    ? `"${name}" (ID: ${productId}) is in stock — ${stock} units available. Image: ${image} | Link: ${link}`
    : `"${name}" (ID: ${productId}) is currently out of stock. Image: ${image} | Link: ${link}`;
}

// ── Tool dispatcher ─────────────────────────────────────────────────────────

export async function callTool(name: string, args: any): Promise<string> {
  switch (name) {
    case 'searchFAQ':      return await searchFAQ(args);
    case 'searchProducts': return searchProducts(args);
    case 'checkStock':     return checkStock(args);
    default:               return `Unknown tool: ${name}`;
  }
}
