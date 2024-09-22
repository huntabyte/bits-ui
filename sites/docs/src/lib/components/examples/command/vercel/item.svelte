<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Command } from 'bits-ui';

	let {
		shortcut = '',
		onSelect = () => {},
		children
	}: {
		shortcut?: string;
		onSelect?: (() => void) | undefined;
		children: Snippet;
	} = $props();
</script>

<Command.Item {onSelect}>
	{@render children?.()}
	{#if shortcut}
		<div data-command-vercel-shortcuts="">
			{#each shortcut.split(' ') as key}
				<kbd>{key}</kbd>
			{/each}
		</div>
	{/if}
</Command.Item>
