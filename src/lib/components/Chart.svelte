<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount, onDestroy } from 'svelte';

	export let labels: string[] = [];
	export let datasets: { label: string, data: number[], backgroundColor: string, borderColor: string, borderWidth: number }[] = [];
	export let options: object = {};

	let chart: Chart;

	onMount(() => {
		const ctx = document.getElementById('chart') as HTMLCanvasElement;
		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels,
				datasets
			},
			options
		});
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});

	$: {
		if (chart) {
			chart.data.labels = labels;
			chart.data.datasets.forEach((dataset, index) => {
				dataset.data = datasets[index].data;
			});
			chart.update();
		}
	}
</script>

<canvas id="chart"></canvas>
