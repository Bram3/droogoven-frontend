export interface SensorData {
    temperature: number;
    humidity: number;
    ow1: number;
    ow2: number;
    ow3: number;
    ow4: number;
    ow5: number;
    average_temp: number;
}

export interface SocketEventHandlers {
    [key: string]: (data: any) => void;
}
