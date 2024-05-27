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
	let never_ending = false;

	let temp_low = 0;
	let temp_high = 0;

	let cooler_on = 0;
	let cooler_off = 0;

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
			never_ending,
			temp_low,
			temp_high,
			cooler_on,
			cooler_off
		});
	};

	const stop = async () => {
		io.emit('stop_task', '');
		currentTask = undefined;
	};
</script>

<div class="flex justify-center p-5 h-full">
	{#if currentTask}
	<div class="flex flex-col">
		<form class="grid grid-flow-row gap-5" on:submit|preventDefault={() => {}}>
			<label>
				<p class="text-2xl font-semibold text-center pb-2">Duration</p>
				<div class="grid grid-flow-col gap-4">
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">d</div>
						<input name="days" min={0} bind:value={currentTask.days} type="number" disabled={true}/>
					</div>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">h</div>
						<input
							name="hours"
							min={0}
							bind:value={currentTask.hours}
							type="number"
							disabled={true}
						/>
					</div>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">m</div>
						<input
							name="minutes"
							min={0}
							bind:value={currentTask.minutes}
							type="number"
							disabled={true}
						/>
					</div>
				</div>
			</label>
			<label class="flex items-center space-x-2 justify-center">
				<input name="neverEnding" class="checkbox" type="checkbox" bind:checked={currentTask.never_ending} disabled={true} />
				<p>Never Ending</p>
			</label>
			<div>
				<p class="text-2xl font-semibold text-center pb-2">Temperature (°C)</p>
				<div class="grid grid-flow-col gap-4">
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">LOW</div>
						<input name="temp_low" min={0} bind:value={currentTask.temp_low} type="number" disabled />
					</div>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">HIGH</div>
						<input name="temp_high" min={0} bind:value={currentTask.temp_high} type="number" disabled />
					</div>
				</div>
			</div>
			<!-- <div>
				<p class="text-2xl font-semibold text-center pb-2">Fan (°C)</p>
				<div class="grid grid-flow-col gap-4">
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">LOW</div>
						<input name="fan_low" min={0} bind:value={currentTask.fan_low} type="number" disabled />
					</div>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">HIGH</div>
						<input name="fan_high" min={0} bind:value={currentTask.fan_high} type="number" disabled />
					</div>
				</div>
			</div> -->
			<div>
				<p class="text-2xl font-semibold text-center pb-2">Cooler (min)</p>
				<div class="grid grid-flow-col gap-4">
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">ON</div>
						<input name="cooler_on" min={0} bind:value={currentTask.cooler_on} type="number" disabled />
					</div>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">OFF</div>
						<input name="cooler_off" min={0} bind:value={currentTask.cooler_off} type="number"  disabled/>
					</div>
				</div>
			</div>
			<button on:click={stop} type="submit" class="btn variant-filled-error">Stop</button>
		</form>
		<div class="flex h-full ">
			{#if !currentTask.never_ending}
				<p class="text-2xl font-semibold text-center pb-2 self-end inline-block">
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
				<div>
					<p class="text-2xl font-semibold text-center pb-2">Temperature (°C)</p>
					<div class="grid grid-flow-col gap-4">
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<div class="input-group-shim">LOW</div>
							<input name="temp_low" min={0} bind:value={temp_low} type="number" />
						</div>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<div class="input-group-shim">HIGH</div>
							<input name="temp_high" min={0} bind:value={temp_high} type="number" />
						</div>
					</div>
				</div>
				<!-- <div>
					<p class="text-2xl font-semibold text-center pb-2">Fan (°C)</p>
					<div class="grid grid-flow-col gap-4">
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<div class="input-group-shim">LOW</div>
							<input name="fan_low" min={0} bind:value={fan_low} type="number" />
						</div>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<div class="input-group-shim">HIGH</div>
							<input name="fan_high" min={0} bind:value={fan_high} type="number" />
						</div>
					</div>
				</div> -->
				<div>
					<p class="text-2xl font-semibold text-center pb-2">Cooler (min)</p>
					<div class="grid grid-flow-col gap-4">
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<div class="input-group-shim">ON</div>
							<input name="cooler_on" min={0} bind:value={cooler_on} type="number" />
						</div>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<div class="input-group-shim">OFF</div>
							<input name="cooler_off" min={0} bind:value={cooler_off} type="number" />
						</div>
					</div>
				</div>
				<button on:click={start} type="submit" class="btn variant-filled-primary">Start</button>
			</form>
		</div>
	{/if}
</div>
