<script lang="ts">
	import { Tabs } from "bits-ui";
	import { cubicInOut } from "svelte/easing";
	import { crossfade } from "svelte/transition";
	import { buttonVariants } from "./ui/button/index.js";
	import { cn } from "$lib/utils/styles.js";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className,
		align = "center",
		children,
		preview,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		align?: "center" | "start" | "end";
		children?: Snippet;
		preview?: Snippet;
	} = $props();

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut,
	});

	let value = $state("preview");
</script>

<div
	class={cn("group relative mb-4 mt-10 flex flex-col space-y-2", className)}
	{...restProps}
	data-preview
>
	<Tabs.Root class="relative mr-auto w-full" bind:value>
		<Tabs.List
			class="h-input-sm rounded-card-sm shadow-mini-inset absolute right-2.5 top-2.5 z-20 flex items-center justify-center bg-neutral-200 px-[4px] dark:border dark:border-neutral-600/30 dark:bg-neutral-950"
		>
			<Tabs.Trigger
				value="preview"
				class={cn(
					buttonVariants(),
					value === "preview"
						? "shadow-mini font-semibold hover:bg-opacity-90"
						: "hover:text-foreground-alt shadow-none transition-all",
					"focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden group relative bg-transparent focus-visible:ring-2 focus-visible:ring-offset-2"
				)}
			>
				<span
					class="group-data-[state=active]:text-foreground group-data-[state=inactive]:text-foreground-alt z-20"
				>
					Preview
				</span>
				{#if value === "preview"}
					<div
						class="bg-background dark:bg-muted absolute left-0 top-0 h-8 w-full rounded-[7px]"
						in:send={{ key: "active" }}
						out:receive={{ key: "active" }}
					></div>
				{/if}
			</Tabs.Trigger>
			<Tabs.Trigger
				value="code"
				class={cn(
					buttonVariants(),
					value === "code"
						? "shadow-mini bg-transparent font-semibold hover:bg-opacity-90"
						: "hover:text-foreground-alt bg-transparent shadow-none transition-all",
					"focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden group relative focus-visible:ring-2 focus-visible:ring-offset-2"
				)}
			>
				<span
					class="group-data-[state=active]:text-foreground group-data-[state=inactive]:text-foreground-alt z-20"
				>
					&lt;Code&gt;
				</span>
				{#if value === "code"}
					<div
						class="bg-background dark:bg-muted absolute left-0 top-0 h-8 w-full rounded-[7px]"
						in:send={{ key: "active" }}
						out:receive={{ key: "active" }}
					></div>
				{/if}
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="code" class="ring-transparent!">
			<div
				class="![&_pre]:mt-0 ![&_pre]:rounded-card w-full [&_pre]:max-h-[443px] [&_pre]:min-h-[443px] [&_pre]:overflow-auto"
			>
				{@render children?.()}
			</div>
		</Tabs.Content>
		<Tabs.Content
			value="preview"
			class="rounded-card border-muted ring-transparent! relative border-2 bg-zinc-50 dark:bg-neutral-900/50"
		>
			<div
				class={cn(
					"preview flex min-h-[443px] w-full justify-center p-12",
					{
						"items-center": align === "center",
						"items-start": align === "start",
						"items-end": align === "end",
					},
					className
				)}
			>
				{@render preview?.()}
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>
