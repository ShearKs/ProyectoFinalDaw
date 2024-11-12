export interface Reserva {
    id?: number;
    nombreCliente?: string;
    deporte?: string;
    idCliente?: number;
    idPista: number;
    pista_nombre?: string;
    idHorario: number;
    idDeporte?: number;
    fecha?: Date | string | null;
    inicio?: string;
    fin?: string;
    estado_reserva?: string;
}
