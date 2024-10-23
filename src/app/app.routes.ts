import { Routes } from '@angular/router';
import { TablaApiComponent } from './tabla-api/tabla-api.component';
import { FormularioComponent } from './shared/components/formulario/formulario.component';
import { LoginComponent } from './auth/login/login.component';
import { ContactosComponent } from './shared/components/contactos/contactos.component';
import { ElegirDeporteComponent } from './components/elegir-deporte/elegir-deporte.component';
import { ReservarDeporteComponent } from './components/reservar-deporte/reservar-deporte.component';
import { HomeComponent } from './components/home/home.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { RegistroComponent } from './auth/registro/registro.component';

export const routes: Routes = [

    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'ejemplos',
        children: [
            {
                path: 'tabla-api',
                component: TablaApiComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'registro',
                component: RegistroComponent
            },
            {
                path: 'formulario',
                component: FormularioComponent
            },
            {
                path: 'perfil',
                component: PerfilComponent
            }
        ]
    },
    {
        path: 'usuarios',
        component: ContactosComponent,
        data: {
            entidad: 'usuarios',
            columnasListar: ['id', 'nombre_usuario', 'nombre', 'apellidos','email','telefono','fecha_nac','tipo_usuario'],
            tiposCampos: {
                text:[],
                date:[],
                select : [],
                password:[],
                

            },
            //Objeto que le pasas el tipo y el campo que es y se encarga en formulario de eliminarlo.
            inputsElimForm: {
                text: [''],
                date: ['fecha_add'],
                select: ['estado'],
            }
        }

    },
    {
        path: 'contactos',
        component: ContactosComponent
    },
    {
        path: 'cursos',
        component: CursosComponent
    },
    {
        path: 'elegir-deporte',
        component: ElegirDeporteComponent
    },
    {
        path: 'elegir-deporte/reservar-deporte/:id',
        component: ReservarDeporteComponent
    }


];
