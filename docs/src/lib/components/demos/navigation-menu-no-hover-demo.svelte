<script lang="ts">
	import { NavigationMenu } from "bits-ui";
	import CaretDown from "phosphor-svelte/lib/CaretDown";
	import { cn } from "#lib/utils/styles.js";

	const components: { title: string; href: string; description: string }[] = [
		{
			title: "Alert Dialog",
			href: "/docs/components/alert-dialog",
			description:
				"A modal dialog that interrupts the user with important content and expects a response.",
		},
		{
			title: "Link Preview",
			href: "/docs/components/link-preview",
			description: "For sighted users to preview content available behind a link.",
		},
		{
			title: "Progress",
			href: "/docs/components/progress",
			description:
				"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
		},
		{
			title: "Scroll Area",
			href: "/docs/components/scroll-area",
			description: "Visually or semantically separates content.",
		},
		{
			title: "Tabs",
			href: "/docs/components/tabs",
			description:
				"A set of layered sections of content—known as tab panels—that are displayed one at a time.",
		},
		{
			title: "Tooltip",
			href: "/docs/components/tooltip",
			description:
				"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
		},
	];

	type ListItemProps = {
		className?: string;
		title: string;
		href: string;
		content: string;
	};
</script>

{#snippet ListItem({ className, title, content, href }: ListItemProps)}
	<li>
		<NavigationMenu.Link
			class={cn(
				"block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground",
				className
			)}
			{href}
		>
			<div class="text-sm leading-none font-medium">{title}</div>
			<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
				{content}
			</p>
		</NavigationMenu.Link>
	</li>
{/snippet}

<NavigationMenu.Root class="relative z-10 flex w-full justify-center">
	<NavigationMenu.List class="group flex list-none items-center justify-center p-1">
		<NavigationMenu.Item value="getting-started" openOnHover={false}>
			<NavigationMenu.Trigger
				class="group inline-flex h-8 w-max items-center justify-center rounded-[7px] bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-accent-foreground focus-visible:bg-muted focus-visible:text-accent-foreground focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-white data-[state=open]:shadow-mini dark:hover:bg-muted dark:data-[state=open]:bg-muted"
			>
				Getting started
				<CaretDown
					class="relative top-[1px] ml-1 size-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
					aria-hidden="true"
				/>
			</NavigationMenu.Trigger>
			<NavigationMenu.Content
				class="absolute top-0 left-0 w-full data-[motion=from-end]:animate-enter-from-right data-[motion=from-start]:animate-enter-from-left data-[motion=to-end]:animate-exit-to-right data-[motion=to-start]:animate-exit-to-left sm:w-auto"
			>
				<ul
					class="m-0 grid list-none gap-x-2.5 p-3 sm:w-[600px] sm:grid-flow-col sm:grid-rows-3 sm:p-[22px]"
				>
					<li class="row-span-3 mb-2 sm:mb-0">
						<NavigationMenu.Link
							href="/"
							class="flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-hidden select-none focus:shadow-md"
						>
							<!-- <Icons.logo class="h-6 w-6" /> -->
							<div class="mt-4 mb-2 text-lg font-medium">Bits UI</div>
							<p class="text-sm leading-tight text-muted-foreground">
								The headless components for Svelte.
							</p>
						</NavigationMenu.Link>
					</li>

					{@render ListItem({
						href: "/docs",
						title: "Introduction",
						content: "Headless components for Svelte and SvelteKit",
					})}
					{@render ListItem({
						href: "/docs/getting-started",
						title: "Getting Started",
						content: "How to install and use Bits UI",
					})}
					{@render ListItem({
						href: "/docs/styling",
						title: "Styling",
						content: "How to style Bits UI components",
					})}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item openOnHover={false}>
			<NavigationMenu.Trigger
				class="group inline-flex h-8 w-max items-center justify-center rounded-[7px] bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-accent-foreground focus-visible:bg-muted focus-visible:text-accent-foreground focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-white data-[state=open]:shadow-mini dark:hover:bg-muted dark:data-[state=open]:bg-muted"
			>
				Components
				<CaretDown
					class="relative top-[1px] ml-1 size-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
					aria-hidden="true"
				/>
			</NavigationMenu.Trigger>
			<NavigationMenu.Content
				class="absolute top-0 left-0 w-full data-[motion=from-end]:animate-enter-from-right data-[motion=from-start]:animate-enter-from-left data-[motion=to-end]:animate-exit-to-right data-[motion=to-start]:animate-exit-to-left sm:w-auto"
			>
				<ul
					class="grid gap-3 p-3 sm:w-[400px] sm:p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
				>
					{#each components as component (component.title)}
						{@render ListItem({
							href: component.href,
							title: component.title,
							content: component.description,
						})}
					{/each}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link
				class="group inline-flex h-8 w-max items-center justify-center rounded-[7px] bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-accent-foreground focus-visible:bg-muted focus-visible:text-accent-foreground focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-muted"
				href="/docs"
			>
				<span class="hidden sm:inline"> Documentation </span>
				<span class="inline sm:hidden"> Docs </span>
			</NavigationMenu.Link>
		</NavigationMenu.Item>
		<NavigationMenu.Indicator
			class="top-full z-10 flex h-2.5 items-end justify-center overflow-hidden opacity-100 transition-[all,transform_250ms_ease] duration-200 data-[state=hidden]:animate-fade-out data-[state=hidden]:opacity-0 data-[state=visible]:animate-fade-in"
		>
			<div
				class="relative top-[70%] size-2.5 rotate-[45deg] rounded-tl-[2px] bg-border"
			></div>
		</NavigationMenu.Indicator>
	</NavigationMenu.List>
	<div class="absolute top-full left-0 flex w-full justify-center perspective-[2000px]">
		<NavigationMenu.Viewport
			class="text-popover-foreground relative mt-2.5 h-[var(--bits-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-md border bg-background shadow-lg transition-[width,_height] duration-200 data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in sm:w-[var(--bits-navigation-menu-viewport-width)]"
		/>
	</div>
</NavigationMenu.Root>
