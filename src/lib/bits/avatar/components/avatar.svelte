<script lang="ts">
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let delayMs: $$Props["delayMs"] = undefined;
	export let loadingStatus: $$Props["loadingStatus"] = undefined;
	export let onLoadingStatusChange: $$Props["onLoadingStatusChange"] =
		undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		states: { loadingStatus: localLoadingStatus },
		updateOption
	} = setCtx({
		src: "",
		delayMs,
		onLoadingStatusChange: ({ next }) => {
			loadingStatus = next;
			onLoadingStatusChange?.(next);
			return next;
		}
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
