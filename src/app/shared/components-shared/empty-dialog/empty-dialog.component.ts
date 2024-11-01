import { AfterViewInit, Component, ComponentRef, EventEmitter, Inject, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ContactosComponent } from "../contactos/contactos.component";
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-empty-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogModule, MatButtonModule, MatDividerModule, MatDialogActions, ContactosComponent],
  templateUrl: './empty-dialog.component.html',
  styleUrls: ['./empty-dialog.component.scss'] 
})
export class EmptyDialogComponent implements OnInit, AfterViewInit {

  //Diálogo global en la que le pasaremos al diálogo un componente y una información que será un objeto....

  @ViewChild('componenteInsertado', { read: ViewContainerRef }) contenedor !: ViewContainerRef;

  constructor(
    public dialogRef: MatDialogRef<EmptyDialogComponent>,

    //Datos que se pasan al diálogo cuando se abre
    @Inject(MAT_DIALOG_DATA) public data: { component: Type<any>, datos: any, eventEmitter: EventEmitter<any> },
  ) { }

  ngAfterViewInit(): void {
    //Carga el componente dinámico
    this.cargaComponenteDinamico();
  }

  ngOnInit(): void {

  }

  public cargaComponenteDinamico() {
    if (!this.contenedor) {
      console.error('El ViewContainerRef no está definido');
      return;
    }

    //limpia el contenedor
    this.contenedor.clear();

    if (this.data?.component) {
      try {
        //Crea el componente dinámico y lo inserta en el contenedor.
        const componentRef: ComponentRef<any> = this.contenedor.createComponent(this.data.component);

        //Si hay datos, los asigna al componente.
        if (this.data.datos) {
          console.log('Holi1')
          componentRef.instance.datos = this.data.datos;
        }

        //Si hay un eventEmitter nos subscribimos a él.
        if (this.data.eventEmitter && componentRef.instance.eventEmitter) {
          console.log('Holi2')
          componentRef.instance.eventEmitter.subscribe((nuevoElemento: any) => {
            console.log('Holi3')
            //Emite el nuevo evento
            this.data.eventEmitter.emit(nuevoElemento);
            //Una vez hayamos emitido el evento cerramos el diálogo
            this.dialogRef.close();
          })
        }

      } catch (error) {
        console.error('Error al crear el componente dinámico:', error);
      }
    } else {
      console.error('El componente a insertar no está definido');
    }
  }

  public cerrar() {
    this.dialogRef.close(true);
  }
}
