/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { CreateTooltipProps } from "@melt-ui/svelte";
import type { Expand, OmitFloating, OnChangeFn, DOMElement } from "$lib/internal/index.js";
import type { ArrowProps, ContentProps } from "$lib/bits/floating/_types.js";

type Props = Expand<OmitFloating<CreateTooltipProps>> & {
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

type TriggerProps = DOMElement<HTMLButtonElement>;

export type { Props, ArrowProps, TriggerProps, ContentProps };
