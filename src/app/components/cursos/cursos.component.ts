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
import { DialogoService } from '../../core/servicies/dialogo.service';
import { ConfirmDialogComponent } from '../../shared/components-shared/confirm-dialog/confirm-dialog.component';

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
    private readonly _dialogMensaje: DialogoService,



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
            this._dialogMensaje.abrirDialogoConfirmacion('Se ha añadido el curso correctamente', true);

            //Volvemos a aztualizar la vista con el nuevo curso...
            this.obtenerCursos();
          } else {
            this._dialogMensaje.abrirDialogoConfirmacion('Se ha producido un error al eliminar el curso.., ERROR: ' + result.mensaje, false);
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

  public eliminarCurso(curso: Curso) {


    // Abrimos el modal y le pasamos el contenido que va a tener
    const dialog = this._dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Confirmación de eliminación de curso',
        contenido: `¿Estás seguro que quieres eliminar el curso: ${curso.nombre}?`,
        textoConfirmacion: 'Eliminar',
      }
    });

    dialog.afterClosed().subscribe(result => {

      //Si le hemos dado a sí...
      if (result) {

        const idCurso: number = curso.id;

        this._apiCursos.eliminarCurso(idCurso).pipe(
          tap((response => {

            if (response.status === 'exito') {
              this._dialogMensaje.abrirDialogoConfirmacion('Se ha procedido a eliminar el curso', true);
              //Una vez eliminados los cursos actualizamos la vista
              this.obtenerCursos();
            } else {
              this._dialogMensaje.abrirDialogoConfirmacion('Ha habido un error al eliminar el curso', false);
            }

          }))
        ).subscribe();

      }
    })
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


    const dialog = this._dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Confirmación de inscripción',
        contenido: '¿Estás seguro que quieres inscribirte en el curso?',
        textoConfirmacion: 'Inscribirte',
      }
    });

    dialog.afterClosed().subscribe(result => {

      if (result) {

        this._apiCursos.anadirInscripcion(inscripcion).pipe(
          tap((response) => {
            if (response) {
              const curso = this.cursos.find(c => c.id === idCurso);
              this._dialogMensaje.abrirDialogoConfirmacion('¡Te has logrado apuntarte al curso satisfactoriamente!',true);
              if (curso)
                curso.esta_inscrito = 1;
            }
          }
          )
        ).subscribe();
      }
    })

  }
}
