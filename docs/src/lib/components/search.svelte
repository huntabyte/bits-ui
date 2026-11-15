<script lang="ts">
	import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
	import { flushSync, onMount } from "svelte";
	import { Button, Command, Dialog } from "bits-ui";
	import {
		type SearchResult,
		createContentIndex,
		searchContentIndex,
	} from "#lib/utils/search.js";
	import ScrollArea from "./ui/scroll-area.svelte";

	let { showTrigger = true, open = $bindable(false) }: { showTrigger?: boolean; open?: boolean } =
		$props();

	let searchState = $state<"loading" | "ready">("loading");
	let searchQuery = $state("");
	let searchInput = $state<HTMLInputElement | null>(null);
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

	function openSearch() {
		if (clearTimeoutId !== undefined) {
			window.clearTimeout(clearTimeoutId);
			clearTimeoutId = undefined;
			searchQuery = "";
		}
		// iOS needs focus within the user gesture to open the software keyboard.
		flushSync(() => (open = true));
		searchInput?.focus({ preventScroll: true });
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			openSearch();
		}
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

<Dialog.Root
	bind:open
	onOpenChange={(o) => {
		if (o) return;
		clearSearchWithDelay();
	}}
>
	{#if showTrigger}
		<Button.Root
			onclick={openSearch}
			aria-label="Search Docs"
			class="relative -mr-3 ml-auto inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-input px-2 transition-colors hover:bg-dark-10 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden sm:hidden"
		>
			<MagnifyingGlass class="size-5" />
		</Button.Root>
		<Dialog.Trigger
			onclick={openSearch}
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
			<Command.Root
				shouldFilter={false}
				class="flex h-full w-full flex-col self-start overflow-hidden rounded-xl bg-background"
			>
				<Command.Input
					bind:ref={searchInput}
					autofocus
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
							<ScrollArea {...props} type="auto">
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
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
