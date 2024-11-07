export interface Reserva {
    id?: number;
    idCliente?: number;
    idPista: number;
    idHorario: number;
    idDeporte?: number;
    fecha?: Date;
    inicio?: string; 
    fin?: string;     
}
