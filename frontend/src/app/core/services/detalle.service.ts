import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Detalle } from '../../shared/interfaces/compra';

@Injectable({
  providedIn: 'root'
})
export class DetalleService {
  private Url = '/api/detalle/';

  constructor(private http: HttpClient) { }
 
  getDetalle(): Observable<Detalle[]> {  
    return this.http.get<Detalle[]>(this.Url);
  }

  actualizarDetalle(id: number, detalle: Detalle): Observable<Detalle> {
    return this.http.put<Detalle>(`${this.Url}${id}/`, detalle);
  }

  eliminarDetalle(id: number): Observable<any> {
    return this.http.delete(`${this.Url}${id}/`);
  }

  agregarDetalle(detalle: Detalle): Observable<Detalle> {
    return this.http.post<Detalle>(this.Url, detalle);
  }

}


