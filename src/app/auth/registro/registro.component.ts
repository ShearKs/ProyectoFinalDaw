import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ServicioAuthService } from '../servicies/servicio-auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Usuario } from '../interfaces/usuario.interface';
import { AutenticationService } from '../servicies/autentication.service';
import { tap } from 'rxjs';
import { BasicDialogComponent } from '../../shared/components-shared/basic-dialog/basic-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [MatDatepickerModule,
    MatNativeDateModule, CommonModule, MatDialogModule, MatError, MatFormFieldModule, MatIconModule, RouterLink, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent implements OnInit {

  public regisForm !: FormGroup;

  constructor(
    private dialog: MatDialog,
    public authService: ServicioAuthService,
    private readonly _authApi: AutenticationService,
    private readonly _router: Router,
    private fb: FormBuilder,
  ) { }


  ngOnInit(): void {


    this.regisForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],  // Fecha de nacimiento
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      usuario: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena1: ['', Validators.required],
      contrasena2: ['', Validators.required]
    }, { validator: this.comprobarContrasenas });
  }

  private comprobarContrasenas(formGroup: FormGroup) {

    //Recogemos las contraseñas
    const contrasena = formGroup.get('contrasena1')?.value
    const confirmarContrasena = formGroup.get('contrasena2')?.value

    if (contrasena && confirmarContrasena && contrasena !== confirmarContrasena) {

      return { noCoindiden: true }
    }
    return null;
  }


  //Función que se encarga de conectar con la api para insertar el usuario....
  private crearUsuario(usuario: Usuario) {

    this._authApi.crearUsuario(usuario)
      .pipe(
        tap((resultado => {
          if (resultado.status === 'exito') {
            localStorage.setItem('registroExitoso', JSON.stringify({ mensaje: 'Te has registrado correctamente!', correcto: true }));
            this._router.navigate(['/login']);
          } else {
            localStorage.setItem('registroExitoso', JSON.stringify({ mensaje: 'Ha habido un error al intentar registrarte!', correcto: false }));

          }

        }))
      ).subscribe();
  }

  public onSubmit() {

    if (this.regisForm.valid) {

      //Una vez creado hacemo el usuario que le vamos a pasar al php para que lo inserte..
      const nuevoUsuario: Usuario = {
        nombre_usuario: this.regisForm.get('usuario')?.value,
        nombre: this.regisForm.get('nombre')?.value,
        apellidos: this.regisForm.get('apellidos')?.value,
        telefono: parseInt(this.regisForm.get('telefono')?.value),
        email: this.regisForm.get('correo')?.value,
        contrasena: this.regisForm.get('contrasena1')?.value,
        fecha_add: new Date().toISOString(),
        fecha_nac: this.regisForm.get('fechaNacimiento')?.value

      }

      this.crearUsuario(nuevoUsuario);

    } else {

      console.log('Formulario no es valido...')
    }
  }

}
