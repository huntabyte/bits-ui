export { default as Provider } from "./components/drawer-provider.svelte";
export { default as IndentBackground } from "./components/drawer-indent-background.svelte";
export { default as Indent } from "./components/drawer-indent.svelte";
export { default as Root } from "./components/drawer.svelte";
export { default as Trigger } from "./components/drawer-trigger.svelte";
export { default as SwipeArea } from "./components/drawer-swipe-area.svelte";
export { default as Portal } from "$lib/bits/utilities/portal/portal.svelte";
export { default as Backdrop } from "./components/drawer-backdrop.svelte";
export { default as Viewport } from "./components/drawer-viewport.svelte";
export { default as Popup } from "./components/drawer-popup.svelte";
export { default as Content } from "./components/drawer-content.svelte";
export { default as Title } from "./components/drawer-title.svelte";
export { default as Description } from "./components/drawer-description.svelte";
export { default as Close } from "./components/drawer-close.svelte";
export { createTether, DrawerTether as Tether } from "./drawer.svelte.js";

export type {
	DrawerProviderProps as ProviderProps,
	DrawerIndentBackgroundProps as IndentBackgroundProps,
	DrawerIndentProps as IndentProps,
	DrawerRootProps as RootProps,
	DrawerTriggerProps as TriggerProps,
	DrawerSwipeAreaProps as SwipeAreaProps,
	DrawerPortalProps as PortalProps,
	DrawerBackdropProps as BackdropProps,
	DrawerViewportProps as ViewportProps,
	DrawerPopupProps as PopupProps,
	DrawerContentProps as ContentProps,
	DrawerTitleProps as TitleProps,
	DrawerDescriptionProps as DescriptionProps,
	DrawerCloseProps as CloseProps,
	DrawerSnapPoint,
	DrawerSwipeDirection,
} from "./types.js";
