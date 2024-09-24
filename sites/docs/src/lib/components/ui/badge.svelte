<script lang="ts">
	import type { PrimitiveSpanAttributes, WithChildren } from "bits-ui";
	import { cn } from "$lib/utils/styles.js";

	let {
		children,
		class: className,
		...restProps
	}: WithChildren<PrimitiveSpanAttributes> = $props();
</script>

<span
	class={cn(
		"ml-2 rounded-[4px] bg-[#FCDAFE] px-1.5 py-1 text-[0.7rem] font-semibold leading-none text-[#2A266B] no-underline group-hover:no-underline",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
