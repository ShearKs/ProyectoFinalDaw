import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PerfilServiciosService } from './perfil-servicios.service';
import { tap } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { sameObject } from '../../functions';
import { Usuario } from '../../auth/interfaces/usuario.interface';

@Component({
  selector: 'app-perfil',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, CommonModule, TitleCasePipe, MatDatepickerModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilComponent implements OnInit {

  public formulario !: FormGroup;
  public usuarioLogged: any = {}
  public modoEdit: boolean = false;

  constructor(
    private readonly _perfilServicio: PerfilServiciosService,
    private readonly __fb: FormBuilder,
    private readonly __apiPerfil: PerfilServiciosService,
  ) { }
  ngOnInit(): void {

    // Inicializar el FormGroup
    this.formulario = this.__fb.group({
      usuario: ['', Validators.required], // Agrega validadores si es necesario
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]], // Validación de correo,
      telefono: ['', Validators.required],
      fecha_nac: ['', Validators.required],
    });

    // Recogemos al usuario que está en localStorage
    this.usuarioLogged = JSON.parse(localStorage.getItem('user') || '{}'); // Asegúrate de parsear correctamente

    // Cargar datos del usuario en el formulario
    this.formulario.patchValue({
      usuario: this.usuarioLogged.nombre_usuario,
      nombre: this.usuarioLogged.nombre,
      apellidos: this.usuarioLogged.apellidos,
      telefono: this.usuarioLogged.telefono,
      correo: this.usuarioLogged.email,
      fecha_nac: this.usuarioLogged.fecha_nac,
    });
    console.log(this.usuarioLogged);
  }


  //función en la que puedes editar el componente...
  public setEditable(): void {
    this.modoEdit = !this.modoEdit
  }

  public onSubmit() {

    //Recogemos todo que tenemos para editar al usuario..
    const nombre = this.formulario.get('nombre')?.value;
    const apellidos = this.formulario.get('apellidos')?.value;
    const email = this.formulario.get('correo')?.value;
    const telefono = this.formulario.get('telefono')?.value;
    const fecha_nac = this.formulario.get('fecha_nac')?.value;

    const usuarioEdit: Usuario = {
      //El  id y el nombre de usuario va a ser siempre el mismo no se va a cambiar...
      id: this.usuarioLogged.id,
      nombre_usuario: this.usuarioLogged.nombre_usuario,
      nombre: this.formulario.get('nombre')?.value,
      apellidos: this.formulario.get('apellidos')?.value,
      email: this.formulario.get('correo')?.value,
      telefono: this.formulario.get('telefono')?.value,
      fecha_nac: this.formulario.get('fecha_nac')?.value,
      tipo_usuario: this.usuarioLogged.tipo_usuario,

    }

    console.log(usuarioEdit)
    console.log(this.usuarioLogged)

    if (!sameObject(this.usuarioLogged, usuarioEdit)) {

      //si hemos cambiado algún dato hacemos la petición para cambiaa los dartos de usuario a 
      this.__apiPerfil.editarUsuario(usuarioEdit).pipe(
        tap((resultEdit => {

          console.log(resultEdit)

        }))
      ).subscribe();

    } else {
      alert('No has cambiado nada...');
    }
  }


}
