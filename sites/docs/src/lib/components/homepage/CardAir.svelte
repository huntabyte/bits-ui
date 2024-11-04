<script lang="ts">
	import Fan from "phosphor-svelte/lib/Fan";
	import { Tabs } from "bits-ui";
	import HomeSlider from "$lib/components/homepage/HomeSlider.svelte";
	let foo = [50];
</script>

<div class="outer relative order-2 lg:order-3">
	<div
		class="m-[10px] flex aspect-square flex-col justify-between rounded-card-lg bg-[#e0f2fe] px-5 pb-8 pt-5"
	>
		<div class="flex justify-between">
			<Tabs.Root value="c" class="flex items-center font-medium">
				<Tabs.Content value="c" class="select-none"
					><span class="temp text-indigo-950">21</span></Tabs.Content
				>
				<Tabs.Content value="f" class="select-none"
					><span class="temp text-indigo-950">69.8</span></Tabs.Content
				>

				<Tabs.List class="ml-1 flex flex-col gap-2 text-[14px]">
					<Tabs.Trigger
						value="c"
						class="text-indigo-950/30 data-[state=active]:text-indigo-950"
						>°C</Tabs.Trigger
					>
					<Tabs.Trigger
						value="f"
						class="text-indigo-950/30 data-[state=active]:text-indigo-950"
						>°F</Tabs.Trigger
					>
				</Tabs.List>
			</Tabs.Root>

			<div class="text-right font-semibold text-indigo-950">
				<div class="spin_anim" style="animation-duration: {(101 - foo) * 100}ms;">
					<Fan class="ml-auto size-6 " />
				</div>
				<div class="right_text">Air<br />Conditioner</div>
			</div>
		</div>

		<div class="">
			<div class="relative my-5 flex justify-between">
				{#each { length: 7 } as i, _}
					<div class="outer relative h-16 w-4 rounded-[35px] bg-[#000231]/10">
						<div
							class="inner absolute bottom-0 h-1/2 w-full rounded-[35px] bg-indigo-950"
						></div>
					</div>
				{/each}
				<div class="sine">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 212 30"
						fill="none"
						class=""
					>
						<path
							d="M1 29C10.3489 20.1254 38.5826 2.10999 76.7262 1.04504C124.406 -0.286151 145.441 28.3343 170.332 28.3344C192.075 28.3345 205.975 13.5804 211 7.36823"
							stroke="#F43F5E"
							stroke-width="2"
						/>
					</svg>
				</div>
			</div>

			<HomeSlider bind:value={foo} />
		</div>
	</div>
</div>

<style lang="postcss">
	.outer {
		@media screen and (min-width: 1024px) {
			transform: translateY(-12px);
		}
	}
	.temp {
		font-size: 3.625rem;
		line-height: 1;
	}
	.right_text {
		letter-spacing: -0.01em;
		font-size: 10px;
		line-height: 110%;
		margin-top: 0.6em;
	}
	.sine {
		position: absolute;
		top: 50%;
		left: -6px;
		transform: translateY(-50%);
		width: calc(100% + 10px);
		aspect-ratio: 212/30;
		svg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	.spin_anim {
		width: min-content;
		margin-left: auto;
		animation-name: spin;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
</style>
