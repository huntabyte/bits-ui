<script lang="ts">
	import { Select as SelectPrimitive } from "@/lib";
	import { cn } from "@/utils";

	type $$Props = SelectPrimitive.SeparatorProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Separator
	class={cn("-mx-1 my-1 h-px bg-muted", className)}
	{...$$restProps}
/>
