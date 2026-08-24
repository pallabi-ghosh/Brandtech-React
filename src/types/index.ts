export interface Product {
  id: number;
  brand: string;
  price: number;
  stock: number | string;
  color: string;
  size: (string | number)[];
  name: {
    dk?: string;
    en?: string;
  };
  images: string[];
  categories: string[];
  variant?: ProductVariant[];
}

export interface ProductVariant {
  stock: number | string;
  color: string;
  size: (string | number)[];
  images?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string | number;
  selectedColor?: string;
}
