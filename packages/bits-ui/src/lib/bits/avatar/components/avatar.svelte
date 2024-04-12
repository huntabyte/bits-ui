<script lang="ts">
	import { setCtx } from "../ctx.js";
	import type { RootProps } from "../index.js";

	let {
		delayMs,
		loadingStatus = $bindable(),
		onLoadingStatusChange,
		asChild,
		el = $bindable(),
	}: RootProps = $props();

	const {
		states: { loadingStatus: localLoadingStatus },
		updateOption,
		getAttrs,
	} = setCtx({
		src: "",
		delayMs,
		onLoadingStatusChange: ({ next }) => {
			loadingStatus = next;
			onLoadingStatusChange?.(next);
			return next;
		},
	});
	const attrs = getAttrs("root");

	$: loadingStatus !== undefined && localLoadingStatus.set(loadingStatus);
	$: updateOption("delayMs", delayMs);
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<div bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</div>
{/if}
