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
import { sameObject } from '../../../functions';
import { GestorDatosService } from './gestor-datos.service';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';


export interface entidad {

  id: number,
  //propiedades dinámicas
  [key: string]: any
}


@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatIconModule, MatDialogModule],
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.scss'
})

export class ContactosComponent implements OnInit, AfterViewInit {


  //Informació que le pasaremos al componente mediante inputs
  //@Input() public columnas : string[] = [];
  @Input() public servicioDatos: any;
  @Input() public entidad !: string;




  public entidadDatos: entidad[] = [];


  //public columnas: string[] = ['id', 'nombre', 'usuario', 'apellidos', 'edad', 'correo', 'acciones'];
  public columnas: string[] = ['id'];

  public datasource = new MatTableDataSource(this.entidadDatos);

  //public datasource = new MatTableDataSource<T>();
  //public entidades: T[] = [];

  //Cogemos referencia del paginador
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private readonly _gestorDatos: GestorDatosService) { }

  ngOnInit(): void {

    this.entidad = this.route.snapshot.data['entidad'];

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
      })

    ).subscribe();
  }

  public nuevoContacto(): void {

    const nuevoContactoEmitter = new EventEmitter<entidad>();

    const dialogRef = this.dialog.open(EmptyDialogComponent, {
      data: {
        component: AddContactoComponent,
        datos: null,
        eventEmitter: nuevoContactoEmitter
      }
    });

    nuevoContactoEmitter.subscribe((nuevoContacto: entidad) => {

      //Añadimos el contacto a la tabla.
      this._addContacto(nuevoContacto)
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo fue cerrado')
    })
  }



  public eliminarContacto(contacto: any): void {

    //Abrimos el modal y le pasamos el contenido que va a tener. 
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Confirmación de Eliminación',
        contenido: `¿Estás seguro que quieres eliminar a ${contacto.nombre}?`,
        textoConfirmacion: 'Eliminar',
      }
    });

    dialog.afterClosed().subscribe(result => {

      if (result) {
        //Encontramos el indice del elemento en el array
        const index = this.datasource.data.findIndex(e => e.id === contacto.id)

        const longitudTab = this.datasource.data.length

        //Eliminiamos el elemento del array si se encuentra
        this.datasource.data.splice(index, 1);

        //Actualizamos el datasource para que se nos muestre en la tabla los cambios
        //Cuando creamos un nuevo array con el spread operator ... estamos cambiando la referencia
        // a un nuevo array y esto es suficiente para que angular lo interprete como un cambio y actualice la tabla
        this.datasource.data = [...this.datasource.data];

        if (longitudTab !== this.datasource.data.length) {
          this._abrirDialogoConfirmacion("Se ha elminado correctamente el contacto en la tabla", true)
        }

      }
    })
  }

  //Detalle contacto sirve tanto para ver como para editar, es la misma vista....
  public detalleContacto(contacto: entidad, esEditable: boolean): void {

    const contactoEditado = new EventEmitter<entidad>();
    //Clonado del objeto...
    const contactoAnterior = JSON.parse(JSON.stringify(contacto))

    const dialog = this.dialog.open(EmptyDialogComponent, {
      data: {
        component: DetalleContactoComponent,
        contacto: {
          datos: contacto,
          editable: esEditable
        },
        eventEmitter: contactoEditado
      }
    });

    //Para editar el contacto....
    contactoEditado.subscribe((contactoActualizado: entidad) => {

      //Optenemos el id del contacto actualizado...
      const index = this.datasource.data.findIndex(e => e.id === contactoActualizado.id)

      console.log('Contacto anterior: ', contactoAnterior)
      console.log('Contacto Actualizado: ', contactoActualizado)

      if (index > -1) {

        //Si el objeto no es el mismo lo editamos y hacemos que se abra el modal de confiramción....
        if (!sameObject(contactoAnterior, contactoActualizado)) {

          //Actualizamos el contacto en cuestión
          this.datasource.data[index] = contactoActualizado;

          console.log('Tabla actualizada ', this.datasource.data)

          //Actualizamos la tabla
          this.datasource.data = [...this.datasource.data]

          //Abrimos el diálogo como confirmación de que se ha editado el contacto
          this._abrirDialogoConfirmacion("Se ha editado el contacto correctamente", true)
        } else {
          console.log('Los contactos son iguales no se abre el diálogo...')
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

  private _addContacto(nuevoContacto: entidad): void {

    const data = this.datasource.data
    data.push(nuevoContacto)
    //Actualizamos la tabla
    this.datasource.data = [...this.datasource.data]

    //Informamos al usuario que se ha añadido un nuevo contacto...
    this._abrirDialogoConfirmacion("Se ha añadido un contacto con éxito", true)
  }

}

