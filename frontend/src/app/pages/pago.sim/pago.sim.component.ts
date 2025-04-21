import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { CartService, CartItem } from '../../core/services/cart.service';
import { HttpClient } from '@angular/common/http';
import { Compra } from '../../shared/interfaces/compra';
import { DecimalFormatPipe } from '../../shared/pipes/decimal-format.pipe';
import { Pedido } from '../../shared/interfaces/pedido';
import { forkJoin } from 'rxjs';
import { PedidosService } from '../../core/services/pedidos.service';
import { LogService } from '../../core/services/log.service';

@Component({
  selector: 'app-pago-sim',
  standalone: true,
  imports: [CommonModule, FormsModule], // Asegúrate de agregar FormsModule
  templateUrl: './pago.sim.component.html',
  styleUrls: ['./pago.sim.component.css']
})
export class PagoSimComponent {
  compra: Compra = {
    descripcion: '',
    precio_total: 0,
    user_id: 0,
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
      user_id: userId,
      user_first_name: '', // Ajusta según los datos disponibles
      user_last_name: '',  // Ajusta según los datos disponibles
      detalles: [],  // Aquí agregarás los detalles más adelante
      direccion: '',  // Ajusta según los datos disponibles
      ciudad: '',  // Ajusta según los datos disponibles
      codigoPostal: '',  // Ajusta según los datos disponibles
      fecha: new Date(),
      user:userId
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
              id_pedido: '', // Ajusta según la lógica de tu negocio
              fecha_pedido: new Date(),
              estado: 'pagado',
              user_id: userId
            };
  
            this.pedidosService.agregarPedido(pedido).subscribe(
              pedidoResponse => {
                console.log('Pedido registrado con éxito', pedidoResponse);
                alert('Compra realizada con éxito');
                this.clearFormAndCart(); // Llama a la nueva función para limpiar el formulario y el carrito
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
    // Implementa la lógica para obtener el user_id desde el token o el contexto de autenticación
    const token = this.logService.getToken();  // Ejemplo de cómo obtener el token de un servicio
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id;
    }
    return 0; // Devuelve 0 o lanza un error si el user_id no se encuentra
  }

  clearFormAndCart() {
    this.cartService.clearCart(); // Limpia el carrito de compras
    this.cartItems = [];
    this.total = 0;
    this.cardNumber = ''; // Limpiar campos del formulario
    this.expDate = '';
    this.cvv = '';
  }
}

