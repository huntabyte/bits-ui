<script lang="ts">
	import { LinkPreview } from "bits-ui";
	let { count, openIndex = -1 }: { count: number; openIndex?: number } = $props();
</script>

{#each { length: count }, i (i)}
	<LinkPreview.Root open={openIndex === i}>
		<LinkPreview.Trigger data-bench="trigger">trigger {i}</LinkPreview.Trigger>
		<LinkPreview.Portal>
			<LinkPreview.Content data-bench="content">
				<button>inside</button>
				<LinkPreview.Arrow />
			</LinkPreview.Content>
		</LinkPreview.Portal>
	</LinkPreview.Root>
{/each}
