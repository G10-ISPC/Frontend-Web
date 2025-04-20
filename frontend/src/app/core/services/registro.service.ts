import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { usuario } from '../../shared/interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  apiUrl = 'api/registro/';

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: usuario): Observable<any> {

    return this.http.post<any>(this.apiUrl, usuario);

  }

}