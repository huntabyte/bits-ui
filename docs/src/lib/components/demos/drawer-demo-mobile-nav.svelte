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
		class="inline-flex h-12 items-center justify-center rounded-input bg-dark px-[21px] text-[15px] font-semibold text-background shadow-mini select-none hover:bg-dark/95 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
	>
		Open mobile menu
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Backdrop
			class="fixed inset-0 z-[60] min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] data-[ending-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[starting-style]:opacity-0 data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
		/>
		<Drawer.Viewport
			class="fixed inset-0 z-[60] flex touch-none items-end justify-center [padding-bottom:var(--drawer-keyboard-inset)]"
		>
			<Drawer.Popup
				class="relative flex max-h-[calc(100dvh-1rem)] min-h-0 w-full max-w-[42rem] [transform:translateY(calc(var(--drawer-transition-slide-y,0px)+var(--drawer-swipe-movement-y)))] touch-none flex-col overflow-visible rounded-t-2xl bg-drawer text-foreground shadow-drawer transition-[transform,box-shadow] duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--bleed:3rem] after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-[var(--bleed)] after:bg-drawer after:content-[''] data-[ending-style]:[transform:translateY(calc(100%+2px))] data-[starting-style]:[transform:translateY(calc(100%+2px))] data-[swiping]:select-none"
			>
				<div class="shrink-0 touch-none px-6 pt-3.5 pb-3">
					<div class="grid grid-cols-[1fr_auto_1fr] items-center">
						<div aria-hidden="true" class="h-9 w-9"></div>
						<div class="h-1 w-12 justify-self-center rounded-full bg-dark-40"></div>
						<Drawer.Close
							aria-label="Close menu"
							class="absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
						>
							<div>
								<X class="size-5 text-foreground" />
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
								class="m-0 mb-1 text-lg leading-7 font-semibold tracking-tight"
							>
								Menu
							</Drawer.Title>
							<Drawer.Description class="m-0 mb-5 text-sm text-foreground-alt">
								Browse the docs and components.
							</Drawer.Description>
							<nav aria-label="Navigation" class="w-full">
								<p
									class="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase"
								>
									Docs
								</p>
								<ul class="m-0 grid list-none gap-1 p-0">
									{#each ITEMS as item (item.href)}
										<li class="flex">
											<a
												class="w-full rounded-card-sm bg-dark-04 px-4 py-3 text-sm text-foreground no-underline hover:bg-dark-10 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
												href={item.href}
											>
												{item.label}
											</a>
										</li>
									{/each}
								</ul>

								<p
									class="mt-6 mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase"
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
												class="w-full rounded-card-sm bg-dark-04 px-4 py-3 text-sm text-foreground no-underline hover:bg-dark-10 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
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
							class="flex w-2.5 touch-none rounded-full border-l border-l-transparent p-px transition-all duration-200 select-none data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100"
						>
							<ScrollArea.Thumb class="flex-1 rounded-full bg-dark-40" />
						</ScrollArea.Scrollbar>
					</ScrollArea.Root>
				</Drawer.Content>
			</Drawer.Popup>
		</Drawer.Viewport>
	</Drawer.Portal>
</Drawer.Root>
