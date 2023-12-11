<script lang="ts">
	import { Slider } from "$lib";

	let value = [50];
</script>

<div class="w-full md:max-w-[280px]">
	<Slider.Root
		bind:value
		class="relative flex w-full touch-none select-none items-center"
	>
		<span
			class="relative h-2 w-full grow overflow-hidden rounded-full bg-dark-10"
		>
			<Slider.Range class="absolute h-full bg-foreground" />
		</span>
		<Slider.Thumb
			class="block rounded-full border border-border-input bg-background shadow transition-colors sq-[27px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 active:scale-98 disabled:pointer-events-none disabled:opacity-50"
		/>
	</Slider.Root>
</div>
