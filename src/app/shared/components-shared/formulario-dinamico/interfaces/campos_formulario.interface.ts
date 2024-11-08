export interface CampoFormulario {

    nombre: string;
    tipo: 'text' | 'number' | 'date' | 'select';
    label: string;
    requerido?: boolean;
    opciones?: string[]; //opciones para los selects...
    valorInicial?: any;

}