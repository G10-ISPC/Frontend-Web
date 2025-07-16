import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../interfaces/pedido'; 
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = `${environment.apiUrl}/pedido/`; 

  constructor(private http: HttpClient) { }

  agregarPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }
}
