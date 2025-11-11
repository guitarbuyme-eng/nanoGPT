export interface CartItem {
  id: string;
  variantId: string;
  title: string;
  price: string;
  currencyCode: string;
  quantity: number;
  image: string;
  handle: string;
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(item: Omit<CartItem, 'quantity'>): CartItem[] {
  const cart = getCart();
  const existingItem = cart.find(i => i.variantId === item.variantId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(variantId: string): CartItem[] {
  const cart = getCart().filter(item => item.variantId !== variantId);
  saveCart(cart);
  return cart;
}

export function updateQuantity(variantId: string, quantity: number): CartItem[] {
  const cart = getCart();
  const item = cart.find(i => i.variantId === variantId);

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(variantId);
    }
    item.quantity = quantity;
    saveCart(cart);
  }

  return cart;
}

export function clearCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cart');
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => {
    return total + parseFloat(item.price) * item.quantity;
  }, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((count, item) => count + item.quantity, 0);
}
