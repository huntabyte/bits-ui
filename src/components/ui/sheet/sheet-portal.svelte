<script lang="ts">
	import { Dialog as SheetPrimitive } from "@/lib";
	import { cn } from "@/utils";

	type $$Props = SheetPrimitive.PortalProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SheetPrimitive.Portal class={cn(className)} {...$$restProps}>
	<slot />
</SheetPrimitive.Portal>
