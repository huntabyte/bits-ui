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
	inTransitionConfig={{ y: -8, duration: 100 }}
	outTransition={scale}
	outTransitionConfig={{ start: 0.95, opacity: 0, duration: 50 }}
	class={cn(
		"relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground outline-none shadow-md data-[state=open]:translate-y-1",
		className
	)}
	{...$$restProps}
>
	<slot />
</SelectPrimitive.Content>
