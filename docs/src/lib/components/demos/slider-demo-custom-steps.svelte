<script lang="ts">
	import { Slider } from "bits-ui";

	// Font size example with common typography sizes
	let fontSize = $state(16);
	const fontSizes = [8, 16, 24, 32, 48, 96];

	// Design system spacing example
	let spacing = $state([8, 32]);
	const spacingSteps = [4, 8, 16, 32, 64];

	// Zoom levels example
	let zoom = $state(100);
	const zoomLevels = [25, 50, 100, 200, 400];

	// Breakpoint example
	let breakpoints = $state([640, 1024]);
	const breakpointSteps = [320, 640, 1024, 1536];
</script>

<div class="space-y-8">
	<!-- Font Size Selector -->
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-medium">Font Size</h3>
			<span class="text-muted-foreground text-xs">{fontSize}px</span>
		</div>
		<div class="w-full md:max-w-[320px]">
			<Slider.Root
				type="single"
				step={fontSizes}
				min={8}
				max={64}
				bind:value={fontSize}
				class="relative flex w-full touch-none select-none items-center"
			>
				{#snippet children({ ticks })}
					<span
						class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
					>
						<Slider.Range class="bg-foreground absolute h-full" />
					</span>
					<Slider.Thumb
						index={0}
						class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card focus-visible:outline-hidden z-5 data-active:scale-[0.98] data-active:border-dark-40 block size-[20px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					/>
					{#each ticks as tick (tick)}
						<Slider.Tick
							index={tick}
							class="dark:bg-background/20 bg-background z-1 h-2 w-[1px]"
						/>
					{/each}
				{/snippet}
			</Slider.Root>
		</div>
		<div class="text-muted-foreground text-xs">
			Common typography sizes: 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64px
		</div>
		<div class="rounded-md border p-3">
			<p style="font-size: {fontSize}px">Sample text at {fontSize}px</p>
		</div>
	</div>

	<!-- Spacing Range Selector -->
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-medium">Design System Spacing</h3>
			<span class="text-muted-foreground text-xs">{spacing[0]}px - {spacing[1]}px</span>
		</div>
		<div class="w-full md:max-w-[320px]">
			<Slider.Root
				step={spacingSteps}
				min={4}
				max={64}
				type="multiple"
				bind:value={spacing}
				class="relative flex w-full touch-none select-none items-center"
			>
				{#snippet children({ ticks, thumbs })}
					<span
						class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
					>
						<Slider.Range class="bg-foreground absolute h-full" />
					</span>
					{#each thumbs as thumb (thumb)}
						<Slider.Thumb
							index={thumb}
							class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card focus-visible:outline-hidden z-5 data-active:scale-[0.98] data-active:border-dark-40 block size-[20px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
						/>
					{/each}
					{#each ticks as tick (tick)}
						<Slider.Tick
							index={tick}
							class="dark:bg-background/20 bg-background z-1 h-2 w-[1px]"
						/>
					{/each}
				{/snippet}
			</Slider.Root>
		</div>
		<div class="text-muted-foreground text-xs">
			Design system values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
		</div>
		<div class="flex gap-2">
			<div class="rounded-md border p-2" style="padding: {spacing[0]}px">
				Min: {spacing[0]}px padding
			</div>
			<div class="rounded-md border p-2" style="padding: {spacing[1]}px">
				Max: {spacing[1]}px padding
			</div>
		</div>
	</div>

	<!-- Zoom Level Selector -->
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-medium">Zoom Level</h3>
			<span class="text-muted-foreground text-xs">{zoom}%</span>
		</div>
		<div class="w-full md:max-w-[320px]">
			<Slider.Root
				type="single"
				step={zoomLevels}
				min={25}
				max={300}
				bind:value={zoom}
				class="relative flex w-full touch-none select-none items-center"
			>
				{#snippet children({ ticks })}
					<span
						class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
					>
						<Slider.Range class="bg-foreground absolute h-full" />
					</span>
					<Slider.Thumb
						index={0}
						class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card focus-visible:outline-hidden z-5 data-active:scale-[0.98] data-active:border-dark-40 block size-[20px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					/>
					{#each ticks as tick (tick)}
						<Slider.Tick
							index={tick}
							class="dark:bg-background/20 bg-background z-1 h-2 w-[1px]"
						/>
					{/each}
				{/snippet}
			</Slider.Root>
		</div>
		<div class="text-muted-foreground text-xs">
			Common zoom levels: 25%, 50%, 75%, 100%, 125%, 150%, 200%, 250%, 300%
		</div>
		<div class="overflow-hidden rounded-md border p-3">
			<div
				style="transform: scale({zoom / 100}); transform-origin: top left; width: {100 /
					(zoom / 100)}%"
			>
				<div
					class="flex h-16 w-32 items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-sm text-white"
				>
					{zoom}% Scale
				</div>
			</div>
		</div>
	</div>

	<!-- Breakpoint Selector -->
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-medium">Responsive Breakpoints</h3>
			<span class="text-muted-foreground text-xs"
				>{breakpoints[0]}px - {breakpoints[1]}px</span
			>
		</div>
		<div class="w-full md:max-w-[320px]">
			<Slider.Root
				step={breakpointSteps}
				min={320}
				max={1536}
				type="multiple"
				bind:value={breakpoints}
				class="relative flex w-full touch-none select-none items-center"
			>
				{#snippet children({ ticks, thumbs })}
					<span
						class="bg-dark-10 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
					>
						<Slider.Range class="bg-foreground absolute h-full" />
					</span>
					{#each thumbs as thumb (thumb)}
						<Slider.Thumb
							index={thumb}
							class="border-border-input bg-background hover:border-dark-40 focus-visible:ring-foreground dark:bg-foreground dark:shadow-card focus-visible:outline-hidden z-5 data-active:scale-[0.98] data-active:border-dark-40 block size-[20px] cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
						/>
					{/each}
					{#each ticks as tick (tick)}
						<Slider.Tick
							index={tick}
							class="dark:bg-background/20 bg-background z-1 h-2 w-[1px]"
						/>
					{/each}
				{/snippet}
			</Slider.Root>
		</div>
		<div class="text-muted-foreground text-xs">
			Standard breakpoints: 320px (mobile), 480px, 640px (sm), 768px (md), 1024px (lg), 1280px
			(xl), 1536px (2xl)
		</div>
		<div class="space-y-2">
			<div class="text-xs font-medium">Selected range covers:</div>
			<div class="flex flex-wrap gap-1 text-xs">
				{#each breakpointSteps.filter((bp) => bp >= breakpoints[0] && bp <= breakpoints[1]) as bp (bp)}
					<span class="bg-muted text-muted-foreground rounded px-2 py-1">
						{bp}px
						{#if bp === 320}
							(mobile)
						{:else if bp === 640}
							(sm)
						{:else if bp === 768}
							(md)
						{:else if bp === 1024}
							(lg)
						{:else if bp === 1280}
							(xl)
						{:else if bp === 1536}
							(2xl)
						{/if}
					</span>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	/* Ensure proper scaling for zoom demo */
	:global(.zoom-container) {
		overflow: hidden;
	}
</style>
