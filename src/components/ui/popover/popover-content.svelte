<script lang="ts">
	import { Popover as PopoverPrimitive } from "@/lib";
	import { cn } from "@/utils";
	import { transition } from ".";
	type $$Props = PopoverPrimitive.ContentProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<PopoverPrimitive.Content
	{transition}
	{...$$restProps}
	class={cn(
		"bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-none ",
		className
	)}
>
	<slot />
</PopoverPrimitive.Content>
