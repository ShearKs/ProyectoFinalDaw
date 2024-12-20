import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './shared/components-shared/menu/menu.component';
import { AutenticationService } from './auth/servicies/autentication.service';
import { SpinerCargaComponent } from './shared/components-shared/spiner-carga/spiner-carga.component';
import { fechaToday } from './functions';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, SpinerCargaComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean = false;

  constructor(
    private _router: Router,
    private readonly _authService: AutenticationService,
  ) { }

  ngOnInit(): void {
    this.checkLoginStatus();

    fechaToday();

    // Suscribirse al estado de autenticación
    this._authService.loginStatus$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      console.log('Estado de autenticación:', this.isLoggedIn);
    });
  }

  public autenticado(): void {
    this.isLoggedIn = true;
  }

  public onCerrarSesion(): void {
    this._authService.cerrarSesion();
    this.isLoggedIn = false;
    this._router.navigate(['/login']);
  }

  private checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    console.log('Está autenticado?', this.isLoggedIn);
  }

  public onLoginSuccess() {
    this.isLoggedIn = true;
  }
}
