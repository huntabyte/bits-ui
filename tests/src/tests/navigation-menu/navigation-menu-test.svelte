<script lang="ts" module>
	export type NavigationMenuTestProps = NavigationMenu.RootProps & {
		noViewport?: boolean;
		noSubViewport?: boolean;
		groupItemProps?: NavigationMenu.ItemProps;
		subGroupItemProps?: NavigationMenu.ItemProps;
		subGroupItem1Props?: NavigationMenu.ItemProps;
		subGroupItem2Props?: NavigationMenu.ItemProps;
	};
</script>

<script lang="ts">
	import { NavigationMenu } from "bits-ui";

	let {
		noViewport,
		noSubViewport,
		groupItemProps,
		subGroupItemProps,
		subGroupItem1Props,
		subGroupItem2Props,
		...restProps
	}: NavigationMenuTestProps = $props();
</script>

<main>
	<button data-testid="previous-button" tabindex={0}>previous button</button>
	<NavigationMenu.Root {...restProps} data-testid="root" delayDuration={0} skipDelayDuration={0}>
		<NavigationMenu.List data-testid="list">
			<NavigationMenu.Item value="group" data-testid="group-item" {...groupItemProps}>
				<NavigationMenu.Trigger data-testid="group-item-trigger">
					trigger
				</NavigationMenu.Trigger>
				<NavigationMenu.Content data-testid="group-item-content">
					<button data-testid="group-item-content-button1">first button</button>
					<button data-testid="group-item-content-button2">second button </button>
				</NavigationMenu.Content>
			</NavigationMenu.Item>

			<NavigationMenu.Item
				value="sub-group"
				data-testid="sub-group-item"
				{...subGroupItemProps}
			>
				<NavigationMenu.Trigger data-testid="sub-group-item-trigger">
					sub
				</NavigationMenu.Trigger>
				<NavigationMenu.Content data-testid="sub-group-item-content">
					<NavigationMenu.Sub value="sub1" data-testid="sub-group-item-sub">
						<NavigationMenu.List data-testid="sub-group-item-sub-list">
							<NavigationMenu.Item
								value="sub1"
								data-testid="sub-group-item-sub-item1"
								{...subGroupItem1Props}
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
								{...subGroupItem2Props}
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
	<button data-testid="next-button" tabindex={0}>next button</button>
</main>
