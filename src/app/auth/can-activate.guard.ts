import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // Verifica si el token está presente en localStorage
    const isLoggedIn = !!localStorage.getItem('token');

    if (isLoggedIn) {
      // Si el usuario está autenticado, redirigir a la página principal (Home)
      this.router.navigate(['/']);
      return false; // Impide el acceso a la ruta
    }
    
    return true; // Permitir el acceso si no está autenticado
  }
}
