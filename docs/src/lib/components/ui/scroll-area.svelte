<script lang="ts">
	import { cn } from "#lib/utils/styles.js";
	import { ScrollArea } from "bits-ui";
	import type { ComponentProps } from "svelte";

	let {
		class: className,
		children,
		scrollbarXProps,
		scrollbarYProps,
		orientation = "both",
		...restProps
	}: ComponentProps<typeof ScrollArea.Root> & {
		scrollbarXProps?: Partial<ComponentProps<typeof ScrollArea.Scrollbar>>;
		scrollbarYProps?: Partial<ComponentProps<typeof ScrollArea.Scrollbar>>;
		orientation?: "vertical" | "horizontal" | "both";
	} = $props();
</script>

<ScrollArea.Root {...restProps}>
	<ScrollArea.Viewport class={cn("max-h-[400px] max-w-[800px] py-3.5 pr-3.5", className)}>
		{@render children?.()}
	</ScrollArea.Viewport>
	{#if orientation === "vertical" || orientation === "both"}
		<ScrollArea.Scrollbar
			orientation="vertical"
			{...scrollbarYProps}
			class={cn(
				"relative flex w-2.5 touch-none rounded-full bg-background p-px transition-all duration-150 select-none before:absolute before:inset-0 before:bg-background hover:w-3 hover:bg-dark-10 data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:animate-in data-[state=visible]:fade-in-0",
				scrollbarYProps?.class
			)}
		>
			<ScrollArea.Thumb class="flex-1 rounded-full bg-muted-foreground" />
		</ScrollArea.Scrollbar>
	{/if}
	{#if orientation === "horizontal" || orientation === "both"}
		<ScrollArea.Scrollbar
			orientation="horizontal"
			{...scrollbarXProps}
			class={cn(
				"relative flex h-2.5 touch-none rounded-full bg-background p-px transition-all duration-150 select-none before:absolute before:inset-0 before:bg-background hover:h-3 hover:bg-dark-10 data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:animate-in data-[state=visible]:fade-in-0",
				scrollbarXProps?.class
			)}
		>
			<ScrollArea.Thumb class="rounded-full bg-muted-foreground" />
		</ScrollArea.Scrollbar>
	{/if}
	{#if orientation === "both"}
		<ScrollArea.Corner />
	{/if}
</ScrollArea.Root>
