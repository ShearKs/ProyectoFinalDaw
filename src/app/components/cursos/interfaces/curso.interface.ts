export interface Curso {
    id: number;
    nombre: string;
    icono_curso: string;
    plazas: number;
    deporte: string;
    informacion?: string;
    esta_inscrito?: number;
    idDeporte?: number;
}