import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { PUBLIC_WS } from "$env/static/public"

export interface SensorData {
    am2320_temp: number;
    am2320_humidity: number;
    ow_temps: number[];
    average_temp: number;
}

// Define a function to create the WebSocket store
export function createWebSocketStore(url: string, protocol: string): Readable<SensorData | null> {
    return readable<SensorData | null>(null, (set) => {
        const socket = new WebSocket(url, protocol);

        socket.addEventListener("open", () => {
            console.log("WebSocket connection established.");
        });

        socket.addEventListener("message", (event) => {
            console.log('Received data:', event.data);
            let data = JSON.parse(event.data) as SensorData;
            set(data);
        });

        socket.addEventListener("error", (error) => {
            console.error("WebSocket error:", error);
        });

        socket.addEventListener("close", () => {
            console.log("WebSocket connection closed.");
        });

        // Cleanup function when the store is unsubscribed
        return () => {
            console.log("Closing WebSocket.");
            socket.close();
        };
    });
}

// Use the function to create the store
export const websocketStore = createWebSocketStore(`${PUBLIC_WS}`, 'echo-protocol');
