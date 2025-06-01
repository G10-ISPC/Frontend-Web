export interface Product {
  id?: string;
  id_producto: string;
  nombre_producto: string;
  descripcion: string;
  precio: number;
  stock: number; 
  visible?: boolean;
  main_imagen: any;
  editingStock?: boolean;
}


