<script lang="ts">
	import Graph from '$lib/components/Graph.svelte';
	import RightSidebar from '$lib/components/RightSidebar.svelte';
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import { PUBLIC_API } from '$env/static/public';
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	import { io } from '$lib/ws';
	import { onMount } from 'svelte';
	import type { SensorData } from '$lib/types';
	import { currentData, last24h, last7d } from '$lib/data';
	let tabSet: number = 0;
	

	onMount(() => {
		io.on('sensor_state', (data: SensorData) => {
			let d: any = $currentData
			d.push(data);
			if (d.length > 300) {
				d.shift();
			}
			currentData.set(d);
		});

		io.on('sensor_data_24h', (data: any) => {
			
			last24h.set(data);

		});

		io.on('sensor_data_7d', (data: any) => {
			last7d.set(data);
		});
	});

	$: {
		if (tabSet === 1) {
			io.emit('get_sensors_24h', '');
		} else if (tabSet === 2) {
			io.emit('get_sensors_7d', '');
		}
	}
</script>

<div class="flex flex-col h-full justify-center items-center p-5">
	<div class="grid grid-cols-10 w-screen h-full">
		<div class="col-span-3">
			<LeftSidebar />
		</div>
		<div class="col-span-5">
			<TabGroup>
				<Tab bind:group={tabSet} name="tab1" value={0}>Now</Tab>
				<Tab bind:group={tabSet} name="tab2" value={1}>Last 24h</Tab>
				<Tab bind:group={tabSet} name="tab3" value={2}>Last week</Tab>
			</TabGroup>
			<!-- Tab Panels -->
			<div class="relative h-[85%]">
				<Graph {currentData} {last24h} {last7d} {tabSet} />
			</div>
		</div>
		<div class="col-span-2">
			<RightSidebar />
		</div>
	</div>
</div>
