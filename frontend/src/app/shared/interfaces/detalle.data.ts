export interface Detalle {
    id_detalle?: number;
    cantidad: number;
    precio_calculado: number;
    id_producto: string;
    compra?: Compra;
  }
  
  export interface Compra {
    descripcion: string;
    precio_total: number;
    user_id: string;
    detalles: DetallesCompra[];
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    fecha: Date; 
  }
  
  export interface DetallesCompra {
    cantidad: number;
    precio_calculado: number;
    producto_id: string;
    nombre_producto: string;
  }
    

  