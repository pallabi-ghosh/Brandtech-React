# Brandtech E-Commerce Store

A modern e-commerce application built with Next.js, TypeScript, React, Tailwind CSS, and Zustand.

## Features

- **Product Listing**: Browse all products in a responsive grid layout
- **Advanced Filters**: Filter by brand, category, price range, color, and size
- **Search Functionality**: Search products by name or brand
- **Product Details**: View detailed product information, images, and variants
- **Shopping Cart**: Add items to cart with size and color selection
- **Responsive Design**: Mobile-friendly design using Tailwind CSS
- **Type Safety**: Fully typed with TypeScript
- **State Management**: Cart management with Zustand

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS for utility-based styling
  - CSS Modules ready for component-scoped styles
  - Styled Components support included
- **State Management**: Zustand
- **Image Optimization**: Next.js Image component

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (server)
│   ├── page.tsx                # Listing page (server, filters via searchParams)
│   ├── globals.css             # Global styles
│   ├── product/
│   │   └── [id]/
│   │       ├── page.tsx        # Product detail (server, SSG + generateMetadata)
│   │       └── not-found.tsx   # 404 UI for unknown product ids
│   └── cart/
│       └── page.tsx            # Shopping cart (client)
├── components/
│   ├── Header.tsx              # Navigation header (client — cart badge)
│   ├── Footer.tsx              # Footer (server)
│   ├── ProductCard.tsx         # Product card (server)
│   ├── SearchBar.tsx           # Search input (client — writes ?q=)
│   ├── Filters.tsx             # Filter sidebar (client — writes ?brand=, ?size=, …)
│   ├── ProductGallery.tsx      # Image gallery (client)
│   └── ProductPurchasePanel.tsx# Size/qty/add-to-cart (client)
├── lib/
│   ├── products.ts             # Server-only data access + filtering
│   └── filters.ts              # Pure searchParams <-> filter-state helpers
├── data/
│   └── products.json           # Product data (never sent to the browser)
├── store/
│   └── cartStore.ts            # Zustand cart store
└── types/
    └── index.ts                # TypeScript types
```

## Rendering Model

Pages are React Server Components; only the interactive leaves are client
components. `products.json` is read on the server and never bundled into the
client JS.

- `/` is dynamically rendered because filter state lives in the URL
  (`?brand=&category=&color=&size=&minPrice=&maxPrice=&q=`). Filtering runs on
  the server, so filter URLs are shareable and bookmarkable.
- `/product/[id]` is statically generated via `generateStaticParams`, with
  per-product `<title>`/description from `generateMetadata`. Unknown ids call
  `notFound()` and return a real HTTP 404.

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm run start
```

## Features Breakdown

### 1. Product Listing Page (`/`)
- Displays all products in a responsive grid
- Side panel with advanced filters
- Search bar for quick product search
- Hero section with branding

### 2. Filters
- **Brand Filter**: Filter by product brand
- **Price Range**: Slider to select price range
- **Category**: Filter by product category
- **Color**: Filter by product color
- **Size**: Filter by available sizes

### 3. Product Detail Page (`/product/[id]`)
- Large product images with thumbnail gallery
- Product information (price, brand, stock status)
- Size selection
- Quantity adjustment
- Add to cart functionality
- Related product information

### 4. Shopping Cart (`/cart`)
- View all cart items
- Adjust quantities
- Remove items
- Order summary with subtotal, tax, and total
- Checkout functionality

## Customization

### Adding CSS Modules
Create a `.module.css` file and import it:
```tsx
import styles from './Component.module.css';
export default function Component() {
  return <div className={styles.container}>Content</div>;
}
```

### Using Styled Components
```tsx
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background: #f0f0f0;
`;

export default function Component() {
  return <Container>Content</Container>;
}
```

### Modifying Product Data
Edit `src/data/products.json` to add or modify products.

## API Routes (Optional)
To add API routes, create files in `src/app/api/`:
```tsx
// src/app/api/products/route.ts
export async function GET() {
  return Response.json({ products: [...] });
}
```

## Environment Variables
Create a `.env.local` file if needed:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Performance Optimizations
- Image optimization with Next.js Image component
- CSS-in-JS support for styled-components
- Code splitting with Next.js
- Fast refresh during development

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements
- Product reviews and ratings
- Wishlist functionality
- User authentication
- Payment integration
- Order tracking
- Admin dashboard
- Product recommendations

## License
MIT

## Support
For issues or questions, please create an issue in the repository.
