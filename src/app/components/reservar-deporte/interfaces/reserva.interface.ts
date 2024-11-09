export interface Reserva {
    id?: number;
    idCliente?: number;
    idPista: number;
    idHorario: number;
    idDeporte?: number;
    fecha?: Date | string | null;
    inicio?: string;
    fin?: string;
}
