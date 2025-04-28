import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LogService } from '../services/log.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class isLoggedInGuard implements CanActivate {

  constructor(private logService: LogService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.logService.isUserLogin().pipe(map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        console.log('Bloque else del guardia IsLoggedInGuard ejecutado');
        alert('Acceso no autorizado. Debe iniciar sesión.');
        return false;
      }
    }));
  }
}