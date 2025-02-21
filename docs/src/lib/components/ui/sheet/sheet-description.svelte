<script lang="ts">
	import { Dialog as SheetPrimitive, type WithoutChildren } from "bits-ui";
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils/styles.js";

	let {
		class: className,
		children,
		...restProps
	}: WithoutChildren<SheetPrimitive.DescriptionProps> & { children?: Snippet } = $props();
</script>

<SheetPrimitive.Description class={cn("text-muted-foreground text-sm", className)} {...restProps}>
	{@render children?.()}
</SheetPrimitive.Description>
