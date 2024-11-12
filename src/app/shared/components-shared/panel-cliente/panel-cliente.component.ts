import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlClientService } from './control-client.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-panel-cliente',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './panel-cliente.component.html',
  styleUrl: './panel-cliente.component.scss'
})
export class PanelClienteComponent implements OnInit, AfterViewInit {
  @Input() idUsuario!: number;
  public reservasUsuario: any[] = [];
  public dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Definir las columnas a mostrar en la tabla
  public displayedColumns: string[] = ['pista_nombre', 'deporte_nombre', 'inicio', 'fin', 'fecha_reserva', 'estado_reserva'];

  constructor(
    private readonly _panelControlCall: ControlClientService) { }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.cargarReservasUsuario();
  }


  private cargarReservasUsuario() {
    this._panelControlCall.getReservasUsuario(this.idUsuario).pipe(
      tap((reservas: any[]) => {
        this.dataSource.data = reservas
      })
    ).subscribe();
  }
}
