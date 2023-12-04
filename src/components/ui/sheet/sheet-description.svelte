<script lang="ts">
	import { Dialog as SheetPrimitive } from "@/lib";
	import { cn } from "@/utils";

	type $$Props = SheetPrimitive.DescriptionProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SheetPrimitive.Description
	class={cn("text-sm text-muted-foreground", className)}
	{...$$restProps}
>
	<slot />
</SheetPrimitive.Description>
