<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { isDrawerPopupInteractOutsideEvent } from "../drawer-dismissible-interact-outside.js";
	import { DrawerPopupState } from "../drawer.svelte.js";
	import type { DrawerPopupProps } from "../types.js";
	import DismissibleLayer from "$lib/bits/utilities/dismissible-layer/dismissible-layer.svelte";
	import EscapeLayer from "$lib/bits/utilities/escape-layer/escape-layer.svelte";
	import FocusScope from "$lib/bits/utilities/focus-scope/focus-scope.svelte";
	import TextSelectionLayer from "$lib/bits/utilities/text-selection-layer/text-selection-layer.svelte";
	import ScrollLock from "$lib/bits/utilities/scroll-lock/scroll-lock.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		forceMount = false,
		onCloseAutoFocus = noop,
		onOpenAutoFocus = noop,
		onEscapeKeydown = noop,
		onInteractOutside = noop,
		trapFocus = true,
		preventScroll = true,
		restoreScrollDelay = null,
		...restProps
	}: DrawerPopupProps = $props();

	const popupState = DrawerPopupState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		trapFocus: boxWith(() => trapFocus),
		preventScroll: boxWith(() => preventScroll),
	});

	const mergedProps = $derived(mergeProps(restProps, popupState.props));
	const focusEnabled = $derived(popupState.root.opts.open.current && trapFocus);
	const dismissibleEnabled = $derived(popupState.root.opts.open.current);
	const shouldPreventScroll = $derived(popupState.root.opts.open.current && preventScroll);

	function handleOpenAutoFocus(event: Event) {
		onOpenAutoFocus(event);
		if (event.defaultPrevented) return;
		event.preventDefault();
		popupState.opts.ref.current?.focus();
	}
</script>

{#if popupState.shouldRender || forceMount}
	<FocusScope
		ref={popupState.opts.ref}
		loop
		trapFocus={focusEnabled}
		enabled={focusEnabled}
		onOpenAutoFocus={handleOpenAutoFocus}
		{onCloseAutoFocus}
	>
		{#snippet focusScope({ props: focusScopeProps })}
			<EscapeLayer
				{...mergedProps}
				enabled={popupState.root.opts.open.current}
				ref={popupState.opts.ref}
				onEscapeKeydown={(e) => {
					onEscapeKeydown(e);
					if (e.defaultPrevented) return;
					popupState.root.handleClose();
				}}
			>
				<DismissibleLayer
					{...mergedProps}
					ref={popupState.opts.ref}
					enabled={dismissibleEnabled}
					isValidEvent={isDrawerPopupInteractOutsideEvent}
					onInteractOutside={(e) => {
						const target = e.target instanceof Element ? e.target : null;
						const viewportAttr = popupState.root.getBitsAttr("viewport");
						const backdropAttr = popupState.root.getBitsAttr("backdrop");
						const targetIsViewport = Boolean(target?.closest(`[${viewportAttr}]`));
						const targetIsBackdrop = Boolean(target?.closest(`[${backdropAttr}]`));
						onInteractOutside(e);
						if (e.defaultPrevented) return;

						// mouse/pen: dismissible fires on pointerdown; closing here would unmount before
						// swipe-from-outside can run. defer close until pointerup if still outside popup.
						const deferMouseClose =
							e.type === "pointerdown" &&
							"pointerType" in e &&
							e.pointerType !== "touch" &&
							(targetIsViewport || targetIsBackdrop);

						if (deferMouseClose) {
							e.preventDefault();
							const pointerId = e.pointerId;
							const doc = popupState.opts.ref.current?.ownerDocument ?? document;

							const cleanup = () => {
								doc.removeEventListener("pointerup", onPtrEnd, true);
								doc.removeEventListener("pointercancel", onPtrEnd, true);
							};

							const onPtrEnd = (up: PointerEvent) => {
								if (up.pointerId !== pointerId) return;
								cleanup();

								if (!popupState.root.opts.open.current) return;

								const popupEl = popupState.opts.ref.current;
								if (!popupEl) return;

								const mx = Math.abs(
									Number.parseFloat(
										popupEl.style.getPropertyValue("--drawer-swipe-movement-x")
									) || 0
								);
								const my = Math.abs(
									Number.parseFloat(
										popupEl.style.getPropertyValue("--drawer-swipe-movement-y")
									) || 0
								);

								// only skip dismiss when the drawer was actually moved (viewport swipe),
								// not when the pointer wandered outside without engaging the sheet.
								const SWIPE_OFFSET_EPS_PX = 1.5;
								if (mx > SWIPE_OFFSET_EPS_PX || my > SWIPE_OFFSET_EPS_PX) return;

								const atPoint = doc.elementFromPoint(up.clientX, up.clientY);
								if (atPoint && popupEl.contains(atPoint)) return;

								popupState.root.handleClose();
							};

							doc.addEventListener("pointerup", onPtrEnd, true);
							doc.addEventListener("pointercancel", onPtrEnd, true);
							return;
						}

						if (
							e.type !== "click" &&
							e.pointerType !== "touch" &&
							(targetIsViewport || targetIsBackdrop)
						) {
							e.preventDefault();
						}
						popupState.root.handleClose();
					}}
				>
					<TextSelectionLayer
						{...mergedProps}
						ref={popupState.opts.ref}
						enabled={() =>
							popupState.root.opts.open.current &&
							!popupState.root.viewportSwipeDelegate?.isSwipeGestureActive()}
					>
						{#if child}
							{#if shouldPreventScroll}
								<ScrollLock {preventScroll} {restoreScrollDelay} />
							{/if}
							{@render child({
								props: mergeProps(mergedProps, focusScopeProps),
								...popupState.snippetProps,
							})}
						{:else}
							{#if shouldPreventScroll}
								<ScrollLock {preventScroll} {restoreScrollDelay} />
							{/if}
							<div {...mergeProps(mergedProps, focusScopeProps)}>
								{@render children?.()}
							</div>
						{/if}
					</TextSelectionLayer>
				</DismissibleLayer>
			</EscapeLayer>
		{/snippet}
	</FocusScope>
{/if}
