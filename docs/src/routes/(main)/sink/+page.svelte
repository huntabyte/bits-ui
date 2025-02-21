<script lang="ts">
	import { NavigationMenu } from "bits-ui";
</script>

<div class="nav-menu">
	<NavigationMenu.Root orientation="vertical">
		<NavigationMenu.List>
			<NavigationMenu.Item>
				<NavigationMenu.Link href="/">Link 1</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item openOnHover={false}>
				<NavigationMenu.Trigger type="button">Trigger A</NavigationMenu.Trigger>
				<NavigationMenu.Content class="bg-blue-200">
					<ul class="m-0 ml-3 flex list-none flex-col">
						<li class="row-span-3 mb-2 sm:mb-0">
							<NavigationMenu.Link href="/">A - Link 1</NavigationMenu.Link>
						</li>

						<li class="row-span-3 mb-2 sm:mb-0">
							<NavigationMenu.Link href="/">A - Link 2</NavigationMenu.Link>
						</li>

						<li class="row-span-3 mb-2 sm:mb-0">
							<NavigationMenu.Sub>
								<NavigationMenu.Item openOnHover={false}>
									<NavigationMenu.Trigger type="button">
										Sub-Trigger A
									</NavigationMenu.Trigger>
									<NavigationMenu.Content class="bg-green-200">
										<ul class="m-0 ml-3 flex list-none flex-col">
											<li class="row-span-3 mb-2 sm:mb-0">
												<NavigationMenu.Link href="/">
													Sub A - Link 1
												</NavigationMenu.Link>
											</li>

											<li class="row-span-3 mb-2 sm:mb-0">
												<NavigationMenu.Link href="/">
													Sub A - Link 2
												</NavigationMenu.Link>
											</li>
										</ul>
									</NavigationMenu.Content>
								</NavigationMenu.Item>
							</NavigationMenu.Sub>
						</li>
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link href="/">Link 2</NavigationMenu.Link>
			</NavigationMenu.Item>

			<NavigationMenu.Item openOnHover={false}>
				<NavigationMenu.Trigger type="button">Trigger B</NavigationMenu.Trigger>
				<NavigationMenu.Content class="bg-blue-200 p-3">
					<ul class="m-0 ml-3 flex list-none flex-col">
						<li class="row-span-3 mb-2 sm:mb-0">
							<NavigationMenu.Link href="/">B - Link 1</NavigationMenu.Link>
						</li>

						<li class="row-span-3 mb-2 sm:mb-0">
							<NavigationMenu.Link href="/">B - Link 2</NavigationMenu.Link>
						</li>

						<li>
							<NavigationMenu.Sub>
								<NavigationMenu.Item openOnHover={false}>
									<NavigationMenu.Trigger type="button">
										Sub-Trigger B
									</NavigationMenu.Trigger>
									<NavigationMenu.Content class="bg-green-200">
										<ul class="m-0 ml-3 flex list-none flex-col">
											<li class="row-span-3 mb-2 sm:mb-0">
												<NavigationMenu.Link href="/">
													Sub B - Link 1
												</NavigationMenu.Link>
											</li>

											<li class="row-span-3 mb-2 sm:mb-0">
												<NavigationMenu.Link href="/">
													Sub B - Link 2
												</NavigationMenu.Link>
											</li>
										</ul>
									</NavigationMenu.Content>
								</NavigationMenu.Item>
							</NavigationMenu.Sub>
						</li>
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item>

			<NavigationMenu.Item>
				<NavigationMenu.Link href="/">Link 3</NavigationMenu.Link>
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
