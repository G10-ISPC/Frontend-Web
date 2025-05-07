import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginResponse } from '../interfaces/request-response';
import { LoginRequest } from '../interfaces/request-response';
import { usuario } from '../interfaces/usuario';
import { Router, RouterLink } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = 'api/login/';
  private readonly TOKEN_KEY = "token";
  private readonly isUserLogin$ = new BehaviorSubject<boolean>(
    Boolean(localStorage.getItem(this.TOKEN_KEY))
  );
  private readonly isAdmin$ = new BehaviorSubject<boolean>(false);
  private readonly PROFILE_URL = 'api/perfilUsuario/';

  private currentUserSubject = new BehaviorSubject<{ first_name: string | null, last_name: string | null }>(
    this.getUserIdFromToken()
  );
  currentUser$ = this.currentUserSubject.asObservable();

  private sessionTimeout: any;

  constructor(private http: HttpClient, private router: Router) {
    this.checkAdminStatus();
  }

  getToken(): string {
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log('Token recuperado:', token); 
    return token ?? '';
  }

  decodeToken(token: string): any {
    const payloadBase64 = token.split('.')[1];
    const payloadString = atob(payloadBase64);
    return JSON.parse(payloadString);
  }

  getUserIdFromToken(): { id: number | null, username: string | null, first_name: string | null, last_name: string | null } {
    const token = this.getToken();
    console.log('Token:', token); 
    if (!token) {
      console.error('Token no encontrado');
      return { id: null, username: null, first_name: null, last_name: null };
    }

    try {
      const payload = this.decodeToken(token);
      console.log('Payload:', JSON.stringify(payload, null, 2));
      
      return {
        id: payload.user_id ?? null,
        username: payload.username ?? null,
        first_name: payload.first_name ?? null, 
        last_name: payload.last_name ?? null
      };
    } catch (e) {
      console.error('Error al parsear el payload del token:', e);
      return { id: null, username: null, first_name: null, last_name: null };
    }
  }

  setUser(user: { first_name: string | null, last_name: string | null }) {
    this.currentUserSubject.next(user);
  }


  checkAdminStatus() {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      console.log('Decoded Token:', decodedToken); 
      this.isAdmin$.next(decodedToken.is_staff);
    }
  }

  get isAdmin(): Observable<boolean> {
    return this.isAdmin$.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
      tap((response: LoginResponse) => {
        const token = response.token;
        if (token) {
          localStorage.setItem(this.TOKEN_KEY, token);
          console.log('Token guardado:', localStorage.getItem(this.TOKEN_KEY));
          this.isUserLogin$.next(true);
  
          const decoded = this.decodeToken(token);
          console.log('Token decodificado en login:', decoded);
          this.isAdmin$.next(decoded.is_staff);
          this.setUser({ first_name: decoded.first_name, last_name: decoded.last_name }); 
          this.startSessionTimeout(); 
        } else {
          throw new Error("Este usuario no existe.");
        }
      }),
      catchError(this.handleError)
    );
  }

  startSessionTimeout(): void {
    this.clearSessionTimeout();
    this.sessionTimeout = setTimeout(() => {
      this.logout();
    }, 3 * 60 * 1000); 
  }

  clearSessionTimeout(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }


  isUserLogin(): Observable<boolean> {
    return this.isUserLogin$.asObservable();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isUserLogin$.next(false);
    this.isAdmin$.next(false);
    this.setUser({ first_name: null, last_name: null });
    this.clearSessionTimeout();
    this.router.navigate(['/login']);

  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error("Se ha producido un error", error.error);
    } else {
      console.error("Backend retornó el código de estado", error.status, error.error);
    }
    return throwError(() => new Error("Email o Contraseña no son válidos"));
  }
  
  getUserProfile(): Observable<usuario> {
    return this.http.get<usuario>(this.PROFILE_URL, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`)
    }).pipe(
      catchError(error => {
        console.error('Get user profile error:', error);
        return throwError(() => error);
      })
    );
  }
  updateUserProfile(data: Partial<usuario>): Observable<usuario> {
    return this.http.put<usuario>(this.PROFILE_URL, data, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`)
    }).pipe(
      catchError(error => {
        console.error('Update user profile error:', error);
        return throwError(() => error);
      })
    );
  }
  
  deleteUserAccount(): Observable<any> {
    return this.http.delete(this.PROFILE_URL, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`)
    }).pipe(
      catchError(error => {
        console.error('Delete user error:', error);
        return throwError(() => error);
      })
    );
  }
  
}
