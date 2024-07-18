import { box } from "svelte-toolbelt";
import { getContext, setContext } from "svelte";
import type { Box } from "./box.svelte.js";

const ITEM_DATA_ATTR = "data-bits-collection-item";

type ContextValue = Box<HTMLElement[]>;

export function useCollection(key?: string, name = ITEM_DATA_ATTR) {
	// eslint-disable-next-line symbol-description
	const COLLECTION_SYMBOL = key ?? Symbol();

	function createCollection(sourceNode?: Box<HTMLElement | null>) {
		const items = box<HTMLElement[]>([]);

		function setCollection() {
			const sourceEl = sourceNode?.value;
			if (!sourceEl) return (items.value = []);

			return (items.value = Array.from(
				sourceEl.querySelectorAll(`[${name}]:not([data-disabled])`)
			) as HTMLElement[]);
		}
		$effect.pre(() => {
			items.value = [];
		});

		$effect(() => {
			setCollection();
		});

		$effect(() => {
			if (!sourceNode?.value) return;
			setCollection();
		});

		setContext(COLLECTION_SYMBOL, items);

		return items;
	}

	function getCollection() {
		return getContext<ContextValue>(COLLECTION_SYMBOL);
	}

	return {
		createCollection,
		getCollection,
	};
}
