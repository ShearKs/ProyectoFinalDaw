import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GestorDatosService } from '../contactos/gestor-datos.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-formulario-generico',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule, MatSelectModule, MatNativeDateModule, MatOptionModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButton, CommonModule, MatCardModule],
  templateUrl: './formulario-generico.component.html',
  styleUrl: './formulario-generico.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormularioGenericoComponent implements OnInit {

  //Event emitter para enviar los datos al componente principal
  @Output() eventEmitter = new EventEmitter<any>();

  public formularioDinamico: FormGroup;
  //Datos que obtenemos del componente de la tabla
  public titulo: string = "Formulario Genérico";
  public entity: any = {};
  public esEditable: boolean = false;
  public entidadOject: any[] = [];


  constructor(
    private fb: FormBuilder,
    private readonly _gestorDatos: GestorDatosService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.formularioDinamico = this.fb.group({});
  }

  ngOnInit(): void {

    this.titulo = this.data.datos.titulo || "";
    this.entity = this.data.datos.entidad || {}
    this.esEditable = this.data.datos.editable || false

    console.log('editable los inputs ? ', this.esEditable)

    //Llenamos la clave y le valor 
    this.entidadOject = Object.entries(this.entity).map(([propiedad, valor]) => {
      const propiedadF: string = propiedad.toLowerCase();
      //valor por defecto
      let tipo = 'text';
      if (propiedadF.includes('fecha')) {
        tipo = 'date';
      } else if (propiedadF.includes('contrasena') || propiedadF.includes('contraseña') || propiedadF.includes('contraseña')) {
        tipo = 'password';
      } else if (propiedadF.includes('estado') || propiedadF.includes('rol') || propiedadF.includes('tipo_usuario')) {
        tipo = 'select'
      }


      return { propiedad, valor, tipo };
    })

    //Ejecutamos la función para crear el formulario de forma dinámica
    this.crearFormularioDinamico();
  }

  private crearFormularioDinamico(): void {
    this.entidadOject.forEach(entidad => {

      if (entidad.propiedad.toLowerCase() === 'id' || entidad.propiedad === 'fecha_add') return;

      //Cada uno podrá incluir más validadores aparte de ser required
      const validators = this.getValidadorPorPropiedad(entidad.propiedad);

      const control = this.fb.control(entidad.valor.toLowerCase(), validators);

      if (!this.esEditable) control.disable();

      this.formularioDinamico.addControl(entidad.propiedad,
        control);
    });
  }

  private getValidadorPorPropiedad(propiedad: string) {

    const validators = [Validators.required];

    const propiedadF: string = propiedad.toLowerCase();

    //Condicionantes por si quieren más validadores
    switch (propiedadF) {

      case 'dni':
        validators.push(Validators.pattern(/^\d{8}[A-Z]$/));
        break;
      case 'mail':
      case 'email':
        validators.push(Validators.email);
        break;
      case 'edad':
        validators.push(Validators.min(0), Validators.max(120));
        break;
    }
    return validators;
  }

  public getOptionsForSelect(propiedad: string): string[] {

    const optionsMap: { [key: string]: string[] } = {
      estado: ['activo', 'inactivo'],
      tipo_usuario: ['cliente', 'trabajador']
    };
    return optionsMap[propiedad.toLowerCase()] || [];
  }

  //Para recoger los valores del formulario
  public onSubmit() {
    if (this.formularioDinamico.valid) {
      const formValues = { ...this.formularioDinamico.value };

      // Itera sobre los campos para formatear los que sean de tipo fecha
      Object.keys(formValues).forEach(key => {
        if (formValues[key] instanceof Date) {
          formValues[key] = formValues[key].toISOString().split('T')[0]; // Formato YYYY-MM-DD
        }
      });

      this.eventEmitter.emit(formValues)
    } else {
      console.log("el formulario no es válido...")
    }
  }

}
