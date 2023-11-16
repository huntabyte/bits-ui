/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type {
	OmitOpen,
	Expand,
	Transition,
	OnChangeFn,
	AsChild,
	TransitionProps,
	OmitIds
} from "$lib/internal/index.js";
import type { CreatePopoverProps } from "@melt-ui/svelte";

type Props = Expand<
	OmitOpen<OmitIds<Omit<CreatePopoverProps, "arrowSize">>> & {
		/**
		 * The open state of the popover.
		 * You can bind this to a boolean value to programmatically control the open state.
		 *
		 * @defaultValue false
		 */
		open?: boolean;

		/**
		 * A callback function called when the open state changes.
		 */
		onOpenChange?: OnChangeFn<boolean>;
	}
>;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & AsChild>;

type TriggerProps = AsChild;
type CloseProps = AsChild;

type ArrowProps = Expand<
	{
		/**
		 * The size of the arrow in pixels.
		 */
		size?: number;
	} & AsChild
>;

export type { Props, CloseProps, ArrowProps, ContentProps, TriggerProps };
