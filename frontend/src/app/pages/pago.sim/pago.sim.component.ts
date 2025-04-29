import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/interfaces/cart';
import { HttpClient } from '@angular/common/http';
import { Compra } from '../../core/interfaces/compra';
import { Pedido } from '../../core/interfaces/pedido';
import { forkJoin } from 'rxjs';
import { PedidosService } from '../../core/services/pedidos.service';
import { LogService } from '../../core/services/log.service';

@Component({
  selector: 'app-pago-sim',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './pago.sim.component.html',
  styleUrls: ['./pago.sim.component.css']
})
export class PagoSimComponent {
  compra: Compra = {
    descripcion: '',
    precio_total: 0,
    user: 0,
    detalles: [],
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    fecha: new Date()
  };

  cartItems: CartItem[];
  total: number;
  cardNumber: string = '';
  expDate: string = '';
  cvv: string = '';

  constructor(private cartService: CartService, private http: HttpClient, private pedidosService: PedidosService, private logService: LogService) {
    this.cartItems = this.cartService.cart().items;
    this.total = this.cartService.cart().total;
  }

  onCheckout() {
    const nombresProductos = this.cartItems.map(item => item.nombre_producto).join(', ');
    const userId = this.getUserId();
  
    const compra: Compra = {
      descripcion: `${nombresProductos}`,
      precio_total: this.total,
      user: userId,  
      user_first_name: '', 
      user_last_name: '',  
      detalles: [],  
      direccion: '',  
      ciudad: '',  
      codigoPostal: '', 
      fecha: new Date()
    };
     
  
    this.http.post('/api/compra/', compra).subscribe(
      (compraResponse: any) => {
        const compraId = compraResponse.id_compra;
  
        const detalles = this.cartItems.map(item => ({
          cantidad: item.quantity,
          precio_calculado: item.precio * item.quantity,
          producto: item.id_producto,
          compra: compraId
        }));
  
        const detallesRequests = detalles.map(detalle =>
          this.http.post('/api/detalle/', detalle)
        );
  
        forkJoin(detallesRequests).subscribe(
          () => {
            const pedido: Pedido = {
              id_pedido: '', 
              fecha_pedido: new Date(),
              estado: 'pagado',
              user_id: userId
            };
  
            this.pedidosService.agregarPedido(pedido).subscribe(
              pedidoResponse => {
                console.log('Pedido registrado con éxito', pedidoResponse);
                alert('Compra realizada con éxito');
                this.clearFormAndCart(); 
              },
              error => {
                console.error('Error al registrar el pedido', error);
                alert('Error al registrar el pedido');
              }
            );
          },
          error => {
            console.error('Error al registrar los detalles', error);
            alert('Error al registrar los detalles');
          }
        );
      },
      error => {
        console.error('Error al realizar la compra', error);
        alert('Error al realizar la compra: ' + JSON.stringify(error.error));
      }
    );
  }
  
  getUserId(): number {
    
    const token = this.logService.getToken();  
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id;
    }
    return 0; 
  }

  clearFormAndCart() {
    this.cartService.clearCart(); 
    this.cartItems = [];
    this.total = 0;
    this.cardNumber = ''; 
    this.expDate = '';
    this.cvv = '';
  }
}

