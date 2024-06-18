import type {
	OnChangeFn,
	PrimitiveInputAttributes,
	WithAsChild,
	Without,
} from "$lib/internal/types.js";
import type { Snippet } from "svelte";

export type PinInputRootPropsWithoutHTML = {
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
	 * A reference to the container element.
	 */
	containerRef?: HTMLElement | null;

	/**
	 * A reference to the input element.
	 */
	inputRef?: HTMLInputElement | null;

	/**
	 * Id of the input element.
	 */
	inputId?: string;

	/**
	 * Id of the container element.
	 */
	containerId?: string;

	/**
	 * The children snippet used to render the individual cells.
	 */
	children: Snippet<[PinInputRootSnippetProps]>;
};

export type PinInputRootProps = PinInputRootPropsWithoutHTML &
	Without<Omit<PrimitiveInputAttributes, "id">, PinInputRootPropsWithoutHTML>;

export type PinInputCellProps = {
	/**
	 * Whether the cell is active.
	 */
	isActive: boolean;

	/**
	 * The character displayed in the cell.
	 */
	char: string;

	/**
	 * Whether the cell has a fake caret.
	 */
	hasFakeCaret: boolean;
};

export type PinInputCell = {
	char: string | null | undefined;
	isActive: boolean;
	hasFakeCaret: boolean;
};

export type PinInputRootSnippetProps = {
	cells: PinInputCell[];
	isFocused: boolean;
	isHovering: boolean;
};
