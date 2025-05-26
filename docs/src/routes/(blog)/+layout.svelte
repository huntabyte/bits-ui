<script lang="ts">
	import Metadata from "$lib/components/metadata.svelte";
	import SiteHeader from "$lib/components/site-header.svelte";

	let { children } = $props();
</script>

<Metadata />
<SiteHeader />
<div class="min-h-[calc(100vh-64px)]">
	<div class="flex-1 items-start">
		{@render children()}
	</div>
</div>
