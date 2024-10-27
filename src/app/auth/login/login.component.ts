import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ServicioAuthService } from '../servicies/servicio-auth.service';
import { NgIf } from '@angular/common';
import { AutenticationService } from '../servicies/autentication.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { BotonGenericoComponent } from '../../shared/components-shared/boton-generico/boton-generico.component';
import { MatDialog } from '@angular/material/dialog';
import { BasicDialogComponent } from '../../shared/components-shared/basic-dialog/basic-dialog.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, RouterLink, MatError, NgIf, MatIconModule, MatFormField, MatInputModule, BotonGenericoComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Output() loginSuccess = new EventEmitter<void>();

  public loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: ServicioAuthService,
    private aunteService: AutenticationService,
    private readonly _dialog: MatDialog,
    private readonly _router: Router
  ) {
    this.loginForm = this.fb.group({
      usuario: ["", Validators.required],
      contrasena: ['', Validators.required],
    });
  }
  canDeactivate(): boolean {
    // Puedes agregar lógica aquí para preguntar al usuario si realmente quiere salir
    return confirm('¿Estás seguro de que quieres salir sin guardar los cambios?');
  }

  ngOnInit(): void {
    const registroExitoso = localStorage.getItem('registroExitoso');
    if (registroExitoso) {
      const { mensaje, correcto } = JSON.parse(registroExitoso);
      this._dialog.open(BasicDialogComponent, { data: { mensaje, correcto } });
      localStorage.removeItem('registroExitoso');
    }
    const fechaHoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    localStorage.setItem('fechaHoy', fechaHoy);
  }

  public login(usuario: string, contrasena: string) {
    this.aunteService.login(usuario, contrasena).pipe(
      tap((respuesta) => {
        if (respuesta.success) {
          localStorage.setItem('token', respuesta.token!);
          //Insertamos el usuario para utilizar sus datos
          localStorage.setItem('user',respuesta.user)


          this.loginSuccess.emit(); // Emitir evento de éxito

          //Nos vamos al home
          this._router.navigate(['/']);
        } else {
          this._abrirDialogoConfirmacion('Error al iniciar sesión', false); // Mostrar mensaje de error
        }
      }),
      catchError(error => {
        console.error('Error de autenticación:', error);
        this._abrirDialogoConfirmacion('Error al iniciar sesión', false); // Mostrar mensaje de error
        return of(null); // Retornar un observable vacío
      })
    ).subscribe();
  }

  private _abrirDialogoConfirmacion(mensaje: string, correcto: boolean): void {
    this._dialog.open(BasicDialogComponent, {
      data: {
        mensaje: mensaje,
        correcto: correcto,
      }
    });
  }

  public onSubmit() {
    if (this.loginForm.valid) {
      const { usuario, contrasena } = this.loginForm.value;
      this.login(usuario, contrasena);
    } else {
      console.log('Formulario no es válido...');
    }
  }
}
