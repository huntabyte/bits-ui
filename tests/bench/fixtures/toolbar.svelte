<script lang="ts">
	import { Toolbar } from "bits-ui";
	let { count, value = [] }: { count: number; value?: string[] } = $props();
</script>

<Toolbar.Root>
	<Toolbar.Group type="multiple" bind:value>
		{#each { length: count }, i (i)}
			<Toolbar.GroupItem value={i} data-bench="item">{i}</Toolbar.GroupItem>
		{/each}
	</Toolbar.Group>
	{#each { length: count }, i (i)}
		<Toolbar.Button>b{i}</Toolbar.Button>
	{/each}
	<Toolbar.Link href="#">link</Toolbar.Link>
</Toolbar.Root>
