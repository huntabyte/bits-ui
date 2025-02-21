<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import NavigationMenu from "./navigation-menu-base.svelte";

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: "Components/Navigation Menu",
		component: NavigationMenu,
	});
</script>

<Story name="Base" />
