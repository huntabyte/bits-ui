<script lang="ts">
	import { NavigationMenu } from "bits-ui";
	import CaretDown from "phosphor-svelte/lib/CaretDown";
	import { cn } from "$lib/utils/styles.js";

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
	];

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
			"hover:bg-muted hover:text-accent-foreground focus-visible:bg-muted focus-visible:text-accent-foreground outline-hidden block select-none space-y-1 rounded-md p-3 leading-none no-underline transition-colors",
			className
		)}
		{href}
	>
		<div class="text-sm font-medium leading-none">{title}</div>
		<p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
			{content}
		</p>
	</NavigationMenu.Link>
{/snippet}

{#snippet SubmenuItem({ className, title, value, items }: SubmenuItemProps)}
	<NavigationMenu.Item {value} class="relative w-full">
		<NavigationMenu.Trigger
			class={cn(
				"hover:bg-muted hover:text-accent-foreground focus-visible:bg-muted focus-visible:text-accent-foreground data-[state=open]:bg-muted outline-hidden group flex w-full select-none items-center justify-between space-y-1 rounded-md p-3 leading-none no-underline transition-colors",
				className
			)}
		>
			<div class="text-sm font-medium leading-none">{title}</div>
			<CaretDown
				class="ml-auto size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
				aria-hidden="true"
			/>
		</NavigationMenu.Trigger>
		<NavigationMenu.Content
			class="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-right-1 data-[state=open]:slide-in-from-right-1 absolute left-0 top-full z-50 mt-2 w-full min-w-[300px] rounded-md border shadow-lg transition-all duration-200 ease-out"
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
				class="hover:text-accent-foreground focus-visible:bg-muted focus-visible:text-accent-foreground data-[state=open]:shadow-mini dark:hover:bg-muted dark:data-[state=open]:bg-muted focus-visible:outline-hidden group inline-flex h-8 w-max items-center justify-center rounded-[7px] bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-white"
			>
				Getting started
				<CaretDown
					class="relative top-[1px] ml-1 size-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
					aria-hidden="true"
				/>
			</NavigationMenu.Trigger>
			<NavigationMenu.Content
				class="data-[motion=from-end]:animate-enter-from-right data-[motion=from-start]:animate-enter-from-left data-[motion=to-end]:animate-exit-to-right data-[motion=to-start]:animate-exit-to-left data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 bg-background absolute left-0 top-full mt-2 w-full rounded-md border shadow-lg sm:w-auto"
			>
				<ul
					class="m-0 grid list-none gap-x-2.5 p-3 sm:w-[600px] sm:grid-flow-col sm:grid-rows-3 sm:p-[22px]"
				>
					<li class="row-span-3 mb-2 sm:mb-0">
						<NavigationMenu.Link
							href="/"
							class="from-muted/50 to-muted bg-linear-to-b outline-hidden flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline focus-visible:shadow-md"
						>
							<!-- <Icons.logo class="h-6 w-6" /> -->
							<div class="mb-2 mt-4 text-lg font-medium">Bits UI</div>
							<p class="text-muted-foreground text-sm leading-tight">
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
				class="hover:text-accent-foreground focus-visible:bg-muted focus-visible:text-accent-foreground data-[state=open]:shadow-mini dark:hover:bg-muted dark:data-[state=open]:bg-muted focus-visible:outline-hidden group inline-flex h-8 w-max items-center justify-center rounded-[7px] bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-white"
			>
				Features
				<CaretDown
					class="relative top-[1px] ml-1 size-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
					aria-hidden="true"
				/>
			</NavigationMenu.Trigger>
			<NavigationMenu.Content
				class="data-[motion=from-end]:animate-enter-from-right data-[motion=from-start]:animate-enter-from-left data-[motion=to-end]:animate-exit-to-right data-[motion=to-start]:animate-exit-to-left data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 bg-background absolute left-0 top-full mt-2 w-full rounded-md border shadow-lg sm:w-auto"
			>
				<div class="relative p-3 sm:w-[500px] sm:p-6">
					<NavigationMenu.Sub orientation="vertical" class="w-full">
						<NavigationMenu.List class="flex flex-col space-y-1">
							<li>
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
							{/each}
							<div class="flex items-center justify-between">
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
					</NavigationMenu.Sub>
				</div>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link
				class="hover:text-accent-foreground focus-visible:bg-muted focus-visible:text-accent-foreground data-[state=open]:shadow-mini dark:hover:bg-muted dark:data-[state=open]:bg-muted focus-visible:outline-hidden group inline-flex h-8 w-max items-center justify-center rounded-[7px] bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-white"
				href="/docs"
			>
				<span class="hidden sm:inline"> Documentation </span>
				<span class="inline sm:hidden"> Docs </span>
			</NavigationMenu.Link>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>
