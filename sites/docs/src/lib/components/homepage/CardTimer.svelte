<script lang="ts">
	import X from "phosphor-svelte/lib/X";
	import HomeSwitch from "$lib/components/homepage/HomeSwitch.svelte";
	import HomeSelect from "$lib/components/homepage/HomeSelect.svelte";
	let checked = false;

	let startTime: number;
	let stopwatchInterval: string | number | NodeJS.Timeout | null | undefined;
	let elapsedPausedTime = 0;

	let stopwatchElement: HTMLDivElement;
	function startStopwatch() {
		if (!stopwatchInterval) {
			startTime = new Date().getTime() - elapsedPausedTime;
			stopwatchInterval = setInterval(updateStopwatch, 1000);
		}
	}

	function stopStopwatch() {
		if (stopwatchInterval !== null) {
			clearInterval(stopwatchInterval);
		}
		elapsedPausedTime = new Date().getTime() - startTime;
		stopwatchInterval = null;
	}

	function resetStopwatch() {
		stopStopwatch();
		elapsedPausedTime = 0;
		stopwatchElement.innerHTML = "0:00:00";
	}

	function updateStopwatch() {
		let currentTime = new Date().getTime();
		let elapsedTime = currentTime - startTime;
		let seconds = Math.floor(elapsedTime / 1000) % 60;
		let minutes = Math.floor(elapsedTime / 1000 / 60) % 60;
		let hours = Math.floor(elapsedTime / 1000 / 60 / 60);
		let displayTime = `${hours}:${pad(minutes)}:${pad(seconds)}`;
		stopwatchElement.innerHTML = displayTime;
	}

	function pad(number: number) {
		return (number < 10 ? "0" : "") + number;
	}
	function dispatchedEvent(e: { detail: { stopwatchState: any } }) {
		if (e.detail.stopwatchState) {
			startStopwatch();
		} else {
			resetStopwatch();
		}
	}
</script>

<div class="outer relative order-1 lg:order-5">
	<div class="line line_top"></div>
	<div class="line line_right"></div>
	<div class="m-[10px]">
		<div
			class="aspect-square w-full rounded-card-lg border border-border-input bg-white px-[14px] py-3 shadow-card"
		>
			<div class="timer mb-5 rounded-15px bg-foreground p-1">
				<div class="timer_inner rounded-xl px-2 pb-8 pt-3 text-white">
					<div class="time font-medium" bind:this={stopwatchElement}>0:00:00</div>
					<div class="text-[13px] font-medium">
						Task:
						<span class="relative ml-1 mr-2 mt-[2px] inline-flex h-[10px] w-[10px]">
							<span
								class="{checked
									? 'ping_anim'
									: ''} absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"
							></span>
							<span
								class="relative inline-flex h-[10px] w-[10px] rounded-full bg-rose-500"
							></span>
						</span>
						New app
					</div>
				</div>
				<div class="labels mb-2 mt-[9px] flex gap-[3px] px-1 font-medium">
					<div class="label active group px-2">
						design
						<X
							class="relative ml-1.5 hidden size-1.5 group-[.active]:block"
							weight="bold"
							aria-label="Close"
						/>
					</div>
					<div class="label group px-2">
						code
						<X
							class="relative ml-1.5 hidden size-1.5 group-[.active]:block"
							weight="bold"
							aria-label="Close"
						/>
					</div>
					<div class="label group px-2">
						other
						<X
							class="relative ml-1.5 hidden size-1.5 group-[.active]:block"
							weight="bold"
							aria-label="Close"
						/>
					</div>
				</div>
			</div>

			<div class="flex gap-2">
				<HomeSelect />
				<HomeSwitch bind:myChecked={checked} on:stopwatch={dispatchedEvent} />
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.line_top {
		position: absolute;
		top: 0;
		left: -40px;
		width: calc(100% + 50px);
		height: 1px;
		background: linear-gradient(to right, transparent 50%, white 50%),
			linear-gradient(to right, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			10px 1px,
			100% 1px;
	}
	.line_right {
		position: absolute;
		right: 0;
		bottom: 0;
		top: -200px;
		width: 1px;
		background: linear-gradient(to top, transparent 50%, white 50%),
			linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			1px 10px,
			100% 100%;
		transform: rotate(180deg);
	}
	.outer {
		@media screen and (min-width: 1024px) {
			transform: translateY(7%);
		}
	}
	.timer_inner {
		background: rgba(81, 84, 95, 0.6);
	}
	.time {
		font-size: 2.563rem;
		line-height: 100%;
	}
	.label {
		display: flex;
		align-items: center;
		font-size: 11px;
		border-radius: 25px;

		background: #31343e;
		color: rgba(255, 255, 255, 0.7);
		&.active {
			color: hsl(var(--foreground));
			background: white;
		}
	}
	.ping_anim {
		animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
	}
	@keyframes ping {
		75%,
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}
</style>
