<script lang="ts">
	import { unstable_Drawer as Drawer, ScrollArea } from "bits-ui";
	import X from "phosphor-svelte/lib/X";

	const ITEMS = [
		{ href: "/docs/getting-started", label: "Overview" },
		{ href: "/docs/components", label: "Components" },
		{ href: "/docs/utilities", label: "Utilities" },
		{ href: "/docs/releases", label: "Releases" },
	] as const;

	const LONG_LIST = [
		"Accordion",
		"Alert Dialog",
		"Autocomplete",
		"Avatar",
		"Button",
		"Checkbox",
		"Checkbox Group",
		"Collapsible",
		"Combobox",
		"Context Menu",
		"Dialog",
		"Drawer",
		"Field",
		"Fieldset",
		"Form",
		"Input",
		"Menu",
		"Menubar",
		"Meter",
		"Navigation Menu",
		"Number Field",
		"Popover",
		"Preview Card",
		"Progress",
		"Radio",
		"Scroll Area",
		"Select",
		"Separator",
		"Slider",
		"Switch",
		"Tabs",
		"Toast",
		"Toggle",
		"Toggle Group",
		"Toolbar",
		"Tooltip",
	] as const;
</script>

<Drawer.Root>
	<Drawer.Trigger
		class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-12 select-none items-center justify-center px-[21px] text-[15px] font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
	>
		Open mobile menu
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Backdrop
			class="fixed inset-0 z-[60] min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
		/>
		<Drawer.Viewport
			class="fixed inset-0 z-[60] flex touch-none items-end justify-center [padding-bottom:var(--drawer-keyboard-inset)]"
		>
			<Drawer.Popup
				class="bg-drawer text-foreground shadow-drawer after:bg-drawer relative flex max-h-[calc(100dvh-1rem)] min-h-0 w-full max-w-[42rem] touch-none flex-col overflow-visible rounded-t-2xl transition-[transform,box-shadow] duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--bleed:3rem] [transform:translateY(calc(var(--drawer-transition-slide-y,0px)+var(--drawer-swipe-movement-y)))] after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-[var(--bleed)] after:content-[''] data-[swiping]:select-none data-[ending-style]:[transform:translateY(calc(100%+2px))] data-[starting-style]:[transform:translateY(calc(100%+2px))]"
			>
				<div class="shrink-0 touch-none px-6 pb-3 pt-3.5">
					<div class="grid grid-cols-[1fr_auto_1fr] items-center">
						<div aria-hidden="true" class="h-9 w-9"></div>
						<div class="bg-dark-40 h-1 w-12 justify-self-center rounded-full"></div>
						<Drawer.Close
							aria-label="Close menu"
							class="focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden absolute right-5 top-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
						>
							<div>
								<X class="text-foreground size-5" />
								<span class="sr-only">Close</span>
							</div>
						</Drawer.Close>
					</div>
				</div>
				<Drawer.Content class="min-h-0 flex-1">
					<ScrollArea.Root type="hover">
						<ScrollArea.Viewport
							class="max-h-[calc(100dvh-6rem)] touch-auto overscroll-contain px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
						>
							<Drawer.Title
								class="m-0 mb-1 text-lg font-semibold leading-7 tracking-tight"
							>
								Menu
							</Drawer.Title>
							<Drawer.Description class="text-foreground-alt m-0 mb-5 text-sm">
								Browse the docs and components.
							</Drawer.Description>
							<nav aria-label="Navigation" class="w-full">
								<p
									class="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-widest"
								>
									Docs
								</p>
								<ul class="m-0 grid list-none gap-1 p-0">
									{#each ITEMS as item (item.href)}
										<li class="flex">
											<a
												class="rounded-card-sm bg-dark-04 text-foreground hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden w-full px-4 py-3 text-sm no-underline focus-visible:ring-2 focus-visible:ring-offset-2"
												href={item.href}
											>
												{item.label}
											</a>
										</li>
									{/each}
								</ul>

								<p
									class="text-muted-foreground mb-2 mt-6 text-xs font-medium uppercase tracking-widest"
								>
									Components
								</p>
								<ul
									aria-label="Component links"
									class="m-0 grid list-none gap-1 p-0"
								>
									{#each LONG_LIST as item (item)}
										<li class="flex">
											<a
												class="rounded-card-sm bg-dark-04 text-foreground hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden w-full px-4 py-3 text-sm no-underline focus-visible:ring-2 focus-visible:ring-offset-2"
												href="/docs/components/drawer"
											>
												{item}
											</a>
										</li>
									{/each}
								</ul>
							</nav>
						</ScrollArea.Viewport>
						<ScrollArea.Scrollbar
							orientation="vertical"
							class="flex w-2.5 touch-none select-none rounded-full border-l border-l-transparent p-px transition-all duration-200 data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100"
						>
							<ScrollArea.Thumb class="bg-dark-40 flex-1 rounded-full" />
						</ScrollArea.Scrollbar>
					</ScrollArea.Root>
				</Drawer.Content>
			</Drawer.Popup>
		</Drawer.Viewport>
	</Drawer.Portal>
</Drawer.Root>
