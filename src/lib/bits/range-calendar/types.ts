import type { DOMEl, HTMLDivAttributes } from "$lib/internal";
import type {
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLTableAttributes,
	HTMLTdAttributes,
	HTMLThAttributes
} from "svelte/elements";
import type * as I from "./_types.js";
import type { CustomEventHandler } from "$lib";

type Props = I.Props & Omit<HTMLDivAttributes, "placeholder"> & DOMEl;

type PrevButtonProps = I.PrevButtonProps & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;

type NextButtonProps = I.NextButtonProps & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;

type HeadingProps = I.HeadingProps & HTMLDivAttributes & DOMEl;

type HeaderProps = I.HeaderProps & HTMLDivAttributes & DOMEl<Element>;

type GridProps = I.GridProps & HTMLTableAttributes & DOMEl<HTMLTableElement>;

type GridHeadProps = I.GridHeadProps &
	HTMLAttributes<HTMLTableSectionElement> &
	DOMEl<HTMLTableSectionElement>;

type HeadCellProps = I.HeadCellProps & HTMLThAttributes & DOMEl<HTMLTableCellElement>;

type GridBodyProps = I.GridBodyProps &
	HTMLAttributes<HTMLTableSectionElement> &
	DOMEl<HTMLTableSectionElement>;

type GridRowProps = I.GridRowProps &
	HTMLAttributes<HTMLTableRowElement> &
	DOMEl<HTMLTableRowElement>;

type CellProps = I.CellProps & HTMLTdAttributes & DOMEl<HTMLTableCellElement>;

type DayProps = I.DayProps & HTMLDivAttributes & DOMEl;

/**
 * Events
 */

type ButtonEvents = {
	click: CustomEventHandler<MouseEvent, HTMLButtonElement>;
};

type PrevButtonEvents = ButtonEvents;

type NextButtonEvents = ButtonEvents;

type DayEvents = {
	click: CustomEventHandler<MouseEvent, HTMLDivElement>;
	focusin: CustomEventHandler<FocusEvent, HTMLDivElement>;
	mouseenter: CustomEventHandler<MouseEvent, HTMLDivElement>;
};

type Events = {
	keydown: CustomEventHandler<KeyboardEvent, HTMLDivElement>;
};

export type {
	Props,
	PrevButtonProps,
	NextButtonProps,
	HeadingProps,
	GridProps,
	CellProps,
	GridRowProps,
	GridBodyProps,
	HeadCellProps,
	GridHeadProps,
	HeaderProps,
	DayProps,
	//
	Events,
	PrevButtonEvents,
	NextButtonEvents,
	DayEvents
};
