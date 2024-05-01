export interface SensorData {
    am2320_temp: number;
    am2320_humidity: number;
    ow_temps: number[];
    average_temp: number;
}

export interface SocketEventHandlers {
    [key: string]: (data: any) => void;
}
