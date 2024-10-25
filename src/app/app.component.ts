import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./shared/components/menu/menu.component";
import { SpinerCargaComponent } from "./shared/components/spiner-carga/spiner-carga.component";
import { CommonModule } from '@angular/common';
import { LoginComponent } from "./auth/login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, SpinerCargaComponent, CommonModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  public isLoggedIn: boolean = false;

  ngOnInit(): void {
     // Verificar si el token está en localStorage al iniciar la aplicación
     this.isLoggedIn = !!localStorage.getItem('token');
  }


  public autenticado(): void {
    this.isLoggedIn = true;
  }


}
