import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { modelo } from '../contactos.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-contacto',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './add-contacto.component.html',
  styleUrl: './add-contacto.component.scss',
  //Cambiamos la estrategia de detectión de cambios
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddContactoComponent implements OnInit {

  //Evento para emitir el nuevo contacto
  @Output() eventEmitter : EventEmitter<any> = new EventEmitter<any>();

  //Grupo de formulario reactivo.
  public form !: FormGroup;

  constructor(
    //Inyectamos los datos del evento
    @Inject(MAT_DIALOG_DATA) public data :any,
    //FormBuilder para el manejo de formularios reactivos.
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    //Inicializamos el formulario con distintas validaciones
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      peso: ['',[ Validators.required,Validators.pattern(/^\d+$/)]],
      simbolo: ['', Validators.required],
    })
  }

  public onSubmit(): void {
    //Verificamos si el formulario es valido
    if (this.form.valid) {
      //objeto con los campos obtenidos del formulario
      const nuevoContacto: modelo = {
        posicion: 99,
        nombre: this.form.get('nombre')?.value,
        peso: this.form.get('peso')?.value,
        simbolo: this.form.get('simbolo')?.value,
      }

      //Emitimos el nuevo contacto al EventEmitter
      this.eventEmitter.emit(nuevoContacto)

    } else {
      console.error('Formulario no valido')
    }

  }
}
