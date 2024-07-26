<script lang="ts">
	import type { Snippet } from "svelte";
	import { Collapsible, Tabs } from "bits-ui";
	import DemoCodeTabs from "./demo-code-tabs.svelte";
	import TailwindConfig from "./code-renders/tailwind-config.svelte";
	import AppCSS from "./code-renders/app-css.svelte";
	import { cn } from "$lib/utils/styles.js";

	type Props = {
		children: Snippet;
		class?: string;
	};
	let { children, class: className }: Props = $props();

	const items = [
		{
			label: "App.svelte",
			value: "App.svelte",
		},
		{
			label: "tailwind.config.js",
			value: "tailwind.config.js",
		},
		{
			label: "app.css",
			value: "app.css",
		},
	];

	let open = $state(false);
</script>

<DemoCodeTabs {items} value="App.svelte" bind:open>
	<Collapsible.Root bind:open>
		{#each items as item (item.value)}
			<Tabs.Content
				value={item.value}
				class="relative overflow-hidden rounded-b-card border-x-2 border-b-2 bg-background"
			>
				<Collapsible.Content forceMount>
					<div
						class={cn(
							"w-full [&_pre]:!my-0 [&_pre]:!mt-0 [&_pre]:max-h-[800px] [&_pre]:min-h-80 [&_pre]:overflow-auto [&_pre]:!rounded-none [&_pre]:!rounded-b-none [&_pre]:!rounded-tl-none [&_pre]:!rounded-tr-none [&_pre]:!border-t-0 [&_pre]:!border-none [&_pre]:!px-2 [&_pre]:!pb-5 [&_pre]:!pt-2",
							!open && "[&_pre]:!max-h-80",
							className
						)}
					>
						{#if item.value === "App.svelte"}
							{@render children()}
						{:else if item.value === "tailwind.config.js"}
							<TailwindConfig />
						{:else if item.value === "app.css"}
							<AppCSS />
						{/if}
					</div>
				</Collapsible.Content>
			</Tabs.Content>
		{/each}
	</Collapsible.Root>
</DemoCodeTabs>
