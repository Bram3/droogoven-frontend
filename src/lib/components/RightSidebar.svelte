<script lang="ts">
	import { onMount } from 'svelte';
	import type { SensorData } from '$lib/types';
	import { io } from '$lib/ws';

	let sensorData: SensorData | null = null;
    onMount(() => {
        io.on("sensor_state", (data) => {
		if (data) {
			sensorData = data;
		}
	});
    })

</script>

<div class="flex flex-col justify-center items-center h-full">
	{#if sensorData}
		<p>Humidity: {sensorData.humidity} RH%</p>
		<p>Average Temperature: {sensorData.average_temp}°C</p>
		<p>Middle Temperature: {sensorData.temperature}°C</p>
		<p>Bottom Temperature: {sensorData.ow1}°C</p>
		<p>Top Temperature: {sensorData.ow2}°C</p>
		<p>Isolation Temperature: {sensorData.ow3}°C</p>
		<p>Cooler Temperature: {sensorData.ow4}°C</p>
		<p>Heater Temperature: {sensorData.ow5}°C</p>


	{/if}
</div>
