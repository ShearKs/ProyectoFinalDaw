import { Component } from '@angular/core';
import { ServicioCargaService } from '../../../core/servicies/servicio-carga.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-spiner-carga',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spiner-carga.component.html',
  styleUrl: './spiner-carga.component.scss'
})
export class SpinerCargaComponent {

  constructor(public spinnerService : ServicioCargaService){}
}
