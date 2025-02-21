<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import AlertDialog from "./alert-dialog.svelte";

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: "Components/Alert Dialog",
		component: AlertDialog,
	});
</script>

<Story name="Single" />
