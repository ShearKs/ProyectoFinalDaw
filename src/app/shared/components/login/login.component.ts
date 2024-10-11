import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BotonGenericoComponent } from "../boton-generico/boton-generico.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormField, MatInputModule, BotonGenericoComponent,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  public loginForm !: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: [''],
      contrasena: ['']
    });
  }
  public onSubmit(){
    console.log('Usuario: ',this.loginForm.get('usuario')?.value)
    console.log('Contraseña: ',this.loginForm.get('contrasena')?.value)
  }


}
