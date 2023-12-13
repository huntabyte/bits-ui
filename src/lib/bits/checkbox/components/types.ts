import type {
	EventCallback,
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	PrimitiveInputAttributes
} from "$lib/internal";
import type { DefaultOrAsChildProps, Without } from "$lib/internal/new/types";

type BaseCollapsibleProps = {
	disabled?: boolean;
	defaultChecked?: boolean | "indeterminate";
	checked?: boolean | "indeterminate";
	onCheckedChange?: OnChangeFn<boolean | "indeterminate">;
	required?: boolean;
	onclick?: EventCallback<MouseEvent>;
	onkeydown?: EventCallback<KeyboardEvent>;
} & Omit<PrimitiveButtonAttributes, "disabled">;

export type CheckboxProps = DefaultOrAsChildProps<BaseCollapsibleProps>;

export type CheckboxWithoutHTML = Without<
	BaseCollapsibleProps,
	Omit<PrimitiveButtonAttributes, "disabled">
>;

export type CheckboxInputProps = DefaultOrAsChildProps<PrimitiveInputAttributes>;

export type CheckboxInputWithoutHTML = Without<PrimitiveInputAttributes, PrimitiveInputAttributes>;

export type CheckboxIndicatorProps = DefaultOrAsChildProps<PrimitiveDivAttributes>;

export type CheckboxIndicatorWithoutHTML = Without<PrimitiveDivAttributes, PrimitiveDivAttributes>;
