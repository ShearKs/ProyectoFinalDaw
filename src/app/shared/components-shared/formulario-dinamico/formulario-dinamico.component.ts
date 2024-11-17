import { Component, EventEmitter, Input, Output, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CampoFormulario } from './interfaces/campos_formulario.interface';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-formulario-dinamico',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule,MatDatepickerModule, MatSelectModule,MatIconModule, MatInputModule,NgxMatTimepickerModule,FormsModule,ReactiveFormsModule],
  templateUrl: './formulario-dinamico.component.html',
  styleUrls: ['./formulario-dinamico.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioDinamicoComponent implements OnInit {

  public campos: CampoFormulario[] = [];
  public tituloformulario: string = "FORMULARIO SIN TITULO";
  public esEditable :boolean = false;
  public esNuevoEvento: boolean = false;

  @Input() datos: any;
  @Output() eventEmitter = new EventEmitter<any>();

  public form!: FormGroup;

  constructor(
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    // Establecer el título y los campos del formulario
    this.tituloformulario = this.data.datos.titulo;
    this.campos = this.data.datos.campos;
    this.esEditable = this.data.datos.editable;
    this.esNuevoEvento = this.data.datos.esNuevoEvento;  // Determinamos si es un nuevo evento

    console.log("Campos")
    console.log(this.campos)

    // Llamar al método para crear el formulario
    this.crearFormulario();
  }

  // Método para crear el formulario dinámico
  public crearFormulario(): void {


    // Si es un nuevo evento, reiniciamos el formulario con valores vacíos
    if (this.esNuevoEvento) {
      this.resetFormulario();
    } else {
      // Si no es un nuevo evento (modo edición), rellenamos el formulario con los datos pasados
      this.crearFormularioConDatos();
    }
  }

  // Método para crear el formulario con los datos (modo edición)
  public crearFormularioConDatos(): void {
    const formulario: { [key: string]: FormControl } = {};

    // Crear FormControl para cada campo con los valores pasados en los datos
    this.campos.forEach(campo => {
      formulario[campo.nombre] = new FormControl(
        this.data.datos[campo.nombre] || campo.valorInicial,  // Si hay datos pasados, los usamos, si no, usamos los valores iniciales
        campo.requerido ? Validators.required : []
      );
    });

    this.form = this._fb.group(formulario);
  }

  // Método para reiniciar el formulario con valores vacíos (para nuevo evento)
  public resetFormulario(): void {
    const formulario: { [key: string]: FormControl } = {};

    // Crear FormControl para cada campo, asegurándonos de que esté vacío
    this.campos.forEach(campo => {
      formulario[campo.nombre] = new FormControl('', campo.requerido ? Validators.required : []);
    });

    this.form = this._fb.group(formulario);
  }

  public typeOf(valor: any) :string{
    return typeof valor;
  }

  // Método para manejar el envío del formulario
  public onSubmit(): void {
    if (this.form.valid) {


      // Emitir los datos del formulario cuando sea válido
      this.eventEmitter.emit(this.form.value);
    } else {
      console.log('Formulario no válido');
    }
  }
}
