<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	import CaretDown from "phosphor-svelte/lib/CaretDown";
	import OpenAiLogo from "phosphor-svelte/lib/OpenAiLogo";
	import FileMd from "phosphor-svelte/lib/FileMd";
	import { page } from "$app/state";
	import type { Component } from "svelte";
	import Claude from "$icons/claude.svelte";

	const q = $derived(
		`The following is a documentation page from Bits UI (a headless component library for Svelte 5): https://bits-ui.com${page.url.pathname}. Be ready to help answer questions about this page.`
	);

	const path = $derived(page.url.pathname.split("#")[0]);
</script>

{#snippet LinkItem({ href, icon, label }: { href: string; icon: Component; label: string })}
	<DropdownMenu.Item
		class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
	>
		{#snippet child({ props })}
			{@const Icon = icon}
			<a {href} target="_blank" {...props}>
				<div class="flex items-center">
					<Icon class="text-foreground-alt mr-2 size-5" />
					{label}
				</div>
			</a>
		{/snippet}
	</DropdownMenu.Item>
{/snippet}

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="border-input text-foreground hover:bg-muted inline-flex size-8 select-none items-center justify-center rounded-r-md border text-sm font-medium active:scale-[0.98]"
	>
		<CaretDown class="text-foreground size-4" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="border-muted bg-background shadow-popover outline-hidden focus-visible:outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-h-(--bits-dropdown-menu-content-available-height) origin-(--bits-dropdown-menu-content-transform-origin) z-50 w-[180px] rounded-xl border px-1 py-1.5"
			sideOffset={8}
			align="end"
		>
			{@render LinkItem({
				href: `https://bits-ui.com${path}/llms.txt`,
				label: "View Markdown",
				icon: FileMd,
			})}
			{@render LinkItem({
				href: `https://chatgpt.com?q=${encodeURIComponent(q)}`,
				label: "Open in ChatGPT",
				icon: OpenAiLogo,
			})}
			{@render LinkItem({
				href: `https://claude.ai/new?q=${encodeURIComponent(q)}`,
				label: "Open in Claude",
				icon: Claude,
			})}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
