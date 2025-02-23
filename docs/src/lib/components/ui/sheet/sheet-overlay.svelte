<script lang="ts">
	import { Dialog as SheetPrimitive, type WithoutChildren } from "bits-ui";
	import { cn } from "$lib/utils/styles.js";

	let { class: className, ...restProps }: WithoutChildren<SheetPrimitive.OverlayProps> = $props();
</script>

<SheetPrimitive.Overlay
	class={cn("bg-background/80 backdrop-blur-xs fixed inset-0 z-50", className)}
	{...restProps}
/>
