import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//import { usuario } from '../contactos.component';


@Component({
  selector: 'app-detalle-contacto',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatButton, MatInputModule, CommonModule, MatCardModule],
  templateUrl: './detalle-contacto.component.html',
  styleUrls: ['./detalle-contacto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalleContactoComponent implements OnInit, AfterViewInit {

  public formulario!: FormGroup;

  public nombre !: string;
  public peso !: number;
  public simbolo !: string;

  public editable !: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    console.log('Esto es el formulario de detalle....')

    this.editable = this.data.contacto?.editable;

    this.nombre = this.data.contacto.datos.nombre || '';
    this.peso = this.data.contacto.datos.peso || '';
    this.simbolo = this.data.contacto.datos.simbolo || '';

    this.formulario = this.fb.group({
      nombre: [this.nombre, Validators.required],
      peso: [this.peso, Validators.required],
      simbolo: [this.simbolo, Validators.required],
    })

    console.log('--- Ver contacto ---')
    console.log(this.data.contacto.datos)
  }

  ngAfterViewInit(): void {
  }

  public cambiarModo() {
    this.editable = true;
  }

  public onSubmit(): void {
    if (this.formulario.valid) {

      if (this.editable) {

        console.log('Posición: ',this.data.contacto.datos.posicion)

        // const contactoActualizado: usuario = {
          
        //   id: this.data.contacto.datos.id,
        //   nombre: this.formulario.get('nombre')?.value,
        //   apellidos: this.formulario.get('apellidos')?.value,
        //   usuario: this.formulario.get('usuario')?.value,
        //   edad: parseInt(this.formulario.get('edad')?.value),
        //   correo: this.formulario.get('correo')?.value
        // }
        //this.data.eventEmitter.emit(contactoActualizado)
      }

      console.log('Formulario enviado', this.formulario.value);
    } else {
      console.log('Formulario no válido');
    }
  }
}
