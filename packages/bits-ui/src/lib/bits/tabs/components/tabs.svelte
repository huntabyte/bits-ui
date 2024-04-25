<script lang="ts">
	import type { RootProps } from "../index.js";
	import { useTabsRoot } from "../tabs.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		id = useId(),
		value = $bindable(""),
		onValueChange,
		orientation = "horizontal",
		loop = false,
		activationMode = "automatic",
		disabled = false,
		...restProps
	}: RootProps = $props();

	const state = useTabsRoot({
		id: readonlyBox(() => id),
		value: box(
			() => value,
			(v) => {
				if (value !== v) {
					value = v;
					onValueChange?.(v);
				}
			}
		),
		orientation: readonlyBox(() => orientation),
		loop: readonlyBox(() => loop),
		activationMode: readonlyBox(() => activationMode),
		disabled: readonlyBox(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
