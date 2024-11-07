import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EventosService } from './eventos.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent implements OnInit {

  public eventos: any = [
    // { titulo: 'Conferencia de Tecnología', descripcion: 'Una conferencia sobre las últimas tendencias en tecnología.', fecha: '2024-11-10' },
    // { titulo: 'Taller de Programación', descripcion: 'Un taller interactivo para aprender programación en Angular.', fecha: '2024-11-15' },
    // { titulo: 'Hackathon Anual', descripcion: 'Competencia de programación de 24 horas para equipos.', fecha: '2024-11-20' },
    // { titulo: 'Meetup de Desarrollo Web', descripcion: 'Un evento de networking para desarrolladores web.', fecha: '2024-11-25' }
  ];

  constructor(private readonly _eventosCall: EventosService) { }

  ngOnInit(): void {

    //Al mismo iniciar en la aplicación obtenemos todos los deportes que hay...
    this._eventosCall.getEventos().pipe(

      tap((eventosObtenidos => {
        console.log('Eventos que llegan...', eventosObtenidos);
        this.eventos = eventosObtenidos;
      }))
    ).subscribe();




  }

  // Método para inscribirse a un evento
  public inscribirse(evento: any): void {
    alert(`Te has inscrito en el evento: ${evento.titulo}`);
  }
}
