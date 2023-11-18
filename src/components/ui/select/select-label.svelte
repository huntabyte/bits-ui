<script lang="ts">
	import { Select as SelectPrimitive } from "@/lib";
	import { cn } from "@/utils";

	type $$Props = SelectPrimitive.LabelProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Label
	class={cn("px-2 py-1.5 text-sm font-semibold", className)}
	{...$$restProps}
>
	<slot />
</SelectPrimitive.Label>
