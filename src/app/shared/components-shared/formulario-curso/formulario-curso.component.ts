import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-formulario-curso',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButton,
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './formulario-curso.component.html',
  styleUrls: ['./formulario-curso.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioCursoComponent implements OnInit, AfterViewInit {
  @Output() eventEmitter = new EventEmitter<any>();
  formularioDinamico: FormGroup;
  titulo: string;
  camposEliminar: any = {};
  deportes: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {
    this.formularioDinamico = this.fb.group({});
    this.titulo = this.data.datos.titulo || 'Formulario Genérico';
    this.camposEliminar = this.data.datos.camposAEliminar || {};
    this.deportes = this.data.datos.entidad.deporte.data; // Datos de deportes recibidos desde el componente padre
  }

  ngOnInit(): void {
    this.crearFormulario();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  private crearFormulario(): void {
    const entidad = this.data.datos.entidad;
    for (const propiedad in entidad) {
      if (this.esCampoVisible(propiedad)) {
        const validators = this.getValidadorPorPropiedad(propiedad);
        this.formularioDinamico.addControl(propiedad, this.fb.control(entidad[propiedad], validators));
      }
    }
  }

  private esCampoVisible(propiedad: string): boolean {
    const tipo = this.determinarTipo(propiedad);
    return !this.camposEliminar[tipo]?.includes(propiedad);
  }

  public determinarTipo(propiedad: string): string {
    if (['fecha', 'date'].some(term => propiedad.toLowerCase().includes(term))) return 'date';
    if (propiedad.toLowerCase() === 'contrasena' || propiedad.toLowerCase() === 'contraseña') return 'password';
    if (propiedad.toLowerCase() === 'deporte') return 'select'; // Se asegura que 'deporte' es un select
    return 'text';
  }

  private getValidadorPorPropiedad(propiedad: string): ValidatorFn[] | null {
    const validators: ValidatorFn[] = [];
    switch (propiedad.toLowerCase()) {
      case 'nombre':
        validators.push(Validators.required);
        break;
      // Añadir validaciones para otros campos según sea necesario
    }
    return validators.length > 0 ? validators : null;
  }

  getOptionsForSelect(propiedad: string): string[] {
    if (propiedad.toLowerCase() === 'deporte') {
      return Object.values(this.deportes); // Devuelve la lista de nombres de deportes
    }
    return [];
  }

  onSubmit(): void {
    if (this.formularioDinamico.valid) {
      const formValues = { ...this.formularioDinamico.value };
      this.eventEmitter.emit(formValues);
    } else {
      this.mostrarErroresFormulario();
    }
  }

  private mostrarErroresFormulario(): void {
    Object.keys(this.formularioDinamico.controls).forEach(field => {
      const control = this.formularioDinamico.get(field);
      if (control && control.invalid) {
        console.error(`Campo no válido: ${field}`, control.errors);
      }
    });
  }
}
