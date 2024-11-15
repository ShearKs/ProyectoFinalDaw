import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlClientService } from './control-client.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-panel-cliente',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatTabGroup, MatTabsModule, MatPaginatorModule],
  templateUrl: './panel-cliente.component.html',
  styleUrl: './panel-cliente.component.scss'
})
export class PanelClienteComponent implements OnInit, AfterViewInit {
  @Input() idUsuario!: number;
  public dataSource = new MatTableDataSource<any>([]);
  public displayedColumns: string[] = [];

  // Mapa de alias de columnas (pa que salga to bonico...)
  public columnAliases: { [key: string]: string } = {
    'pista_nombre': 'Nombre de Pista',
    'deporte_nombre': 'Deporte',
    'inicio': 'Hora de Inicio',
    'fin': 'Hora de Fin',
    'fecha_reserva': 'Fecha de Reserva',
    'estado_reserva': 'Estado Reserva',
    'curso_nombre': 'Nombre del Curso',
    'cliente_nombre': 'Cliente',
    'fecha_inscripcion': 'Fecha de Inscripción',
    'estado_inscripcion_curso': 'Estado de Inscripción',
    'evento_nombre': 'Nombre del Evento',
    'distancia': 'Distancia',
    'estado_inscripcion': 'Estado de Inscripción'
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Columnas para cada tipo de dato
  private reservasColumns: string[] = ['pista_nombre', 'deporte_nombre', 'inicio', 'fin', 'fecha_reserva', 'estado'];
  private cursosColumns: string[] = ['curso_nombre', 'cliente_nombre', 'deporte', 'fecha_inscripcion', 'estado'];
  private eventosColumns: string[] = ['evento_nombre', 'deporte', 'distancia', 'estado'];

  constructor(private readonly _panelControlCall: ControlClientService) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    // Inicialmente cargamos las columnas para las reservas
    this.displayedColumns = this.reservasColumns;
    this.cargarReservasUsuario();
  }

  // Método que nos hace la funcionalidad de según la pestaña que seleccionemos se carga una pestaña u otra.
  public onTabChange(index: number): void {
    if (index === 0) {
      this.cargarReservasUsuario();
      this.displayedColumns = this.reservasColumns;
    } else if (index === 1) {
      this.cargarCursosUsuario();
      this.displayedColumns = this.cursosColumns;
    } else if (index === 2) {
      this.inscripEventosUser();
      this.displayedColumns = this.eventosColumns;
    }
  }

  // PETICIONES HTTP
  private cargarReservasUsuario(): void {
    this._panelControlCall.getReservasUsuario(this.idUsuario).pipe(
      tap((reservas: any[]) => {
        this.dataSource.data = reservas;
      })
    ).subscribe();
  }

  private cargarCursosUsuario(): void {
    this._panelControlCall.getCursosUsuario(this.idUsuario).pipe(
      tap((cursos: any[]) => {
        this.dataSource.data = cursos;
      })
    ).subscribe();
  }

  private inscripEventosUser(): void {
    this._panelControlCall.getInscripcionesEventos(this.idUsuario).pipe(
      tap((eventos: any[]) => {
        this.dataSource.data = eventos;
      })
    ).subscribe();
  }
}
