<script lang="ts">
	import { Command } from "bits-ui";
	let { count, search = "" }: { count: number; search?: string } = $props();
</script>

<Command.Root>
	<Command.Input bind:value={search} data-bench="input" />
	<Command.List>
		<Command.Viewport>
			<Command.Empty>none</Command.Empty>
			{#each { length: 10 }, g (g)}
				<Command.Group value="group-{g}">
					<Command.GroupHeading>Group {g}</Command.GroupHeading>
					<Command.GroupItems>
						{#each { length: count / 10 }, i (i)}
							<Command.Item
								value="item {g}-{i}"
								keywords={["kw" + i]}
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
