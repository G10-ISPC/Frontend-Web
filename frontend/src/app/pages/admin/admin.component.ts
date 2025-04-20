import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../shared/interfaces/products.data';
import { ProductoService } from '../../core/services/producto.service';
import { Detalle, Compra } from '../../shared/interfaces/compra';
import { DetalleService } from '../../core/services/detalle.service';
import { CompraGralService } from '../../core/services/compra-gral.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule], 
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {  
  form: FormGroup;
  producto: Product = new Product();
  productoEnEdicion: number | null = null; 
  view: string = '';
  public products = signal<Product[]>([] as Product[]); 
  data: any[] = []; 
  showForm: boolean = false;
  editMode: boolean = false;
  selectedFile: File | null = null;
  getDetalle: Detalle[] = [];
  getCompra: Compra[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private router: Router,
    private detalleService: DetalleService,
    private compraGralService: CompraGralService
  ) {
    
    this.form = this.formBuilder.group({
      nombre_producto: ['', [Validators.required]],
      imagenUrl: [''],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {    
    this.llenarData();
    this.obtenerDetalles();
    this.obtenerTodasLasCompras();
  }

  obtenerDetalles(): void {
    this.detalleService.getDetalle().subscribe(
      (data: Detalle[]) => {
        this.getDetalle = data;
        console.log('Detalles obtenidos:', data);
      },
      (error) => {
        console.error('Error al obtener los detalles:', error);
      }
    );
  }

  obtenerTodasLasCompras(): void {
    this.compraGralService.getCompras().subscribe(
      (data: Compra[]) => {
        this.getCompra = data.map(compra => ({
          ...compra,
          user_first_name: compra.user_first_name || '',
          user_last_name: compra.user_last_name || ''
        }));
        console.log('Compras recibidas del backend:', this.getCompra);
      },
      (error) => {
        console.error('Error al obtener las compras:', error);
      }
    );
  }

  llenarData(): void {
  console.log('✅ Ejecutando llenarData()...');
  this.productoService.getData().subscribe(
    (data: Product[]) => {
      this.products.set(
        data.map(producto => ({
          ...producto,
          main_imagen: producto.main_imagen?.startsWith('http') 
            ? producto.main_imagen 
            : `http://127.0.0.1:8000${producto.main_imagen}`
        }))
      );
      console.log('📦 Productos cargados en el administrador:', this.products());
    },
    error => {
      console.error('❌ Error al obtener los productos:', error);
    }
  );
}

  borrarData(event: any, id: string): void {
    event.preventDefault();
    this.productoService.deleteData(id).subscribe(
      () => {
        console.log('Producto eliminado correctamente');
        this.products.update(products => products.filter(product => product.id_producto !== id));
      },
      error => {
        console.error('Error al eliminar el producto', error);
      }
    );
  }

  onEnviar(event: Event): void {
    event.preventDefault(); 
    console.log('Botón añadir presionado, ejecutando onEnviar...');
  
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('nombre_producto', this.form.get('nombre_producto')?.value);
      formData.append('descripcion', this.form.get('descripcion')?.value);
      formData.append('precio', this.form.get('precio')?.value);
  
      if (this.selectedFile) {
        formData.append('main_imagen', this.selectedFile); 
      }
  
      if (this.productoEnEdicion) {
        console.log(`Actualizando producto con ID ${this.productoEnEdicion}...`);
        this.productoService.updateProduct(this.productoEnEdicion, formData).subscribe(
          response => {
            console.log('Producto actualizado:', response);
            this.llenarData();
            this.resetFormulario();
          },
          error => {
            console.error('Error al actualizar el producto:', error);
          }
        );
      } else {
        console.log('Creando nuevo producto...');
        this.productoService.createProduct(formData).subscribe(
          response => {
            console.log('Producto creado exitosamente:', response);
            this.llenarData();           
            this.showForm = false;
            this.resetFormulario();
          },
          error => {
            console.error('Error al crear el producto:', error);
          }
        );
      }
    } else {
      console.log('Formulario inválido');
    }
  }
 

  showProducts(): void {
    this.view = 'productos';
    this.showForm = false;
  }

  showPurchases(): void {
    this.view = 'compras';
    this.showForm = false;
  }

  editProduct(producto: Product): void {
    this.form.patchValue({
      nombre_producto: producto.nombre_producto,
      descripcion: producto.descripcion,
      precio: producto.precio
      
    });
    this.productoEnEdicion = Number(producto.id_producto); 
    console.log('Producto en edición:', this.productoEnEdicion);    
     this.showForm = true;
     this.editMode = true; 
  }

  resetFormulario(): void {
    this.form.reset();
    this.productoEnEdicion = null;
    this.selectedFile = null;
  }
  
  toggleVisibility(producto: Product): void {
    producto.visible = !producto.visible;
    console.log("Actualizando visibilidad del producto:", producto);
  
    const idProductoNumerico = Number(producto.id_producto);
  
    if (!isNaN(idProductoNumerico)) {
      const formData = new FormData();
      formData.append('visible', String(producto.visible));
      formData.append('nombre_producto', producto.nombre_producto ?? '');
      formData.append('descripcion', producto.descripcion ?? '');
      formData.append('precio', producto.precio?.toString() ?? '');
  
      if (producto.main_imagen && typeof producto.main_imagen !== 'string') {
        formData.append('main_imagen', producto.main_imagen);
      }
  
      this.productoService.updateProduct(idProductoNumerico, formData).subscribe(() => {
        console.log(`✅ Visibilidad actualizada en el backend para el producto ${producto.id_producto}`);
        this.llenarData();
      }, error => {
        console.error('❌ Error al actualizar la visibilidad:', error);
      });
    } else {
      console.error(`❌ Error: id_producto (${producto.id_producto}) no es un número válido.`);
    }
  }
  
  showProductForm() {
    this.showForm = true;
    this.editMode = false; 

  }
  
  hideProductForm() {
    this.showForm = false;
  }

  closeForm(): void {
    this.showForm = false;
  }
  filtroUsuario: string = '';
filtroFecha: string = '';
filtroProducto: string = '';
comprasFiltradas: Compra[] = [];

filtrarCompras() {
  this.comprasFiltradas = this.getCompra.filter(compra => {
    return (
      (!this.filtroUsuario || (compra.user_first_name?.toLowerCase().includes(this.filtroUsuario.toLowerCase()) || compra.user_last_name?.toLowerCase().includes(this.filtroUsuario.toLowerCase()))) &&
      (!this.filtroFecha || new Date(compra.fecha).toISOString().split('T')[0] === this.filtroFecha) &&
      (!this.filtroProducto || compra.detalles.some(detalle => detalle.nombre_producto?.toLowerCase().includes(this.filtroProducto.toLowerCase())))
    );
  });
}

cumpleFiltro(compra: Compra, detalle: Detalle): boolean { 
  return (
    (!this.filtroUsuario || (
      (compra.user_first_name ?? '').toLowerCase().includes(this.filtroUsuario.toLowerCase()) || 
      (compra.user_last_name ?? '').toLowerCase().includes(this.filtroUsuario.toLowerCase())
    )) &&
    (!this.filtroFecha || new Date(compra.fecha ?? '').toISOString().split('T')[0] === this.filtroFecha) &&
    (!this.filtroProducto || (
      (detalle.nombre_producto ?? '').toLowerCase().includes((this.filtroProducto ?? '').toLowerCase())
    ))
  );
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
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
  }
}

onSubmit(): void {
  const formData = new FormData();
  formData.append('nombre', this.form.get('nombre')?.value);
  formData.append('descripcion', this.form.get('descripcion')?.value);
  formData.append('precio', this.form.get('precio')?.value);

  if (this.selectedFile) {
    formData.append('main_imagen', this.selectedFile); 
  }

  this.productoService.createProduct(formData).subscribe(
    response => console.log('Producto creado', response),
    error => console.error('Error', error)
  );
}
}