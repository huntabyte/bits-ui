<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import X from "phosphor-svelte/lib/X";
	import { SheetOverlay, SheetPortal, type Side, sheetVariants } from "./index.js";
	import { cn } from "$lib/utils/index.js";

	let {
		side,
		class: className,
		children,
		...restProps
	}: Omit<SheetPrimitive.ContentProps & { side?: Side }, "child" | "asChild" | "ref"> = $props();
</script>

<SheetPortal>
	<SheetOverlay />
	<SheetPrimitive.Content class={cn(sheetVariants({ side }), className)} {...restProps}>
		{@render children?.()}
		<SheetPrimitive.Close
			class="focus:ring-ring data-[state=open]:bg-secondary absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
		>
			<X class="h-4 w-4" />
			<span class="sr-only">Close</span>
		</SheetPrimitive.Close>
	</SheetPrimitive.Content>
</SheetPortal>
