// @vitest-environment node
import { render } from "svelte/server";
import { expect, it } from "vitest";
import SsrIds from "./ssr-ids.test.svelte";

it("renders identical HTML across server renders (#2311)", () => {
	const first = render(SsrIds).body;
	const second = render(SsrIds).body;
	expect(second).toBe(first);
});
