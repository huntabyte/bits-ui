import { Menubar as MenubarPrimitive } from "@/lib";

import Root from "./menubar.svelte";
import CheckboxItem from "./menubar-checkbox-item.svelte";
import Content from "./menubar-content.svelte";
import Item from "./menubar-item.svelte";
import Label from "./menubar-label.svelte";
import RadioItem from "./menubar-radio-item.svelte";
import Separator from "./menubar-separator.svelte";
import Shortcut from "./menubar-shortcut.svelte";
import SubContent from "./menubar-sub-content.svelte";
import SubTrigger from "./menubar-sub-trigger.svelte";
import Trigger from "./menubar-trigger.svelte";
import type { TransitionConfig } from "svelte/transition";
import { cubicOut } from "svelte/easing";

const Menu = MenubarPrimitive.Menu;
const Group = MenubarPrimitive.Group;
const Sub = MenubarPrimitive.Sub;
const RadioGroup = MenubarPrimitive.RadioGroup;

export {
	Root,
	CheckboxItem,
	Content,
	Item,
	Label,
	RadioItem,
	Separator,
	Shortcut,
	SubContent,
	SubTrigger,
	Trigger,
	Menu,
	Group,
	Sub,
	RadioGroup,
	//
	Root as Menubar,
	CheckboxItem as MenubarCheckboxItem,
	Content as MenubarContent,
	Item as MenubarItem,
	Label as MenubarLabel,
	RadioItem as MenubarRadioItem,
	Separator as MenubarSeparator,
	Shortcut as MenubarShortcut,
	SubContent as MenubarSubContent,
	SubTrigger as MenubarSubTrigger,
	Trigger as MenubarTrigger,
	Menu as MenubarMenu,
	Group as MenubarGroup,
	Sub as MenubarSub,
	RadioGroup as MenubarRadioGroup
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
