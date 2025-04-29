import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../interfaces/pedido'; 

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private url = '/api/pedido/';

  constructor(private http: HttpClient) { }

  agregarPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.url, pedido);
  }
}
