<script lang="ts">
	import { AlertDialog } from "bits-ui";
	let { count, openIndex = -1 }: { count: number; openIndex?: number } = $props();
</script>

{#each { length: count }, i (i)}
	<AlertDialog.Root open={openIndex === i}>
		<AlertDialog.Trigger data-bench="trigger">trigger {i}</AlertDialog.Trigger>
		<AlertDialog.Portal>
			<AlertDialog.Overlay />
			<AlertDialog.Content data-bench="content">
				<AlertDialog.Title>title</AlertDialog.Title>
				<AlertDialog.Description>desc</AlertDialog.Description>
				<input />
				<AlertDialog.Cancel>cancel</AlertDialog.Cancel><AlertDialog.Action>ok</AlertDialog.Action>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
{/each}
