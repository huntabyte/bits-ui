<script lang="ts">
	import "$lib/styles/markdown.postcss";
	import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "$lib/components/index.js";

	let { data } = $props();
</script>

<div class="markdown pb-24">
	<PageHeader>
		<PageHeaderHeading>{data.metadata.title}</PageHeaderHeading>
		<PageHeaderDescription>{data.metadata.description}</PageHeaderDescription>
	</PageHeader>
	<svelte:component this={data.component} schemas={data.schemas} />
</div>
