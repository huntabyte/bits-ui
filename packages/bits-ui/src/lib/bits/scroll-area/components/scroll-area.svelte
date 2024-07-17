<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx } from "../ctx.js";
	import type { Props } from "../index.js";
	import { styleToString } from "$lib/internal/style.js";

	type $$Props = Props;

	export let type: $$Props["type"] = "hover";
	export let dir: $$Props["dir"] = "ltr";
	export let hideDelay: $$Props["hideDelay"] = 600;
	export let asChild: $$Props["asChild"] = false;
	export let ref: $$Props["el"] = undefined;

	const {
		elements: { root },
		updateOption,
		getAttrs,
	} = setCtx({
		type,
		dir,
		hideDelay,
	});

	$: builder = $root;

	$: updateOption("type", type);
	$: updateOption("dir", dir);
	$: updateOption("hideDelay", hideDelay);

	const bitsAttrs = getAttrs("root");
	const style = styleToString({
		overflow: "hidden",
	});

	$: attrs = {
		...$$restProps,
		...bitsAttrs,
		style,
	};

	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={ref} use:melt={builder} {...attrs}>
		<slot {builder} />
	</div>
{/if}
