import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../interfaces/compra'; 
@Injectable({
  providedIn: 'root'
})
export class CompraGralService {
  private apiUrl = 'api/todas-compras/';  

  constructor(private http: HttpClient) { }

  getCompras(): Observable<Compra[]> {
    const token = localStorage.getItem('access_token');
    return this.http.get<Compra[]>(this.apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}