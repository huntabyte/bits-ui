import type { HTMLButtonAttributes } from "svelte/elements";
import type { CreateTooltipProps as MeltTooltipProps } from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	OmitFloating,
	OnChangeFn,
	Transition,
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

import type {
	ArrowProps as TooltipArrowPropsWithoutHTML,
	ContentProps as TooltipContentPropsWithoutHTML,
} from "$lib/bits/floating/_types.js";

export type { TooltipArrowPropsWithoutHTML, TooltipContentPropsWithoutHTML };

export type TooltipPropsWithoutHTML = Expand<OmitFloating<MeltTooltipProps>> & {
	/**
	 * The open state of the tooltip.
	 * You can bind this to a boolean value to programmatically control the open state.
	 *
	 * @example
	 * ```svelte
	 * <script>
	 * 	import { Tooltip } from 'bits-ui';
	 * 	let open = false;
	 *
	 * 	$: if (someCondition) {
	 * 		open = true
	 * 	}
	 * </script>
	 *
	 * <Tooltip.Root bind:open>
	 * 	<!-- ... -->
	 * </Tooltip.Root>
	 * ```
	 */
	open?: boolean & {};

	/**
	 * A callback function called when the open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;
};

export type TooltipTriggerPropsWithoutHTML = DOMElement<HTMLButtonElement>;
//

export type TooltipProps = TooltipPropsWithoutHTML;

export type TooltipContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = TooltipContentPropsWithoutHTML<T, In, Out> & HTMLDivAttributes;

export type TooltipTriggerProps = TooltipTriggerPropsWithoutHTML & HTMLButtonAttributes;
export type TooltipArrowProps = TooltipArrowPropsWithoutHTML & HTMLDivAttributes;

export type TooltipTriggerEvents<T extends Element = HTMLButtonElement> = {
	blur: CustomEventHandler<FocusEvent, T>;
	focus: CustomEventHandler<FocusEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	pointerdown: CustomEventHandler<PointerEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
};

export type TooltipContentEvents<T extends Element = HTMLDivElement> = {
	pointerdown: CustomEventHandler<PointerEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
};
