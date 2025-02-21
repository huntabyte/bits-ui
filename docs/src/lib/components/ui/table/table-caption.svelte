<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/styles.js";

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLElement> = $props();
</script>

<caption class={cn("text-muted-foreground mt-4 text-sm", className)} {...restProps}>
	{@render children?.()}
</caption>
