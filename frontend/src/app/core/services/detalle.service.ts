import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Detalle } from '../interfaces/detalle';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetalleService {
  private apiUrl = `${environment.apiUrl}/detalle/`; // ✅ Comillas corregidas

  constructor(private http: HttpClient) { }
 
  getDetalle(): Observable<Detalle[]> {  
    return this.http.get<Detalle[]>(this.apiUrl); // ✅ variable corregida
  }

  actualizarDetalle(id: number, detalle: Detalle): Observable<Detalle> {
    return this.http.put<Detalle>(`${this.apiUrl}${id}/`, detalle); // ✅ variable corregida
  }

  eliminarDetalle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`); // ✅ variable corregida
  }

  agregarDetalle(detalle: Detalle): Observable<Detalle> {
    return this.http.post<Detalle>(this.apiUrl, detalle); // ✅ variable corregida
  }

}


