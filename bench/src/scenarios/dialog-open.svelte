<script lang="ts">
	import { Dialog } from "bits-ui";

	let { ctl, outsideCount = 10_000 }: { ctl: { open: boolean }; outsideCount?: number } =
		$props();

	const outside = Array.from({ length: outsideCount }, (_, i) => i);
</script>

<Dialog.Root bind:open={ctl.open}>
	<Dialog.Trigger class="trigger" data-bench-trigger>open dialog</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="overlay" />
		<Dialog.Content class="popup dialog" data-bench-content>
			<Dialog.Title>Benchmark dialog</Dialog.Title>
			<Dialog.Description>Dialog content used for the open benchmark.</Dialog.Description>
			<label>Name <input type="text" /></label>
			<label>Email <input type="email" /></label>
			<Dialog.Close class="trigger">close</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<div>
	{#each outside as i (i)}<span class="outside-node"></span>{/each}
</div>
