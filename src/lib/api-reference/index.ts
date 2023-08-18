import type { APISchema } from "@/types";
import { accordion } from "./accordion";
import { alertDialog } from "./alert-dialog";
import { dialog } from "./dialog";
import { aspectRatio } from "./aspect-ratio";
import { avatar } from "./avatar";

export const bits = [
	"accordion",
	"alert-dialog",
	"aspect-ratio",
	"avatar",
	"button",
	"checkbox",
	"collapsible",
	"context-menu",
	"dialog",
	"dropdown-menu",
	"hover-card",
	"label",
	"menubar",
	"popover",
	"progress",
	"radio-group",
	"select",
	"separator",
	"slider",
	"switch",
	"tabs",
	"toggle",
	"tooltip"
] as const;

export const bitsSet = new Set(bits);

export function isBit(value: string): value is (typeof bits)[number] {
	return bitsSet.has(value as (typeof bits)[number]);
}

export type Bit = (typeof bits)[number];

export const apiSchemas: Record<Bit, APISchema[]> = {
	accordion,
	"alert-dialog": alertDialog,
	dialog,
	"aspect-ratio": aspectRatio,
	avatar
};

export function getAPISchemas(bit: Bit): APISchema[] {
	return apiSchemas[bit];
}
