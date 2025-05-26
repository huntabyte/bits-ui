<script lang="ts">
	import type { PostMetadata } from "$lib/utils/docs.js";
	import PageHeaderDescription from "./page-header/page-header-description.svelte";
	import PageHeaderHeading from "./page-header/page-header-heading.svelte";
	import PageHeader from "./page-header/page-header.svelte";

	let { metadata }: { metadata: PostMetadata } = $props();
</script>

<PageHeader>
	<PageHeaderHeading>
		{metadata.title}
		<span aria-hidden="true" class="hidden"> Blog </span>
	</PageHeaderHeading>
	<PageHeaderDescription class="mb-11">{metadata.description}</PageHeaderDescription>
</PageHeader>
