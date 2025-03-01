<script lang="ts">
	import Check from "phosphor-svelte/lib/Check";
	import CopySimple from "phosphor-svelte/lib/CopySimple";
	import { cn } from "$lib/utils/styles.js";
	import type { HTMLButtonAttributes } from "svelte/elements";

	let {
		class: className,
		copyCode,
		copied = false,
		...rest
	}: {
		copyCode: () => void;
		copied?: boolean;
	} & HTMLButtonAttributes = $props();
</script>

<button
	class={cn(
		"text-muted-foreground hover:bg-muted focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden relative inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2",
		className
	)}
	onclick={copyCode}
	aria-label="Copy"
	{...rest}
	data-copy-code
>
	{#if copied}
		<Check class="h-5 w-5" />
	{:else}
		<CopySimple class="h-5 w-5" />
	{/if}
</button>
