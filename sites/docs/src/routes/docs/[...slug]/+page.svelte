<script lang="ts">
	import "$lib/styles/markdown.postcss";
	import type { ComponentType } from "svelte";
	import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "$lib/components/index.js";

	let { data } = $props();
	const component = $derived(data.component) as unknown as ComponentType;
</script>

<div class="markdown pb-24">
	<PageHeader>
		<PageHeaderHeading>{data.metadata.title}</PageHeaderHeading>
		<PageHeaderDescription>{data.metadata.description}</PageHeaderDescription>
	</PageHeader>
	<svelte:component this={component} />
</div>
