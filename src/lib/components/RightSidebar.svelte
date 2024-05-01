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
		<p>Humidity: {sensorData.am2320_humidity} RH%</p>
		<p>Average Temperature: {sensorData.average_temp}°C</p>
		<p>AM Temperature: {sensorData.am2320_temp}°C</p>
		{#each sensorData.ow_temps as temp, index}
			<p>OW{index + 1} Temperature: {temp}°C</p>
		{/each}
	{/if}
</div>
