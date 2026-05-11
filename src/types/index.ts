export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string | null;
  category?: Category | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  createdAt: Date;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  total: number;
  status: OrderStatus;
  paymentRef: string | null;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  size: string | null;
  color: string | null;
  price: number;
  productName: string;
  productImage: string | null;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  slug: string;
  stock: number;
}

export interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
}
