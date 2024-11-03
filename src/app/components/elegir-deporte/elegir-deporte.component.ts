import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { DeportesService } from '../../core/servicies/deportes.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-elegir-deporte',
  standalone: true,
  imports: [RouterOutlet, MatPaginator, MatCardModule, RouterLink, CommonModule, MatIconModule],
  templateUrl: './elegir-deporte.component.html',
  styleUrls: ['./elegir-deporte.component.scss']
})
export class ElegirDeporteComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public deportes: any[] = [
    // { id: 3, nombre: 'Tenis', cantidadInstalacion: 8, isAvailable: true, icon: "sports_tennis" },
    // { id: 4, nombre: 'Fútbol', cantidadInstalacion: 4, isAvailable: false, icon: "sports_soccer" },
    // { id: 1, nombre: 'Baloncesto', cantidadInstalacion: 3, isAvailable: true, icon: "sports_basketball" },
    // { id: 12, nombre: 'Pádel', cantidadInstalacion: 10, isAvailable: true, icon: "umbrella" },
    // { id: 5, nombre: 'Natación', cantidadInstalacion: 3, isAvailable: false, icon: "pool" },
    // { id: 10, nombre: 'Fútbol Sala', cantidadInstalacion: 8, isAvailable: false, icon: "sports_and_outdoors" },
    // { id: 54, nombre: 'Panenka', cantidadInstalacion: 377, isAvailable: false, icon: "tsunami" },
    // { id: 80, nombre: 'Toros', cantidadInstalacion: 377, isAvailable: false, icon: "pets" },
  ];

  //Usuario para hacer pruebas..
  public usuario: any = {
    id: 1,
    nombre: "Sergio",
    apellidos: "Fernández Esparcia",
    administrdor: true,
  }

  // Tamaño de la página
  public pageSize = 6;
  // Índice de la página actual
  public pageIndex = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly _deportesServices: DeportesService) { }

  ngOnInit(): void {

    this._deportesServices.getDeportes().pipe(
      tap((deportesObtenidos => {
        this.deportes = deportesObtenidos;
      }))
    ).subscribe();
  }

  public accesoReserva(deporte: any) {
    this.router.navigate([this.route.snapshot.url.join('/'), 'reservar-deporte', deporte.id]);
  }

  public handlePageEvent(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  public getPaginatedDeportes() {
    return this.deportes.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }
}
