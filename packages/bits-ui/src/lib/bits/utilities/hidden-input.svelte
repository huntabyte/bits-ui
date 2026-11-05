<script lang="ts">
	import { mergeProps, srOnlyStyles } from "svelte-toolbelt";
	import type { HTMLInputAttributes } from "svelte/elements";

	let { value = $bindable(), ...restProps }: HTMLInputAttributes = $props();

	const mergedProps = $derived(
		mergeProps(restProps, {
			"aria-hidden": "true",
			tabindex: -1,
			style: {
				...srOnlyStyles,
				position: "absolute",
				top: "0",
				left: "0",
			},
		})
	);
</script>

<!--
	The component state is the source of truth. Mirroring it into `defaultValue`/`defaultChecked`
	makes a native form reset restore the current state instead of clearing the input, and avoids
	`bind:value`, whose reset handler would write a stale value back into `value` (#1942).
-->
{#if mergedProps.type === "checkbox"}
	<input {...mergedProps} {value} defaultChecked={mergedProps.checked} />
{:else}
	<input
		{...mergedProps}
		{value}
		defaultValue={value ?? ""}
		oninput={(e) => (value = e.currentTarget.value)}
	/>
{/if}
