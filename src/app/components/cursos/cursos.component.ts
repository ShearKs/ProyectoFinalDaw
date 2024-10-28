import { Component, OnInit } from '@angular/core';
import { Curso } from './curso.interface';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatIconModule],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.scss'
})
export class CursosComponent implements OnInit {

  public cursos: Curso[] = [
    { id: 1, nombre: 'Curso de Natación para principiantes', icono: 'a', plazas: 35, idDeporte: 5 },
    { id: 2, nombre: 'Curso de Fútbol para prevenjamines', icono: 'a', plazas: 50, idDeporte: 4 },
    { id: 3, nombre: 'Iniciación al baloncesto', icono: 'a', plazas: 40, idDeporte: 1 },
    { id: 4, nombre: 'Curso inntermedio de padel', icono: 'a', plazas: 15, idDeporte: 15 },
  ];


  ngOnInit(): void {
    console.log('Hola cursos')
  }








}
