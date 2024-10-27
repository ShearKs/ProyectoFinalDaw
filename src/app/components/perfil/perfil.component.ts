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

@Component({
  selector: 'app-perfil',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, MatDatepickerModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
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
    this.usuarioLogged= JSON.parse(localStorage.getItem('user') || '{}'); // Asegúrate de parsear correctamente

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


}
