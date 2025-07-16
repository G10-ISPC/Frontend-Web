import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { usuario } from '../interfaces/usuario';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private apiUrl = `${environment.apiUrl}/registro/`; 

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: usuario): Observable<any> {

    return this.http.post<any>(this.apiUrl, usuario);

  }

}