<script lang="ts">
    export let data: PageData

	import Graph from '$lib/components/Graph.svelte';
	import RightSidebar from '$lib/components/RightSidebar.svelte';
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import type { PageData } from './$types';
</script>

<div class="flex flex-col h-full justify-center items-center p-5">
	<div class="grid grid-cols-10 w-screen h-full">
		<div class="col-span-2">
			<LeftSidebar {data}/>
		</div>
		<div class="col-span-6">
            <Graph />

        </div>
		<div class="col-span-2">
            <RightSidebar/>
        </div>
	</div>
</div>
