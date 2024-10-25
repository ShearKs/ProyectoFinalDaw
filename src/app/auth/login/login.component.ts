import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BotonGenericoComponent } from "../../shared/components/boton-generico/boton-generico.component";
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ServicioAuthService } from '../servicies/servicio-auth.service';
import { NgIf } from '@angular/common';
import { AutenticationService } from '../servicies/autentication.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatError, NgIf, MatIconModule, RouterLink, MatFormField, MatInputModule, BotonGenericoComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  @Output() loginSuccess = new EventEmitter<void>();

  public loginForm !: FormGroup;

  public usuario: string = "";
  public contrasena: string = "";

  constructor(
    private fb: FormBuilder,
    //Este es solo para mostrar la contrase...
    public authService: ServicioAuthService,
    private aunteService: AutenticationService,

  ) {
    this.loginForm = this.fb.group({
      usuario: ["", Validators.required],
      contrasena: ['', Validators.required],
    })
  }

  ngOnInit(): void {

  }

  public login(usuario: string, contrasena: string) {

    this.aunteService.login(usuario, contrasena).pipe(
      tap((respuesta => {
        if (respuesta.success) {
          localStorage.setItem('token', respuesta.token!);
          this.loginSuccess.emit();
          console.log('holiii')
        } else {
          console.log('no ha sido posible niñiu');
        }
      }))
    ).subscribe();

  }

  public onSubmit() {
    //Si no se pone el valid se pasa los validadores por el forro...
    if (this.loginForm.valid) {

      console.log('Usuario: ', this.loginForm.get('usuario')?.value)
      console.log('Contraseña: ', this.loginForm.get('contrasena')?.value)

      this.usuario = this.loginForm.get('usuario')?.value;
      this.contrasena = this.loginForm.get('contrasena')?.value;

      this.login(this.usuario, this.contrasena);
    }

  }

}
