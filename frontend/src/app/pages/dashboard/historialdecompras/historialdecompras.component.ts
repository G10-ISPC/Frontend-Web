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

@Component({
  selector: 'app-historialdecompras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historialdecompras.component.html',
  styleUrls: ['./historialdecompras.component.css']
})
export class HistorialdecomprasComponent implements OnInit {
[x: string]: any;
  getDetalle: Detalle[] = [];
  getCompra: Compra[] = [];  
  constructor(
    private detalleService: DetalleService,
    private compraService: CompraService,
    
  ) { }

  ngOnInit(): void {
    this.obtenerDetalles();
    this.obtenerCompras(); 
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
      },
      (error) => {
        console.error('Error al obtener las compras:', error);
      }
    );
  }
  
  
}
