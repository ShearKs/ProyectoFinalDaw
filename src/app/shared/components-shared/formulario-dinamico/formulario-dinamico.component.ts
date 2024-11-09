import { Component, EventEmitter, Input, Output, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CampoFormulario } from './interfaces/campos_formulario.interface';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-formulario-dinamico',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatInputModule],
  templateUrl: './formulario-dinamico.component.html',
  styleUrls: ['./formulario-dinamico.component.scss']
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

  // Método para manejar el envío del formulario
  public onSubmit(): void {
    if (this.form.valid) {

      console.log('AAAAAAAAAAAAAAAAAAAAAA')
      console.log(this.form.value)
      console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBB')

      // Emitir los datos del formulario cuando sea válido
      this.eventEmitter.emit(this.form.value);
    } else {
      console.log('Formulario no válido');
    }
  }
}
