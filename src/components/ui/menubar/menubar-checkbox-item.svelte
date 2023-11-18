<script lang="ts">
	import { Menubar as MenubarPrimitive } from "@/lib";
	import { cn } from "@/utils";
	import { Check } from "radix-icons-svelte";

	type $$Props = MenubarPrimitive.CheckboxItemProps;
	let className: $$Props["class"] = undefined;
	export { className as class };
	export let checked: $$Props["checked"] = undefined;
</script>

<MenubarPrimitive.CheckboxItem
	bind:checked
	class={cn(
		"data-[highlighted]:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[disabled]:opacity-50",
		className
	)}
	{...$$restProps}
	on:focusin
	on:focusout
	on:keydown
	on:pointerdown
	on:pointerleave
	on:pointermove
>
	<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
		<MenubarPrimitive.CheckboxIndicator>
			<Check class="h-4 w-4" />
		</MenubarPrimitive.CheckboxIndicator>
	</span>
	<slot />
</MenubarPrimitive.CheckboxItem>
