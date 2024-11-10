import { Component, OnInit } from '@angular/core';
import { MenuComponent } from "../../shared/components-shared/menu/menu.component";
import { usuario } from '../../shared/components-shared/contactos/contacto.interface';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule,CommonModule,MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  //Usuario en localstorage..
  public usuario !: usuario;

  ngOnInit(): void {
    //Obtenemos el usuario que tenemos en localStorage...
    const userData = localStorage.getItem('user');
    this.usuario = userData ? JSON.parse(userData) : null;

    console.log("Usuario: ",this.usuario)



  }

}
