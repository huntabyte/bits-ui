<script lang="ts">
	import Info from "phosphor-svelte/lib/Info";
	import RocketLaunch from "phosphor-svelte/lib/RocketLaunch";
	import Warning from "phosphor-svelte/lib/Warning";
	import WarningOctagon from "phosphor-svelte/lib/WarningOctagon";
	import type { PrimitiveElementAttributes, WithChildren } from "bits-ui";
	import * as Alert from "$lib/components/ui/alert/index.js";
	import { cn } from "$lib/utils/styles.js";

	let {
		children,
		type = "note",
		class: className,
		title = type
			.split("")
			.map((c, i) => (i === 0 ? c.toUpperCase() : c))
			.join(""),
	}: WithChildren<PrimitiveElementAttributes> & {
		type?: "note" | "warning" | "danger" | "tip";
	} = $props();

	const iconMap = {
		note: Info,
		tip: RocketLaunch,
		warning: Warning,
		danger: WarningOctagon,
	} as const;
</script>

<Alert.Root class={cn("mt-6", className)} variant={type}>
	{@const Icon = iconMap[type]}
	<Icon class="size-6" weight="bold" />

	{#if title}
		<Alert.Title class="mb-2 text-lg">
			{title}
		</Alert.Title>
	{/if}

	<Alert.Description class="leading-relaxed">
		{@render children?.()}
	</Alert.Description>
</Alert.Root>
