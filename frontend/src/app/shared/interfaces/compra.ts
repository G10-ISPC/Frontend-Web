export interface Detalle {
    id_detalle?: number;
    cantidad: number;
    precio_calculado: number;
    id_producto: string;
    compra?: Compra;
    nombre_producto: string; // Agregamos esta propiedad

  }
  
export interface Compra {
  descripcion: string;
  precio_total: number;
  user_id?: number;
  //user_name?: string;
  user_first_name?: string; // Agrega esta propiedad
  user_last_name?: string
  detalles: DetallesCompra[];
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  fecha: Date; 
  user?: number;
}


export interface DetallesCompra {
  cantidad: number;
  precio_calculado: number;
  producto_id: string;
  nombre_producto: string;
  id_producto: string; // Agregado para que coincida con Detalle 06/04

}

