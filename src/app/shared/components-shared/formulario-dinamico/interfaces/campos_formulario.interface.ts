export interface CampoFormulario {
  nombre: string;
  tipo: 'text' | 'number' | 'password' | 'date' | 'time' | 'text' | 'select' | 'hidden';
  label: string;
  requerido?: boolean;
  opciones?: { valor: string | number; label: string }[];
  valorInicial?: string | number;  // Permite valores de tipo string o number
}
