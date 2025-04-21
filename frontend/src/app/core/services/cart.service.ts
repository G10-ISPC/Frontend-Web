import { Injectable, signal } from '@angular/core';

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

  addItem(item: CartItem) {
    const itemObj = this.cart().items.find((t) => t.id_producto === item.id_producto);
    if (itemObj) {
      this.increaseItem(itemObj);
    } else {
      this.cart.update((prevCart) => ({
        ...prevCart,
        items: [...prevCart.items, item],
        count: prevCart.count + 1,
        total: prevCart.total + item.precio,
      }));
    }
  }

  increaseItem(item: CartItem) {
    this.cart.update((prevCart) => {
      const newCart = {
        ...prevCart,
        items: [...prevCart.items],
      };
      const itemObj = newCart.items.find((t) => t.id_producto === item.id_producto);
      itemObj!.quantity = itemObj!.quantity + 1;
      newCart.count++;
      newCart.total += itemObj!.precio;
      return newCart;
    });
  }

  decreaseItem(item: CartItem) {
    this.cart.update((prevCart) => {
      const newCart = {
        ...prevCart,
        items: [...prevCart.items],
      };
      const itemObj = newCart.items.find((t) => t.id_producto === item.id_producto);
      itemObj!.quantity = itemObj!.quantity - 1;
      newCart.count--;
      newCart.total -= itemObj!.precio;
      return newCart;
    });
  }

  removeItem(item: CartItem) {
    this.cart.update((prevCart) => {
      const newCart = {
        ...prevCart,
        items: [...prevCart.items.filter((t) => t.id_producto !== item.id_producto)],
      };
      const itemObj = prevCart.items.find((t) => t.id_producto === item.id_producto);
      newCart.count -= itemObj!.quantity;
      newCart.total -= itemObj!.precio * itemObj!.quantity;
      return newCart;
    });
  }
}

export interface CartItem {
  id_producto: string;
  nombre_producto: string;
  main_imagen: string;
  precio: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  count: number;
  total: number;
}




