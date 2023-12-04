<script lang="ts">
	import { cn } from "@/utils";
	import { CopySimple, Check } from "phosphor-svelte";
	let className: string | undefined | null = undefined;

	export let copyCode: () => void;
	export let copied = false;
	export { className as class };
</script>

<button
	class={cn(
		"relative z-20 inline-flex h-6 w-6 items-center justify-center rounded-md border bg-background text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		className
	)}
	on:click={copyCode}
	{...$$restProps}
	data-copy-code
>
	<span class="sr-only">Copy</span>
	{#if copied}
		<Check class="h-3 w-3" />
	{:else}
		<CopySimple class="h-3 w-3" />
	{/if}
</button>
