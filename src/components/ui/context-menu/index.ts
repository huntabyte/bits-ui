import { ContextMenu as ContextMenuPrimitive } from "@/lib";

import Item from "./context-menu-item.svelte";
import Label from "./context-menu-label.svelte";
import Content from "./context-menu-content.svelte";
import Shortcut from "./context-menu-shortcut.svelte";
import RadioItem from "./context-menu-radio-item.svelte";
import Separator from "./context-menu-separator.svelte";
import RadioGroup from "./context-menu-radio-group.svelte";
import SubContent from "./context-menu-sub-content.svelte";
import SubTrigger from "./context-menu-sub-trigger.svelte";
import CheckboxItem from "./context-menu-checkbox-item.svelte";
import type { TransitionConfig } from "svelte/transition";
import { cubicOut } from "svelte/easing";

const Sub = ContextMenuPrimitive.Sub;
const Root = ContextMenuPrimitive.Root;
const Trigger = ContextMenuPrimitive.Trigger;
const Group = ContextMenuPrimitive.Group;

export {
	Sub,
	Root,
	Item,
	Label,
	Group,
	Trigger,
	Content,
	Shortcut,
	Separator,
	RadioItem,
	SubContent,
	SubTrigger,
	RadioGroup,
	CheckboxItem,
	//
	Root as ContextMenu,
	Sub as ContextMenuSub,
	Item as ContextMenuItem,
	Label as ContextMenuLabel,
	Group as ContextMenuGroup,
	Content as ContextMenuContent,
	Trigger as ContextMenuTrigger,
	Shortcut as ContextMenuShortcut,
	RadioItem as ContextMenuRadioItem,
	Separator as ContextMenuSeparator,
	RadioGroup as ContextMenuRadioGroup,
	SubContent as ContextMenuSubContent,
	SubTrigger as ContextMenuSubTrigger,
	CheckboxItem as ContextMenuCheckboxItem
};

type TransitionParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const transition = (
	node: Element,
	params: TransitionParams = { y: 5, x: 0, start: 0.95, duration: 200 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, "");
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};
