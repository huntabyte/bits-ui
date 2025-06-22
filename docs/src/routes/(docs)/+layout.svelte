<script lang="ts">
	import { dev } from "$app/environment";
	import Metadata from "$lib/components/metadata.svelte";
	import SiteHeader from "$lib/components/site-header.svelte";
	import TailwindIndicator from "$lib/components/tailwind-indicator.svelte";
	import SidebarNav from "$lib/components/navigation/sidebar-nav.svelte";
	import { navigation } from "$lib/config/index.js";
	import "$lib/styles/app.css";
	import { onMount } from "svelte";
	import { page } from "$app/state";

	onMount(async () => {
		if (dev || page.url.searchParams.get("test")) {
			const eruda = (await import("eruda")).default;
			eruda.init();
		}
	});

	let { children } = $props();
</script>

<Metadata />
<SiteHeader />
<div class="min-h-[calc(100vh-64px)]">
	<div
		class="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10"
	>
		<SidebarNav items={navigation.sidebar} />
		{@render children()}
	</div>
</div>

{#if dev}
	<TailwindIndicator />
{/if}
