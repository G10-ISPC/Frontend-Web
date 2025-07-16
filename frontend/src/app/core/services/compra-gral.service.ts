import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../interfaces/compra'; 
import { environment } from '../../../environments/environment'; //se importa environment

@Injectable({
  providedIn: 'root'
})
export class CompraGralService {
  private apiUrl = `${environment.apiUrl}/todas-compras/`;  // Se modifica la api

  constructor(private http: HttpClient) { }

  getCompras(): Observable<Compra[]> {
    const token = localStorage.getItem('access_token');
    return this.http.get<Compra[]>(this.apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
  cambiarEstado(id: number, nuevoEstado: string) {
  const token = localStorage.getItem('access_token') || '';
  return this.http.patch<{ mensaje: string }>(
    `http://localhost:8000/api/compra/${id}/cambiar-estado/`,
    { estado: nuevoEstado },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}
}