<script lang="ts">
	import { Menubar as MenubarPrimitive } from "@/lib";
	import { transition } from ".";
	import { cn } from "@/utils";

	type $$Props = MenubarPrimitive.SubContentProps;
	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<MenubarPrimitive.SubContent
	{transition}
	transitionConfig={{ x: -5, y: 0 }}
	class={cn(
		"bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-md border p-1 shadow-lg  focus:outline-none",
		className
	)}
	{...$$restProps}
	on:keydown
	on:focusout
	on:pointermove
>
	<slot />
</MenubarPrimitive.SubContent>
