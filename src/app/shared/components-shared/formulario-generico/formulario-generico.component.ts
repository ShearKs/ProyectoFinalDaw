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




  // @Output() formSubmit = new EventEmitter<any>();
  // formularioDinamico: FormGroup;
  // titulo = 'Formulario Genérico';
  // entidadObject: any[] = [];
  // camposEliminar: any = {};

  // constructor(
  //   private fb: FormBuilder,
  //   private gestorDatosService: GestorDatosService,
  //   @Inject(MAT_DIALOG_DATA) public data: any,
  // ) {
  //   this.formularioDinamico = this.fb.group({});
  // }

  ngOnInit(): void {


    // this.inicializarDatos();
    // const entidadFiltrada = this.filtrarDatosEntidad(this.data.datos.entidad || {});
    // this.entidadObject = this.construirEntidadObject(entidadFiltrada);
    // this.crearFormulario();
    // console.log('Entidades filtradas:', this.entidadObject); 




  }

  // private inicializarDatos(): void {
  //   this.titulo = this.data.datos.titulo || 'Formulario Genérico';
  //   this.camposEliminar = this.data.datos.camposAEliminar || {};
  // }

  // private filtrarDatosEntidad(entidad: any): any {
  //   const camposValidos = ['nombre', 'apellidos', 'direccion', 'fecha', 'numero']; // Cambia estos campos según sea necesario
  //   return Object.keys(entidad)
  //     .filter(key => camposValidos.includes(key))
  //     .reduce((obj, key) => {
  //       obj[key] = entidad[key];
  //       return obj;
  //     }, {});
  // }

  // private construirEntidadObject(entidad: any): any[] {
  //   return Object.entries(entidad).map(([propiedad, valor]) => {
  //     const tipo = this.determinarTipo(propiedad);
  //     return { propiedad, valor, tipo };
  //   });
  // }

  // private determinarTipo(propiedad: string): string {
  //   const propiedadLower = propiedad.toLowerCase();
  //   if (propiedadLower.includes('fecha')) return 'date';
  //   if (propiedadLower.includes('contrasena') || propiedadLower.includes('contraseña')) return 'password';
  //   if (['estado', 'rol', 'tipo_usuario'].includes(propiedadLower)) return 'select';
  //   return 'text';
  // }

  // private crearFormulario(): void {
  //   this.entidadObject.forEach(entidad => {
  //     if (entidad.propiedad.toLowerCase() === 'id' || entidad.propiedad === 'fecha_add') return;
  //     const validators = this.esCampoAEliminar(entidad.propiedad) ? [] : this.getValidadorPorPropiedad(entidad.propiedad);
  //     this.formularioDinamico.addControl(entidad.propiedad, this.fb.control(entidad.valor, validators));
  //   });
  // }

  // private esCampoAEliminar(propiedad: string): boolean {
  //   const tipo = this.determinarTipo(propiedad);
  //   const camposAEliminar = this.camposEliminar[tipo] || [];
  //   return camposAEliminar.includes(propiedad);
  // }

  // private getValidadorPorPropiedad(propiedad: string): Validators[] {
  //   const validators = [Validators.required];
  //   switch (propiedad.toLowerCase()) {
  //     case 'dni':
  //       validators.push(Validators.pattern(/^\d{8}[A-Z]$/));
  //       break;
  //     case 'email':
  //       validators.push(Validators.email);
  //       break;
  //     case 'edad':
  //       validators.push(Validators.min(0), Validators.max(120));
  //       break;
  //   }
  //   return validators;
  // }

  // getOptionsForSelect(propiedad: string): string[] {
  //   const optionsMap: { [key: string]: string[] } = {
  //     estado: ['activo', 'inactivo'],
  //     tipo_usuario: ['cliente', 'trabajador']
  //   };
  //   return optionsMap[propiedad.toLowerCase()] || [];
  // }

  // isCampoVisible(propiedad: string): boolean {
  //   const tipo = this.determinarTipo(propiedad);
  //   return !this.camposEliminar[tipo]?.includes(propiedad);
  // }

  // onSubmit(): void {
  //   if (this.formularioDinamico.valid) {
  //     const formValues = { ...this.formularioDinamico.value, id: this.data.datos.entidad.id };
  //     this.formatarFechas(formValues);
  //     this.formSubmit.emit(formValues);
  //   } else {
  //     this.mostrarErroresFormulario();
  //   }
  // }

  // private formatarFechas(formValues: any): void {
  //   Object.keys(formValues).forEach(key => {
  //     if (formValues[key] instanceof Date) {
  //       formValues[key] = formValues[key].toISOString().split('T')[0];
  //     }
  //   });
  // }

  // private mostrarErroresFormulario(): void {
  //   Object.keys(this.formularioDinamico.controls).forEach(field => {
  //     const control = this.formularioDinamico.get(field);
  //     if (control && control.invalid) {
  //       console.error(`Campo no válido: ${field}`, control.errors);
  //     }
  //   });
  // }
}



