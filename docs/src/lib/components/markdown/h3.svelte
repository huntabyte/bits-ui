<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/styles.js";

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h3
	class={cn("mt-12 scroll-m-[70px] text-xl font-semibold tracking-tight", className)}
	{...restProps}
>
	{@render children?.()}
</h3>
