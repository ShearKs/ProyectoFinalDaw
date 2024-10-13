import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PerfilServiciosService } from './perfil-servicios.service';
import { tap } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {

  public formulario !: FormGroup;
  public usuarioLogged: any = {}

  public nombre !: string;
  public usuario !: string;
  public apellidos !: string;
  public correo !: string;
  public edad !: string;

  constructor(
    private readonly _perfilServicio: PerfilServiciosService,
    private readonly __fb: FormBuilder,
  ) { }
  ngOnInit(): void {

    this._perfilServicio.getUsuario().
      pipe(
        tap((data: any) => {
          this.usuarioLogged = data;


          this.formulario.patchValue({

            usuario: this.usuarioLogged.usuario,
            nombre: this.usuarioLogged.nombre,
            apellidos: this.usuarioLogged.apellidos,
            correo: this.usuarioLogged.correo,
            edad: parseInt(this.usuarioLogged.edad)

          });

          // comentario

          // Asignamos las propiedades individuales
          this.nombre = this.usuarioLogged.nombre;
          this.apellidos = this.usuarioLogged.apellidos;
          this.correo = this.usuarioLogged.correo;
          this.edad = this.usuarioLogged.edad;

          console.log(this.usuarioLogged)
        })
      ).subscribe();

    this.nombre = this.usuarioLogged.nombre;


    this.formulario = this.__fb.group({
      usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', Validators.required],
      edad: ['', Validators.required],
    })
  }

}
