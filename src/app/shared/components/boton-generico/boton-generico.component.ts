import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-boton-generico',
  standalone: true,
  imports: [MatButton],
  templateUrl: './boton-generico.component.html',
  styleUrl: './boton-generico.component.scss'
})
export class BotonGenericoComponent {

  @Input() label:string = 'Clícame';
  @Input() color:string = 'primary';

}
