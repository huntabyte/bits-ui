<script lang="ts">
	import "$lib/styles/markdown.css";
	import BlogPage from "$lib/components/blog-page.svelte";

	let { data } = $props();
</script>

<BlogPage {...data} />
