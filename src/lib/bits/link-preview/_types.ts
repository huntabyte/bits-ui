/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { Expand, OnChangeFn, OmitFloating, DOMElement } from "$lib/internal/index.js";
import type { ArrowProps, ContentProps } from "$lib/bits/floating/_types.js";
import type { CreateLinkPreviewProps } from "@melt-ui/svelte";

type Props = Expand<
	OmitFloating<CreateLinkPreviewProps> & {
		/**
		 * The open state of the link preview.
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

type TriggerProps = DOMElement<HTMLAnchorElement>;

export type { Props, ArrowProps, ContentProps, TriggerProps };
