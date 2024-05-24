<script lang="ts">

	import Graph from '$lib/components/Graph.svelte';
	import RightSidebar from '$lib/components/RightSidebar.svelte';
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import { io } from 'socket.io-client';
	import { PUBLIC_API } from '$env/static/public';

</script>

<div class="flex flex-col h-full justify-center items-center p-5">
	<div class="grid grid-cols-10 w-screen h-full">
		<div class="col-span-3">
			<LeftSidebar/>
		</div>
		<div class="col-span-5">
            <Graph />

        </div>
		<div class="col-span-2">
            <RightSidebar/>
        </div>
	</div>
</div>
