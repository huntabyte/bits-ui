<script lang="ts">
	import { Dialog, Sidebar } from "bits-ui";
	import Bell from "phosphor-svelte/lib/Bell";
	import ChartLineUp from "phosphor-svelte/lib/ChartLineUp";
	import Clock from "phosphor-svelte/lib/Clock";
	import DotsThree from "phosphor-svelte/lib/DotsThree";
	import Files from "phosphor-svelte/lib/Files";
	import Folder from "phosphor-svelte/lib/Folder";
	import Gear from "phosphor-svelte/lib/Gear";
	import House from "phosphor-svelte/lib/House";
	import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
	import Plus from "phosphor-svelte/lib/Plus";
	import SidebarIcon from "phosphor-svelte/lib/Sidebar";
	import UsersThree from "phosphor-svelte/lib/UsersThree";
	import X from "phosphor-svelte/lib/X";

	let active = $state("Overview");
	let openMobile = $state(false);

	const navigation = [
		{ label: "Overview", icon: House },
		{ label: "Analytics", icon: ChartLineUp },
		{ label: "Customers", icon: UsersThree, badge: "12" },
		{ label: "Documents", icon: Files },
	];

	const projects = ["Website redesign", "Mobile app", "Research"];
</script>

{#snippet sidebarPanel(panelState: Sidebar.SidebarState, mobile: boolean)}
	<Sidebar.Root
		collapsible="icon"
		class="group/sidebar relative flex h-full shrink-0 flex-col overflow-hidden border-r transition-[width] duration-200 ease-linear motion-reduce:transition-none {mobile
			? 'bg-background w-[17rem]'
			: panelState === 'expanded'
				? 'bg-muted/45 w-[17rem]'
				: 'bg-muted/45 w-[4.25rem]'}"
	>
		<Sidebar.Header class="flex h-16 shrink-0 items-center gap-3 border-b px-3">
			<div
				class="bg-foreground text-background flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
				aria-hidden="true"
			>
				B
			</div>
			<div
				class="min-w-0 flex-1 whitespace-nowrap leading-tight transition-opacity duration-100 ease-linear group-data-[state=collapsed]/sidebar:opacity-0"
			>
				<p class="truncate text-sm font-semibold">Bits Studio</p>
				<p class="text-foreground-alt truncate text-xs">Design workspace</p>
			</div>
			{#if mobile}
				<Dialog.Close
					class="hover:bg-muted focus-visible:ring-foreground ml-auto inline-flex size-8 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2"
					aria-label="Close sidebar"
				>
					<X class="size-4" />
				</Dialog.Close>
			{/if}
		</Sidebar.Header>

		<Sidebar.Content
			class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 group-data-[state=collapsed]/sidebar:overflow-hidden"
		>
			<Sidebar.Group>
				<Sidebar.GroupLabel
					class="text-foreground-alt mb-1 flex h-7 items-center whitespace-nowrap px-2 text-[11px] font-medium uppercase tracking-wider transition-[margin,opacity] duration-200 ease-linear group-data-[state=collapsed]/sidebar:-mt-8 group-data-[state=collapsed]/sidebar:opacity-0"
				>
					Workspace
				</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu class="space-y-1">
						{#each navigation as item (item.label)}
							{@const Icon = item.icon}
							<Sidebar.MenuItem class="group relative">
								<Sidebar.MenuButton
									isActive={active === item.label}
									onclick={() => {
										active = item.label;
										if (mobile) openMobile = false;
									}}
									aria-label={item.label}
									title={panelState === "collapsed" && !mobile
										? item.label
										: undefined}
									class="hover:bg-muted focus-visible:ring-foreground data-[active]:bg-foreground data-[active]:text-background flex h-9 w-full items-center gap-3 overflow-hidden rounded-md px-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2"
								>
									<Icon class="size-[18px] shrink-0" weight="regular" />
									<span
										class="min-w-0 flex-1 truncate whitespace-nowrap transition-opacity duration-100 ease-linear group-data-[state=collapsed]/sidebar:opacity-0"
									>
										{item.label}
									</span>
									{#if item.badge}
										<Sidebar.MenuBadge
											class="bg-muted flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium transition-opacity duration-100 ease-linear group-data-[active]:bg-white/15 group-data-[state=collapsed]/sidebar:opacity-0"
										>
											{item.badge}
										</Sidebar.MenuBadge>
									{/if}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>

			<Sidebar.Separator class="bg-border my-3 h-px" />
			<Sidebar.Group class="relative">
				<Sidebar.GroupLabel
					class="text-foreground-alt mb-1 flex h-7 items-center whitespace-nowrap px-2 text-[11px] font-medium uppercase tracking-wider transition-[margin,opacity] duration-200 ease-linear group-data-[state=collapsed]/sidebar:-mt-8 group-data-[state=collapsed]/sidebar:opacity-0"
				>
					Projects
				</Sidebar.GroupLabel>
				<Sidebar.GroupAction
					class="hover:bg-muted focus-visible:ring-foreground absolute right-1 top-0 inline-flex size-7 items-center justify-center rounded-md transition-opacity duration-100 ease-linear focus-visible:outline-none focus-visible:ring-2 group-data-[state=collapsed]/sidebar:pointer-events-none group-data-[state=collapsed]/sidebar:opacity-0"
					aria-label="Create project"
				>
					<Plus class="size-3.5" />
				</Sidebar.GroupAction>
				<Sidebar.GroupContent>
					<Sidebar.Menu class="space-y-0.5">
						{#each projects as project (project)}
							<Sidebar.MenuItem class="group relative">
								<Sidebar.MenuButton
									aria-label={project}
									title={panelState === "collapsed" && !mobile
										? project
										: undefined}
									class="hover:bg-muted focus-visible:ring-foreground flex h-8 w-full items-center gap-2 overflow-hidden rounded-md px-2 text-left text-xs focus-visible:outline-none focus-visible:ring-2"
								>
									<Folder class="text-foreground-alt size-4 shrink-0" />
									<span
										class="min-w-0 flex-1 truncate whitespace-nowrap transition-opacity duration-100 ease-linear group-data-[state=collapsed]/sidebar:opacity-0"
									>
										{project}
									</span>
								</Sidebar.MenuButton>
								<Sidebar.MenuAction
									showOnHover
									class="hover:bg-background focus-visible:ring-foreground absolute right-1 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded opacity-0 focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 group-hover:opacity-100 group-data-[state=collapsed]/sidebar:hidden"
									aria-label={`More options for ${project}`}
								>
									<DotsThree class="size-4" weight="bold" />
								</Sidebar.MenuAction>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>

		<Sidebar.Footer class="border-t p-2">
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton
						aria-label="Settings"
						title={panelState === "collapsed" && !mobile ? "Settings" : undefined}
						class="hover:bg-muted focus-visible:ring-foreground flex h-9 w-full items-center gap-3 overflow-hidden rounded-md px-2.5 text-sm focus-visible:outline-none focus-visible:ring-2"
					>
						<Gear class="size-[18px] shrink-0" />
						<span
							class="whitespace-nowrap transition-opacity duration-100 ease-linear group-data-[state=collapsed]/sidebar:opacity-0"
						>
							Settings
						</span>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Footer>

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
	class="bg-background relative flex h-[540px] w-full overflow-hidden rounded-lg border"
>
	{#snippet children({ state, isMobile })}
		{#if isMobile}
			<Dialog.Root bind:open={openMobile}>
				<Dialog.Portal>
					<Dialog.Overlay
						class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 fixed inset-0 z-50 bg-black/45"
					/>
					<Dialog.Content
						class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left fixed inset-y-0 left-0 z-50 outline-none"
					>
						<Dialog.Title class="sr-only">Workspace navigation</Dialog.Title>
						<Dialog.Description class="sr-only">
							Navigate the Bits Studio workspace.
						</Dialog.Description>
						{@render sidebarPanel(state, true)}
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		{:else}
			{@render sidebarPanel(state, false)}
		{/if}

		<Sidebar.Inset class="flex min-w-0 flex-1 flex-col">
			<header class="flex h-16 shrink-0 items-center gap-3 border-b px-4 sm:px-5">
				<Sidebar.Trigger
					class="hover:bg-muted focus-visible:ring-foreground inline-flex size-9 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2"
					aria-label="Toggle sidebar"
				>
					<SidebarIcon class="size-[18px]" />
				</Sidebar.Trigger>
				<div class="relative hidden max-w-64 flex-1 sm:block">
					<MagnifyingGlass
						class="text-foreground-alt pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
					/>
					<Sidebar.Input
						class="bg-muted/60 focus:ring-foreground h-9 w-full rounded-md border-0 pl-9 pr-3 text-sm outline-none focus:ring-2"
						placeholder="Search"
						aria-label="Search workspace"
					/>
				</div>
				<button
					class="hover:bg-muted focus-visible:ring-foreground ml-auto inline-flex size-9 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2"
					aria-label="Notifications"
				>
					<Bell class="size-[18px]" />
				</button>
			</header>

			<div class="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
				<div class="mx-auto max-w-4xl">
					<div class="mb-6 flex items-end justify-between gap-4">
						<div>
							<p class="text-foreground-alt text-xs font-medium">Saturday, July 18</p>
							<h2 class="mt-1 text-xl font-semibold tracking-tight">{active}</h2>
						</div>
						<button
							class="bg-foreground text-background hover:bg-foreground/90 focus-visible:ring-foreground inline-flex h-9 items-center gap-2 rounded-md px-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
						>
							<Plus class="size-3.5" /> New report
						</button>
					</div>

					<div class="grid grid-cols-1 border-y sm:grid-cols-3">
						{#each [["Revenue", "$24.8k", "+12.5%"], ["Active users", "1,429", "+8.2%"], ["Conversion", "4.6%", "+0.7%"]] as metric, index (metric[0])}
							<div
								class="py-4 sm:px-4 {index > 0
									? 'border-t sm:border-l sm:border-t-0'
									: ''}"
							>
								<p class="text-foreground-alt text-xs">{metric[0]}</p>
								<div class="mt-1 flex items-baseline gap-2">
									<p class="text-lg font-semibold">{metric[1]}</p>
									<p class="text-success-foreground text-[11px] font-medium">
										{metric[2]}
									</p>
								</div>
							</div>
						{/each}
					</div>

					<section class="mt-6 rounded-lg border">
						<div class="flex items-center justify-between border-b px-4 py-3">
							<div>
								<h3 class="text-sm font-medium">Recent activity</h3>
								<p class="text-foreground-alt mt-0.5 text-xs">
									Updates across your workspace
								</p>
							</div>
							<Clock class="text-foreground-alt size-4" />
						</div>
						<div class="divide-y px-4">
							{#each [["Maya Chen", "published the Q3 report", "2m"], ["Noah Williams", "invited three teammates", "18m"], ["Ava Patel", "updated Website redesign", "1h"]] as event (event[0])}
								<div class="flex items-center gap-3 py-3 text-xs">
									<div
										class="bg-muted flex size-7 shrink-0 items-center justify-center rounded-full font-medium"
									>
										{event[0].slice(0, 1)}
									</div>
									<p class="min-w-0 flex-1 truncate">
										<span class="font-medium">{event[0]}</span>
										<span class="text-foreground-alt"> {event[1]}</span>
									</p>
									<span class="text-foreground-alt shrink-0">{event[2]}</span>
								</div>
							{/each}
						</div>
					</section>
				</div>
			</div>
		</Sidebar.Inset>
	{/snippet}
</Sidebar.Provider>
