export interface CampoFormulario {
  nombre: string;
  //Los tipos de datos que puede haber en la base de datos
  tipo: 'text' | 'textarea' | 'number' | 'password' | 'date' | 'time' | 'text' | 'select' | 'hidden';
  label: string;
  requerido?: boolean;
  opciones?: { valor: string | number; label: string }[];
  valorInicial?: string | number;  // Permite valores de tipo string o number
}
