<script lang="ts">
	import { Command, computeCommandScore } from "bits-ui";
	let {
		count,
		search = "",
		custom = false,
		keywordCount = 1,
		exact = false,
	}: {
		count: number;
		search?: string;
		custom?: boolean;
		keywordCount?: number;
		exact?: boolean;
	} = $props();
	const customFilter = (value: string, search: string, keywords?: string[]) =>
		exact
			? Number(value.includes(search) || keywords?.some((keyword) => keyword.includes(search)))
			: computeCommandScore(value, search, keywords);
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
								keywords={Array.from({ length: keywordCount }, (_, k) =>
									k === 0 ? `alias-${g}-${i}` : `keyword-${g}-${i}-${k}`
								)}
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
