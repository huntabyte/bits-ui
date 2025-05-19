<script lang="ts" module>
	export type NavigationMenuTestProps = NavigationMenu.RootProps & {};
</script>

<script lang="ts">
	import { NavigationMenu } from "bits-ui";

	let { ...restProps }: NavigationMenuTestProps = $props();
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
					<NavigationMenu.Sub value="sub1" data-testid="group-item-sub">
						<NavigationMenu.List data-testid="group-item-sub-list">
							<NavigationMenu.Item value="sub1" data-testid="group-item-sub-item1">
								<NavigationMenu.Trigger data-testid="group-item-sub-item1-trigger">
									sub1
								</NavigationMenu.Trigger>
								<NavigationMenu.Content data-testid="group-item-sub-item1-content">
									content1
								</NavigationMenu.Content>
							</NavigationMenu.Item>
							<NavigationMenu.Item value="sub2" data-testid="group-item-sub-item2">
								<NavigationMenu.Trigger data-testid="group-item-sub-item2-trigger">
									sub2
								</NavigationMenu.Trigger>
								<NavigationMenu.Content data-testid="group-item-sub-item2-content">
									content2
								</NavigationMenu.Content>
							</NavigationMenu.Item>
						</NavigationMenu.List>
						<NavigationMenu.Viewport data-testid="group-item-sub-viewport"
						></NavigationMenu.Viewport>
					</NavigationMenu.Sub>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
			<NavigationMenu.Item value="link" data-testid="link-item">
				<NavigationMenu.Link data-testid="link-item-link">item link</NavigationMenu.Link>
			</NavigationMenu.Item>
			<NavigationMenu.Indicator data-testid="indicator"></NavigationMenu.Indicator>
		</NavigationMenu.List>
		<NavigationMenu.Viewport data-testid="viewport"></NavigationMenu.Viewport>
	</NavigationMenu.Root>
	<button data-testid="next-button">next button</button>
</main>
