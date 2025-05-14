import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../interfaces/compra';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  
  private misComprasUrl = 'api/mis-compras/';

  constructor(private http: HttpClient) { }

  registrarCompra(compra: Compra): Observable<Compra> {
    
    compra.fecha = new Date(); 

    return this.http.post<Compra>(this.misComprasUrl, compra);
  }

  getCompras(): Observable<Compra[]> {
    const token = localStorage.getItem('access_token');
    return this.http.get<Compra[]>(this.misComprasUrl, {
      headers: {
      'Authorization': `Bearer ${token}`
      }
    });
  }

  getCompra(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.misComprasUrl}${id}/`);
  }

  actualizarCompra(id: number, compra: Compra): Observable<Compra> {
    return this.http.put<Compra>(`${this.misComprasUrl}${id}/`, compra);
  }

  // Método PATCH: actualiza un solo campo como 'estado'
  actualizarCampoCompra(id: number, campos: Partial<Compra>): Observable<Compra> {
    return this.http.patch<Compra>(`${this.misComprasUrl}${id}/`, campos);
  }

  eliminarCompra(id: number): Observable<any> {
    return this.http.delete(`${this.misComprasUrl}${id}/`);
  }
}


