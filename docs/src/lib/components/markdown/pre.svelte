<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "#lib/utils/styles.js";

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLPreElement> = $props();
</script>

<pre
	class={cn(
		"relative mt-6 mb-4 overflow-x-auto rounded-card border-2 border-muted py-8",
		className
	)}
	{...restProps}>
	{@render children?.()}
</pre>
