<script lang="ts">
	import Check from "phosphor-svelte/lib/Check";
	import CopySimple from "phosphor-svelte/lib/CopySimple";
	import { cn } from "$lib/utils/index.js";
	let className: string | undefined | null = undefined;

	export let copyCode: () => void;
	export let copied = false;
	export { className as class };
</script>

<button
	class={cn(
		"text-muted-foreground hover:bg-muted focus-visible:ring-foreground focus-visible:ring-offset-background relative inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
		className
	)}
	on:click={copyCode}
	aria-label="Copy"
	{...$$restProps}
	data-copy-code
>
	{#if copied}
		<Check class="h-5 w-5" />
	{:else}
		<CopySimple class="h-5 w-5" />
	{/if}
</button>
