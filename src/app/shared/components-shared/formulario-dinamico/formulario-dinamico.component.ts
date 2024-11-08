import { Component, EventEmitter, Input, Output, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  //Campos sobre lo que vamos a construir el formulario dinámico
  public campos: CampoFormulario[] = [];
  //titulo del formulario
  public tituloformulario: string = "FORMULARIO SIN TITULO";
  @Input() datos: any;
  @Output() eventEmitter = new EventEmitter<any>();

  public form !: FormGroup;

  constructor(

    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    this.form = this._fb.group({});
  }

  ngOnInit() {
    this.tituloformulario = this.data.datos.titulo;
    this.campos = this.data.datos.campos;


    // Llamar al método para crear el formulario cuando el componente se inicialice
    this.crearFormulario();

    console.log('---- Datos recibidos ----')
    console.log(this.campos)
  }

  public crearFormulario() {
    // Asegurarse de que los campos se reciban correctamente
    console.log('Campos recibidos:', this.campos);

    this.campos.forEach(campo => {
      let control = this._fb.control(campo.valorInicial || '');

      // Si el campo es obligatorio, agregar la validación
      if (campo.requerido) {
        control.setValidators(Validators.required);
      }

      // Validaciones específicas según el tipo de campo
      if (campo.tipo === 'number') {
        control.setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
      }

      if (campo.tipo === 'date') {
        control.setValidators([Validators.required]);
      }

      // Agregar el control al formulario
      this.form.addControl(campo.nombre, control);
    });
  }

  public onSubmit() {
    if (this.form.valid) {
      this.eventEmitter.emit(this.form.value);
    }
  }
}
