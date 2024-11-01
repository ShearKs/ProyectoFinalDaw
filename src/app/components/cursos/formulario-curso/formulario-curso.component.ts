import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-formulario-curso',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, CommonModule, MatOptionModule, MatSelectModule],
  templateUrl: './formulario-curso.component.html',
  styleUrl: './formulario-curso.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class FormularioCursoComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter<any>();

  public cursoForm: FormGroup;

  //Para almacenar los deportes
  public deportes: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    //Datos que nos llega desde el diálogo.
    @Inject(MAT_DIALOG_DATA) public data: any


  ) {
    this.cursoForm = this.fb.group({
      nombre: ['', Validators.required],
      icono_curso: ['', Validators.required],
      plazas: [1, [Validators.required, Validators.min(1)]],
      descripcion: ['', Validators.required] ,
      idDeporte: ['', Validators.required]
    });
  }
  ngOnInit(): void {

    //Al iniciar, cargamos los deportes pasados por el diálogo...
    if (this.data && this.data.datos?.deportes) {
      this.deportes = this.data.datos.deportes;
    }

    console.log(this.deportes)
  }

  onSubmit() {
    if (this.cursoForm.valid) {
      const nuevoCurso = this.cursoForm.value;
   
      this.eventEmitter.emit(nuevoCurso);
    }
  }

}
