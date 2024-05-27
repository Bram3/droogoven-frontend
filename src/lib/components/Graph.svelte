<script lang="ts">
	import type { SensorData } from '$lib/types';
	import ChartComponent from './Chart.svelte';
	export let currentData: any;
	export let last24h: any;
	export let last7d: any;
	export let tabSet: number = 0;

	let _currentData: any;
	currentData.subscribe((value: any) => {
		_currentData = value;
	});

	let _last24h: any;
	last24h.subscribe((value: any) => {
		_last24h = value;
	});

	let _last7d: any;
	last7d.subscribe((value: any) => {
		_last7d = value;
	});

	let labels: any = [];
	let datasets: any = [];
	let options = {
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
	};

	$: {
		let selectedData: any;
		if (tabSet === 0) {
			selectedData = _currentData;
		} else if (tabSet === 1) {
			selectedData = _last24h;
		} else if (tabSet === 2) {
			selectedData = _last7d;
		}

		labels = Array(selectedData.length).fill('');
		datasets = [
			{
				label: 'Middle Temperature',
				data: selectedData.map((d: { temperature: any; }) => d.temperature),
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 3,
				pointRadius: 0
			},
			{
				label: 'Bottom Temperature',
				data: selectedData.map((d: { ow1: any; }) => d.ow1),
				backgroundColor: 'rgba(54, 162, 235, 0.2)',
				borderColor: 'rgba(54, 162, 235, 1)',
				borderWidth: 3,
				pointRadius: 0
			},
			{
				label: 'Top Temperature',
				data: selectedData.map((d: { ow2: any; }) => d.ow2),
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 3,
				pointRadius: 0
			},
			{
				label: 'Isolation Temperature',
				data: selectedData.map((d: { ow3: any; }) => d.ow3),
				backgroundColor: 'rgba(153, 102, 255, 0.2)',
				borderColor: 'rgba(153, 102, 255, 1)',
				borderWidth: 3,
				pointRadius: 0
			},
			{
				label: 'Cooler Temperature',
				data: selectedData.map((d: { ow4: any; }) => d.ow4),
				backgroundColor: 'rgba(255, 159, 64, 0.2)',
				borderColor: 'rgba(255, 159, 64, 1)',
				borderWidth: 3,
				pointRadius: 0
			},
			{
				label: 'Heater Temperature',
				data: selectedData.map((d: { ow5: any; }) => d.ow5),
				backgroundColor: 'rgba(255, 206, 86, 0.2)',
				borderColor: 'rgba(255, 206, 86, 1)',
				borderWidth: 3,
				pointRadius: 0
			},
			{
				label: 'Humidity',
				data: selectedData.map((d: { humidity: any; }) => d.humidity),
				backgroundColor: 'rgba(50, 100, 157, 0.2)',
				borderColor: 'rgba(50, 100, 157, 1)',
				borderWidth: 3,
				pointRadius: 0
			}
		];
	}
</script>

<ChartComponent {labels} {datasets} {options} />
