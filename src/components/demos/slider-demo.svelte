<script lang="ts">
	import { Slider } from "$lib/index.js";

	let value = [50];
</script>

<div class="w-full md:max-w-[280px]">
	<Slider.Root
		bind:value
		let:thumbs
		class="relative flex w-full touch-none select-none items-center"
	>
		<span class="relative h-2 w-full grow overflow-hidden rounded-full bg-dark-10">
			<Slider.Range class="absolute h-full bg-foreground" />
		</span>
		{#each thumbs as thumb}
			<Slider.Thumb
				{thumb}
				class="block size-[25px] cursor-pointer rounded-full border border-border-input bg-background shadow  transition-colors hover:border-dark-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 active:scale-98 disabled:pointer-events-none disabled:opacity-50 dark:bg-foreground dark:shadow-card"
			/>
		{/each}
	</Slider.Root>
</div>
