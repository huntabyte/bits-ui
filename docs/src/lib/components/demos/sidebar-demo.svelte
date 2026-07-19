<script lang="ts">
	import { Dialog, Sidebar } from "bits-ui";
	import Calendar from "phosphor-svelte/lib/Calendar";
	import Gear from "phosphor-svelte/lib/Gear";
	import House from "phosphor-svelte/lib/House";
	import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
	import SidebarIcon from "phosphor-svelte/lib/Sidebar";
	import Tray from "phosphor-svelte/lib/Tray";
	import X from "phosphor-svelte/lib/X";

	let openMobile = $state(false);

	const items = [
		{ title: "Home", icon: House },
		{ title: "Inbox", icon: Tray },
		{ title: "Calendar", icon: Calendar },
		{ title: "Search", icon: MagnifyingGlass },
		{ title: "Settings", icon: Gear },
	];
</script>

{#snippet sidebarPanel(panelState: Sidebar.SidebarState, mobile: boolean)}
	<Sidebar.Root
		collapsible="icon"
		class="group/sidebar relative flex h-full shrink-0 flex-col border-r transition-[width] duration-200 ease-linear motion-reduce:transition-none {mobile
			? 'bg-background w-[18rem]'
			: panelState === 'expanded'
				? 'bg-muted/45 w-64'
				: 'bg-muted/45 w-12'}"
	>
		<Sidebar.Content
			class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden group-data-[state=collapsed]/sidebar:overflow-hidden"
		>
			<Sidebar.Group class="p-2">
				<Sidebar.GroupLabel
					class="text-foreground-alt mb-1 flex h-8 items-center whitespace-nowrap px-2 text-xs transition-[margin,opacity] duration-200 ease-linear group-data-[state=collapsed]/sidebar:-mt-9 group-data-[state=collapsed]/sidebar:opacity-0 motion-reduce:transition-none"
				>
					Application
				</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu class="space-y-1">
						{#each items as item (item.title)}
							{@const Icon = item.icon}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									aria-label={item.title}
									title={panelState === "collapsed" && !mobile
										? item.title
										: undefined}
									class="hover:bg-muted focus-visible:ring-foreground flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2"
								>
									<Icon class="size-4 shrink-0" />
									<span
										class="truncate whitespace-nowrap transition-opacity duration-100 ease-linear group-data-[state=collapsed]/sidebar:opacity-0 motion-reduce:transition-none"
									>
										{item.title}
									</span>
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>

		{#if !mobile}
			<Sidebar.Rail
				class="hover:bg-foreground/10 focus-visible:bg-foreground/10 absolute inset-y-0 -right-1 z-10 w-2 cursor-ew-resize focus-visible:outline-none"
				aria-label="Toggle sidebar"
			/>
		{/if}
	</Sidebar.Root>
{/snippet}

<Sidebar.Provider
	bind:openMobile
	class="bg-background relative flex h-[420px] w-full overflow-hidden rounded-lg border"
>
	{#snippet children({ state, isMobile })}
		{#if isMobile}
			<Dialog.Root bind:open={openMobile}>
				<Dialog.Portal>
					<Dialog.Overlay
						class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 fixed inset-0 z-50 bg-black/45 motion-reduce:animate-none"
					/>
					<Dialog.Content
						class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left fixed inset-y-0 left-0 z-50 outline-none motion-reduce:animate-none"
					>
						<Dialog.Title class="sr-only">Application navigation</Dialog.Title>
						<Dialog.Description class="sr-only">
							Navigate to another section of the application.
						</Dialog.Description>
						<Dialog.Close
							class="hover:bg-muted focus-visible:ring-foreground absolute right-2 top-2 z-10 inline-flex size-8 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2"
							aria-label="Close sidebar"
						>
							<X class="size-4" />
						</Dialog.Close>
						{@render sidebarPanel(state, true)}
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		{:else}
			{@render sidebarPanel(state, false)}
		{/if}

		<Sidebar.Inset class="bg-background min-w-0 flex-1">
			<header class="flex h-12 items-center px-4">
				<Sidebar.Trigger
					class="hover:bg-muted focus-visible:ring-foreground inline-flex size-8 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2"
					aria-label="Toggle sidebar"
				>
					<SidebarIcon class="size-4" />
				</Sidebar.Trigger>
			</header>
		</Sidebar.Inset>
	{/snippet}
</Sidebar.Provider>
