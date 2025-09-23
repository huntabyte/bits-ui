<script lang="ts">
	import type { Snippet } from "svelte";
	import { Collapsible, Tabs } from "bits-ui";
	import DemoCodeTabs from "./demo-code-tabs.svelte";
	import AppCSS from "./code-renders/app-css.svelte";
	import ScrollArea from "$lib/components/ui/scroll-area.svelte";
	import { cn } from "$lib/utils/styles.js";
	import { useCopyToClipboard } from "$lib/utils/copy-to-clipboard.svelte.js";
	import { watch } from "runed";

	let {
		children,
		fileName = "app.svelte",
		class: className,
		nonExpandableItems = [],
		variant = "preview",
	}: {
		fileName?: string;
		children: Snippet;
		class?: string;
		nonExpandableItems?: string[];
		variant?: "preview" | "collapsed";
	} = $props();

	const items = $derived([
		{
			label: fileName,
			value: fileName,
		},
		{
			label: "app.css",
			value: "app.css",
		},
	]);

	let open = $state(false);
	let activeValue = $state(fileName);
	let codeWrapper = $state<HTMLElement>(null!);
	const expandable = $derived(!nonExpandableItems.includes(activeValue));
	const copyToClipboard = useCopyToClipboard();

	watch([() => activeValue, () => codeWrapper], () => {
		if (!codeWrapper) return;
		copyToClipboard?.setCodeString(codeWrapper.innerText.trim() ?? "");
	});
</script>

<Collapsible.Root bind:open>
	<DemoCodeTabs
		{items}
		value={activeValue}
		onValueChange={(v) => {
			activeValue = v;
		}}
		bind:open
		{expandable}
		bind:ref={codeWrapper}
		{variant}
	>
		{#each items as item (item.value)}
			<Tabs.Content
				value={item.value}
				class="rounded-b-card bg-background relative overflow-hidden border-x-2 border-b-2"
				data-llm-ignore={item.value === "app.css" ? "" : undefined}
			>
				<Collapsible.Content forceMount>
					<ScrollArea
						class={cn(
							"h-full max-h-fit min-h-80 w-full py-0",
							!open && "max-h-80!",
							className
						)}
					>
						<div
							class={cn(
								"[&_pre]:my-0! [&_pre]:mt-0! [&_pre]:rounded-none! [&_pre]:rounded-tl-none! [&_pre]:rounded-tr-none! [&_pre]:rounded-b-none! [&_pre]:border-t-0! [&_pre]:border-none! [&_pre]:px-2! [&_pre]:pt-2! [&_pre]:pb-5! w-full",
								className
							)}
						>
							{#if item.value === fileName}
								{@render children()}
							{:else if item.value === "app.css"}
								<AppCSS />
							{/if}
						</div>
					</ScrollArea>
				</Collapsible.Content>
			</Tabs.Content>
		{/each}
	</DemoCodeTabs>
</Collapsible.Root>
