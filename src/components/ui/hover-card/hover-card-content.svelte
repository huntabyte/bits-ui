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
		"z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none ",
		className
	)}
	{...$$restProps}
>
	<slot />
</HoverCardPrimitive.Content>
