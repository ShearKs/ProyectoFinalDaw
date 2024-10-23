import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BotonGenericoComponent } from "../../shared/components/boton-generico/boton-generico.component";
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ServicioAuthService } from '../servicies/servicio-auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatError, NgIf, MatIconModule, RouterLink, MatFormField, MatInputModule, BotonGenericoComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  public loginForm !: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: ServicioAuthService
  ) {
    this.loginForm = this.fb.group({
      usuario: ["", Validators.required],
      contrasena: ['', Validators.required],
    })
  }

  ngOnInit(): void {

  }


  public onSubmit() {
    //Si no se pone el valid se pasa los validadores por el forro...
    if (this.loginForm.valid) {

      console.log('Usuario: ', this.loginForm.get('usuario')?.value)
      console.log('Contraseña: ', this.loginForm.get('contrasena')?.value)
    }

  }

}
