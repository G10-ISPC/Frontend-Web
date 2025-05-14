import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Compra } from '../../../core/interfaces/compra';
import { Detalle } from '../../../core/interfaces/detalle';
import { DetalleService } from '../../../core/services/detalle.service';
import { CompraGralService } from '../../../core/services/compra-gral.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-lista-de-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-de-compras.component.html',
  styleUrls: ['./lista-de-compras.component.css']
})
export class ListaDeComprasComponent implements OnInit {
  getCompra: Compra[] = [];
  comprasFiltradas: Compra[] = [];
  filtroUsuario: string = '';
  filtroFecha: string = '';
  filtroProducto: string = '';

  constructor(
    private detalleService: DetalleService,
    private compraGralService: CompraGralService
  ) {}

  ngOnInit(): void {
    this.obtenerTodasLasCompras();
  }

  obtenerTodasLasCompras(): void {
    this.compraGralService.getCompras().subscribe(
      (data: Compra[]) => {
        this.getCompra = data.map(compra => ({
          ...compra,
          user_first_name: compra.user_first_name || '',
          user_last_name: compra.user_last_name || ''
        }));
      },
      error => console.error('Error al obtener compras', error)
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

  filtrarCompras() {
    const filtroProducto = this.filtroProducto.toLowerCase();
    const filtroUsuario = this.filtroUsuario.toLowerCase();
    const filtroFecha = this.filtroFecha;

    this.comprasFiltradas = this.getCompra.filter(compra => {
      // Genera la descripción de la compra con productos
      const descripcion = this.generarDescripcionCompra(compra.detalles).toLowerCase();
      
      // Filtra por producto, usuario y fecha
      const coincideConProducto = descripcion.includes(filtroProducto);
      const coincideConUsuario = compra.user_first_name?.toLowerCase().includes(filtroUsuario) || 
                                 compra.user_last_name?.toLowerCase().includes(filtroUsuario);
      const coincideConFecha = filtroFecha ? new Date(compra.fecha).toISOString().split('T')[0] === filtroFecha : true;


      // Retorna true si cumple con todos los filtros
      return coincideConProducto && coincideConUsuario && coincideConFecha;
    });

  }

  limpiarFiltros(): void {
    this.filtroUsuario = '';
    this.filtroProducto = '';
    this.filtroFecha = '';
    this.filtrarCompras();
  }

  exportarExcel(): void {
    this.filtrarCompras();
    const datosAExportar = this.comprasFiltradas.length > 0 ? this.comprasFiltradas : this.getCompra;

    const datos = datosAExportar.map(compra => ({
      Usuario: `${compra.user_first_name ?? ''} ${compra.user_last_name ?? ''}`,
      Producto: compra.detalles.map(detalle => detalle.nombre_producto).join(', '),
      Cantidad: compra.detalles.map(detalle => detalle.cantidad).join(', '),
      Fecha: new Date(compra.fecha).toISOString().split('T')[0],
      Precio: compra.detalles.map(detalle => detalle.precio_calculado).join(', ')
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Compras');

    XLSX.writeFile(libro, 'compras_filtradas.xlsx');
  }
}
