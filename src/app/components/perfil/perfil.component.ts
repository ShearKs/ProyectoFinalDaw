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
import { MatTabsModule } from '@angular/material/tabs';
import { DialogoMensajeService } from '../../core/servicies/dialogo.service';
import { ConfirmDialogComponent } from '../../shared/components-shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PanelClienteComponent } from "../../shared/components-shared/panel-cliente/panel-cliente.component";

@Component({
  selector: 'app-perfil',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatTabsModule, PanelClienteComponent, MatCardModule, CommonModule, TitleCasePipe, MatDatepickerModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, PanelClienteComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilComponent implements OnInit {

  public formulario !: FormGroup;
  public usuarioLogged: any = {}
  //para el panel de control
  public clienteId: number = 0;


  public modoEdit: boolean = false;

  constructor(
    private readonly _perfilServicio: PerfilServiciosService,
    private readonly __fb: FormBuilder,
    private readonly __apiPerfil: PerfilServiciosService,
    private readonly _dialog: MatDialog,
    private readonly _dialogMensaje: DialogoMensajeService,

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
    this.usuarioLogged = JSON.parse(localStorage.getItem('user') || '{}');

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

    // console.log('Cliente id', this.usuarioLogged.id)
    this.clienteId = this.usuarioLogged.id_usuario;
  }


  //función en la que puedes editar el componente...
  public setEditable(): void {
    this.modoEdit = !this.modoEdit
  }

  public onSubmit() {
    // Obtenemos los datos del formulario
    const usuarioEdit: Usuario = {
      id: this.usuarioLogged.id,
      nombre_usuario: this.usuarioLogged.nombre_usuario,
      nombre: this.formulario.get('nombre')?.value,
      apellidos: this.formulario.get('apellidos')?.value,
      email: this.formulario.get('correo')?.value,
      telefono: this.formulario.get('telefono')?.value,
      fecha_nac: this.formulario.get('fecha_nac')?.value,
      id_usuario: this.usuarioLogged.id_usuario,
      tipo_usuario: this.usuarioLogged.tipo_usuario,
    };

    if (!sameObject(this.usuarioLogged, usuarioEdit)) {


      const dialog = this._dialog.open(ConfirmDialogComponent, {
        data: {
          titulo: 'Modificación de Perfil',
          contenido: `¿Estás seguro que quieres modificar tu usuaario? `,
          textoConfirmacion: 'Editar',
        }
      });

      dialog.afterClosed().subscribe(result => {

        if (result) {
          this.__apiPerfil.editarUsuario(usuarioEdit).pipe(
            tap(response => {
              if (response.status === "exito") {
                // Actualiza localStorage y la referencia de usuarioLogged
                localStorage.setItem('user', JSON.stringify(usuarioEdit));
                this.usuarioLogged = { ...usuarioEdit };

                // Actualiza el formulario con los datos nuevos
                this.formulario.patchValue({
                  nombre: usuarioEdit.nombre,
                  apellidos: usuarioEdit.apellidos,
                  telefono: usuarioEdit.telefono,
                  correo: usuarioEdit.email,
                  fecha_nac: usuarioEdit.fecha_nac,
                });

                this._dialogMensaje.abrirDialogoConfirmacion('Se ha actualizado el tu usuario con la información que proporcionaste!', true)
              }
            })
          ).subscribe();

        }

      });

    } else {
      alert('No has cambiado nada...');
    }
  }



}
