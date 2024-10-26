import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isLoggedIn = !!localStorage.getItem('token');

    // Permitir acceso a login y registro si no está autenticado
    if (!isLoggedIn && (route.routeConfig?.path === 'login' || route.routeConfig?.path === 'registro')) {
      return true; // Acceso permitido
    }

    // Permitir acceso a otras rutas solo si está autenticado
    if (isLoggedIn) {
      return true; // Acceso permitido
    }

    // Si no está autenticado y no está en login o registro, redirigir al login
    this.router.navigate(['/login']);
    return false;
  }
}
