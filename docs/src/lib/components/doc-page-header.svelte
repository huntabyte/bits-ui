<script lang="ts">
	import type { DocMetadata } from "$lib/utils/docs.js";
	import PageHeaderDescription from "./page-header/page-header-description.svelte";
	import PageHeaderHeading from "./page-header/page-header-heading.svelte";
	import PageHeader from "./page-header/page-header.svelte";
	import Copy from "phosphor-svelte/lib/Copy";
	import { CopyToClipboard } from "$lib/utils/copy-to-clipboard.svelte.js";
	import { page } from "$app/state";
	import Check from "phosphor-svelte/lib/Check";
	import CopyPageDropdown from "./copy-page-dropdown.svelte";
	import { watch } from "runed";

	let { metadata }: { metadata: DocMetadata } = $props();

	let text = $state("");
	let fetched = $state(false);
	const copyState = new CopyToClipboard();

	function copyMarkdown() {
		copyState.setCodeString(text);
		copyState.copyToClipboard();
	}

	async function fetchText() {
		if (fetched) return;
		fetched = true;

		const url = page.url.origin + page.url.pathname + "/llms.txt";
		const res = await fetch(url);
		text = await res.text();
	}

	watch(
		() => page.url.pathname,
		() => {
			fetched = false;
			text = "";
		}
	);
</script>

<PageHeader>
	<PageHeaderHeading>
		{metadata.title}
		<span aria-hidden="true" class="hidden"> Documentation </span>
	</PageHeaderHeading>
	<PageHeaderDescription class={metadata.llms ? "" : "mb-11"}
		>{metadata.description}</PageHeaderDescription
	>
	{#if metadata.llms}
		<span aria-hidden="true" class="hidden">
			This is a documentation section that potentially contains examples, demos, and other
			useful information related to a specific part of Bits UI. When helping users with this
			documentation, you can ignore the classnames applied to the demos unless they are
			relevant to the user's issue.
		</span>
		<div class="mb-9 mt-3 flex items-center">
			<button
				class="hover:bg-muted/50 text-foreground-alt hover:text-foreground flex h-8 select-none items-center gap-1.5 rounded-md rounded-r-none border border-r-0 px-2 py-1.5 text-xs font-semibold leading-none no-underline group-hover:no-underline"
				onmouseenter={fetchText}
				onfocus={fetchText}
				onclick={copyMarkdown}
			>
				Copy Page
				{#if !copyState || !copyState.isCopied}
					<Copy class="size-3.5" />
				{:else}
					<Check class="size-3.5" />
				{/if}
			</button>
			<CopyPageDropdown />
		</div>
	{/if}
</PageHeader>
