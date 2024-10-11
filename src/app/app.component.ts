import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./shared/components/menu/menu.component";
import { SpinerCargaComponent } from "./shared/components/spiner-carga/spiner-carga.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, SpinerCargaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'prueba-componentes';
}
