/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { DOMElement, Expand, OmitIds } from "$lib/internal/index.js";
import type { CreateMenubarProps } from "@melt-ui/svelte";

type Props = Expand<OmitIds<CreateMenubarProps> & DOMElement>;

export type { Props };
