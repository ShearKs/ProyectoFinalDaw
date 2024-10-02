import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-elegir-deporte',
  standalone: true,
  imports: [RouterOutlet,MatCardModule, MatPaginator, RouterLink, MatFormFieldModule, MatDatepickerModule, MatGridListModule, CommonModule, MatIconModule],
  templateUrl: './elegir-deporte.component.html',
  styleUrl: './elegir-deporte.component.scss'
})
export class ElegirDeporteComponent implements OnInit {

  public rutaActual: string = "";

  public deportes: any[] = [

    { id: 3, nombre: 'Tenis', cantidadInstalacion: 8, isAvailable: true, icon: "sports_tennis" },
    { id: 4, nombre: 'Fútbol', cantidadInstalacion: 4, isAvailable: false, icon: "sports_soccer" },
    { id: 1, nombre: 'Baloncesto', cantidadInstalacion: 3, isAvailable: true, icon: "sports_basketball" },
    { id: 12, nombre: 'Pádel', cantidadInstalacion: 10, isAvailable: true, icon: "umbrella" },
    { id: 5, nombre: 'Natación', cantidadInstalacion: 3, isAvailable: false, icon: "pool" },
    { id: 10, nombre: 'Fútbol Sala', cantidadInstalacion: 8, isAvailable: false, icon: "sports_and_outdoors" },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.rutaActual = this.route.snapshot.url.join('/');
    console.log('Ruta Actual: ', this.rutaActual)
  }

  public accesoReserva(deporte: any) {

    //this.router.navigate(['reservar-deporte', deporte.id])
    //this.router.navigate([`/${this.rutaActual}/reserva-deporte`, deporte.id])
    this.router.navigate([this.rutaActual, 'reservar-deporte', deporte.id]);
  
  }
}

