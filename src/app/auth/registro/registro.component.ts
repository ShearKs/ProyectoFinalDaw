import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { ServicioAuthService } from '../servicies/servicio-auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [MatFormFieldModule,MatIconModule,RouterLink,MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  public regisForm !: FormGroup;

  constructor(public authService: ServicioAuthService) {

    this.regisForm = new FormGroup({
      'nombre': new FormControl('', [Validators.required]),
      'apellidos': new FormControl('', [Validators.required]),
      'usuario': new FormControl('', [Validators.required]),
      'correo': new FormControl('', [Validators.required]),
      'contrasena1': new FormControl('', [Validators.required]),
      'contrasena2': new FormControl('', [Validators.required]),
    })
  }


  public onSubmit() {
    console.log('hola esto es el registro')

    const nombre = this.regisForm.get('nombre')?.value
    const apellidos = this.regisForm.get('apellidos')?.value
    const usuario = this.regisForm.get('usuario')?.value
    const correo = this.regisForm.get('correo')?.value
    const contrasena = this.regisForm.get('contrasena1')?.value

    console.log(nombre)
    console.log(apellidos)
    console.log(usuario)
    console.log(correo)
    console.log(contrasena)
  }


  private compronbarContrasenas() {

    let coinciden: boolean = false;

    //Recogemos las contraseñas
    const contrasena = this.regisForm.get('contrasena1')?.value
    const confirmarContrasena = this.regisForm.get('contrasena2')?.value

    //Si las contraseñas coinciden
    if (contrasena === confirmarContrasena) {
      coinciden = true;
    }

    return coinciden;
  }



}
