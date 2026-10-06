export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem {
  id: number;
  quantity: number;
}
export interface CartItemWithProduct extends CartItem {
  product: Product;
}
export interface User {
  email: string;
}

export interface StoredUser extends User {
  password: string;
}

export type AuthResult =
  | { success: true }
  | { success: false; error: string };