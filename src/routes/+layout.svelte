<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { io } from '$lib/ws';

	import { getToastStore } from '@skeletonlabs/skeleton';
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';

initializeStores();
const toastStore = getToastStore();

	onMount(() => {
		io.on("response", (data) => {
			toastStore.trigger({message: data.message, background: "variant-filled-success"})
		})
		io.on("response-error", (data) => {
			toastStore.trigger({message: data.message, background: "variant-filled-error"})
		})
	})
</script>

<Toast position="tr"/>
<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Droogoven</strong>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
