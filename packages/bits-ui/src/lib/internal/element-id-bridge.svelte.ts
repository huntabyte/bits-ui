import { watch } from "runed";
import { type ReadableBox, type WritableBox } from "svelte-toolbelt";

interface ElementIdBridgeConnectOpts {
	ref: WritableBox<HTMLElement | null>;
	id: ReadableBox<string | undefined>;
}

/**
 * Coordinates an element reference with its ID for accessibility attributes.
 *
 * Ensures both the DOM element and its ID are available before exposing the ID,
 * preventing race conditions where ARIA attributes reference non-existent elements.
 * Updates reactively when either the source ID or element changes.
 */
export class ElementIdBridge {
	#id = $state<string | undefined>(undefined);
	element = $state<HTMLElement | null>(null);
	id = $derived.by(() => {
		if (this.element && this.#id) return this.#id;
		return undefined;
	});

	connect(opts: ElementIdBridgeConnectOpts) {
		this.#id = opts.id.current;
		this.element = opts.ref.current;

		watch.pre(
			() => opts.id.current,
			(currId) => {
				this.#id = currId;
			}
		);

		watch.pre(
			() => opts.ref.current,
			(currNode) => {
				this.element = currNode;
			}
		);
	}
}
