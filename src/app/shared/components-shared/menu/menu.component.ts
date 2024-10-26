import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet, Event } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';
import { AutenticationService } from '../../../auth/servicies/autentication.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, CommonModule, RouterLink, RouterModule, MatButtonModule, MatMenuModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  //Para poder informar al app.component que se ha cerrado sesión...
  @Output() cerrarSesionEvent = new EventEmitter<void>();

  //Almacena la ruta actual para determinar que elemento del menú está activo.
  public rutaActual: string = "";

  constructor(
    private readonly _router: Router,
    private readonly _authService: AutenticationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    //Escucha los cambios en las rutas de navegación
    // 'NavigationEnd' indica que la navegación ha termiando y se puede actualizar la ruta
    this._router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Actualiza la ruta actual con la nueva URL después de la redirreción 
      this.rutaActual = event.urlAfterRedirects;
    });
  }

  public isActiveRoute(route: string): boolean {
    // Si la ruta es '/', solo marcar cuando la ruta es exactamente '/'
    if (route === '/') {
      return this.rutaActual === route;
    }
    // Para las otras rutas, marcar si la ruta actual empieza por el segmento
    return this.rutaActual.startsWith(route) && route !== '/';
  }


  //Método para cerrar sesión
  public onCerrarSesion(): void {

    this._authService.cerrarSesion();

    //Nos redirigimos al login de la aplicación
    this._router.navigate(['/login']);
  }





}
