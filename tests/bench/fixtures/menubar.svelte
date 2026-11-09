<script lang="ts">
	import { Menubar } from "bits-ui";
	let { count, value = "" }: { count: number; value?: string } = $props();
</script>

<Menubar.Root bind:value>
	{#each { length: 5 }, m (m)}
		<Menubar.Menu value="m{m}">
			<Menubar.Trigger data-bench="trigger">Menu {m}</Menubar.Trigger>
			<Menubar.Portal>
				<Menubar.Content data-bench="content">
					{#each { length: count }, i (i)}
						<Menubar.Item data-bench="item">Item {i}</Menubar.Item>
					{/each}
				</Menubar.Content>
			</Menubar.Portal>
		</Menubar.Menu>
	{/each}
</Menubar.Root>
