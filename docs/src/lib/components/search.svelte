<script lang="ts">
	import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
	import { onMount } from "svelte";
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

	const isMobile = new MediaQuery("(width < 40rem)");
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
		}, 450);
	}
</script>

<svelte:document onkeydown={handleKeydown} />

{#if isMobile.current}
	<Drawer.Root bind:open swipeDirection="down" onOpenChange={handleOpenChange}>
		{#if showTrigger}
			<Drawer.Trigger
				aria-label="Search Docs"
				class="relative -mr-3 ml-auto inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-input px-2 transition-colors hover:bg-dark-10 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden sm:hidden"
			>
				<MagnifyingGlass class="size-5" />
			</Drawer.Trigger>
		{/if}
		<Drawer.Portal>
			<Drawer.Backdrop class="search-backdrop fixed inset-0 z-50 bg-black/80" />
			<Drawer.Viewport
				class="fixed inset-0 z-100 flex items-end justify-center pb-[var(--drawer-keyboard-inset)]"
			>
				<Drawer.Popup
					class="search-drawer w-full overflow-y-auto overscroll-contain rounded-t-2xl bg-background px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-popover outline-hidden"
					onOpenAutoFocus={(event) => {
						event.preventDefault();
						searchInput?.focus({ preventScroll: true });
					}}
				>
					<div
						aria-hidden="true"
						class="mx-auto my-3 h-1 w-10 rounded-full bg-muted-foreground/40"
					></div>
					<Drawer.Content>
						<Drawer.Title class="sr-only">Search</Drawer.Title>
						<Drawer.Description class="sr-only"
							>Search for documentation</Drawer.Description
						>
						<Drawer.Close class="ml-auto block px-3 py-2 text-sm text-muted-foreground"
							>Close</Drawer.Close
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
		class="flex h-full w-full flex-col self-start overflow-hidden rounded-xl bg-background"
	>
		<Command.Input
			bind:ref={searchInput}
			aria-label="Search documentation"
			bind:value={searchQuery}
			autocomplete="off"
			spellcheck="false"
			type="search"
			data-empty={searchQuery === ""}
			class="focus-override inline-flex h-input w-full touch-manipulation truncate rounded-xl bg-background px-4 text-base transition-colors placeholder:text-foreground-alt/50 focus:ring-0 focus:outline-hidden data-[empty=false]:rounded-b-none data-[empty=false]:border-b"
			placeholder="Search for something..."
		/>
		{#if searchQuery !== "" && results.length === 0}
			<Command.Empty
				forceMount
				class="flex w-full items-center justify-center pt-8 pb-6 text-sm text-foreground"
				>No results found.</Command.Empty
			>
		{/if}

		{#if searchQuery !== "" && results.length > 0}
			<Command.List class="mt-1 max-h-[400px] overflow-x-hidden px-2 pt-2 pb-2">
				{#snippet child({ props })}
					<ScrollArea
						{...props}
						type="auto"
						class={isMobile.current
							? "max-h-[min(400px,calc(100dvh-var(--drawer-keyboard-inset)-12rem))]"
							: undefined}
					>
						<Command.Viewport>
							{#if searchState === "loading"}
								<Command.Loading>Loading...</Command.Loading>
							{/if}

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
											<span class="text-xs text-muted-foreground"
												>{category}</span
											>
										{/if}
									</div>
									{#if snippet}
										<div
											class="search-result text-xs leading-relaxed text-muted-foreground"
										>
											{@html snippet}
										</div>
									{/if}
								</Command.LinkItem>
							{/each}
						</Command.Viewport>
					</ScrollArea>
				{/snippet}
			</Command.List>
		{/if}
	</Command.Root>
{/snippet}

<style>
	:global(.search-drawer) {
		max-height: calc(100dvh - var(--drawer-keyboard-inset) - 2rem);
		transform: translateY(var(--drawer-swipe-movement-y));
		transition: transform 450ms cubic-bezier(0.32, 0.72, 0, 1);
	}

	:global(.search-drawer[data-starting-style]),
	:global(.search-drawer[data-ending-style]) {
		transform: translateY(calc(100% + 2px));
	}

	:global(.search-backdrop) {
		opacity: calc(1 - var(--drawer-swipe-progress));
		transition: opacity 450ms cubic-bezier(0.32, 0.72, 0, 1);
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
