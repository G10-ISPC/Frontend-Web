import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../interfaces/compra';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private apiUrl = `${environment.apiUrl}/mis-compras/`;

  constructor(private http: HttpClient) { }

  registrarCompra(compra: Compra): Observable<Compra> {
    compra.fecha = new Date();
    return this.http.post<Compra>(this.apiUrl, compra);
  }

  getCompras(): Observable<Compra[]> {
    const token = localStorage.getItem('access_token');
    return this.http.get<Compra[]>(this.apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  getCompra(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}${id}/`);
  }

  actualizarCompra(id: number, compra: Compra): Observable<Compra> {
    return this.http.put<Compra>(`${this.apiUrl}${id}/`, compra);
  }

  actualizarCampoCompra(id: number, campos: Partial<Compra>): Observable<Compra> {
    return this.http.patch<Compra>(`${this.apiUrl}${id}/`, campos);
  }

  eliminarCompra(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}


