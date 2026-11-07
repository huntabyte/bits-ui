<script lang="ts">
	import X from "phosphor-svelte/lib/X";
	import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
	import { onMount } from "svelte";
	import { page } from "$app/state";
	import { navigation, type NavItem } from "#lib/config/index.js";
	import { MediaQuery } from "svelte/reactivity";
	import { Command, Dialog, unstable_Drawer as Drawer } from "bits-ui";
	import {
		type SearchResult,
		createContentIndex,
		searchContentIndex,
	} from "#lib/utils/search.js";
	import ScrollArea from "./ui/scroll-area.svelte";

	let { showTrigger = true, open = $bindable(false) }: { showTrigger?: boolean; open?: boolean } =
		$props();

	const isMobile = new MediaQuery("(width < 48rem)");
	let searchInput = $state<HTMLInputElement | null>(null);

	let searchState = $state<"loading" | "ready">("loading");
	let searchQuery = $state("");
	let results = $state<SearchResult[]>([]);

	onMount(async () => {
		const content = await fetch("/api/search.json").then((res) => res.json());
		createContentIndex(content);
		searchState = "ready";
	});

	$effect(() => {
		if (searchState !== "ready") return;
		results = searchContentIndex(searchQuery);
	});

	let clearTimeoutId: number | undefined;

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = true;
		}
	}

	onMount(() => () => window.clearTimeout(clearTimeoutId));

	function handleOpenChange(nextOpen: boolean) {
		if (nextOpen) {
			window.clearTimeout(clearTimeoutId);
			return;
		}
		clearSearchWithDelay();
	}

	function clearSearchWithDelay() {
		if (clearTimeoutId) window.clearTimeout(clearTimeoutId);
		clearTimeoutId = window.setTimeout(() => {
			searchQuery = "";
			clearTimeoutId = undefined;
		}, 300);
	}
</script>

<svelte:document onkeydown={handleKeydown} />

