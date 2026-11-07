import { describe, it } from "vitest";
import { bench, writeResults, assert, $$ } from "./harness.js";
import { props } from "./props.svelte.js";
import Simple from "./fixtures/simple.svelte";
import Checkbox from "./fixtures/checkbox.svelte";
import Switch from "./fixtures/switch.svelte";
import Toggle from "./fixtures/toggle.svelte";
import Accordion from "./fixtures/accordion.svelte";
import Collapsible from "./fixtures/collapsible.svelte";
import RadioGroup from "./fixtures/radio-group.svelte";
import Tabs from "./fixtures/tabs.svelte";
import ToggleGroup from "./fixtures/toggle-group.svelte";
import Toolbar from "./fixtures/toolbar.svelte";
import Slider from "./fixtures/slider.svelte";
import RatingGroup from "./fixtures/rating-group.svelte";
import PinInput from "./fixtures/pin-input.svelte";
import Pagination from "./fixtures/pagination.svelte";
import ScrollArea from "./fixtures/scroll-area.svelte";

writeResults("primitives");

describe("simple (aspect-ratio, avatar, button, label, meter, progress, separator)", () => {
	it("mount 100 each", () =>
		bench("simple/mount-100x7", { component: Simple, props: props({ count: 100 }) }));
	it("update value", () =>
		bench("simple/update-value-100x7", {
			component: Simple,
			props: props({ count: 100, value: 10 }),
			run: ({ props }) => void (props.value = 90),
		}));
});

describe("checkbox", () => {
	it("mount 500", () =>
		bench("checkbox/mount-500", { component: Checkbox, props: props({ count: 500 }) }));
	it("toggle all 500", () =>
		bench("checkbox/toggle-500", {
			component: Checkbox,
			props: props({ count: 500, checked: false }),
			run: ({ props }) => void (props.checked = true),
			verify: ({ target }) =>
				assert($$(target, "[data-state=checked]").length === 500, "all checked"),
		}));
});

describe("switch", () => {
	it("mount 500", () =>
		bench("switch/mount-500", { component: Switch, props: props({ count: 500 }) }));
	it("toggle all 500", () =>
		bench("switch/toggle-500", {
			component: Switch,
			props: props({ count: 500, checked: false }),
			run: ({ props }) => void (props.checked = true),
		}));
});

describe("toggle", () => {
	it("mount 500", () =>
		bench("toggle/mount-500", { component: Toggle, props: props({ count: 500 }) }));
	it("press all 500", () =>
		bench("toggle/press-500", {
			component: Toggle,
			props: props({ count: 500, pressed: false }),
			run: ({ props }) => void (props.pressed = true),
		}));
});

describe("accordion", () => {
	it("mount 200", () =>
		bench("accordion/mount-200", { component: Accordion, props: props({ count: 200 }) }));
	it("open one of 200", () =>
		bench("accordion/open-1-of-200", {
			component: Accordion,
			props: props({ count: 200, value: [] as string[] }),
			run: ({ props }) => void (props.value = ["100"]),
			verify: ({ target }) =>
				assert($$(target, "[data-bench=content]").length >= 1, "content open"),
		}));
	it("click trigger in 200", () =>
		bench("accordion/click-trigger-200", {
			component: Accordion,
			props: props({ count: 200 }),
			run: ({ target }) => $$(target, "[data-bench=trigger]")[100]!.click(),
			verify: ({ target }) =>
				assert($$(target, "[data-bench=trigger]")[100]!.dataset.state === "open", "opened"),
		}));
});

describe("collapsible", () => {
	it("mount 300", () =>
		bench("collapsible/mount-300", { component: Collapsible, props: props({ count: 300 }) }));
	it("open all 300", () =>
		bench("collapsible/open-all-300", {
			component: Collapsible,
			props: props({ count: 300, open: false }),
			run: ({ props }) => void (props.open = true),
			verify: ({ target }) =>
				assert($$(target, "[data-bench=content]").length === 300, "open"),
		}));
});

