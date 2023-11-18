<script lang="ts">
	import { LinkPreview as HoverCardPrimitive } from "@/lib";
	import { cn } from "@/utils";
	import { transition } from ".";
	type $$Props = HoverCardPrimitive.ContentProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<HoverCardPrimitive.Content
	{transition}
	class={cn(
		"bg-popover text-popover-foreground z-50 w-64 rounded-md border p-4 shadow-md outline-none ",
		className
	)}
	{...$$restProps}
>
	<slot />
</HoverCardPrimitive.Content>
