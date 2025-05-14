import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LogService } from '../services/log.service';

@Injectable({
  providedIn: 'root'
})
export class IsUserGuard implements CanActivate {

  constructor(private logService: LogService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.logService.isAdmin.pipe(
      map(isAdmin => {
        if (!isAdmin) {
          return true;
        } else {
          this.router.navigate(['/home']);
          alert('Acceso denegado: solo para usuarios comunes');
          return false;
        }
      })
    );
  }
}
