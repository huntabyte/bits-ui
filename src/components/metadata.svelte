<script lang="ts">
	import { page } from "$app/stores";
	import { siteConfig } from "@/config";
	import SvelteSeo from "svelte-seo";

	export let title: string = siteConfig.name;

	$: title = $page.data?.title
		? `${$page.data.title} - ${siteConfig.name}`
		: siteConfig.name;
</script>

<SvelteSeo
	{title}
	description={siteConfig.description}
	canonical={siteConfig.url}
	keywords={siteConfig.keywords}
	openGraph={{
		title,
		description: siteConfig.description,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: siteConfig.name
			}
		],
		site_name: siteConfig.name,
		url: siteConfig.url,
		type: "website"
	}}
	twitter={{
		card: "summary_large_image",
		site: "@huntabyte",
		title,
		description: siteConfig.description,
		image: siteConfig.ogImage,
		creator: "@huntabyte",
		imageAlt: siteConfig.description
	}}
/>