{#if isMobile.current}
	<Drawer.Root bind:open swipeDirection="down" onOpenChange={handleOpenChange}>
		{#if showTrigger}
			<Drawer.Trigger
				aria-label="Search Docs"
				class="relative -mr-3 ml-auto inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-input px-2 transition-colors hover:bg-dark-10 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden md:hidden"
			>
				<MagnifyingGlass class="size-5" />
			</Drawer.Trigger>
		{/if}
		<Drawer.Portal>
			<Drawer.Backdrop class="search-backdrop fixed inset-0 z-50 bg-black/50" />
			<Drawer.Viewport
				class="search-viewport fixed top-0 left-0 z-100 flex w-full items-end justify-center"
			>
				<Drawer.Popup
					class="search-drawer flex w-full shrink-0 flex-col overflow-hidden rounded-t-2xl bg-background shadow-popover outline-hidden"
					onOpenAutoFocus={(event) => {
						event.preventDefault();
						searchInput?.focus({ preventScroll: true });
					}}
				>
					<div
						aria-hidden="true"
						class="mx-auto mt-2.5 mb-1 h-1 w-8 shrink-0 rounded-full bg-dark-10"
					></div>
					<Drawer.Content class="flex min-h-0 flex-1 flex-col">
						<Drawer.Title class="sr-only">Documentation</Drawer.Title>
						<Drawer.Description class="sr-only"
							>Browse all documentation or search for a page</Drawer.Description
						>
						{@render searchContent()}
					</Drawer.Content>
				</Drawer.Popup>
			</Drawer.Viewport>
		</Drawer.Portal>
	</Drawer.Root>
{:else}
	<Dialog.Root bind:open onOpenChange={handleOpenChange}>
		{#if showTrigger}
			<Dialog.Trigger
				class="relative hidden h-10 items-center justify-between gap-3 rounded-[9px] bg-muted px-3 text-sm font-normal whitespace-nowrap text-muted-foreground ring-offset-background transition-colors hover:bg-dark-10 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden sm:inline-flex sm:w-72"
			>
				<span class="flex items-center gap-2">
					<MagnifyingGlass class="size-5" />Search Docs ...
				</span>
				<span class="flex items-center gap-[1px]">
					<kbd
						class="pointer-events-none hidden h-5 items-center gap-1 rounded-sm border bg-background-alt px-1.5 font-mono text-[10px] font-medium opacity-100 shadow-kbd select-none sm:flex dark:bg-dark-10 dark:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.07)]"
					>
						<span class="text-xs">⌘</span>
					</kbd>
					<kbd
						class="pointer-events-none hidden h-5 items-center gap-1 rounded-sm border bg-background-alt px-1.5 font-mono text-[10px] font-medium opacity-100 shadow-kbd select-none sm:flex dark:bg-dark-10 dark:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.07)]"
					>
						K
					</kbd>
				</span>
			</Dialog.Trigger>
		{/if}
		<Dialog.Portal>
			<Dialog.Overlay
				class="fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
			/>
			<Dialog.Content
				class="fixed top-[20%] left-[50%] z-100 w-full max-w-[94%] translate-x-[-50%] translate-y-[0%] rounded-card-lg bg-background shadow-popover outline-hidden duration-400 ease-out data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-[600px] md:w-full"
				onCloseAutoFocus={(e) => {
					e.preventDefault();
				}}
			>
				<Dialog.Title class="sr-only">Search</Dialog.Title>
				<Dialog.Description class="sr-only">Search for documentation</Dialog.Description>
				{@render searchContent()}
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
{/if}

{#snippet searchContent()}
	<Command.Root
		shouldFilter={false}
		class={isMobile.current
			? "flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-background"
			: "flex h-full w-full flex-col self-start overflow-hidden rounded-xl bg-background"}
	>
		<div
			class={isMobile.current
				? "flex shrink-0 items-center gap-3 border-b border-border-card px-4 pb-2"
				: "contents"}
		>
			{#if isMobile.current}
				<MagnifyingGlass class="size-5 shrink-0 text-foreground-alt" aria-hidden="true" />
			{/if}
			<Command.Input
				bind:ref={searchInput}
				aria-label="Search documentation"
				bind:value={searchQuery}
				autocomplete="off"
				spellcheck="false"
				type="search"
				data-empty={searchQuery === ""}
				class={isMobile.current
					? "focus-override h-12 min-w-0 flex-1 appearance-none bg-transparent text-base text-foreground outline-hidden placeholder:text-foreground-alt focus:ring-0"
					: "focus-override inline-flex h-input w-full touch-manipulation truncate rounded-xl bg-background px-4 text-base transition-colors placeholder:text-foreground-alt/50 focus:ring-0 focus:outline-hidden data-[empty=false]:rounded-b-none data-[empty=false]:border-b"}
				placeholder={isMobile.current ? "Search documentation…" : "Search for something..."}
				enterkeyhint="search"
				autocapitalize="off"
			/>
			{#if isMobile.current}
				<Drawer.Close
					aria-label="Close search"
					class="flex size-10 shrink-0 items-center justify-center rounded-full text-foreground-alt hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground active:bg-muted"
				>
					<X class="size-[18px]" aria-hidden="true" />
				</Drawer.Close>
			{/if}
		</div>
		{#if searchQuery !== "" && results.length === 0 && searchState === "ready"}
			<Command.Empty
				forceMount
				class="flex flex-1 flex-col items-center justify-center gap-1 px-6 py-10 text-center text-sm"
			>
				<span class="font-medium text-foreground">No results found</span>
				<span class="text-foreground-alt">Try another component or keyword.</span>
			</Command.Empty>
		{/if}
		{#if (isMobile.current && (searchQuery === "" || searchState === "loading")) || (searchQuery !== "" && results.length > 0)}
			<Command.List
				class={isMobile.current
					? "min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom),var(--drawer-keyboard-inset,0px))]"
					: "mt-1 max-h-[400px] overflow-x-hidden px-2 pt-2 pb-2"}
			>
				{#snippet child({ props })}
					{#if isMobile.current}
						<div {...props}>{@render resultItems()}</div>
					{:else}
						<ScrollArea {...props} type="auto">{@render resultItems()}</ScrollArea>
					{/if}
				{/snippet}
			</Command.List>
		{/if}
	</Command.Root>
{/snippet}

{#snippet resultItems()}
	<Command.Viewport>
		{#if searchState === "loading" && searchQuery !== ""}
			<Command.Loading class="px-3 py-4 text-sm text-foreground-alt"
				>Loading documentation…</Command.Loading
			>
		{:else if isMobile.current && searchQuery === ""}
			{#each navigation.sidebar as group (group.title)}
				<Command.Group class="pb-4">
					<Command.GroupHeading
						class="px-3 pt-2 pb-2 text-xs font-medium text-foreground-alt"
					>
						{group.title}
					</Command.GroupHeading>
					<Command.GroupItems>
						{#if group.title === "Overview"}
							{@render navigationLink({ title: "Home", href: "/" })}
						{/if}
						{#each group.items as item (item.title + item.href)}
							{#if item.href && !item.disabled}
								{@render navigationLink(item)}
							{/if}
						{/each}
					</Command.GroupItems>
				</Command.Group>
			{/each}
		{:else}
			{#each results as { title, href, snippet, category } (title + href)}
				<Command.LinkItem
					{href}
					class="flex cursor-pointer flex-col items-start gap-1 rounded-button px-3 py-2.5 text-sm outline-hidden select-none data-selected:bg-muted"
					onSelect={() => {
						searchQuery = "";
						open = false;
					}}
				>
					<div class="flex w-full items-center justify-between">
						<span class="font-medium capitalize">{title}</span>
						{#if category}
							<span class="text-xs text-muted-foreground">{category}</span>
						{/if}
					</div>
					{#if snippet}
						<div class="search-result text-xs leading-relaxed text-muted-foreground">
							{@html snippet}
						</div>
					{/if}
				</Command.LinkItem>
			{/each}
		{/if}
	</Command.Viewport>
{/snippet}

{#snippet navigationLink(item: NavItem)}
	<Command.LinkItem
		href={item.href}
		value={item.href}
		aria-current={page.url.pathname === item.href ? "page" : undefined}
		target={item.external ? "_blank" : undefined}
		rel={item.external ? "noreferrer" : undefined}
		onSelect={() => (open = false)}
		class="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-hidden aria-[current=page]:font-semibold aria-[current=page]:text-foreground data-selected:bg-muted"
	>
		{item.title}
		{#if item.label}
			<span class="ml-auto rounded bg-muted px-1.5 py-0.5 text-xs text-foreground-alt"
				>{item.label}</span
			>
		{/if}
	</Command.LinkItem>
{/snippet}

<style>
	/* Keep the sheet anchored while the software keyboard covers the lower viewport. */
	:global(.search-viewport) {
		height: 100svh;
	}

	:global(.search-drawer) {
		height: calc(100svh - var(--header-height) - 0.5rem);
		transform: translate3d(0, var(--drawer-swipe-movement-y), 0);
		will-change: transform;
		transition: transform 280ms cubic-bezier(0.32, 0.72, 0, 1);
	}

	:global(.search-drawer[data-starting-style]),
	:global(.search-drawer[data-ending-style]) {
		transform: translate3d(0, calc(100% + 2px), 0);
	}

	:global(.search-backdrop) {
		opacity: calc(1 - var(--drawer-swipe-progress));
		will-change: opacity;
		transition: opacity 280ms cubic-bezier(0.32, 0.72, 0, 1);
	}

	:global(.search-backdrop[data-starting-style]),
	:global(.search-backdrop[data-ending-style]) {
		opacity: 0;
	}

	:global(.search-drawer[data-swiping]),
	:global(.search-backdrop[data-swiping]) {
		transition-duration: 0ms;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.search-drawer),
		:global(.search-backdrop) {
			transition-duration: 0ms;
		}
	}
</style>
