import { NgComponentOutlet } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DecimalFormatPipe } from '../../../core/pipes/decimal-format.pipe';
import { DetalleService } from '../../../core/services/detalle.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Detalle } from '../../../core/interfaces/detalle';
import { Compra } from '../../../core/interfaces/compra';
import { CompraService } from '../../../core/services/compra.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CancelarPedidoResponse } from '../../../core/interfaces/cancelaPedidoResponse';

@Component({
  selector: 'app-historialdecompras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historialdecompras.component.html',
  styleUrls: ['./historialdecompras.component.css']
})
export class HistorialdecomprasComponent implements OnInit {
  temporizadores: { [id: number]: string } = {};
[x: string]: any;
  getDetalle: Detalle[] = [];
  getCompra: Compra[] = [];  
  private intervalosActivos: { [id: number]: any } = {};

  

  constructor(
    private detalleService: DetalleService,
    private compraService: CompraService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.obtenerDetalles();
    this.obtenerCompras(); 
    this.iniciarTemporizadores();  // Inicia el temporizador
    // Llama al backend cada 30 segundos para actualizar los estados
  setInterval(() => {
    this.obtenerCompras();
  }, 30000);
    
  }

  obtenerDetalles(): void {
    this.detalleService.getDetalle().subscribe(
      (data: Detalle[]) => {  
        this.getDetalle = data;
      },
      (error) => {
        console.error('Error al obtener los detalles:', error);
      }
    );
  }

  obtenerCompras(): void {
    this.compraService.getCompras().subscribe(  
      (data: Compra[]) => {
        this.getCompra = data;
        this.iniciarTemporizadores();
      },
      (error) => {
        console.error('Error al obtener las compras:', error);
      }
    );
  }

  mostrarBotonCancelar(compra: Compra): boolean {
    if (!compra.cancelable_hasta || !compra.estado) return false;
  
    const cancelableHasta = new Date(compra.cancelable_hasta).getTime();
    const ahora = new Date().getTime();
    //console.log(`🕓 Ahora (timestamp): ${ahora}`);
    //console.log(`🕙 Cancelable hasta (timestamp): ${cancelableHasta}`);

    //console.log('🟡 Estado recibido:', compra.estado);

    return compra.estado === "pendiente" && ahora < cancelableHasta;
  }
  

  cancelarPedido(id: number): void {
    this.http.post<CancelarPedidoResponse>(`http://localhost:8000/api/cancelar-compra/${id}/`, {})
.subscribe(
      (response) => {
        if (response.mensaje) {
          console.log("✅", response.mensaje);
          this.obtenerCompras(); // Recargar la lista
        } else if (response.error) {
          console.warn("⚠️", response.error);
        }
      },
      (error) => {
        console.error("❌ Error en la solicitud HTTP", error);
      }
    );
  }

  iniciarTemporizadores(): void {
    // Primero cancela todos los temporizadores activos previos
    Object.values(this.intervalosActivos).forEach(clearInterval);
    this.temporizadores = {};
    this.intervalosActivos = {};
  
    this.getCompra.forEach(compra => {
      console.log(`🧾 Compra ID ${compra.id_compra}`);
      console.log(`Estado: ${compra.estado}`);
      console.log(`Cancelable hasta: ${compra.cancelable_hasta}`);
      console.log(`¿Mostrar botón?: ${this.mostrarBotonCancelar(compra)}`);

      if (compra.cancelable_hasta && this.mostrarBotonCancelar(compra)) {
        const id = compra.id_compra!;
        const intervalo = setInterval(() => {
          const tiempoRestante = new Date(compra.cancelable_hasta).getTime() - new Date().getTime();
          if (tiempoRestante <= 0) {
            this.temporizadores[id] = 'Tiempo agotado';
            clearInterval(this.intervalosActivos[id]);
            
            // Actualizar el estado a "En preparación" cuando se acabe el tiempo
            this.actualizarEstadoCompra(id, 'preparacion');
          } else {
            const minutos = Math.floor(tiempoRestante / 60000);
            const segundos = Math.floor((tiempoRestante % 60000) / 1000);
            this.temporizadores[id] = `${minutos}:${segundos.toString().padStart(1, '0')} restantes`;
          }
        }, 1000);
        this.intervalosActivos[id] = intervalo;
      }
    });
  }

actualizarEstadoCompra(id: number, nuevoEstado: string): void {
  // Creas un objeto parcialmente con solo el campo `estado`
  const compraActualizada: Partial<Compra> = {
    estado: nuevoEstado
  };

  // Llamas al servicio de actualización, pasando el objeto parcial
  this.compraService.actualizarCompra(id, compraActualizada as Compra).subscribe(
    (response) => {
      console.log(`✅ Estado actualizado a ${nuevoEstado} para la compra ${id}`);
      // Actualizar el estado directamente en el arreglo `getCompra`
      const compraIndex = this.getCompra.findIndex(compra => compra.id_compra === id);
      if (compraIndex !== -1) {
        this.getCompra[compraIndex].estado = nuevoEstado;
      }
    },
    (error) => {
      console.error("❌ Error al actualizar el estado de la compra:", error);
    }
  );
}


  generarDescripcionCompra(detalles: Detalle[]): string {
    const conteo: { [nombre: string]: number } = {};
    detalles.forEach(detalle => {
      if (detalle.nombre_producto) {
        conteo[detalle.nombre_producto] = (conteo[detalle.nombre_producto] || 0) + detalle.cantidad;
      }
    });
  
    return Object.entries(conteo)
      .map(([nombre, cantidad]) => `${cantidad} ${nombre}`)
      .join(', ');
  }
  
  obtenerCantidadTotal(detalles: Detalle[]): number {
    return detalles.reduce((total, d) => total + d.cantidad, 0);
  }
  
  traducirEstado(estado?: string): string {
  switch (estado) {
    case 'pendiente':
      return 'Pedido aún no preparado';
    case 'preparacion':
      return 'En preparación';
    case 'cancelado':
      return 'Cancelado';
    default:
      return 'Estado desconocido';
  }
}

   
}
