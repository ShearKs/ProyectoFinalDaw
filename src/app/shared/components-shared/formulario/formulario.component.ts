import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BotonGenericoComponent } from "../boton-generico/boton-generico.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormPruebaService } from '../../../core/servicies/form-prueba.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatDatepickerModule, MatInputModule, MatIconModule, BotonGenericoComponent, BotonGenericoComponent, ReactiveFormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class FormularioComponent {

  public form: FormGroup;

  constructor(private fb: FormBuilder, private formService: FormPruebaService) {

    this.form = this.fb.group({
      nombre: ["", Validators.required],
      apellidos: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
    })
  }

  public onSubmit() {
    if (this.form.valid) {
      console.log("------- INFORMACIÓN QUE HA LLEGADO DEL FORMULARIO --------")
      console.log("Nombre :", this.form.get('nombre')?.value);
      console.log("Apellidos :", this.form.get('apellidos')?.value);
      console.log("Dirección :", this.form.get('direccion')?.value);
      console.log("Teléfono :", this.form.get('telefono')?.value);
      console.log('Fecha:', this.form.get('fechaNacimiento')?.value)


      console.log('Ahora enviamos para el servidor....')
      this.formService.enviarFormulario(this.form.value).subscribe(response => {
        console.log('Respuesta del servidor : ', response);
      }, error => {
        console.error('Error al enviar los datos: ', error)
      })

    } else {
      console.log('Formulario no válido');
    }
  }
}
