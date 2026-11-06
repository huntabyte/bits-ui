<script lang="ts">
	import { Slider } from "bits-ui";

	let value = $state(50);
</script>

<div class="flex h-[320px] w-full justify-center">
	<Slider.Root
		type="single"
		step={1}
		bind:value
		orientation="vertical"
		class="relative flex h-full touch-none flex-col items-center select-none"
		trackPadding={3}
	>
		<span class="relative h-full w-2 cursor-pointer overflow-hidden rounded-full bg-dark-10">
			<Slider.Range class="absolute w-full bg-foreground" />
		</span>
		<Slider.Thumb
			index={0}
			class="z-5 block size-[25px] cursor-pointer rounded-full border border-border-input bg-background shadow-sm transition-colors hover:border-dark-40 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-active:scale-[0.98] data-active:border-dark-40 dark:bg-foreground dark:shadow-card"
		/>
	</Slider.Root>
</div>
