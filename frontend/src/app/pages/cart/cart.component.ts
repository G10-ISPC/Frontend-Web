import { Component, computed } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CartItemCardComponent} from './components/cart-item-card/cart-item-card.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';  
import { LogService } from '../../core/services/log.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemCardComponent, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],  
})
export class CartComponent {
  count = computed(() => this.cartService.cart().count);
  total = computed(() => this.cartService.cart().total);
  items = computed(() => this.cartService.cart().items);
  tiempoRestante = computed(() => this.cartService.remainingTime());
  authService: any;
  
  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private logService: LogService  
  ) {}

    formatTiempo(ms: number): string {
    if (!ms || ms <= 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }

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



