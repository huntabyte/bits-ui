<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from "@/lib";
	import { cn } from "@/utils";
	import { transition } from ".";

	type $$Props = ContextMenuPrimitive.SubContentProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<ContextMenuPrimitive.SubContent
	{transition}
	transitionConfig={{ x: -10, y: 0 }}
	class={cn(
		"z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-lg focus:outline-none",
		className
	)}
	{...$$restProps}
	on:keydown
	on:focusout
	on:pointermove
>
	<slot />
</ContextMenuPrimitive.SubContent>
