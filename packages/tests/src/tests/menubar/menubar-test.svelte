<script lang="ts">
	import { Menubar } from "bits-ui";
	import MenubarMenu from "./menubar-menu-test.svelte";

	let restProps: Menubar.RootProps = $props();
</script>

<main>
	<button data-testid="previous-button">previous button</button>
	<Menubar.Root {...restProps} data-testid="root">
		<MenubarMenu id="1" />
		<MenubarMenu id="2" />
		<MenubarMenu id="3" />
		<MenubarMenu id="4" />
	</Menubar.Root>
	<button data-testid="next-button">next button</button>
</main>
