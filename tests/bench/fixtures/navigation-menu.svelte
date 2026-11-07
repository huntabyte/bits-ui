<script lang="ts">
	import { NavigationMenu } from "bits-ui";
	let { count, value = "" }: { count: number; value?: string } = $props();
</script>

<NavigationMenu.Root bind:value delayDuration={0}>
	<NavigationMenu.List>
		{#each { length: count }, i (i)}
			<NavigationMenu.Item value="i{i}">
				<NavigationMenu.Trigger data-bench="trigger">Item {i}</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					{#each { length: 5 }, l (l)}
						<NavigationMenu.Link href="#">link {l}</NavigationMenu.Link>
					{/each}
				</NavigationMenu.Content>
			</NavigationMenu.Item>
		{/each}
		<NavigationMenu.Indicator />
	</NavigationMenu.List>
	<NavigationMenu.Viewport />
</NavigationMenu.Root>
