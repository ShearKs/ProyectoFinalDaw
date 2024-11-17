export interface Curso {
    id: number;
    nombre: string;
    icono_curso: string;
    plazas: number;
    deporte: string;
    fecha_curso?:string;
    informacion?: string;
    esta_inscrito?: number;
    disponible? : boolean;
    idDeporte?: number;
}