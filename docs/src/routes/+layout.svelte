<script lang="ts">
	import { Toaster } from "svelte-sonner";
	import { ModeWatcher } from "mode-watcher";
	import Metadata from "$lib/components/metadata.svelte";
	import "$lib/styles/app.css";
	import { useSiteConfig } from "$lib/utils/use-site-config.svelte.js";
	import { siteConfig } from "$lib/config/site.js";

	let { children } = $props();

	useSiteConfig(() => siteConfig);
</script>

<ModeWatcher />
<Metadata />
<Toaster position="top-right" />

{@render children()}