describe("radio-group", () => {
	it("mount 500", () =>
		bench("radio-group/mount-500", { component: RadioGroup, props: props({ count: 500 }) }));
	it("change value in 500", () =>
		bench("radio-group/change-500", {
			component: RadioGroup,
			props: props({ count: 500, value: "0" }),
			run: ({ props }) => void (props.value = "250"),
		}));
	it("click item in 500", () =>
		bench("radio-group/click-500", {
			component: RadioGroup,
			props: props({ count: 500, value: "0" }),
			run: ({ target }) => $$(target, "[data-bench=item]")[250]!.click(),
			verify: ({ target }) =>
				assert(
					$$(target, "[data-bench=item]")[250]!.dataset.state === "checked",
					"clicked"
				),
		}));
});

describe("tabs", () => {
	it("mount 200", () =>
		bench("tabs/mount-200", { component: Tabs, props: props({ count: 200 }) }));
	it("change value in 200", () =>
		bench("tabs/change-200", {
			component: Tabs,
			props: props({ count: 200, value: "0" }),
			run: ({ props }) => void (props.value = "100"),
		}));
});

describe("toggle-group", () => {
	it("mount 300", () =>
		bench("toggle-group/mount-300", { component: ToggleGroup, props: props({ count: 300 }) }));
	it("click item in 300", () =>
		bench("toggle-group/click-300", {
			component: ToggleGroup,
			props: props({ count: 300 }),
			run: ({ target }) => $$(target, "[data-bench=item]")[150]!.click(),
			verify: ({ target }) =>
				assert($$(target, "[data-bench=item]")[150]!.dataset.state === "on", "pressed"),
		}));
});

describe("toolbar", () => {
	it("mount 200", () =>
		bench("toolbar/mount-200", { component: Toolbar, props: props({ count: 200 }) }));
});

describe("slider", () => {
	it("mount 100", () =>
		bench("slider/mount-100", { component: Slider, props: props({ count: 100 }) }));
	it("update value x100", () =>
		bench("slider/update-100", {
			component: Slider,
			props: props({ count: 100, value: 10 }),
			run: ({ props }) => void (props.value = 70),
			verify: ({ target }) =>
				assert(
					$$(target, "[data-bench=thumb]").length === 100 &&
						$$(target, "[data-bench=thumb]").every(
							(thumb) => thumb.dataset.value === "70"
						),
					"all thumbs updated"
				),
		}));
});

describe("rating-group", () => {
	it("mount 100", () =>
		bench("rating-group/mount-100", { component: RatingGroup, props: props({ count: 100 }) }));
	it("update value x100", () =>
		bench("rating-group/update-100", {
			component: RatingGroup,
			props: props({ count: 100, value: 1 }),
			run: ({ props }) => void (props.value = 7.5),
		}));
});

describe("pin-input", () => {
	it("mount 100", () =>
		bench("pin-input/mount-100", { component: PinInput, props: props({ count: 100 }) }));
	it("update value x100", () =>
		bench("pin-input/update-100", {
			component: PinInput,
			props: props({ count: 100, value: "" }),
			run: ({ props }) => void (props.value = "123456"),
		}));
});

describe("pagination", () => {
	it("mount 100", () =>
		bench("pagination/mount-100", { component: Pagination, props: props({ count: 100 }) }));
	it("change page x100", () =>
		bench("pagination/change-page-100", {
			component: Pagination,
			props: props({ count: 100, page: 1 }),
			run: ({ props }) => void (props.page = 50),
		}));
});

describe("scroll-area", () => {
	it("mount 50", () =>
		bench("scroll-area/mount-50", { component: ScrollArea, props: props({ count: 50 }) }));
	it("scroll x50", () =>
		bench("scroll-area/scroll-50", {
			component: ScrollArea,
			props: props({ count: 50 }),
			run: async ({ target }) => {
				for (const vp of $$(target, "[data-bench=viewport]")) vp.scrollTop = 100;
				await new Promise((r) => requestAnimationFrame(r));
			},
		}));
});
