interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  company: string;
  description: string;
  offer: number;
  available: number;
  isFavorite: boolean;
}

interface Offer {
  id: number;
  product: number;
  image: string;
  company: string;
}

interface Company {
  id: number;
  name: string;
  image: string;
  soon: number;
}

interface Category {
  id: number;
  name: string;
  image: string;
}

interface CartProduct {
  id: number;
  quantity: number;
  name: string;
  image: string;
  price: number;
  with_coins: boolean;
}

interface discount {
  code: string;
  value: number;
}

interface OrderProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  with_coins: boolean;
}

interface Order {
  id: string;
  created_at: string;
  method: string;
  city: string;
  discount: string;
  delivered: number;
  processing: number;
  total: number;
  products: OrderProduct[];
}
