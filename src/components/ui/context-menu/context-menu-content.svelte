<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from "@/lib";
	import * as ContextMenu from ".";
	import { cn } from "@/utils";

	type $$Props = ContextMenuPrimitive.ContentProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<ContextMenuPrimitive.Content
	transition={ContextMenu.transition}
	class={cn(
		"z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none",
		className
	)}
	{...$$restProps}
>
	<slot />
</ContextMenuPrimitive.Content>
