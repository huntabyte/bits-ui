<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "@/lib";
	import { cn } from "@/utils";
	import { transition } from "../alert-dialog";

	type $$Props = TooltipPrimitive.ContentProps;

	let className: $$Props["class"] = undefined;
	export let sideOffset: $$Props["sideOffset"] = 4;
	export { className as class };
</script>

<TooltipPrimitive.Content
	{transition}
	transitionConfig={{ y: 8, start: 0.95, duration: 150 }}
	{sideOffset}
	class={cn(
		"bg-primary text-primary-foreground z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs ",
		className
	)}
	{...$$restProps}
>
	<slot />
</TooltipPrimitive.Content>
