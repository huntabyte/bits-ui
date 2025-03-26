<script lang="ts" module>
	export type MenubarTestProps = Menubar.RootProps & {
		one?: Partial<MenubarMenuProps>;
		two?: Partial<MenubarMenuProps>;
		three?: Partial<MenubarMenuProps>;
		four?: Partial<MenubarMenuProps>;
	};
</script>

<script lang="ts">
	import { Menubar } from "bits-ui";
	import MenubarMenu, { type MenubarMenuProps } from "./menubar-menu-test.svelte";

	let { one, two, three, four, ...restProps }: MenubarTestProps = $props();
</script>

<main>
	<button data-testid="previous-button">previous button</button>
	<Menubar.Root {...restProps} data-testid="root">
		<MenubarMenu id="1" {...one} />
		<MenubarMenu id="2" {...two} />
		<MenubarMenu id="3" {...three} />
		<MenubarMenu id="4" {...four} />
	</Menubar.Root>
	<button data-testid="next-button">next button</button>
</main>
