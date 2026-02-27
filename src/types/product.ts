export interface Product {
  id: string; name: string; price: number; currency: string; size: string;
  description: string; benefits: string[]; images: string[]; category: string;
  inStock: boolean; keywords: string[];
}
export interface CartItem extends Product { quantity: number; }
export interface Policies { return: string; refund: string; delivery: string; }
