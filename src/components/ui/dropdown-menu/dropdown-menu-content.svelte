<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "@/lib";
	import { cn } from "@/utils";
	import { contentTransition } from ".";

	type $$Props = DropdownMenuPrimitive.ContentProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<DropdownMenuPrimitive.Content
	transition={contentTransition}
	transitionConfig={{ duration: 200, y: 5, start: 0.95 }}
	class={cn(
		"z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none",
		className
	)}
	{...$$restProps}
>
	<slot />
</DropdownMenuPrimitive.Content>
