<script lang="ts">
	import { NavigationMenu } from "bits-ui";

	const items = ["one", "two", "three"];
</script>

<main>
	<button data-testid="outside">outside</button>
	<NavigationMenu.Root data-testid="root">
		<NavigationMenu.List>
			{#each items as item (item)}
				<NavigationMenu.Item value={item} openOnHover={false}>
					<NavigationMenu.Trigger data-testid="{item}-trigger"
						>{item}</NavigationMenu.Trigger
					>
					<NavigationMenu.Content data-testid="{item}-content" forceMount>
						<button data-testid="{item}-content-button">{item} button</button>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			{/each}
		</NavigationMenu.List>
	</NavigationMenu.Root>
</main>

<style>
	:global([data-navigation-menu-content][data-state="closed"]) {
		display: none;
	}
</style>
