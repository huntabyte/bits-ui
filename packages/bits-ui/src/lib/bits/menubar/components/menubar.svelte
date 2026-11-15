<script lang="ts">
	import { resolveDirProp } from "#lib/bits/utilities/config/prop-resolvers.js";
	import { getBitsConfig } from "#lib/bits/utilities/config/bits-config.js";
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { MenubarRootProps } from "../types.js";
	import { MenubarRootState } from "../menubar.svelte.js";
	import { createId } from "#lib/internal/create-id.js";
	import { noop } from "#lib/internal/noop.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		value = $bindable(""),
		dir,
		loop = true,
		onValueChange = noop,
		...restProps
	}: MenubarRootProps = $props();

	const rootState = MenubarRootState.create({
		id: boxWith(() => id),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				onValueChange?.(v);
			}
		),
		dir: resolveDirProp(() => dir),
		loop: boxWith(() => loop),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	// only set `dir` when the prop or a BitsConfig provides one, so the DOM direction is otherwise inherited
	const config = getBitsConfig();
	const mergedProps = $derived(
		mergeProps(restProps, rootState.props, { dir: dir ?? config.dir.current })
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
