import type { HTMLDivAttributes, OnChangeFn } from "$lib/internal";
import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";

export type CheckboxRootProps = {
	disabled?: boolean;
	asChild?: boolean;
	defaultChecked?: boolean | "indeterminate";
	checked?: boolean | "indeterminate";
	onCheckedChange?: OnChangeFn<boolean | "indeterminate">;
	required?: boolean;
} & HTMLButtonAttributes;

export type CheckboxRootWithoutHTML = Omit<
	CheckboxRootProps,
	Exclude<keyof HTMLButtonAttributes, "disabled">
>;

export type CheckboxInputProps = {
	asChild?: boolean;
} & HTMLInputAttributes;

export type CheckboxInputWithoutHTML = Omit<CheckboxInputProps, keyof HTMLInputAttributes>;

export type CheckboxIndicatorProps = {
	asChild?: boolean;
} & HTMLDivAttributes;

export type CheckboxIndicatorWithoutHTML = Omit<CheckboxIndicatorProps, keyof HTMLDivAttributes>;
