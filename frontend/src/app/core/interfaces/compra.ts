import { Detalle } from "./detalle";

export interface Compra {
  id_compra?: number
  descripcion: string;
  precio_total: number;
  user: number;
  user_first_name?: string;
  user_last_name?: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  fecha: Date;
  detalles: Detalle[]; // Detalle y DetallesCompra son lo mismo  
  estado?: string;
  cancelable_hasta:Date;
}
