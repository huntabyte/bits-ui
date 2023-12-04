/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type {
	Transition,
	OmitOpen,
	OmitForceVisible,
	Expand,
	OnChangeFn,
	AsChild,
	TransitionProps
} from "$lib/internal/index.js";
import type { CreateCollapsibleProps } from "@melt-ui/svelte";

type Props = Expand<
	OmitOpen<OmitForceVisible<CreateCollapsibleProps>> & {
		/**
		 * The open state of the collapsible.
		 * You can bind this to a boolean value to programmatically control the open state.
		 *
		 * @defaultValue false
		 */
		open?: boolean;

		/**
		 * A callback function called when the open state changes.
		 */
		onOpenChange?: OnChangeFn<boolean>;
	} & AsChild
>;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & AsChild>;

type TriggerProps = AsChild;

export type { Props, ContentProps, TriggerProps };
