import { Injectable, signal, computed, effect } from '@angular/core';
import { Cart, CartItem } from '../interfaces/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly CART_KEY = 'cart-data';
  private readonly EXPIRATION_KEY = 'cart-expiration';
  private readonly EXPIRATION_MS = 5 * 60 * 1000; // 5 minutos

  cart = signal<Cart>({
    items: [],
    count: 0,
    total: 0,
  });

  remainingTime = signal<number>(0);
  private timerInterval: any;

  constructor() {
    this.loadCart();
    this.resumeTimerIfNeeded();

    // Guardar carrito cada vez que cambia
    effect(() => {
      const value = this.cart();
      localStorage.setItem(this.CART_KEY, JSON.stringify(value));
    });
  }

  clearCart(showAlert: boolean = true) {
    this.cart.set({ items: [], count: 0, total: 0 });
    localStorage.removeItem(this.CART_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
    this.stopTimer();

  }

  addItem(item: CartItem): boolean {
    const itemInCart = this.cart().items.find((t) => t.id_producto === item.id_producto);

    if (itemInCart) {
      return this.updateItemQuantity(itemInCart.id_producto, itemInCart.quantity + 1);
    } else {
      if (item.stock && item.stock >= 1) {
        this.cart.update((prevCart) => ({
          ...prevCart,
          items: [...prevCart.items, { ...item, quantity: 1 }],
          count: prevCart.count + 1,
          total: prevCart.total + item.precio,
        }));
        this.setExpiration();
        this.startTimer();
        return true;
      } else {
        console.warn(`No se puede agregar el producto ${item.nombre_producto}: No hay stock disponible.`);
        return false;
      }
    }
  }

  updateItemQuantity(productId: string, newQuantity: number): boolean {
    let success = false;
    this.cart.update((prevCart) => {
      const newCart = { ...prevCart };
      const itemIndex = newCart.items.findIndex(t => t.id_producto === productId);

      if (itemIndex > -1) {
        const itemObj = { ...newCart.items[itemIndex] };

        if (newQuantity <= 0) {
          success = true;
          return this.removeItemInternal(prevCart, itemObj);
        } else if (newQuantity <= itemObj.stock) {
          const quantityChange = newQuantity - itemObj.quantity;

          itemObj.quantity = newQuantity;
          newCart.items[itemIndex] = itemObj;

          newCart.count += quantityChange;
          newCart.total += quantityChange * itemObj.precio;
          success = true;
        } else {
          console.warn(`No se puede establecer la cantidad del producto ${itemObj.nombre_producto} a ${newQuantity}. Stock máximo disponible: ${itemObj.stock}.`);
          success = false;
        }
      } else {
        console.warn(`Producto con ID ${productId} no encontrado en el carrito.`);
        success = false;
      }
      return newCart;
    });

    this.setExpiration();
    this.startTimer();
    return success;
  }

  increaseItem(item: CartItem): boolean {
    return this.updateItemQuantity(item.id_producto, item.quantity + 1);
  }

  decreaseItem(item: CartItem): boolean {
    return this.updateItemQuantity(item.id_producto, item.quantity - 1);
  }

  removeItem(item: CartItem) {
    this.cart.update((prevCart) => this.removeItemInternal(prevCart, item));
    this.setExpiration();
    this.startTimer();
  }

  private removeItemInternal(prevCart: Cart, itemToRemove: CartItem): Cart {
    const newCart = {
      ...prevCart,
      items: [...prevCart.items.filter((t) => t.id_producto !== itemToRemove.id_producto)],
    };
    newCart.count -= itemToRemove.quantity;
    newCart.total -= itemToRemove.precio * itemToRemove.quantity;
    return newCart;
  }

  // --- ⏳ Temporizador y almacenamiento local ---

  private setExpiration() {
    const expiration = Date.now() + this.EXPIRATION_MS;
    localStorage.setItem(this.EXPIRATION_KEY, expiration.toString());
  }

  private loadCart() {
    const stored = localStorage.getItem(this.CART_KEY);
    if (stored) {
      this.cart.set(JSON.parse(stored));
    }
  }

  private resumeTimerIfNeeded() {
    const exp = localStorage.getItem(this.EXPIRATION_KEY);
    if (exp) {
      const remaining = +exp - Date.now();
      if (remaining > 0) {
        this.startTimer();
      } else {
        this.clearCart(false);
      }
    }
  }

  private startTimer() {
    this.stopTimer();

    this.timerInterval = setInterval(() => {
      const exp = localStorage.getItem(this.EXPIRATION_KEY);
      if (!exp) return;

      const remaining = +exp - Date.now();
      this.remainingTime.set(remaining);

      if (remaining <= 0) {
        this.clearCart();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}
