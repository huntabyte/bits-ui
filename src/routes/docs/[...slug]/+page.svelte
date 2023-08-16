<script lang="ts">
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
	$: if ($page.url.pathname.includes("components")) {
		tagline = "Components";
	} else {
		tagline = "Getting Started";
	}
</script>

<PageHeader>
	<PageHeaderTagline>{tagline}</PageHeaderTagline>
	<PageHeaderHeading>{doc.title}</PageHeaderHeading>
	<PageHeaderDescription>{doc.description}</PageHeaderDescription>
</PageHeader>
