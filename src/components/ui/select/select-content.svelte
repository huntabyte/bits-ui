<script lang="ts">
	import { Select as SelectPrimitive } from "@/lib";
	import { cn } from "@/utils";
	import { transition } from ".";
	import { scale } from "svelte/transition";
	type $$Props = SelectPrimitive.ContentProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Content
	inTransition={transition}
	outTransition={scale}
	outTransitionConfig={{ start: 0.95, opacity: 0, duration: 50 }}
	class={cn(
		"bg-popover text-popover-foreground relative z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md outline-none data-[state=open]:translate-y-1",
		className
	)}
	{...$$restProps}
>
	<slot />
</SelectPrimitive.Content>
