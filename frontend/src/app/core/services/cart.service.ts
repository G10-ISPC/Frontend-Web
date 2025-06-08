import { Injectable, signal } from '@angular/core';
import { Cart, CartItem } from '../interfaces/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = signal<Cart>({
    items: [],
    count: 0,
    total: 0,
  });

  clearCart() {
    this.cart.update(() => ({
      items: [],
      count: 0,
      total: 0
    }));
  }

  constructor() {}

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
}