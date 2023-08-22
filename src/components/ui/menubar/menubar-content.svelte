<script lang="ts">
	import { Menubar as MenubarPrimitive } from "@/lib";
	import { cn } from "@/utils";
	import { transition } from ".";
	type $$Props = MenubarPrimitive.ContentProps;
	let className: $$Props["class"] = undefined;
	export { className as class };
	export let sideOffset = 4;
</script>

<MenubarPrimitive.Content
	{transition}
	{sideOffset}
	class={cn(
		"z-50 min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none",
		className
	)}
	{...$$restProps}
>
	<slot />
</MenubarPrimitive.Content>
