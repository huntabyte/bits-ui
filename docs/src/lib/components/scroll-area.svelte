<script lang="ts">
	import { cn } from "$lib/utils/styles.js";
	import { ScrollArea } from "bits-ui";
	import type { ComponentProps } from "svelte";

	let {
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof ScrollArea.Root> = $props();
</script>

<ScrollArea.Root {...restProps}>
	<ScrollArea.Viewport class={cn("max-h-[400px] max-w-[800px] py-3.5 pr-3.5", className)}>
		{@render children?.()}
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar
		orientation="vertical"
		class="hover:bg-dark-10 data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0 flex w-2.5 touch-none select-none rounded-full border-l border-l-transparent bg-transparent p-px transition-all duration-200 hover:w-3"
	>
		<ScrollArea.Thumb class="bg-muted-foreground flex-1 rounded-full" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Scrollbar
		orientation="horizontal"
		class="hover:bg-dark-10 flex h-2.5 touch-none select-none rounded-full border-t border-t-transparent bg-transparent p-px transition-all duration-200 hover:h-3 "
	>
		<ScrollArea.Thumb class="bg-muted-foreground rounded-full" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Corner />
</ScrollArea.Root>
