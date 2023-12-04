<script lang="ts">
	import { page } from "$app/stores";
	import { siteConfig } from "@/config";

	export let title: string = siteConfig.name;

	$: title = $page.data?.title
		? `${$page.data.title} - ${siteConfig.name}`
		: siteConfig.name;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={siteConfig.description} />
	<meta name="keywords" content={siteConfig.keywords} />
	<meta name="author" content="huntabyte" />
</svelte:head>
