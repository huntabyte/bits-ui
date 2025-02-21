<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/styles.js";

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLPreElement> = $props();
</script>

<pre
	class={cn(
		"rounded-card border-muted relative mb-4 mt-6 overflow-x-auto border-2 py-8",
		className
	)}
	{...restProps}>
	{@render children?.()}
</pre>
