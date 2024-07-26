<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { MenuProps } from "../index.js";
	import { useMenubarMenu } from "../menubar.svelte.js";
	import Menu from "$lib/bits/menu/components/menu.svelte";
	import { useId } from "$lib/internal/useId.js";

	let { value = useId(), ...restProps }: MenuProps = $props();

	const menuState = useMenubarMenu({
		value: box.with(() => value),
	});
</script>

<Menu
	open={menuState.open}
	onOpenChange={(open) => {
		if (!open) menuState.root.onMenuClose();
	}}
	dir={menuState.root.dir.current}
	{...restProps}
/>
