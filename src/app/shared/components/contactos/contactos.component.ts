import { AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EmptyDialogComponent } from '../empty-dialog/empty-dialog.component';
import { DetalleContactoComponent } from './detalle-contacto/detalle-contacto.component';
import { AddContactoComponent } from './add-contacto/add-contacto.component';
import { BasicDialogComponent } from '../basic-dialog/basic-dialog.component';
import { sameObject, singularEntity } from '../../../functions';
import { GestorDatosService } from './gestor-datos.service';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SingularStringDirective } from '../../directives/singular-string.directive';
import { FormularioGenericoComponent } from '../formulario-generico/formulario-generico.component';


export interface entidad {

  id: number,
  //propiedades dinámicas
  [key: string]: any
}


@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [SingularStringDirective, ReactiveFormsModule, CommonModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatIconModule, MatDialogModule],
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.scss'
})

export class ContactosComponent implements OnInit, AfterViewInit {


  @Input() public servicioDatos: any;
  @Input() public entidad !: string;
  public singEntity: string = "";


  public entidadDatos: entidad[] = [];

  public columnas: string[] = ['id'];

  public datasource = new MatTableDataSource(this.entidadDatos);


  //Cogemos referencia del paginador
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private readonly _gestorDatos: GestorDatosService) { }

  ngOnInit(): void {

    this.entidad = this.route.snapshot.data['entidad'];
    this.singEntity = singularEntity(this.entidad)

    console.log('Entidad seleccionada: ', this.entidad)
    this.cargarDatos();

  }

  ngAfterViewInit(): void {

    console.log(this.datasource.data)

    this.datasource.paginator = this.paginator;
  }

  private cargarDatos(): void {

    this._gestorDatos.getEntidad(this.entidad).pipe(

      tap((data: entidad[]) => {
        this.entidadDatos = data;

        if (data.length > 0) {
          // Recopilamos todas las claves únicas de todos los objetos en los datos
          const allKeys = new Set<string>();
          data.forEach(item => {
            Object.keys(item).forEach(key => {
              allKeys.add(key);
            });
          });

          // Convertimos el conjunto de claves a un array y establecemos las columnas
          this.columnas = ['id', ...Array.from(allKeys).filter(key => key !== 'id')];
        }

        console.log('Columnas definidas: ', this.columnas); // Aquí deberías ver 'acciones'
        console.log(this.entidadDatos)
        this.datasource.data = this.entidadDatos;

        console.log('Datos que contiene la tabla')
        console.log(this.datasource.data)
      })

    ).subscribe();
  }

  public nuevoRegistro(): void {

    const nuevoRegistroEmitter = new EventEmitter<entidad>();

    const dialogRef = this.dialog.open(EmptyDialogComponent, {
      data: {
        component: AddContactoComponent,
        datos: null,
        eventEmitter: nuevoRegistroEmitter
      }
    });

    nuevoRegistroEmitter.subscribe((registro: entidad) => {
      //Añadimos el contacto a la tabla.
      this._addRegistro(registro)
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo fue cerrado')
    })
  }



  public eliminarRegistro(entidad: any): void {

    //Abrimos el modal y le pasamos el contenido que va a tener. 
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Confirmación de Eliminación',
        contenido: `¿Estás seguro que quieres eliminar a ${entidad.id}?`,
        textoConfirmacion: 'Eliminar',
      }
    });

    dialog.afterClosed().subscribe(result => {

      if (result) {

        this._gestorDatos.eliminarEntidad(entidad.id, this.entidad).subscribe({
          next: () => {
            

            //Si todo es correcto actualizamos la tabla..
            this.cargarDatos();
          },
          error: () => {
            this._abrirDialogoConfirmacion(`Error al eliminar ${entidad.entidad}`, false);
          }
        })
      }
    })
  }

    //Detalle contacto sirve tanto para ver como para editar, es la misma vista....
    public detalleEntidad(entity: entidad, esEditable: boolean): void {

      const entidadEditada = new EventEmitter<entidad>();
      //Clonado del objeto...
      const oldEntity = JSON.parse(JSON.stringify(entity))
  
      const dialog = this.dialog.open(EmptyDialogComponent, {
        data: {
          component: FormularioGenericoComponent,
          data: {
            titulo: "Visualizado de "+this.entidad,
            cabecera: this.columnas,
            entidad: entity,
            editable: esEditable
          },
          eventEmitter: entidadEditada
        }
      });
  
      //Para editar el contacto....
      entidadEditada.subscribe((entidadUpdate: entidad) => {
  
        //Optenemos el id del contacto actualizado...
        const index = this.datasource.data.findIndex(e => e.id === entidadUpdate.id)
  
        if (index > -1) {
  
          //Miramos si hemos modificado algo...
          if (!sameObject(oldEntity, entidadUpdate)) {
  
            //Nos encargamos mandarle la información al php para editar el usuario
            this._gestorDatos.editEntidad(entity.id, this.entidad, entidadUpdate).subscribe({
  
              next: (result) => {
  
                if (result.status = "exito") {
               
                }else{
                  this._abrirDialogoConfirmacion(`Ha habido un error al eliminar ${this.entidad}, motivo: ${result.mensaje}`,false)
                }
              },
              error: () => {
                this._abrirDialogoConfirmacion(`Ha habido un error al eliminar ${this.entidad}`, false)
              }
            })
          } else {
            console.error('Los contactos son iguales no se abre el diálogo...')
          }
          dialog.close();
        }
      })
    }


  private _abrirDialogoConfirmacion(mensaje: string, correcto: boolean): void {

    this.dialog.open(BasicDialogComponent, {
      data: {
        mensaje: mensaje,
        correcto: correcto,
      }
    })
  }
  public aplicarFiltro(event: Event): void {

    const valorFiltro = (event.target as HTMLInputElement).value;
    this.datasource.filter = valorFiltro.trim().toLowerCase();
  }

  private _addRegistro(nuevoRegistro: entidad): void {

    const data = this.datasource.data
    data.push(nuevoRegistro)
    //Actualizamos la tabla
    this.datasource.data = [...this.datasource.data]

    //Informamos al usuario que se ha añadido un nuevo contacto...
    this._abrirDialogoConfirmacion("Se ha añadido un registro nuevo con éxito", true)
  }


}

