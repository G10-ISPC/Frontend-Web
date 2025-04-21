
export class Product {
  id?: string; 
  id_producto: string;
  nombre_producto: string;
  descripcion: string;
  precio: number;  
  visible?: boolean;
  main_imagen: any;

  constructor(
    id_producto: string = '',
    nombre_producto: string = '',
    descripcion: string = '',
    precio: number = 0,    
    visible: boolean = true
  ) {
    this.id_producto = id_producto;
    this.nombre_producto = nombre_producto;
    this.descripcion = descripcion;
    this.precio = precio;    
    this.visible = visible;

  }
}
