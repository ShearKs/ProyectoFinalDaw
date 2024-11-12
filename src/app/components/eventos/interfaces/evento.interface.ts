export interface Evento {
    id: number;
    nombre: string;
    plazas_disponibles: string;
    hora_salida: string;
    fecha_evento: Date;
    distancia: string;
    descripcion: string;
    esta_inscrito?: number;

    //Necesario para los valores por defecto de los select..
    idDeporte: number;
    deporte?:string;


    lugar? :string;
    latitud?: number;
    longitud?: number;
  
    // Permite indexar propiedades dinámicas de tipo 'string' y que el valor sea de cualquier tipo.
    [key: string]: any;
  }
  