<script lang="ts">
	import { Menubar as MenubarPrimitive } from "@/lib";
	import { cn } from "@/utils";
	import { ChevronRight } from "radix-icons-svelte";

	type $$Props = MenubarPrimitive.SubTriggerProps & {
		inset?: boolean;
	};
	type $$Events = MenubarPrimitive.SubTriggerEvents;

	let className: $$Props["class"] = undefined;
	export let inset: $$Props["inset"] = undefined;
	export { className as class };
</script>

<MenubarPrimitive.SubTrigger
	class={cn(
		"data-[highlighted]:text-accent-foreground data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[state=open]:bg-accent",
		inset && "pl-8",
		className
	)}
	{...$$restProps}
	on:click
	on:keydown
	on:focusin
	on:focusout
	on:pointermove
	on:pointerleave
>
	<slot />
	<ChevronRight class="ml-auto h-4 w-4" />
</MenubarPrimitive.SubTrigger>
