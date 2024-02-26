<script lang="ts">
	import "@/styles/markdown.postcss";
	import type { SvelteComponent } from "svelte";
	import type { PageData } from "./$types.js";
	import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/index.js";
	type Component = $$Generic<typeof SvelteComponent>;

	export let data: PageData;
	$: component = data.component as unknown as Component;
	$: doc = data.metadata;
	$: schemas = data.schemas;
</script>

<div class="markdown pb-24">
	<PageHeader>
		<PageHeaderHeading>{doc.title}</PageHeaderHeading>
		<PageHeaderDescription>{doc.description}</PageHeaderDescription>
	</PageHeader>
	<svelte:component this={component} {schemas} />
</div>
