export interface CampoFormulario {

    nombre: string;
    tipo: 'text' | 'number' | 'date' | 'select';
    label: string;
    requerido?: boolean;
    opciones?: { valor: string | number; label: string }[];
    valorInicial?: any;


}