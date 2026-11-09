<script lang="ts">
	import { Dialog } from "bits-ui";
	let { count, openIndex = -1 }: { count: number; openIndex?: number } = $props();
</script>

{#each { length: count }, i (i)}
	<Dialog.Root open={openIndex === i}>
		<Dialog.Trigger data-bench="trigger">trigger {i}</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Overlay />
			<Dialog.Content data-bench="content">
				<Dialog.Title>title</Dialog.Title>
				<Dialog.Description>desc</Dialog.Description>
				<input />
				<Dialog.Close>close</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
{/each}
