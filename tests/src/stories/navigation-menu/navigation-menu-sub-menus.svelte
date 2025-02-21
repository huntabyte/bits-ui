<script lang="ts">
	import { NavigationMenu } from "bits-ui";
</script>

<div class="nav-menu">
	<NavigationMenu.Root orientation="vertical">
		<NavigationMenu.List>
			<NavigationMenu.Item>
				<NavigationMenu.Link href="/">Item 1</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item openOnHover={false}>
				<NavigationMenu.Trigger type="button">Submenu 1</NavigationMenu.Trigger>
				<NavigationMenu.Content
					interactOutsideBehavior="ignore"
					escapeKeydownBehavior="ignore"
					forceMount
				>
					<NavigationMenu.Sub value="sub1">
						<NavigationMenu.List>
							<NavigationMenu.Item value="sub1">
								<NavigationMenu.Link href="/">Sub item 1</NavigationMenu.Link>
							</NavigationMenu.Item>

							<NavigationMenu.Item value="sub2">
								<NavigationMenu.Link href="/">Sub item 2</NavigationMenu.Link>
							</NavigationMenu.Item>
						</NavigationMenu.List>
						<NavigationMenu.Viewport forceMount />
					</NavigationMenu.Sub>
				</NavigationMenu.Content>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link href="/">Item 2</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item openOnHover={false}>
				<NavigationMenu.Trigger type="button">Submenu 2</NavigationMenu.Trigger>
				<NavigationMenu.Content
					interactOutsideBehavior="ignore"
					escapeKeydownBehavior="ignore"
					forceMount
				>
					<NavigationMenu.Sub value="sub3">
						<NavigationMenu.List>
							<NavigationMenu.Item value="sub3">
								<NavigationMenu.Link href="/">Sub item 3</NavigationMenu.Link>
							</NavigationMenu.Item>

							<NavigationMenu.Item value="sub4">
								<NavigationMenu.Link href="/">Sub item 4</NavigationMenu.Link>
							</NavigationMenu.Item>
						</NavigationMenu.List>
						<NavigationMenu.Viewport forceMount />
					</NavigationMenu.Sub>
				</NavigationMenu.Content>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link href="/">Item 3</NavigationMenu.Link>
			</NavigationMenu.Item>
		</NavigationMenu.List>
		<!-- <NavigationMenu.Viewport /> -->
	</NavigationMenu.Root>
</div>

<style>
	.nav-menu {
		width: 200px;
		box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
		background-color: white;
	}

	:global {
		[data-navigation-menu-list] {
			list-style-type: none;
			padding: 0;
			margin: 0;
		}

		[data-navigation-menu-link],
		[data-navigation-menu-trigger] {
			display: block;
			width: 100%;
			text-align: left;
			line-height: 1rem;
			padding: 10px;
			font-weight: normal;
			text-decoration: none;

			&,
			&:visited {
				color: black;
			}

			&:hover {
				background-color: #ddd;
			}
		}

		[data-navigation-menu-sub] {
			background-color: #f5f5f5;
			border-block: 1px solid #ccc;
		}
	}
</style>
