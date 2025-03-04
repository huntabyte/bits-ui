<script lang="ts">
	import "$lib/styles/markdown.css";
	import DocPage from "$lib/components/doc-page.svelte";

	let { data } = $props();
</script>

<DocPage {...data} />
