import { AfterViewInit, Component, EventEmitter, ViewChild } from '@angular/core';
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

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

export interface modelo {

  posicion: number,
  nombre: string,
  peso: number,
  simbolo: string
}
const personas: modelo[] = [
  { posicion: 1, nombre: 'Luis', peso: 85, simbolo: 'L' },
  { posicion: 2, nombre: 'Jose Antonio', peso: 98, simbolo: 'JA' },
  { posicion: 3, nombre: 'María Luisa', peso: 60, simbolo: 'MA' },
  { posicion: 4, nombre: 'Carmen', peso: 60, simbolo: 'C' },
  { posicion: 5, nombre: 'Maria del Mar', peso: 77, simbolo: 'MM' },
  { posicion: 6, nombre: 'Jose Carlos', peso: 101, simbolo: 'JC' },
  { posicion: 7, nombre: 'Carlos', peso: 55, simbolo: 'CA' },
  { posicion: 8, nombre: 'Emiliano', peso: 80, simbolo: 'E' },
  { posicion: 9, nombre: 'Antonia', peso: 72, simbolo: 'AN' },
  { posicion: 10, nombre: 'Paco', peso: 73, simbolo: 'PA' },
];

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatIconModule, MatDialogModule],
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.scss'
})
export class ContactosComponent implements AfterViewInit {

  public columnas: string[] = ['posicion', 'nombre', 'peso', 'simbolo', 'acciones'];
  public datasource = new MatTableDataSource(personas);

  //Cogemos referencia del paginador
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  constructor(private dialog: MatDialog) { }

  ngAfterViewInit(): void {

    console.log(this.datasource.data)

    this.datasource.paginator = this.paginator;
  }

  public nuevoContacto(): void {

    const nuevoContactoEmitter = new EventEmitter<modelo>();

    const dialogRef = this.dialog.open(EmptyDialogComponent, {
      data: {
        component: AddContactoComponent,
        datos: null,
        eventEmitter: nuevoContactoEmitter
      }
    });

    nuevoContactoEmitter.subscribe((nuevoContacto: modelo) => {

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
        const index = this.datasource.data.findIndex(e => e.posicion === contacto.posicion)

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
  public detalleContacto(contacto: modelo, esEditable: boolean): void {

    const contactoEditado = new EventEmitter<modelo>();
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
    contactoEditado.subscribe((contactoActualizado: modelo) => {

      //Optenemos el id del contacto actualizado...
      const index = this.datasource.data.findIndex(e => e.posicion === contactoActualizado.posicion)

      console.log('Contacto anterior: ',contactoAnterior)
      console.log('Contacto Actualizado: ',contactoActualizado)

      if (index > -1) {

        //Si el objeto no es el mismo lo editamos y hacemos que se abra el modal de confiramción....
        if (!sameObject(contactoAnterior, contactoActualizado)) {

          //Actualizamos el contacto en cuestión
          this.datasource.data[index] = contactoActualizado;

          console.log('Tabla actualizada ',this.datasource.data)

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

  private _addContacto(nuevoContacto: modelo): void {

    const data = this.datasource.data
    data.push(nuevoContacto)
    //Actualizamos la tabla
    this.datasource.data = [...this.datasource.data]

    //Informamos al usuario que se ha añadido un nuevo contacto...
    this._abrirDialogoConfirmacion("Se ha añadido un contacto con éxito", true)
  }

}

