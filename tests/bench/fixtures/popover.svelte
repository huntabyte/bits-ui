<script lang="ts">
	import { Popover } from "bits-ui";
	let { count, openIndex = -1 }: { count: number; openIndex?: number } = $props();
</script>

{#each { length: count }, i (i)}
	<Popover.Root open={openIndex === i}>
		<Popover.Trigger data-bench="trigger">trigger {i}</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content data-bench="content">
				<button>inside</button>
				<Popover.Arrow />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
{/each}
