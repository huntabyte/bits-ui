<script lang="ts">
	import Fan from "phosphor-svelte/lib/Fan";
	import { Tabs } from "bits-ui";
	import HomeSlider from "$lib/components/homepage/home-slider.svelte";

	let fanSpeed = $state(50);

	const temps: number[] = [50, 80, 95, 80, 50, 40, 60];
</script>

<div class="relative order-2 lg:order-3 lg:-translate-y-3">
	<div
		class="line_top_gradient absolute -left-10 top-0 h-[1px] w-[calc(100%+50px)] lg:hidden"
	></div>
	<div
		class="rounded-card-lg mx-1.5 my-3 flex aspect-square flex-col justify-between bg-[#e0f2fe] px-3 pb-6 pt-5 lg:m-2.5 lg:px-5 lg:pb-8 dark:bg-[#C7E6FA]"
	>
		<div class="flex justify-between">
			<Tabs.Root value="c" class="flex items-center font-medium">
				<Tabs.Content value="c" class="select-none"
					><span class="text-[2.70288rem] leading-none text-indigo-950 lg:text-[3.625rem]"
						>21</span
					></Tabs.Content
				>
				<Tabs.Content value="f" class="select-none"
					><span class="text-[2.70288rem] leading-none text-indigo-950 lg:text-[3.625rem]"
						>69</span
					></Tabs.Content
				>
				<Tabs.List class="ml-1 flex flex-col gap-[4px] text-[11px] lg:gap-2 lg:text-[14px]">
					<Tabs.Trigger
						value="c"
						class="cursor-pointer text-indigo-950/30 transition data-[state=active]:text-indigo-950 data-[state=inactive]:hover:text-indigo-950"
						>°C</Tabs.Trigger
					>
					<Tabs.Trigger
						value="f"
						class="cursor-pointer text-indigo-950/30 transition data-[state=active]:text-indigo-950 data-[state=inactive]:hover:text-indigo-950"
						>°F</Tabs.Trigger
					>
				</Tabs.List>
			</Tabs.Root>

			<div class="text-right font-semibold text-indigo-950">
				<div
					class="spin_anim ml-auto w-min"
					style="animation-duration: {(101 - fanSpeed) * 100}ms;"
				>
					<Fan class="ml-auto size-6 " />
				</div>
				<div class="lg:text-xxs mt-[0.6em] text-[7px] leading-[110%] tracking-[-0.01em]">
					Air<br />Conditioner
				</div>
			</div>
		</div>

		<div class="">
			<div class="relative my-5 flex justify-between">
				{#each temps as temp, index (index)}
					<div
						class="outer relative h-12 w-3 rounded-[35px] bg-[#000231]/10 lg:h-16 lg:w-4"
					>
						<div
							class="inner absolute bottom-0 w-full rounded-[35px] bg-indigo-950"
							style="height: {temp}%"
						></div>
					</div>
				{/each}
				<div
					class="aspect-212/30 absolute -left-1.5 top-1/2 w-[calc(100%+10px)] -translate-y-1/2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 212 30"
						fill="none"
						class="absolute left-0 top-0 h-full w-full object-contain"
					>
						<path
							d="M1 29C10.3489 20.1254 38.5826 2.10999 76.7262 1.04504C124.406 -0.286151 145.441 28.3343 170.332 28.3344C192.075 28.3345 205.975 13.5804 211 7.36823"
							stroke="#F43F5E"
							stroke-width="2"
						/>
					</svg>
				</div>
			</div>

			<HomeSlider bind:value={fanSpeed} />
		</div>
	</div>
</div>

<style>
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	.spin_anim {
		animation-name: spin;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
	.line_top_gradient {
		background:
			linear-gradient(to right, transparent 50%, var(--line) 50%),
			linear-gradient(to right, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			10px 1px,
			100% 1px;
	}
</style>
