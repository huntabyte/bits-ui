import { watch } from "runed";
import type { ReadableBox, WritableBox } from "svelte-toolbelt";

export class ElementIdBridge {
	#id = $state<string | undefined>(undefined);
	node = $state<HTMLElement | null>(null);
	id = $derived.by(() => {
		if (this.node && this.#id) return this.#id;
		return undefined;
	});

	link(ref: WritableBox<HTMLElement | null>, id: ReadableBox<string | undefined>) {
		this.#id = id.current;
		this.node = ref.current;

		watch.pre(
			() => id.current,
			(currId) => {
				this.#id = currId;
			}
		);

		watch.pre(
			() => ref.current,
			(currNode) => {
				this.node = currNode;
			}
		);
	}
}
