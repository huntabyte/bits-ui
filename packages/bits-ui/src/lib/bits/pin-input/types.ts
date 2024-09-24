import type { Snippet } from "svelte";
import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type { PrimitiveDivAttributes, PrimitiveInputAttributes } from "$lib/shared/attributes.js";

export type PinInputRootSnippetProps = {
	cells: PinInputCell[];
	isFocused: boolean;
	isHovering: boolean;
};

export type PinInputRootPropsWithoutHTML = Omit<
	WithChild<
		{
			/**
			 * The value of the input.
			 *
			 * @bindable
			 */
			value?: string;

			/**
			 * A callback function that is called when the value of the input changes.
			 */
			onValueChange?: OnChangeFn<string>;

			/**
			 * The max length of the input.
			 */
			maxlength: number;

			/**
			 * Customize the alignment of the text within in the input.
			 *
			 * @default "left"
			 */
			textalign?: "left" | "center" | "right";

			/**
			 * A callback function that is called when the input is completely filled.
			 *
			 */
			// eslint-disable-next-line ts/no-explicit-any
			onComplete?: (...args: any[]) => void;

			/**
			 * How to handle the input when a password manager is detected.
			 */
			pushPasswordManagerStrategy?: "increase-width" | "none";

			/**
			 * Whether the input is disabled
			 */
			disabled?: boolean;

			/**
			 * The children snippet used to render the individual cells.
			 */
			children: Snippet<[PinInputRootSnippetProps]>;
		},
		PinInputRootSnippetProps
	>,
	"child"
>;

export type PinInputRootProps = PinInputRootPropsWithoutHTML &
	Without<PrimitiveInputAttributes, PinInputRootPropsWithoutHTML>;

export type PinInputCellPropsWithoutHTML = WithChild<{
	/**
	 * This specific cell, which is provided by the `cells` snippet prop from
	 * the `PinInput.Root` component.
	 */
	cell: PinInputCell;
}>;

export type PinInputCellProps = PinInputCellPropsWithoutHTML &
	Without<PrimitiveDivAttributes, PinInputCellPropsWithoutHTML>;

export type PinInputCell = {
	/**
	 * The character displayed in the cell.
	 */
	char: string | null | undefined;

	/**
	 * Whether the cell is active.
	 */
	isActive: boolean;

	/**
	 * Whether the cell has a fake caret.
	 */
	hasFakeCaret: boolean;
};
