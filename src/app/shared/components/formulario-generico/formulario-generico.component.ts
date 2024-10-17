import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GestorDatosService } from '../contactos/gestor-datos.service';

@Component({
  selector: 'app-formulario-generico',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButton, CommonModule, MatCardModule],
  templateUrl: './formulario-generico.component.html',
  styleUrl: './formulario-generico.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormularioGenericoComponent implements OnInit {

  public formularioDinamico: FormGroup;
  public listaInputs: string[] = ['id', 'Nombre', 'Fecha', 'Estado', 'Rol'];

  //Datos que obtenemos del componente de la tabla
  public cabecera : string [] = [];
  public entity : any = {};
  public esEditable : boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private readonly _gestorDatos: GestorDatosService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.formularioDinamico = this.fb.group({});
  }

  ngOnInit(): void {

    //Cargamos todos los datos
    this.cabecera = this.data.data.cabecera
    this.entity = this.data.data.entidad
    this.esEditable = this.data.data.editable

    console.log("Cabecera")
    console.log(this.cabecera)
    console.log("Editable?:  ",this.esEditable)
    console.log("Datos")
    console.log(this.entity)

    console.log(this.data)

    //Ejecutamos la función para crear el formulario de forma dinámica
    this.crearFormularioDinamico();
  }

  private crearFormularioDinamico(): void {

    this.listaInputs.forEach(input => {

      this.formularioDinamico.addControl(input, this.fb.control('', Validators.required));
    });

  }







}
