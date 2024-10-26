import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router'; // Importa Router
import { CommonModule } from '@angular/common';
import { LoginComponent } from "./auth/login/login.component";
import { MenuComponent } from './shared/components-shared/menu/menu.component';
import { SpinerCargaComponent } from './shared/components-shared/spiner-carga/spiner-carga.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, SpinerCargaComponent, CommonModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public isLoggedIn: boolean = false;

  constructor(private router: Router) {} // Inyectar Router

  ngOnInit(): void {
    this.checkLoginStatus();
    this.router.events.subscribe(() => {
      // Log para verificar el estado de isLoggedIn y la ruta actual
      console.log(`isLoggedIn: ${this.isLoggedIn}, Current Route: ${this.router.url}`);
    });
  }

  public autenticado(): void {
    this.isLoggedIn = true;
  }

  private checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }
}
