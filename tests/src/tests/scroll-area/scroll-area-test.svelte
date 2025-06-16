<script lang="ts" module>
	import { ScrollArea, type WithoutChildrenOrChild } from "bits-ui";

	export type ScrollAreaTestProps = WithoutChildrenOrChild<ScrollArea.RootProps> & {
		numParagraphs?: number;
		wrapText?: boolean;
		height?: number;
		width?: number;
	};
</script>

<script lang="ts">
	let {
		type = "hover",
		wrapText = true,
		numParagraphs = 3,
		height = 200,
		width = 250,
		...restProps
	}: ScrollAreaTestProps = $props();
</script>

<div class="flex w-[500px] max-w-[500px] flex-col gap-4">
	<select bind:value={type} id="type" data-testid="type">
		<option value="auto">auto</option>
		<option value="hover">hover</option>
		<option value="scroll">scroll</option>
		<option value="always">always</option>
	</select>
	<input type="number" bind:value={height} id="height" data-testid="height" />
	<input type="number" bind:value={width} id="width" data-testid="width" />
	<input type="checkbox" bind:checked={wrapText} id="wrap" />
	<input type="number" bind:value={numParagraphs} id="num-p" data-testid="numParagraphs" />
</div>

<ScrollArea.Root
	{...restProps}
	class="border-dark-10 bg-background-alt shadow-card relative overflow-hidden rounded-[10px] border px-4 py-4"
	{type}
	data-testid="root"
>
	<ScrollArea.Viewport
		class="h-full w-full"
		data-testid="viewport"
		style="width: {width}px; height: {height}px;"
	>
		{#each Array(numParagraphs) as _, i (i)}
			<p style:text-wrap={wrapText ? "wrap" : "nowrap"} class="w-full">
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos impedit rem,
				repellat deserunt ducimus quasi nisi voluptatem cumque aliquid esse ea deleniti
				eveniet incidunt! Deserunt minus laborum accusamus iusto dolorum. Lorem ipsum dolor
				sit, amet consectetur adipisicing elit. Blanditiis officiis error minima eos fugit
				voluptate excepturi eveniet dolore et, ratione impedit consequuntur dolorem hic quae
				corrupti autem? Dolorem, sit voluptatum.
			</p>
		{/each}
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar
		orientation="vertical"
		data-testid="scrollbar-y"
		class="h-full w-2 bg-blue-500"
	>
		<ScrollArea.Thumb data-testid="thumb-y" class="h-full w-full bg-blue-200" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Scrollbar
		orientation="horizontal"
		data-testid="scrollbar-x"
		class="h-2 w-full bg-red-500"
	>
		<ScrollArea.Thumb data-testid="thumb-x" class="h-full w-full bg-red-200" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Corner data-testid="corner" />
</ScrollArea.Root>

<div data-testid="outside">outside</div>
