import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductoService } from '../../../core/services/producto.service';
import { Product } from '../../../core/interfaces/producto';

@Component({
  selector: 'app-form-de-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-de-producto.component.html',
  styleUrls: ['./form-de-producto.component.css']
})
export class FormDeProductoComponent implements OnInit {
  form: FormGroup;
  productoEnEdicion: number | null = null;
  showForm: boolean = false;
  editMode: boolean = false;
  selectedFile: File | null = null;
  public products = signal<Product[]>([]);

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductoService
  ) {
    this.form = this.formBuilder.group({
      nombre_producto: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      imagenUrl: ['']
    });
  }

  ngOnInit(): void {
    this.llenarData();
  }

  llenarData(): void {
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
      },
      error => console.error('Error al obtener productos', error)
    );
  }

  onEnviar(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('nombre_producto', this.form.get('nombre_producto')?.value);
      formData.append('descripcion', this.form.get('descripcion')?.value);
      formData.append('precio', this.form.get('precio')?.value);
      if (this.selectedFile) {
        formData.append('main_imagen', this.selectedFile);
      }

      if (this.productoEnEdicion) {
        this.productoService.updateProduct(this.productoEnEdicion, formData).subscribe(() => {
          this.llenarData();
          this.resetFormulario();
        });
      } else {
        this.productoService.createProduct(formData).subscribe(() => {
          this.llenarData();
          this.showForm = false;
          this.resetFormulario();
        });
      }
    }
  }

  borrarData(event: Event, producto: Product): void {
  event.preventDefault();
  const confirmDelete = confirm(`¿Está seguro que desea eliminar el producto "${producto.nombre_producto}"?`);

  if (confirmDelete) {
    this.productoService.deleteData(producto.id_producto).subscribe(() => {
      this.products.update(products => products.filter(p => p.id_producto !== producto.id_producto));
    });
  }
}
 

  // borrarData(event: any, id: string): void {
  //   event.preventDefault();
  //   this.productoService.deleteData(id).subscribe(() => {
  //     this.products.update(products => products.filter(product => product.id_producto !== id));
  //   });
  // }

  editProduct(producto: Product): void {
    this.form.patchValue({
      nombre_producto: producto.nombre_producto,
      descripcion: producto.descripcion,
      precio: producto.precio
    });
    this.productoEnEdicion = Number(producto.id_producto);
    this.showForm = true;
    this.editMode = true;
  }

  toggleVisibility(producto: Product): void {
    producto.visible = !producto.visible;
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
        this.llenarData();
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  resetFormulario(): void {
    this.form.reset();
    this.productoEnEdicion = null;
    this.selectedFile = null;
  }

  showProductForm(): void {
    this.showForm = true;
    this.editMode = false;
  }

  closeForm(): void {
    this.showForm = false;
  }
}
