<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils/styles.js";

	let { class: className, children, ...restProps }: SheetPrimitive.TitleProps = $props();
</script>

<SheetPrimitive.Title class={cn("text-foreground text-lg font-semibold", className)} {...restProps}>
	{@render children?.()}
</SheetPrimitive.Title>
