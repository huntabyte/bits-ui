<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/styles.js";
	let { class: className, children, ...restProps }: HTMLAttributes<HTMLElement> = $props();
</script>

<code
	class={cn(
		"rounded-button bg-muted text-foreground/60 relative inline-flex h-[27px] items-center justify-center px-[8px] font-mono text-xs font-medium tracking-tighter sm:text-sm",
		className,
		"custom"
	)}
	{...restProps}
>
	{@render children?.()}
</code>
