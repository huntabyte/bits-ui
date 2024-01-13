<script lang="ts">
	import { Dialog as SheetPrimitive } from "@/lib/index.js";
	import { cn } from "@/utils/index.js";

	type $$Props = SheetPrimitive.TitleProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SheetPrimitive.Title
	class={cn("text-lg font-semibold text-foreground", className)}
	{...$$restProps}
>
	<slot />
</SheetPrimitive.Title>
