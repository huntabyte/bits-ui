<script lang="ts">
	import { Popover } from "bits-ui";

	let { ctl }: { ctl: { open: boolean } } = $props();

	const rows = Array.from({ length: 50 }, (_, i) => i);
</script>

<Popover.Root bind:open={ctl.open}>
	<Popover.Trigger class="trigger" data-bench-trigger>open popover</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content class="popup" data-bench-content>
			<div style="padding: 12px; width: 280px;">
				{#each rows as i (i)}
					<label>Field {i} <input type="text" value="value {i}" /></label>
				{/each}
				<Popover.Close class="trigger">close</Popover.Close>
			</div>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
