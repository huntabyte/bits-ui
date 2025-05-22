<script lang="ts" module>
	export type NavigationMenuTestProps = NavigationMenu.RootProps & {
		noViewport?: boolean;
		noSubViewport?: boolean;
	};
</script>

<script lang="ts">
	import { NavigationMenu } from "bits-ui";

	let { noViewport, noSubViewport, ...restProps }: NavigationMenuTestProps = $props();
</script>

<main>
	<button data-testid="previous-button">previous button</button>
	<NavigationMenu.Root {...restProps} data-testid="root">
		<NavigationMenu.List data-testid="list">
			<NavigationMenu.Item value="group" data-testid="group-item">
				<NavigationMenu.Trigger data-testid="group-item-trigger">
					trigger
				</NavigationMenu.Trigger>
				<NavigationMenu.Content data-testid="group-item-content">
					<button data-testid="group-item-content-button1">first button</button>
					<button data-testid="group-item-content-button2">second button </button>
				</NavigationMenu.Content>
			</NavigationMenu.Item>

			<NavigationMenu.Item value="sub-group" data-testid="sub-group-item">
				<NavigationMenu.Trigger data-testid="sub-group-item-trigger">
					sub
				</NavigationMenu.Trigger>
				<NavigationMenu.Content data-testid="sub-group-item-content">
					<NavigationMenu.Sub value="sub1" data-testid="sub-group-item-sub">
						<NavigationMenu.List data-testid="sub-group-item-sub-list">
							<NavigationMenu.Item
								value="sub1"
								data-testid="sub-group-item-sub-item1"
							>
								<NavigationMenu.Trigger
									data-testid="sub-group-item-sub-item1-trigger"
								>
									sub1
								</NavigationMenu.Trigger>
								<NavigationMenu.Content
									data-testid="sub-group-item-sub-item1-content"
								>
									<button data-testid="sub-group-item-sub-item1-content-button">
										first sub button
									</button>
								</NavigationMenu.Content>
							</NavigationMenu.Item>
							<NavigationMenu.Item
								value="sub2"
								data-testid="sub-group-item-sub-item2"
							>
								<NavigationMenu.Trigger
									data-testid="sub-group-item-sub-item2-trigger"
								>
									sub2
								</NavigationMenu.Trigger>
								<NavigationMenu.Content
									data-testid="sub-group-item-sub-item2-content"
								>
									<button data-testid="sub-group-item-sub-item2-content-button">
										second sub button
									</button>
								</NavigationMenu.Content>
							</NavigationMenu.Item>
						</NavigationMenu.List>
						{#if !noSubViewport}
							<NavigationMenu.Viewport data-testid="sub-group-item-sub-viewport"
							></NavigationMenu.Viewport>
						{/if}
					</NavigationMenu.Sub>
				</NavigationMenu.Content>
			</NavigationMenu.Item>

			<NavigationMenu.Item value="link" data-testid="link-item">
				<NavigationMenu.Link data-testid="link-item-link" href="/">
					link
				</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Indicator data-testid="indicator"></NavigationMenu.Indicator>
		</NavigationMenu.List>

		{#if !noViewport}
			<NavigationMenu.Viewport data-testid="viewport"></NavigationMenu.Viewport>
		{/if}
	</NavigationMenu.Root>
	<button data-testid="next-button">next button</button>
</main>
