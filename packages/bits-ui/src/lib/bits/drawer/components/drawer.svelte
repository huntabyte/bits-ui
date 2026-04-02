<script lang="ts" generics="Payload = never">
	import { boxWith } from "svelte-toolbelt";
	import { DrawerRootState } from "../drawer.svelte.js";
	import type { DrawerRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		open = $bindable(false),
		snapPoint = $bindable(),
		triggerId = $bindable<string | null>(null),
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		onSnapPointChange = noop,
		swipeDirection = "down",
		snapPoints = undefined,
		snapToSequentialPoints = false,
		tether = undefined,
		children,
	}: DrawerRootProps<Payload> = $props();

	const rootId = createId(uid);

	const rootState = DrawerRootState.create({
		id: boxWith(() => rootId),
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		snapPoint: boxWith(
			() => snapPoint,
			(v) => {
				snapPoint = v;
				onSnapPointChange(v);
			}
		),
		triggerId: boxWith(
			() => triggerId,
			(v) => {
				triggerId = v;
			}
		),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
		onSnapPointChange: boxWith(() => onSnapPointChange),
		swipeDirection: boxWith(() => swipeDirection),
		snapPoints: boxWith(() => snapPoints),
		snapToSequentialPoints: boxWith(() => snapToSequentialPoints),
		tether: boxWith(() => tether),
	});
</script>

{@render children?.({
	payload: (rootState.activeTriggerId !== null
		? rootState.activePayload
		: rootState.tetherPayload) as [Payload] extends [never] ? null : Payload | null,
	triggerId: rootState.activeTriggerId,
})}
