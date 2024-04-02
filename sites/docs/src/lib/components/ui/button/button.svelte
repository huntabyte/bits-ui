<script lang="ts">
	import { Button as ButtonPrimitive } from "bits-ui";
	import { type Size, type Variant, buttonVariants } from "./index.js";
	import { cn } from "$lib/utils/index.js";

	type $$Props = ButtonPrimitive.Props & {
		variant?: Variant;
		size?: Size;
	};

	let className: $$Props["class"] = undefined;
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let builders: $$Props["builders"] = [];
	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</ButtonPrimitive.Root>
