export interface Usuario {

  id?: number;
  nombre_usuario: string;
  nombre: string;
  apellidos: string;
  telefono: number;
  email: string;
  contrasena?: string;
  fecha_add?: string | null;
  fecha_nac: string;
  id_usuario?: number;
  tipo_usuario?: string
}