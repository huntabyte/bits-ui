<script lang="ts" module>
	import { ScrollArea, type WithoutChildrenOrChild } from "bits-ui";

	export type ScrollAreaStyleOverrideTestProps = WithoutChildrenOrChild<ScrollArea.RootProps> & {
		scrollbarYStyle?: string;
	};
</script>

<script lang="ts">
	let { scrollbarYStyle, ...restProps }: ScrollAreaStyleOverrideTestProps = $props();
</script>

<ScrollArea.Root
	{...restProps}
	type="always"
	data-testid="root"
	style="width: 200px; height: 100px;"
>
	<ScrollArea.Viewport class="h-full w-full" data-testid="viewport">
		{#each Array(20) as _, i (i)}
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos impedit rem,
				repellat deserunt ducimus quasi nisi voluptatem.
			</p>
		{/each}
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar orientation="vertical" data-testid="scrollbar-y" style={scrollbarYStyle}>
		<ScrollArea.Thumb data-testid="thumb-y" />
	</ScrollArea.Scrollbar>
</ScrollArea.Root>
