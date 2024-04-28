<script lang="ts">
	import { enhance } from '$app/forms';

	export let data: any;
	let days = 0;
	let hours = 0;
	let minutes = 0;
	let temperature = 0;
	let neverEnding = false;

	if (data.task) {
		console.log('---');
		console.log(data.task);
		console.log('---');
		if (data.task.duration == -1) {
			neverEnding = true;
		} else {
			days = Math.floor(data.task.duration / (3600 * 24));
			hours = Math.floor((data.task.duration % (3600 * 24)) / 3600);
			minutes = Math.floor((data.task.duration % 3600) / 60);
			console.log(days);
		}
		temperature = data.task.temperature;
	}
	const onSubmit = () => {
		return ({ result, update }: any) => {
            if (result.type != 'success') {
                update()
            }
		};
	};
</script>

<div class="flex justify-center p-5">
	{#if data.task}
		<form class="grid grid-flow-row gap-5" use:enhance={onSubmit} method="POST" action="?/update">
			<label>
				<p class="text-2xl font-semibold text-center pb-2">Duration</p>
				<div class="grid grid-flow-col gap-4">
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">d</div>
						<input name="days" min="0" bind:value={days} type="number" placeholder="" />
					</div>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">h</div>
						<input name="hours" min="0" bind:value={hours} type="number" placeholder="" />
					</div>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">m</div>
						<input name="minutes" min="0" bind:value={minutes} type="number" placeholder="" />
					</div>
				</div>
			</label>
			<label class="flex items-center space-x-2 justify-center">
				<input name="neverEnding" class="checkbox" type="checkbox" bind:checked={neverEnding} />
				<p>Never Ending</p>
			</label>
			<label>
				<p class="text-2xl font-semibold text-center pb-2">Temperature</p>
				<input name="temperature" min="0" bind:value={temperature} class="input" type="number" />
			</label>
			<div class="grid grid-flow-col gap-4">
				<button type="submit" class="btn variant-filled-secondary">Update</button>
				<form action="?/stop" method="POST" use:enhance>
					<button type="submit" class="btn variant-filled-error">Stop</button>
				</form>
			</div>
		</form>
	{:else}
		<form class="grid grid-flow-row gap-5" use:enhance method="POST" action="?/create">
			<label>
				<p class="text-2xl font-semibold text-center pb-2">Duration</p>
				<div class="grid grid-flow-col gap-4">
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">d</div>
						<input name="days" min="0" bind:value={days} type="number" placeholder="" />
					</div>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">h</div>
						<input name="hours" min="0" bind:value={hours} type="number" placeholder="" />
					</div>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">m</div>
						<input name="minutes" min="0" bind:value={minutes} type="number" placeholder="" />
					</div>
				</div>
			</label>
			<label class="flex items-center space-x-2 justify-center">
				<input name="neverEnding" class="checkbox" type="checkbox" bind:checked={neverEnding} />
				<p>Never Ending</p>
			</label>
			<label>
				<p class="text-2xl font-semibold text-center pb-2">Temperature</p>
				<input name="temperature" min="0" bind:value={temperature} class="input" type="number" />
			</label>
			<button type="submit" class="btn variant-filled-primary">Start</button>
		</form>
	{/if}
</div>
