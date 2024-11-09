export interface CampoFormulario {
    nombre: string;
    tipo: 'text' | 'number' | 'date' | 'select' | 'hidden';
    label: string;
    requerido?: boolean;
    opciones?: { valor: string | number; label: string }[];
    valorInicial?: string | number;  // Permite valores de tipo string o number
  }
  