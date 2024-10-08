<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, createCopyCodeButton } from "$lib/utils/index.js";

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLPreElement> = $props();

	const { setCodeString } = createCopyCodeButton();
</script>

<pre
	class={cn(
		"relative mb-4 mt-6 overflow-x-auto rounded-card border-2 border-muted py-8",
		className
	)}
	use:setCodeString
	{...restProps}>
	{@render children?.()}
</pre>
