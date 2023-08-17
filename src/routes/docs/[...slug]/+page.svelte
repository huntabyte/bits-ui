<script lang="ts">
	import "@/styles/markdown.postcss";
	import { page } from "$app/stores";
	import type { SvelteComponent } from "svelte";
	import type { PageData } from "./$types";
	import {
		PageHeader,
		PageHeaderDescription,
		PageHeaderHeading,
		PageHeaderTagline
	} from "@/components";
	type Component = $$Generic<typeof SvelteComponent>;

	export let data: PageData;
	let tagline: string;
	$: component = data.component as unknown as Component;
	$: doc = data.metadata;
	$: console.log($page.url.pathname);
	$: if ($page.url.pathname.split("/")[2] === "components") {
		tagline = "Components";
	} else {
		tagline = "Overview";
	}
</script>

<div class="markdown pb-24">
	<PageHeader>
		<PageHeaderTagline>{tagline}</PageHeaderTagline>
		<PageHeaderHeading>{doc.title}</PageHeaderHeading>
		<PageHeaderDescription>{doc.description}</PageHeaderDescription>
	</PageHeader>
	<svelte:component this={component} />
</div>
