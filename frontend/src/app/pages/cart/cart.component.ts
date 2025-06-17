import { Component, computed } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CartItemCardComponent } from './components/cart-item-card/cart-item-card.component';
import { HttpClient } from '@angular/common/http';  
import { LogService } from '../../core/services/log.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemCardComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],  
})
export class CartComponent {
  count = computed(() => this.cartService.cart().count);
  total = computed(() => this.cartService.cart().total);
  items = computed(() => this.cartService.cart().items);
  authService: any;
  
  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private logService: LogService  
  ) {}

  onItemQuantityUpdate(quantity: number, id: string) {
    let increase = true;
    const item = this.items().find((t: any) => t.id_producto === id);
    if (quantity < item!.quantity) increase = false;
    if (increase) {
      this.cartService.increaseItem(item!);
    } else {
      this.cartService.decreaseItem(item!);
    }
  }

  onRemoveItem(id: string) {
    const item = this.items().find((t: any) => t.id_producto === id);
    this.cartService.removeItem(item!);
  }

  finalizarCompra() {
    const cartData = this.cartService.cart(); 
    const { id } = this.logService.getUserIdFromToken();

    if (!id) {
      alert('No se ha encontrado un usuario autenticado.');
      return;
    }
    
    const compraData = {
      descripcion: 'Compra de productos', 
      precio_total: cartData.total, 
      user: id, 
      detalles: cartData.items.map((item: any) => ({
        cantidad: item.quantity,
        precio_calculado: item.precio,
        id_producto: item.id_producto,
        nombre_producto: item.nombre
      }))
    };

    this.http.post<any>('/api/crear-pago/', compraData).subscribe(
      (response) => {
       
        if (response.init_point) {
          // 🌐 3. Abrir Mercado Pago en otra pestaña
        window.open(response.init_point, '_blank');
          // 🧹 1. Vaciar carrito
        this.cartService.clearCart();

        // 🧭 2. Redirigir a historial de compras
        window.location.href = 'http://localhost:4200/historialdecompras';

        
          }
        
      },
      (error) => {
        console.error('Error al crear el pago', error);
        alert('Hubo un error al procesar tu compra, por favor intenta nuevamente');
      }
    );
  }
}



