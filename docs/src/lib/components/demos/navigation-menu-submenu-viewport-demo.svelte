<script lang="ts">
	import { NavigationMenu } from "bits-ui";
	import CaretDown from "phosphor-svelte/lib/CaretDown";
	import { cn } from "#lib/utils/styles.js";

	const typeHelpers = [
		{
			title: "WithElementRef",
			href: "/docs/type-helpers/with-element-ref",
			description: "Expose a ref to the element.",
		},
		{
			title: "WithoutChild",
			href: "/docs/type-helpers/without-child",
			description: "Remove the child snippet prop from a props type.",
		},
		{
			title: "WithoutChildrenOrChild",
			href: "/docs/type-helpers/without-children-or-child",
			description: "Remove the children and child snippet props from a props type.",
		},
	];

	const utilities = [
		{
			title: "mergeProps",
			href: "/docs/utilities/merge-props",
			description: "Merge multiple objects into a single object",
		},
		{
			title: "Portal",
			href: "/docs/utilities/portal",
			description: "Render a component in a different part of the DOM",
		},
		{
			title: "IsUsingKeyboard",
			href: "/docs/utilities/is-using-keyboard",
			description: "Check if the user is using a keyboard",
		},
	];

	type ListItemProps = {
		className?: string;
		title: string;
		href: string;
		content: string;
	};

	type SubmenuItemProps = {
		className?: string;
		title: string;
		value: string;
		items: { title: string; href: string; description: string }[];
	};
</script>

{#snippet ListItem({ className, title, content, href }: ListItemProps)}
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
{/snippet}

{#snippet SubmenuItem({ className, title, value, items }: SubmenuItemProps)}
	<NavigationMenu.Item {value} class="w-full">
		<NavigationMenu.Trigger
			class={cn(
				"group flex w-full items-center justify-between space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground data-[state=open]:bg-muted",
				className
			)}
		>
			<div class="text-sm leading-none font-medium">{title}</div>
			<CaretDown
				class="ml-auto size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
				aria-hidden="true"
			/>
		</NavigationMenu.Trigger>
		<NavigationMenu.Content
			class="absolute top-0 left-0 w-full data-[motion=from-end]:animate-enter-from-right data-[motion=from-start]:animate-enter-from-left data-[motion=to-end]:animate-exit-to-right data-[motion=to-start]:animate-exit-to-left "
		>
			<ul class="grid gap-1 p-2">
				{#each items as item (item.title)}
					{@render ListItem({
						href: item.href,
						title: item.title,
						content: item.description,
					})}
				{/each}
			</ul>
		</NavigationMenu.Content>
	</NavigationMenu.Item>
{/snippet}

<NavigationMenu.Root class="relative z-10 flex w-full justify-center">
	<NavigationMenu.List class="group flex list-none items-center justify-center p-1">
		<NavigationMenu.Item value="getting-started">
			<NavigationMenu.Trigger
				class="group inline-flex h-8 w-max items-center justify-center rounded-[7px] bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-white data-[state=open]:shadow-mini dark:hover:bg-muted dark:data-[state=open]:bg-muted"
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
		<NavigationMenu.Item value="features">
			<NavigationMenu.Trigger
				class="group inline-flex h-8 w-max items-center justify-center rounded-[7px] bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-white data-[state=open]:shadow-mini dark:hover:bg-muted dark:data-[state=open]:bg-muted"
			>
				Features
				<CaretDown
					class="relative top-[1px] ml-1 size-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
					aria-hidden="true"
				/>
			</NavigationMenu.Trigger>
			<NavigationMenu.Content
				class="absolute top-0 left-0 w-full data-[motion=from-end]:animate-enter-from-right data-[motion=from-start]:animate-enter-from-left data-[motion=to-end]:animate-exit-to-right data-[motion=to-start]:animate-exit-to-left sm:w-auto"
			>
				<div class="relative min-h-[600px] overflow-visible p-3 sm:w-[500px] sm:p-6">
					<NavigationMenu.Sub orientation="vertical" class="relative w-full">
						<NavigationMenu.List class="flex flex-col space-y-1">
							<!-- <li>
								<div class="text-muted-foreground px-3 py-2 text-sm font-medium">
									Components
								</div>
							</li>

							{#each components as component (component.title)}
								<NavigationMenu.Item>
									{@render ListItem({
										href: component.href,
										title: component.title,
										content: component.description,
									})}
								</NavigationMenu.Item>
							{/each} -->
							<div class="flex w-full items-center justify-between">
								{@render SubmenuItem({
									title: "Utilities",
									value: "utilities",
									items: utilities,
								})}

								{@render SubmenuItem({
									title: "Type Helpers",
									value: "type-helpers",
									items: typeHelpers,
								})}
							</div>
						</NavigationMenu.List>
						<div
							class="absolute top-full left-0 w-full overflow-hidden perspective-[2000px]"
						>
							<NavigationMenu.Viewport
								class="text-popover-foreground relative mt-2.5 h-[var(--bits-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-visible rounded-md border bg-background shadow-lg transition-[width,_height] duration-200 data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in sm:w-[var(--bits-navigation-menu-viewport-width)]"
							/>
						</div>
					</NavigationMenu.Sub>
				</div>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link
				class="group inline-flex h-8 w-max items-center justify-center rounded-[7px] bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-white data-[state=open]:shadow-mini dark:hover:bg-muted dark:data-[state=open]:bg-muted"
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
			class="text-popover-foreground relative mt-2.5 h-[var(--bits-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-visible rounded-md border bg-background shadow-lg transition-[width,_height] duration-200 data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in sm:w-[var(--bits-navigation-menu-viewport-width)]"
		/>
	</div>
</NavigationMenu.Root>
