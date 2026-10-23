<script lang="ts">
	import { Command, computeCommandScore } from "bits-ui";
	let {
		count,
		search = "",
		custom = false,
	}: { count: number; search?: string; custom?: boolean } = $props();
	const customFilter = (value: string, search: string, keywords?: string[]) =>
		computeCommandScore(value, search, keywords);
</script>

<Command.Root filter={custom ? customFilter : computeCommandScore}>
	<Command.Input bind:value={search} data-bench="input" />
	<Command.List>
		<Command.Viewport>
			{#each { length: 10 }, g (g)}
				<Command.Group value="group-{g}">
					<Command.GroupHeading>Group {g}</Command.GroupHeading>
					<Command.GroupItems>
						{#each { length: count / 10 }, i (i)}
							<Command.Item
								value="item {g}-{i}"
								keywords={[`alias-${g}-${i}`]}
								data-bench="item"
							>
								Item {g}-{i}
							</Command.Item>
						{/each}
					</Command.GroupItems>
				</Command.Group>
			{/each}
		</Command.Viewport>
	</Command.List>
</Command.Root>
