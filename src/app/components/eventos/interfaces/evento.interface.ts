export interface Evento {
    id: number;
    nombre: string;
    plazas_disponibles: string;
    hora_salida: string;
    fecha_evento: Date;
    distancia: string;
    descripcion: string;
    idDeporte: number;
  
    // Permite indexar propiedades dinámicas de tipo 'string' y que el valor sea de cualquier tipo.
    [key: string]: any;
  }
  