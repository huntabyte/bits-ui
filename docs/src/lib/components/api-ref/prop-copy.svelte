<script lang="ts">
	import { Popover } from "bits-ui";
	import Code from "$lib/components/markdown/code.svelte";

	let { name }: { name: string } = $props();
</script>

<div class="flex items-center gap-1.5">
	<Popover.Root>
		<Popover.Trigger
			class="rounded-button text-foreground-alt hover:text-foreground-alt/80 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
		>
			<Code class="bg-transparent px-0">{name}</Code>
		</Popover.Trigger>
		<Popover.Content
			side="top"
			sideOffset={10}
			class="rounded-input border-border bg-background shadow-popover z-50 max-h-[400px] overflow-auto border p-4"
		>
			<button class="bg-transparent"> Copy to clipboard </button>
		</Popover.Content>
	</Popover.Root>
</div>
