/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { DOMElement, Expand } from "$lib/internal/index.js";
import type { CreateSeparatorProps } from "@melt-ui/svelte";

type Props = Expand<CreateSeparatorProps & DOMElement>;

export type { Props };
