import { Component, OnInit } from '@angular/core';
import { Curso } from './interfaces/curso.interface';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { usuario } from '../../shared/components-shared/contactos/contacto.interface';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatIconModule],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.scss'
})
export class CursosComponent implements OnInit {

  public usuario !: usuario;

  public cursos: Curso[] = [
    { id: 1, nombre: 'Curso de Natación para principiantes', icono: 'pool', plazas: 35, deporte: "Natación" },
    { id: 2, nombre: 'Curso de Fútbol para prevenjamines', icono: 'sports_soccer', plazas: 50, deporte: "Fútbol" },
    { id: 3, nombre: 'Iniciación al baloncesto', icono: 'sports_basketball', plazas: 40, deporte: "Baloncesto" },
    { id: 4, nombre: 'Curso inntermedio de padel', icono: 'sports_tennis', plazas: 15, deporte: "Pádel" },
    { id: 5, nombre: 'Técnica de carrera', icono: 'sprint', plazas: 25, deporte: "Running" },
  ];

  ngOnInit(): void {

    //Obtenemos el usuario que tenemos en localStorage...
    const userData = localStorage.getItem('item');
    this.usuario = userData ? JSON.parse(userData) : null;
  }


  public apuntarseCurso(idCurso: number) {

    console.log('El curso que has seleccionado tiene id: ', idCurso)
    //console.log('El usuario que se quiere apuntar al curso es : ', this.usuario.nombre);
  }


}
