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
import { BasicDialogComponent } from '../basic-dialog/basic-dialog.component';
import { sameObject, singularEntity, upperString } from '../../../functions';
import { GestorDatosService } from './gestor-datos.service';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormularioDinamicoComponent } from '../formulario-dinamico/formulario-dinamico.component';
import { CampoFormulario } from '../formulario-dinamico/interfaces/campos_formulario.interface';


export interface entidad {

  id: number,
  //propiedades dinámicas
  [key: string]: any
}


@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatIconModule, MatDialogModule],
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.scss'
})

export class ContactosComponent implements OnInit, AfterViewInit {


  @Input() public servicioDatos: any;
  @Input() public entidad !: string;
  public singEntity: string = "";
  public entidadFormat: string = "";


  public entidadDatos: entidad[] = [];

  public columnas: string[] = ['id'];

  public datasource = new MatTableDataSource(this.entidadDatos);

  public columnasListar: string[] = [];

  //Campos que eliminamos del formulario 
  public camposDlt: any = {};

  private camposFormulario: CampoFormulario[] = [
    { nombre: 'nombre_usuario', tipo: 'text', label: 'Nombre de usuario', requerido: true },
    { nombre: 'nombre', tipo: 'text', label: 'Nombre', requerido: true },
    { nombre: 'apellidos', tipo: 'text', label: 'Apellidos', requerido: true },
    { nombre: 'telefono', tipo: 'text', label: 'Teléfono', requerido: true },
    { nombre: 'email', tipo: 'text', label: 'Email', requerido: true },
    { nombre: 'fecha_nac', tipo: 'date', label: 'Fecha de Nacimiento', requerido: true },
    { nombre: 'contrasena', tipo: 'password', label: 'Contraseña', requerido: true },
    { nombre: 'tipo_usuario', tipo: 'select', label: 'Tipo de Usuario', 
        opciones: [
          { valor:'cliente',label:'Cliente'},
          { valor:'trabajador' ,label:'Trabajador'}
        
        ], requerido: false }
  ];


  //Cogemos referencia del paginador
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private readonly _gestorDatos: GestorDatosService) { }

  ngOnInit(): void {
    //Recogemos los datos de la entidad
    this.route.data.subscribe(data => {

      this.entidad = data['entidad'];
      this.columnasListar = data['columnasListar'];
      this.camposDlt = data['inputsElimForm'];
    });

    this.singEntity = singularEntity(this.entidad)
    this.entidadFormat = upperString(this.entidad)
    this.cargarDatos();
  }

  ngAfterViewInit(): void {

    this.datasource.paginator = this.paginator;
  }

  private cargarDatos(): void {

    this._gestorDatos.getEntidad(this.entidad).pipe(

      tap((data: any[]) => {
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
          this.columnas = ['id', ...Array.from(allKeys).filter(key => key !== 'id' && key !== 'usuario_id')];

          //Hacemos el filtrado de columnas
          const columnasFiltradas: string[] = this.columnasListar.filter(valor => this.columnas.includes(valor));

          this.columnas = columnasFiltradas;
        }

        this.datasource.data = this.entidadDatos;


      })

    ).subscribe();
  }

  public nuevoRegistro(): void {
    const nuevoRegistroEmitter = new EventEmitter<entidad>();

    const entidadCabeceras: { [key: string]: string } = {};
    this.columnas.forEach(key => {
      entidadCabeceras[key] = "";
    });

    console.log(entidadCabeceras);

    const dialogRef = this.dialog.open(EmptyDialogComponent, {
      data: {
        component: FormularioDinamicoComponent,
        datos: {
          titulo: 'Añadir Usuario',
          //Si los campos son editables...
          editable: true,
          campos: this.camposFormulario,
          //Flag para saber si el evento es nuevo..,
          esNuevoEvento: true
        },
        eventEmitter: nuevoRegistroEmitter
      }
    });

    // Suscribirse al evento para recibir los datos del hijo
    nuevoRegistroEmitter.subscribe((registro: entidad) => {

      this._gestorDatos.addEntidad(this.entidad, registro)
        .pipe(
          tap((result => {
            if (result.status === 'exito') {
              this._abrirDialogoConfirmacion('Se ha añadido un usuario con éxito', true);
              this.cargarDatos();
            }
          }))
        ).subscribe();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo fue cerrado');
    });
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
  public detalleEntidad(entity: any, esEditable: boolean): void {

    const entidadEditada = new EventEmitter<entidad>();

    const entityCopy = { ...entity };

    if (entityCopy.contrasena !== undefined) {
        delete entityCopy.contrasena;
    }
    
    // Filtrar el array de campos, excluyendo el campo "contrasena"
    const camposSinContrasena = this.camposFormulario.filter(campo => campo.nombre !== "contrasena");

    // Asignar valores iniciales a los campos del formulario desde `entityCopy`
    camposSinContrasena.forEach(campo => {
        if (campo.nombre && entityCopy[campo.nombre] !== undefined) {
            console.log(campo.nombre)
            campo.valorInicial = entityCopy[campo.nombre];
        }
    });
    

    //Clonado del objeto...
    const oldEntity = JSON.parse(JSON.stringify(entity))

    const dialog = this.dialog.open(EmptyDialogComponent, {
      data: {
        component: FormularioDinamicoComponent,
        datos: {
          titulo:  !esEditable ? "Información de " + this.singEntity : "Editar "+this.singEntity   ,
          editable: esEditable,
          campos: camposSinContrasena,
          
        },
        eventEmitter: entidadEditada
      }
    });

    //Para editar el contacto....
    entidadEditada.subscribe((entidadUpdate: entidad) => {

      entidadUpdate.id = oldEntity.id

      //Optenemos el id del contacto actualizado...
      const index = this.datasource.data.findIndex(e => e.id === entidadUpdate.id)

      console.log(entidadUpdate)

      if (index > -1) {

        console.log('holaaa')


        //Miramos si hemos modificado algo...
        if (!sameObject(oldEntity, entidadUpdate)) {

          console.log('Editando')

          //Nos encargamos mandarle la información al php para editar el usuario
          this._gestorDatos.editEntidad(entity.id, this.entidad, entidadUpdate).subscribe({

            next: (result) => {

              this._abrirDialogoConfirmacion(`Se ha actualizado correctamente un ${this.singEntity}`, true)
              //Actualizamos la tabla para que los cambios se vean reflejados...
              this.cargarDatos();
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

