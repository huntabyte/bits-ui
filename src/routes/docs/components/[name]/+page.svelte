<script lang="ts">
	import "@/styles/markdown.postcss";
	import { page } from "$app/stores";
	import type { SvelteComponent } from "svelte";
	import type { PageData } from "./$types";
	import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components";
	type Component = $$Generic<typeof SvelteComponent>;

	export let data: PageData;
	let tagline: string;
	$: component = data.component as unknown as Component;
	$: doc = data.metadata;
	$: if ($page.url.pathname.split("/")[2] === "components") {
		tagline = "Components";
	} else {
		tagline = "Overview";
	}
	$: schemas = data.schemas;
</script>

<div class="markdown pb-24">
	<PageHeader>
		<PageHeaderHeading>{doc.title}</PageHeaderHeading>
		<PageHeaderDescription>{doc.description}</PageHeaderDescription>
	</PageHeader>
	<svelte:component this={component} {schemas} />
</div>
