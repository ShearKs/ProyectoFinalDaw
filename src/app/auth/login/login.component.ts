import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BotonGenericoComponent } from "../../shared/components/boton-generico/boton-generico.component";
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ServicioAuthService } from '../servicies/servicio-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatIconModule, RouterLink, MatFormField, MatInputModule, BotonGenericoComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  public loginForm !: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: ServicioAuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: [''],
      contrasena: ['']
    });
  }
  public onSubmit() {
    console.log('Usuario: ', this.loginForm.get('usuario')?.value)
    console.log('Contraseña: ', this.loginForm.get('contrasena')?.value)
  }

}
