import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Compra } from '../../../core/interfaces/compra';
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

  constructor(private compraGralService: CompraGralService) {}

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

  filtrarCompras(): void {
    this.comprasFiltradas = this.getCompra.filter(compra => {
      const usuarioCoincide =
        !this.filtroUsuario ||
        (compra.user_first_name?.toLowerCase().includes(this.filtroUsuario.toLowerCase()) ||
         compra.user_last_name?.toLowerCase().includes(this.filtroUsuario.toLowerCase()));

      const fechaCoincide =
        !this.filtroFecha ||
        new Date(compra.fecha).toISOString().split('T')[0] === this.filtroFecha;

      const productoCoincide =
        !this.filtroProducto ||
        (compra.descripcion?.toLowerCase().includes(this.filtroProducto.toLowerCase()));

      return usuarioCoincide && fechaCoincide && productoCoincide;
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
      Usuario: `${compra.user_first_name ?? ''} ${compra.user_last_name ?? ''}`.trim(),
      Productos: compra.descripcion || 'Sin descripción',
      Fecha: compra.fecha ? new Date(compra.fecha).toISOString().split('T')[0] : '',
      Precio: compra.precio_total
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Compras');

    XLSX.writeFile(libro, 'compras_filtradas.xlsx');
  }

  cambiarEstado(compra: Compra): void {
    if (!compra.id_compra || !compra.estado) {
      alert('Faltan datos para actualizar el estado.');
      return;
    }

    this.compraGralService.cambiarEstado(compra.id_compra, compra.estado).subscribe({
      next: () => {
        this.obtenerTodasLasCompras();
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
        alert('Hubo un error al actualizar el estado.');
      }
    });
  }

  guardarNuevoEstado(compra: Compra): void {
    if (!compra.id_compra || !compra.nuevoEstado) {
      alert('Debe seleccionar un nuevo estado antes de guardar.');
      return;
    }

    this.compraGralService.cambiarEstado(compra.id_compra, compra.nuevoEstado).subscribe({
      next: () => {
        alert('Estado actualizado con éxito ✅');
        this.obtenerTodasLasCompras();
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        alert('❌ Hubo un error al actualizar el estado.');
      }
    });
  }
}
