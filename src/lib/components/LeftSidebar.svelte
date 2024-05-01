<script lang="ts">
	import { enhance } from '$app/forms';
	import { io } from '$lib/ws';
	import { onMount } from 'svelte';
	import { DateTime } from 'luxon';

	let currentTask: any = undefined;

	let interval: ReturnType<typeof setInterval> | undefined;

	const calculateRemainingTime = () => {
		if (!currentTask || !currentTask.start_date) return;

		// Parse the start date as UTC
		const startDate = DateTime.fromISO(currentTask.start_date, { zone: 'utc' });
		const totalDurationSeconds =
			currentTask.days * 86400 + currentTask.hours * 3600 + currentTask.minutes * 60;
		const endDate = startDate.plus({ seconds: totalDurationSeconds });
		const now = DateTime.utc();

		const secondsLeft = endDate.diff(now, 'seconds').seconds;
		if (secondsLeft > 0) {
			remainingDays = Math.floor(secondsLeft / 86400);
			remainingHours = Math.floor((secondsLeft % 86400) / 3600);
			remainingMinutes = Math.floor((secondsLeft % 3600) / 60);
			percentage = Math.round((100 - (secondsLeft / totalDurationSeconds) * 100) * 100) / 100;
		} else {
			remainingDays = 0;
			remainingHours = 0;
			remainingMinutes = 0;
			percentage = 100;
		}
	};

	onMount(() => {
		io.on('task_status', (data) => {
			currentTask = data;
		});
		io.on('task_done', () => {
			currentTask = undefined;
		});
		io.emit('get_task_status', '');
		interval = setInterval(() => {
			if (currentTask) calculateRemainingTime();
		}, 1000); // Update every second

		return () => {
			clearInterval(interval);
		};
	});

	let days = 0;
	let hours = 0;
	let minutes = 0;
	let max_temperature = 0;
	let never_ending = false;

	let remainingDays = 0;
	let remainingHours = 0;
	let remainingMinutes = 0;
	let percentage = 0;

	const start = async () => {
		if (!never_ending) {
			if (days === null || hours === null || minutes == null) {
				return;
			}
		}
		io.emit('start_task', {
			days,
			hours,
			minutes,
			max_temperature,
			never_ending
		});
	};

	const stop = async () => {
		io.emit('stop_task', '');
		currentTask = undefined;
	};
</script>

<div class="flex justify-center p-5 h-full">
	{#if currentTask}
		<div class="flex flex-col content-between justify-between w-full">
			<div class="grid grid-flow-row gap-3">
				{#if currentTask.never_ending}
					<p class="text-2xl font-semibold text-center pb-2">Never Ending</p>
				{:else}
					<p class="text-2xl font-semibold text-center pb-2">
						Duration: {currentTask.days}d {currentTask.hours}h {currentTask.minutes}m
					</p>
					<p class="text-2xl font-semibold text-center pb-2">
						Max Temperature: {currentTask.max_temperature}°C
					</p>
				{/if}

				<button on:click={stop} class="btn variant-filled-error">Stop</button>
			</div>
			<div>
				{#if !currentTask.never_ending}
					<p class="text-2xl font-semibold text-center pb-2 align-text-bottom">
						Remaining: {remainingDays}d {remainingHours}h {remainingMinutes}m ({percentage}%)
					</p>
				{/if}
			</div>
		</div>
	{:else}
		<div>
			<form class="grid grid-flow-row gap-5" on:submit|preventDefault={() => {}}>
				<label>
					<p class="text-2xl font-semibold text-center pb-2">Duration</p>
					<div class="grid grid-flow-col gap-4">
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<div class="input-group-shim">d</div>
							<input name="days" min={0} bind:value={days} type="number" disabled={never_ending} />
						</div>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<div class="input-group-shim">h</div>
							<input
								name="hours"
								min={0}
								bind:value={hours}
								type="number"
								disabled={never_ending}
							/>
						</div>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<div class="input-group-shim">m</div>
							<input
								name="minutes"
								min={0}
								bind:value={minutes}
								type="number"
								disabled={never_ending}
							/>
						</div>
					</div>
				</label>
				<label class="flex items-center space-x-2 justify-center">
					<input name="neverEnding" class="checkbox" type="checkbox" bind:checked={never_ending} />
					<p>Never Ending</p>
				</label>
				<label>
					<p class="text-2xl font-semibold text-center pb-2">Max Temperature</p>
					<input
						name="max_temperature"
						min="0"
						bind:value={max_temperature}
						class="input"
						type="number"
					/>
				</label>
				<button on:click={start} type="submit" class="btn variant-filled-primary">Start</button>
			</form>
		</div>
	{/if}
</div>
