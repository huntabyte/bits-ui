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
		class="relative flex h-full touch-none select-none flex-col items-center"
		trackPadding={3}
	>
		<span class="bg-dark-10 relative h-full w-2 cursor-pointer overflow-hidden rounded-full">
			<Slider.Range class="bg-foreground absolute w-full" />
		</span>
		<Slider.Thumb
			index={0}
			class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card data-active:border-dark-40 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
		/>
	</Slider.Root>
</div>
