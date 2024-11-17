import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-formulario-curso',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, CommonModule, MatOptionModule, MatSelectModule,MatDatepickerModule],
  templateUrl: './formulario-curso.component.html',
  styleUrl: './formulario-curso.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class FormularioCursoComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter<any>();

  public cursoForm: FormGroup;
  public isEditMode: boolean;

  //Para almacenar los deportes
  public deportes: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    //Datos que nos llega desde el diálogo.
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data?.datos?.curso;
    this.cursoForm = this.fb.group({
      id: [data?.datos?.curso?.id || ''],
      nombre: [data?.datos?.curso?.nombre || '', Validators.required],
      icono_curso: [data?.datos?.curso?.icono_curso || '', Validators.required],
      fecha_curso: [data?.datos?.curso?.fecha_curso  || '', Validators.required],
      plazas_totales: [data?.datos?.curso?.plazas || 1, [Validators.required, Validators.min(1)]],
      descripcion: [data?.datos?.curso?.informacion || '', Validators.required],
      idDeporte: [data?.datos?.curso?.idDeporte || '', Validators.required],
    });
  }
  ngOnInit(): void {

    //Al iniciar, cargamos los deportes pasados por el diálogo...
    if (this.data && this.data.datos?.deportes) {
      this.deportes = this.data.datos.deportes;
    }

  }

  onSubmit() {
    if (this.cursoForm.valid) {
      const nuevoCurso = this.cursoForm.value;

      this.eventEmitter.emit(nuevoCurso);
    }
  }

}
