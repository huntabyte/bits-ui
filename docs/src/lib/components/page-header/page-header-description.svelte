<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "#lib/utils/styles.js";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p
	class={cn(
		"mt-3 text-lg leading-7 font-semibold tracking-[-0.01em] text-balance text-foreground/40 sm:text-[21px]",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</p>
