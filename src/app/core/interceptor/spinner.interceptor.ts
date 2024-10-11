//PARA HACER EL INTERCEPTOR DE MANERA FUNCIONAL


// import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
// import { finalize, Observable } from "rxjs";
// import { ServicioCargaService } from "../servicies/servicio-carga.service";
// import { inject } from "@angular/core";

// export const spinnerInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
//     const spinnerService = inject(ServicioCargaService);
//     spinnerService.muestra();
//     return next(req).pipe(
//         finalize(() => spinnerService.ocultar())
//     );
// }

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { finalize, Observable } from "rxjs";
import { ServicioCargaService } from "../servicies/servicio-carga.service";
import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()

export class SpinnerInterceptor implements HttpInterceptor, OnInit {

    private rutaActual !: string;
    private rutasAdmitidas = [
        ''
    ]

    constructor(private router: Router, private spinnerService: ServicioCargaService) { }
    ngOnInit(): void {
        this.rutaActual = this.router.url;
        console.log('Ruta actual :', this.rutaActual)
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.spinnerService.muestra();
        return next.handle(req).pipe(
            finalize(() => this.spinnerService.ocultar())
        );
    }
}