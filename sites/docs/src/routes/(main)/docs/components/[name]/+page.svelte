<script lang="ts">
	import "$lib/styles/markdown.postcss";
	import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "$lib/components/index.js";

	let { data } = $props();
	const Component = $derived(data.component);
</script>

<div class="markdown pb-24">
	<PageHeader>
		<PageHeaderHeading>{data.metadata.title}</PageHeaderHeading>
		<PageHeaderDescription>{data.metadata.description}</PageHeaderDescription>
	</PageHeader>
	<Component schemas={data.schemas} />
</div>
