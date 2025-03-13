<script lang="ts">
	import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
	import { onMount } from "svelte";
	import { Button, Command, Dialog } from "bits-ui";
	import {
		type SearchContent,
		createContentIndex,
		searchContentIndex,
	} from "$lib/utils/search.js";

	let searchState = $state<"loading" | "ready">("loading");
	let searchQuery = $state("");
	let results = $state<SearchContent[]>([]);

	onMount(async () => {
		const content = await fetch("/api/search.json").then((res) => res.json());
		createContentIndex(content);
		searchState = "ready";
	});

	$effect(() => {
		if (searchState === "ready") {
			results = searchContentIndex(searchQuery);
		}
	});

	let dialogOpen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			dialogOpen = true;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<Dialog.Root
	bind:open={dialogOpen}
	onOpenChange={(o) => {
		if (!o) {
			searchQuery = "";
		}
	}}
>
	<Button.Root
		onclick={() => (dialogOpen = true)}
		aria-label="Search Docs"
		class="rounded-input hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden relative -mr-3 ml-auto inline-flex h-10 w-10 touch-manipulation items-center justify-center px-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 sm:hidden"
	>
		<MagnifyingGlass class="size-5" />
	</Button.Root>

	<Dialog.Trigger
		class="bg-muted text-muted-foreground ring-offset-background hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden relative hidden h-10 items-center justify-between gap-3 whitespace-nowrap rounded-[9px] px-3 text-sm font-normal transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 sm:inline-flex sm:w-72"
	>
		<span class="flex items-center gap-2">
			<MagnifyingGlass class="size-5" />Search Docs ...
		</span>
		<span class="flex items-center gap-[1px]">
			<kbd
				class="bg-background-alt shadow-kbd dark:bg-dark-10 pointer-events-none hidden h-5 select-none items-center gap-1 rounded-sm border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex dark:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.07)]"
			>
				<span class="text-xs">⌘</span>
			</kbd>
			<kbd
				class="bg-background-alt shadow-kbd dark:bg-dark-10 pointer-events-none hidden h-5 select-none items-center gap-1 rounded-sm border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex dark:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.07)]"
			>
				K
			</kbd>
		</span>
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
		/>
		<Dialog.Content
			class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%] outline-hidden fixed left-[50%] top-[20%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[0%] sm:max-w-[490px] md:w-full"
			onCloseAutoFocus={(e) => {
				e.preventDefault();
			}}
		>
			<Dialog.Title class="sr-only">Search</Dialog.Title>
			<Dialog.Description class="sr-only">Search for documentation</Dialog.Description>
			<Command.Root
				shouldFilter={false}
				class="divide-border bg-background flex h-full w-full flex-col divide-y self-start overflow-hidden  rounded-xl"
			>
				<Command.Input
					bind:value={searchQuery}
					autocomplete="off"
					spellcheck="false"
					type="search"
					class="focus-override h-input bg-background placeholder:text-foreground-alt/50 focus:outline-hidden inline-flex w-full touch-manipulation truncate rounded-xl px-4 text-base transition-colors focus:ring-0"
					placeholder="Search for something..."
				/>
				{#if searchQuery !== "" && results.length === 0}
					<Command.Empty
						forceMount
						class="text-foreground flex w-full items-center justify-center pb-6 pt-8 text-sm"
						>No results found.</Command.Empty
					>
				{/if}

				{#if searchQuery !== "" && results.length > 0}
					<Command.List
						class="max-h-[280px] overflow-y-auto overflow-x-hidden px-2 pb-2 pt-2"
					>
						<Command.Viewport>
							{#if searchState === "loading"}
								<Command.Loading>Loading...</Command.Loading>
							{/if}

							{#each results as { title, href }}
								<Command.LinkItem
									{href}
									class="rounded-button data-selected:bg-muted outline-hidden flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize"
									onSelect={() => {
										searchQuery = "";
										dialogOpen = false;
									}}
								>
									{title}
								</Command.LinkItem>
							{/each}
						</Command.Viewport>
					</Command.List>
				{/if}
			</Command.Root>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
