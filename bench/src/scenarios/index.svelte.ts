import { flushSync, mount, unmount, type Component } from "svelte";
import {
	forceLayout,
	keydown,
	makeItems,
	measureMount,
	measureOpenCycle,
	nextPaint,
	pointerMove,
	raf,
	waitFor,
	isVisible,
	type Scenario,
} from "../bench";
import DialogOpen from "./dialog-open.svelte";
import PopoverOpen from "./popover-open.svelte";
import SelectOpen from "./select-open.svelte";
import MenuOpen from "./menu-open.svelte";
import ComboboxOpen from "./combobox-open.svelte";
import TooltipGrid from "./tooltip-grid.svelte";
import SelectTriggerGrid from "./select-trigger-grid.svelte";

function getTrigger(): HTMLElement {
	const el = document.querySelector<HTMLElement>("[data-bench-trigger]");
	if (!el) throw new Error("no trigger found");
	return el;
}

function openScenario(opts: {
	cpuThrottle: number;
	component: Component;
	props?: Record<string, unknown>;
	activate: (trigger: HTMLElement) => void;
}): Scenario {
	const ctl = $state({ open: false, value: "" });
	return {
		cpuThrottle: opts.cpuThrottle,
		samples: 5,
		warmup: 2,
		setup(target) {
			mount(opts.component, { target, props: { ctl, ...opts.props } });
		},
		async run() {
			const trigger = getTrigger();
			trigger.focus();
			const duration = await measureOpenCycle({
				activate: () => opts.activate(trigger),
				contentSelector: "[data-bench-content]",
				close: () => (ctl.open = false),
			});
			ctl.value = "";
			return duration;
		},
	};
}

function mountScenario(opts: { component: Component; props?: Record<string, unknown> }): Scenario {
	return {
		cpuThrottle: 1,
		samples: 5,
		warmup: 1,
		setup() {},
		async run() {
			const target = document.getElementById("app")!;
			return measureMount({
				target,
				iterations: 20,
				mountOnce: (t) => {
					const app = mount(opts.component, {
						target: t,
						props: opts.props,
					});
					return () => unmount(app);
				},
			});
		},
	};
}

function menuHighlightScenario(): Scenario {
	const ctl = $state({ open: false });
	return {
		cpuThrottle: 1,
		samples: 5,
		warmup: 1,
		async setup(target) {
			mount(MenuOpen, { target, props: { ctl, items: makeItems(1000) } });
			await nextPaint();
			const trigger = getTrigger();
			trigger.focus();
			keydown(trigger, "Enter");
			await waitFor(() => isVisible("[data-bench-content]"));
			await nextPaint();
		},
		async run() {
			const items = Array.from(
				document.querySelectorAll<HTMLElement>("[data-bench-content] .item")
			);
			if (items.length === 0) throw new Error("no menu items");
			const content = document.querySelector<HTMLElement>("[data-bench-content]")!;
			const contentRect = content.getBoundingClientRect();
			const visible = items.filter((el) => {
				const r = el.getBoundingClientRect();
				return r.top >= contentRect.top && r.bottom <= contentRect.bottom;
			});
			const sweep: HTMLElement[] = [];
			const count = Math.min(50, visible.length);
			for (let i = 0; i < count; i++) {
				sweep.push(visible[Math.floor((i * visible.length) / count)]!);
			}
			let total = 0;
			let highlightedCount = 0;
			for (const el of sweep) {
				const r = el.getBoundingClientRect();
				const t0 = performance.now();
				pointerMove(el, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
				flushSync();
				await Promise.resolve();
				flushSync();
				forceLayout();
				total += performance.now() - t0;
				await raf();
				if (el.hasAttribute("data-highlighted")) highlightedCount++;
			}
			if (highlightedCount < sweep.length * 0.9) {
				throw new Error(
					`sweep did not highlight items (${highlightedCount}/${sweep.length})`
				);
			}
			return total / sweep.length;
		},
	};
}

export const scenarios: Record<string, Scenario> = {
	"dialog-open": openScenario({
		cpuThrottle: 20,
		component: DialogOpen,
		activate: (t) => t.click(),
	}),
	"popover-open": openScenario({
		cpuThrottle: 6,
		component: PopoverOpen,
		activate: (t) => t.click(),
	}),
	"select-open": openScenario({
		cpuThrottle: 6,
		component: SelectOpen,
		props: { items: makeItems(1000) },
		activate: (t) => keydown(t, "Enter"),
	}),
	"menu-open": openScenario({
		cpuThrottle: 6,
		component: MenuOpen,
		props: { items: makeItems(1000) },
		activate: (t) => keydown(t, "Enter"),
	}),
	"combobox-open": openScenario({
		cpuThrottle: 6,
		component: ComboboxOpen,
		props: { items: makeItems(1000) },
		activate: (t) => keydown(t, "ArrowDown"),
	}),
	"tooltip-mount": mountScenario({
		component: TooltipGrid,
		props: { count: 1000 },
	}),
	"select-trigger-mount": mountScenario({
		component: SelectTriggerGrid,
		props: { count: 1000 },
	}),
	"menu-highlight": menuHighlightScenario(),
};
