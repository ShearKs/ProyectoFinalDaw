import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { ServicioAuthService } from '../servicies/servicio-auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Usuario } from '../interfaces/usuario.interface';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, MatError, MatFormFieldModule, MatIconModule, RouterLink, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  public regisForm !: FormGroup;

  constructor(public authService: ServicioAuthService) {

    this.regisForm = new FormGroup(
      {
        'nombre': new FormControl('', [Validators.required]),
        'apellidos': new FormControl('', [Validators.required]),
        'usuario': new FormControl('', [Validators.required]),
        'correo': new FormControl('', [Validators.required]),
        'contrasena1': new FormControl('', [Validators.required]),
        'contrasena2': new FormControl('', [Validators.required]),
      },
      { validators: this.comprobarContrasenas }
    );
  }
  private comprobarContrasenas(form: AbstractControl) {

    //Recogemos las contraseñas
    const contrasena = form.get('contrasena1')?.value
    const confirmarContrasena = form.get('contrasena2')?.value

    if (contrasena && confirmarContrasena && contrasena !== confirmarContrasena) {

      return { noCoindiden: true }
    }
    return null;
  }


  //Función que se encarga de conectar con la api para insertar el usuario....


  public onSubmit() {
    console.log('hola esto es el registro')



    if (this.regisForm.valid) {

      //Una vez creado hacemo el usuario que le vamos a pasar al php para que lo inserte..
      const nuevoUsuario: Usuario = {
        nombre: this.regisForm.get('nombre')?.value,
        apellidos: this.regisForm.get('apellidos')?.value,
        nombre_usuario: this.regisForm.get('usuario')?.value,
        correo: this.regisForm.get('correo')?.value,
        contrasena: this.regisForm.get('contrasena1')?.value,

      }

      console.log(nuevoUsuario)


    } else {

      console.log('Formulario no es valido...')
    }
  }



}
