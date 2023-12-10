import type {
	EventCallback,
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	PrimitiveInputAttributes
} from "$lib/internal";

export interface CheckboxProps extends Omit<PrimitiveButtonAttributes, "disabled"> {
	disabled?: boolean;
	defaultChecked?: boolean | "indeterminate";
	checked?: boolean | "indeterminate";
	onCheckedChange?: OnChangeFn<boolean | "indeterminate">;
	required?: boolean;
	onclick?: EventCallback<MouseEvent>;
	onkeydown?: EventCallback<KeyboardEvent>;
}

export interface CheckboxPropsWithoutHTML
	extends Omit<CheckboxProps, Exclude<keyof PrimitiveButtonAttributes, "disabled">> {}

export interface CheckboxInputProps extends PrimitiveInputAttributes {}

export interface CheckboxInputPropsWithoutHTML
	extends Omit<CheckboxInputProps, keyof PrimitiveInputAttributes> {}

export interface CheckboxIndicatorProps extends PrimitiveDivAttributes {}

export interface CheckboxIndicatorPropsWithoutHTML
	extends Omit<CheckboxIndicatorProps, keyof PrimitiveDivAttributes> {}
