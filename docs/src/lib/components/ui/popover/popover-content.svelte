<script lang="ts">
	import { cn } from "#lib/utils/styles.js";
	import { Popover } from "bits-ui";
	import type { ComponentProps } from "svelte";

	let { class: className, ...restProps }: ComponentProps<typeof Popover.Content> = $props();
</script>

<Popover.Content
	class={cn(
		"z-50 origin-(--bits-popover-content-transform-origin) rounded-card border-2 border-border bg-zinc-50 p-4 shadow-popover data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:bg-[#121212]",
		className
	)}
	{...restProps}
/>
