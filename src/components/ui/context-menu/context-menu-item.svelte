<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from "@/lib";
	import { cn } from "@/utils";

	type $$Props = ContextMenuPrimitive.ItemProps & {
		inset?: boolean;
	};
	type $$Events = ContextMenuPrimitive.ItemEvents;

	let className: $$Props["class"] = undefined;
	export let inset: $$Props["inset"] = undefined;
	export { className as class };
</script>

<ContextMenuPrimitive.Item
	class={cn(
		"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ",
		inset && "pl-8",
		className
	)}
	{...$$restProps}
	on:m-click
>
	<slot />
</ContextMenuPrimitive.Item>
