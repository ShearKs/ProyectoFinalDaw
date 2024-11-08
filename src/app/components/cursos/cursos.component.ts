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

    console.log('Usuario')
    console.log(this.usuario)
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

  }

  public editarCurso(curso: Curso): void {

    const deportes: { [key: string]: string } = {};

    // Obtener los deportes disponibles para el formulario
    this._apiDepo.getDeportes().pipe(
      tap((deportesObject => {
        deportesObject.forEach(deporte => {
          deportes[deporte.id] = deporte.nombre;
        });
      }))
    ).subscribe();

    // Para formulario general
    const cursoEditadoEmitter = new EventEmitter<any>();
    const dialogRef = this._dialog.open(EmptyDialogComponent, {
      data: {
        component: FormularioCursoComponent,
        datos: {
          deportes: deportes,
          curso: curso
        },
        eventEmitter: cursoEditadoEmitter
      }
    });

    cursoEditadoEmitter.subscribe((cursoActualizado: Curso) => {
      console.log('Curso actualizado: ', cursoActualizado);

      this._apiCursos.editarCurso(cursoActualizado).pipe(
        tap((result => {
          console.log(result);

          if (result.status === 'exito') {
            console.log('Curso editado correctamente');
            // Volver a actualizar la vista con el curso editado...
            this.obtenerCursos();
          }
        }))
      ).subscribe();
    });
  }

  public eliminarCurso(idCurso: number) {

    this._apiCursos.eliminarCurso(idCurso).pipe(
      tap((resul => {
        console.log(resul)

        //Una vez eliminados los cursos actualizamos la vista
        this.obtenerCursos();
      }))
    ).subscribe();
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
