import { untrack } from "svelte";
import { page } from "$app/state";
import { on } from "svelte/events";

export type TocItem = {
	title: string;
	url: string;
	items?: TocItem[];
};

export type TableOfContents = {
	items?: TocItem[];
};

export function useToc(getItemIds: () => string[]) {
	const itemIds = $derived(getItemIds());
	let activeId = $state<string | null>(null);
	const urlHash = $derived(page.url.hash);
	const isAtBottom = useIsAtBottom();

	const activeIndex = $derived(itemIds.findIndex((id) => id === activeId));
	const markerTopStyle = $derived.by(() => {
		if (activeIndex === -1) return "0px";
		return activeIndex * 28 + "px";
	});

	function isActive(item: TocItem) {
		return (
			(item.url === urlHash && `#${activeId}` === urlHash) ||
			isParentOfActiveItem(item) ||
			item.url === `#${activeId}`
		);
	}

	function isParentOfActiveItem(item: TocItem) {
		return Boolean(item.items?.some((item) => item.url === `#${activeId}`));
	}

	function isLastItem(item: TocItem) {
		return `#${itemIds[itemIds.length - 1]}` === item.url;
	}

	$effect(() => {
		const hash = urlHash;
		untrack(() => {
			if (hash === `#${activeId}`) return;
			activeId = hash.split("#")[1];
		});
	});

	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						untrack(() => (activeId = entry.target.id));
						activeId = entry.target.id;
					}
				}
			},
			{ rootMargin: "0% 0% -80% 0% " }
		);

		for (const id of itemIds) {
			const node = document.getElementById(id);
			if (node) observer.observe(node);
		}

		return () => {
			for (const id of itemIds) {
				const node = document.getElementById(id);
				if (node) observer.unobserve(node);
			}
		};
	});

	$effect(() => {
		if (isAtBottom.current) {
			untrack(() => {
				activeId = itemIds[itemIds.length - 1];
			});
		}
	});

	return {
		get activeId() {
			return activeId;
		},
		get markerTopStyle() {
			return markerTopStyle;
		},
		isActive,
		isLastItem,
	};
}

function useIsAtBottom() {
	let isAtBottom = $state(false);

	function checkScrollPos() {
		const buffer = 20;
		untrack(() => {
			isAtBottom =
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - buffer;
		});
	}

	$effect(() => {
		return on(window, "scroll", checkScrollPos);
	});

	return {
		get current() {
			return isAtBottom;
		},
	};
}
