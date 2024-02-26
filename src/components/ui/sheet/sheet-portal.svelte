<script lang="ts">
	import { Dialog as SheetPrimitive } from "$lib/index.js";
	import { cn } from "@/utils/index.js";

	type $$Props = SheetPrimitive.PortalProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SheetPrimitive.Portal class={cn(className)} {...$$restProps}>
	<slot />
</SheetPrimitive.Portal>
