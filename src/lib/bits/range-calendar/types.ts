import type { HTMLDivAttributes } from "$lib/internal";
import type {
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLTableAttributes,
	HTMLTdAttributes,
	HTMLThAttributes
} from "svelte/elements";
import type * as I from "./_types.js";
import type { CustomEventHandler } from "$lib";

type Props = I.Props & Omit<HTMLDivAttributes, "placeholder">;

type PrevButtonProps = I.PrevButtonProps & HTMLButtonAttributes;

type NextButtonProps = I.NextButtonProps & HTMLButtonAttributes;

type HeadingProps = I.HeadingProps & HTMLDivAttributes;

type HeaderProps = I.HeaderProps & HTMLDivAttributes;

type GridProps = I.GridProps & HTMLTableAttributes;

type GridHeadProps = I.GridHeadProps & HTMLAttributes<HTMLTableSectionElement>;

type HeadCellProps = I.HeadCellProps & HTMLThAttributes;

type GridBodyProps = I.GridBodyProps & HTMLAttributes<HTMLTableSectionElement>;

type GridRowProps = I.GridRowProps & HTMLAttributes<HTMLTableRowElement>;

type CellProps = I.CellProps & HTMLTdAttributes;

type DayProps = I.DayProps & HTMLDivAttributes;

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
