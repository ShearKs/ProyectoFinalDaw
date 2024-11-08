import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EventosService } from './eventos.service';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioDataService } from '../../core/servicies/usuario-data.service';
import { usuario } from '../../shared/components-shared/contactos/contacto.interface';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent implements OnInit {

  //usuario que hay en la sesión
  public usuario!: usuario | null;

  public eventos: any = [
    // { titulo: 'Conferencia de Tecnología', descripcion: 'Una conferencia sobre las últimas tendencias en tecnología.', fecha: '2024-11-10' },
    // { titulo: 'Taller de Programación', descripcion: 'Un taller interactivo para aprender programación en Angular.', fecha: '2024-11-15' },
    // { titulo: 'Hackathon Anual', descripcion: 'Competencia de programación de 24 horas para equipos.', fecha: '2024-11-20' },
    // { titulo: 'Meetup de Desarrollo Web', descripcion: 'Un evento de networking para desarrolladores web.', fecha: '2024-11-25' }
  ];

  constructor(
    private readonly _eventosCall: EventosService,
    private readonly _usuarioService: UsuarioDataService,


  ) { }

  ngOnInit(): void{


    //Alternativa como si fuera una promesa
    //this.usuario = await firstValueFrom(this._usuarioService.getUsuario());

    this._usuarioService.getUsuario().subscribe((usuarioSesion) => {
      if (usuarioSesion) {
        this.usuario = usuarioSesion;
        console.log('Usuario en la sesión:', this.usuario);
      }
    });

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
