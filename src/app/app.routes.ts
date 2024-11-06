import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';

import { ElegirDeporteComponent } from './components/elegir-deporte/elegir-deporte.component';
import { ReservarDeporteComponent } from './components/reservar-deporte/reservar-deporte.component';
import { HomeComponent } from './components/home/home.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { FormularioComponent } from './shared/components-shared/formulario/formulario.component';
import { ContactosComponent } from './shared/components-shared/contactos/contactos.component';
import { AuthGuard } from './auth/auth.guard';
import { CanActivateGuard } from './auth/can-activate.guard';
import { MenuComponent } from './shared/components-shared/menu/menu.component';


export const routes: Routes = [

    {
        canActivate: [CanActivateGuard],
        path: 'login',
        component: LoginComponent
    },
    {
        canActivate: [CanActivateGuard],
        path: 'registro',
        component: RegistroComponent
    },
    {
        canActivate: [AuthGuard],
        path: '',
        component: HomeComponent
    },
    {
        canActivate: [AuthGuard],
        path: 'perfil',
        component: PerfilComponent
    },
    {
        canActivate: [AuthGuard],
        path: 'cursos',
        component: CursosComponent
    },
    {
        path: 'ejemplos',
        children: [

            {
                canActivate: [AuthGuard],
                path: 'formulario',
                component: FormularioComponent
            },
           
        ]
    },
    {
        canActivate: [AuthGuard],
        path: 'usuarios',
        component: ContactosComponent,
        data: {
            entidad: 'usuarios',
            columnasListar: ['id', 'nombre_usuario', 'nombre', 'apellidos', 'email', 'telefono', 'fecha_nac', 'tipo_usuario'],
            tiposCampos: {
                text: [],
                date: [],
                select: [],
                password: [],
            },
            //Objeto que le pasas el tipo y el campo que es y se encarga en formulario de eliminarlo.
            inputsElimForm: {
                text: [''],
                date: ['fecha_add'],
                select: ['estado'],
            }
        }

    },
    // {
    //     canActivate: [AuthGuard],
    //     component: MenuComponent
    // },
    {
        canActivate: [AuthGuard],
        path: 'contactos',
        component: ContactosComponent
    },
    {
        canActivate: [AuthGuard],
        path: 'cursos',
        component: CursosComponent
    },
    {
        canActivate: [AuthGuard],
        path: 'elegir-deporte',
        component: ElegirDeporteComponent
    },
    {
        canActivate: [AuthGuard],
        path: 'reservar-deporte/:nombre',
        component: ReservarDeporteComponent
    }


];
