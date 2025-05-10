import { Detalle } from "./detalle";

export interface Compra {
  descripcion: string;
  precio_total: number;
  user: number;
  user_first_name?: string;
  user_last_name?: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  fecha: Date;
  detalles: Detalle[];   
}


