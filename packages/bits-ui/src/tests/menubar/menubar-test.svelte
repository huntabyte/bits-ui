<script lang="ts">
	import MenubarMenu from "./menubar-menu-test.svelte";
	import { Menubar } from "$lib/index.js";

	type $$Props = Menubar.RootProps;
</script>

<main>
	<Menubar.Root {...$$restProps} data-testid="root">
		<MenubarMenu id="1" />
		<MenubarMenu id="2" />
		<MenubarMenu id="3" />
		<MenubarMenu id="4" />
	</Menubar.Root>
</main>
