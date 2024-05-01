<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import type { SensorData } from '$lib/types';
	import { io } from '$lib/ws';

	onMount(() => {
		const ctx = document.getElementById('chart') as HTMLCanvasElement;
		const chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: Array(50).fill(''), // Fill the array with empty strings
				datasets: [
					{
						label: 'Temperature',
						data: [],
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
						borderColor: 'rgba(255, 99, 132, 1)',
						borderWidth: 1
					},
					{
						label: 'Humidity',
						data: [],
						backgroundColor: 'rgba(50, 100, 157, 0.2)',
						borderColor: 'rgba(50, 100, 157, 1)',
						borderWidth: 1
					}
				]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							color: 'white',
							stepSize: 5
						}
					},
					x: {
						display: false
					}
				},
				animation: {
					duration: 0 // Turn off animations for smoother updates
				},
				color: 'white',
				maintainAspectRatio: false
			}
		});
		io.on('sensor_state', (data) => {
			data = data as SensorData

			if (data) {
				if (chart.data.datasets[0].data.length >= 50) {
					chart.data.datasets[0].data.shift(); // For temperature
					chart.data.datasets[1].data.shift(); // For humidity
				}
				//@ts-ignore
				chart.data.datasets[0].data.push(data.average_temp);
				//@ts-ignore
				chart.data.datasets[1].data.push(data.am2320_humidity);

				chart.update();
			}
		});
	});
</script>

<canvas id="chart"></canvas>
