<script lang="ts">
	import { Dialog } from "bits-ui";
	let { innerOpen = false }: { innerOpen?: boolean } = $props();
</script>

<Dialog.Root open>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content data-bench="outer">
			<Dialog.Title>outer</Dialog.Title>
			<input />
			<Dialog.Root bind:open={innerOpen}>
				<Dialog.Trigger>open inner</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay />
					<Dialog.Content data-bench="inner">
						<Dialog.Title>inner</Dialog.Title>
						<input />
						<Dialog.Close>close</Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
