<script lang="ts">
	import { boxWith } from "svelte-toolbelt";
	import type { MenubarMenuProps } from "../types.js";
	import { MenubarMenuState } from "../menubar.svelte.js";
	import Menu from "$lib/bits/menu/components/menu.svelte";
	import { noop } from "$lib/internal/noop.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let { value = createId(uid), onOpenChange = noop, ...restProps }: MenubarMenuProps = $props();

	const menuState = MenubarMenuState.create({
		value: boxWith(() => value),
		onOpenChange: boxWith(() => onOpenChange),
	});
</script>

<Menu
	open={menuState.open}
	onOpenChange={(open) => {
		if (!open) menuState.root.onMenuClose();
	}}
	dir={menuState.root.opts.dir.current}
	_internal_variant="menubar"
	{...restProps}
/>
