<script lang="ts">
	import { Sidebar, type WithoutChildrenOrChild } from "bits-ui";
	import SidebarContextTest from "./sidebar-context-test.svelte";

	type Props = WithoutChildrenOrChild<Sidebar.ProviderProps> & {
		collapsible?: Sidebar.SidebarCollapsible;
		customTrigger?: boolean;
		menuButtonDisabled?: boolean;
	};

	let {
		open = true,
		openMobile = false,
		collapsible = "offcanvas",
		customTrigger = false,
		menuButtonDisabled = false,
		...restProps
	}: Props = $props();
</script>

<Sidebar.Provider bind:open bind:openMobile {...restProps} data-testid="provider">
	{#snippet children({ state, isMobile })}
		<span data-testid="binding-open">{open}</span>
		<span data-testid="binding-open-mobile">{openMobile}</span>
		<span data-testid="snippet-state">{state}</span>
		<span data-testid="snippet-mobile">{isMobile}</span>

		<SidebarContextTest />

		{#if customTrigger}
			<Sidebar.Trigger>
				{#snippet child({ props })}
					<button {...props} data-testid="trigger">Custom trigger</button>
				{/snippet}
			</Sidebar.Trigger>
		{:else}
			<Sidebar.Trigger data-testid="trigger">Toggle</Sidebar.Trigger>
		{/if}

		<Sidebar.Root {collapsible} side="right" variant="inset" data-testid="root">
			<Sidebar.Header data-testid="header">
				<Sidebar.Input data-testid="input" aria-label="Search" />
			</Sidebar.Header>
			<Sidebar.Separator data-testid="separator" />
			<Sidebar.Content data-testid="content">
				<Sidebar.Group data-testid="group">
					<Sidebar.GroupLabel data-testid="group-label">Projects</Sidebar.GroupLabel>
					<Sidebar.GroupAction data-testid="group-action" aria-label="Add project">
						Add
					</Sidebar.GroupAction>
					<Sidebar.GroupContent data-testid="group-content">
						<Sidebar.Menu data-testid="menu">
							<Sidebar.MenuItem data-testid="menu-item">
								<Sidebar.MenuButton
									data-testid="menu-button"
									isActive
									size="lg"
									variant="outline"
									disabled={menuButtonDisabled}
								>
									Dashboard
								</Sidebar.MenuButton>
								<Sidebar.MenuAction
									data-testid="menu-action"
									aria-label="Add dashboard"
									showOnHover
								>
									Add
								</Sidebar.MenuAction>
								<Sidebar.MenuBadge data-testid="menu-badge">7</Sidebar.MenuBadge>
								<Sidebar.MenuSub data-testid="menu-sub">
									<Sidebar.MenuSubItem data-testid="menu-sub-item">
										<Sidebar.MenuSubButton
											data-testid="menu-sub-button"
											href="/activity"
											isActive
											size="sm"
										>
											Activity
										</Sidebar.MenuSubButton>
									</Sidebar.MenuSubItem>
								</Sidebar.MenuSub>
							</Sidebar.MenuItem>
						</Sidebar.Menu>
						<Sidebar.MenuSkeleton data-testid="menu-skeleton" showIcon>
							Loading
						</Sidebar.MenuSkeleton>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			</Sidebar.Content>
			<Sidebar.Footer data-testid="footer">Footer</Sidebar.Footer>
			<Sidebar.Rail data-testid="rail" />
		</Sidebar.Root>

		<Sidebar.Inset data-testid="inset">Inset</Sidebar.Inset>
		<button data-testid="binding-trigger" onclick={() => (open = !open)}>Binding toggle</button>
	{/snippet}
</Sidebar.Provider>
