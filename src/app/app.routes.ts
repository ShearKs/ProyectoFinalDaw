import { Routes } from '@angular/router';
import { TablaApiComponent } from './tabla-api/tabla-api.component';
import { FormularioComponent } from './shared/components/formulario/formulario.component';
import { LoginComponent } from './shared/components/login/login.component';
import { ContactosComponent } from './shared/components/contactos/contactos.component';
import { ElegirDeporteComponent } from './components/elegir-deporte/elegir-deporte.component';
import { ReservarDeporteComponent } from './components/reservar-deporte/reservar-deporte.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [

    {
        path:'',
        component: HomeComponent
    }
    ,
    {
        path: 'ejemplos', // Ruta padre "Ejemplos"
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
                path: 'formulario',
                component: FormularioComponent
            }
        ]
    },
    {
        path: 'contactos',
        component: ContactosComponent
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
