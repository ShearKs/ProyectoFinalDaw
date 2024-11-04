export interface Reserva {
    id?: number;
    idCliente?: number;
    idPista: number;
    idHorario: number;
    idDeporte?: number;
    fecha?: string;
    inicio?: string; 
    fin?: string;     
}
