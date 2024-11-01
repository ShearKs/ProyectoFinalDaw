import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { Curso } from './interfaces/curso.interface';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { usuario } from '../../shared/components-shared/contactos/contacto.interface';
import { CursoServiceService } from './curso-service.service';
import { tap } from 'rxjs';
import { Inscripcion } from './interfaces/inscripciones.interface';
import { MatDialog } from '@angular/material/dialog';
import { EmptyDialogComponent } from '../../shared/components-shared/empty-dialog/empty-dialog.component';


import { DeportesService } from '../../core/servicies/deportes.service';
import { FormularioCursoComponent } from './formulario-curso/formulario-curso.component';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatIconModule],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.scss',

})
export class CursosComponent implements OnInit {

  public usuario !: usuario;
  public cursos: Curso[] = [];



  //Por si se quieren hacer pruebas sin bdd
  // public cursos: Curso[] = [
  //   { id: 1, nombre: 'Curso de Natación para principiantes', icono: 'pool', plazas: 35, deporte: "Natación" },
  //   { id: 2, nombre: 'Curso de Fútbol para prevenjamines', icono: 'sports_soccer', plazas: 50, deporte: "Fútbol" },
  //   { id: 3, nombre: 'Iniciación al baloncesto', icono: 'sports_basketball', plazas: 40, deporte: "Baloncesto" },
  //   { id: 4, nombre: 'Curso inntermedio de padel', icono: 'sports_tennis', plazas: 15, deporte: "Pádel" },
  //   { id: 5, nombre: 'Técnica de carrera', icono: 'sprint', plazas: 25, deporte: "Running" },
  // ];



  constructor(
    private readonly _apiCursos: CursoServiceService,
    private readonly _apiDepo: DeportesService,
    private readonly _dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    //Obtenemos el usuario que tenemos en localStorage...
    const userData = localStorage.getItem('user');
    this.usuario = userData ? JSON.parse(userData) : null;
    this.obtenerCursos();
  }

  public anadirCurso(): void {

    const deportes: { [key: string]: string } = {};

    //Al abrir el formulario obtengo información de los deportes que hay
    this._apiDepo.getDeportes().pipe(
      tap((deportesObject => {

        deportesObject.forEach(deporte => {
          deportes[deporte.id] = deporte.nombre;
        })

      }))
    ).subscribe();

    console.log('Deportes obtenidos: ', deportes)


    //Para formulario general
    const nuevoRegistroEmitter = new EventEmitter<any>();
    const dialogRef = this._dialog.open(EmptyDialogComponent, {
      data: {
        component: FormularioCursoComponent,
        datos: {
          deportes: deportes,
        },
        eventEmitter: nuevoRegistroEmitter
      }
    });

    nuevoRegistroEmitter.subscribe((nuevoCurso: Curso) => {
      console.log('Curso recien creado!')
      console.log(nuevoCurso)

      this._apiCursos.addCurso(nuevoCurso).pipe(
        tap((result => {
          console.log(result);

          if (result.status === 'exito') {

            console.log('Has introducido un nuevo curso');
            //Volvemos a aztualizar la vista con el nuevo curso...
            this.obtenerCursos();
          }
        }))
      ).subscribe();
    })


    // nuevoRegistroEmitter.subscribe((nuevoCurso: any) => {
    //   console.log('El curso que va a crear es ')
    //   console.log(nuevoCurso)

    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('El diálogo fue cerrado');
    // });

  }

  //Peticiones a la api....
  private obtenerCursos() {

    this._apiCursos.getCursos(this.usuario.id).pipe(
      tap((cursos => {

        console.log('Cursos obtenidos: ', cursos)
        this.cursos = cursos;

      }))
    ).subscribe();
  }

  public inscribirseCurso(idCurso: number) {
    if (!this.usuario) {
      console.error("Error: el usuario es nulo. Asegúrate de estar autenticado.");
      return;
    }

    console.log(`El cliente ${this.usuario.nombre} quiere apuntarse al curso con id: ${idCurso}`);

    const inscripcion: Inscripcion = {
      idCurso: idCurso,
      idCliente: this.usuario.id
    }

    this._apiCursos.anadirInscripcion(inscripcion).pipe(
      tap((result) => {
        console.log(result)

        const curso = this.cursos.find(c => c.id === idCurso);

        if (curso)
          curso.esta_inscrito = 1;

      }
      )
    ).subscribe();
  }


}
