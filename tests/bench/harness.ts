import { flushSync, mount, unmount, type Component } from "svelte";
import { afterAll } from "vitest";
import { commands } from "vitest/browser";

declare const __BENCH_LABEL__: string;
declare const __BENCH_RUNS__: number;

type Stats = { median: number; min: number; p95: number; mean: number };
export type BenchResult = Record<string, Stats>;

const RUNS = __BENCH_RUNS__;
const WARMUP = Math.max(2, Math.round(RUNS / 4));
const results: Record<string, BenchResult> = {};

const w = window as unknown as {
	gc?: () => void;
};
const perfMem = () =>
	(performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize ?? 0;

// two passes: the first can leave weak/ephemeron garbage behind
const gc = () => (w.gc?.(), w.gc?.());
/** Forces style + layout so the timed region includes rendering cost, not just scripting. */
const layout = () => document.body.getBoundingClientRect();
/** Lets queued microtasks / zero-delay timers (floating-ui, presence, etc.) run. */
const channel = new MessageChannel();
const macrotask = () =>
	new Promise<void>((r) => {
		channel.port1.onmessage = () => r();
		channel.port2.postMessage(null);
	});
export const settle = () => macrotask().then(macrotask);

function stats(xs: number[]): Stats {
	const s = [...xs].sort((a, b) => a - b);
	const q = (p: number) => s[Math.min(s.length - 1, Math.floor(p * s.length))]!;
	return {
		median: q(0.5),
		min: s[0]!,
		p95: q(0.95),
		mean: s.reduce((a, b) => a + b, 0) / s.length,
	};
}

function newTarget() {
	const target = document.createElement("div");
	document.body.appendChild(target);
	return target;
}

type Ctx<P> = { props: P; target: HTMLElement };

export type BenchOptions<P> = {
	component: Component<any>; // oxlint-disable-line no-explicit-any
	/** Return a fresh `$state` object (create it in a `.svelte.ts` file) so `run` can mutate it. */
	props: () => P;
	/** Untimed; runs after mount + settle. */
	setup?: (ctx: Ctx<P>) => void | Promise<void>;
	/** Timed. Omit to benchmark mount/unmount. Keep it synchronous where possible. */
	run?: (ctx: Ctx<P>) => void | Promise<void>;
	/** Untimed; runs after every iteration. Throw if the scenario didn't actually do its work. */
	verify?: (ctx: Ctx<P>) => void;
	runs?: number;
};

/**
 * Mount bench (no `run`): records `mount` (mount + flush + layout), `mountSettled`
 * (+ microtasks/timers), `unmount`, and `heapKB` (JS heap retained while mounted; approximate).
 *
 * Update bench (`run`): mounts untimed, then records `run` (action + flush + layout)
 * and `runSettled`.
 */
export async function bench<P extends Record<string, unknown>>(
	name: string,
	opts: BenchOptions<P>
) {
	const runs = opts.runs ?? RUNS;
	const m: Record<string, number[]> = {};
	const push = (k: string, v: number) => (m[k] ??= []).push(v);

	for (let i = 0; i < WARMUP + runs; i++) {
		const record = i >= WARMUP;
		const target = newTarget();
		const props = opts.props();
		let t0 = performance.now();
		const inst = mount(opts.component, { target, props });
		flushSync();
		layout();
		let t1 = performance.now();
		await settle();
		let t2 = performance.now();
		if (!opts.run) opts.verify?.({ props, target });
		let heapMounted = 0;
		if (record && !opts.run) {
			push("mount", t1 - t0);
			push("mountSettled", t2 - t0);
			gc();
			heapMounted = perfMem();
		}
		if (opts.run) {
			await opts.setup?.({ props, target });
			await settle();
			t0 = performance.now();
			await opts.run({ props, target });
			flushSync();
			layout();
			t1 = performance.now();
			await settle();
			t2 = performance.now();
			opts.verify?.({ props, target });
			if (record) {
				push("run", t1 - t0);
				push("runSettled", t2 - t0);
			}
		}
		t0 = performance.now();
		await unmount(inst);
		flushSync();
		t1 = performance.now();
		if (record && !opts.run) push("unmount", t1 - t0);
		target.remove();
		// clean up anything portalled to body
		for (const el of [...document.body.children]) el.remove();
		document.body.removeAttribute("style");
		await settle();
		if (heapMounted) {
			gc();
			// retained by the mounted tree = heap while mounted - heap after teardown
			push("heapKB", (heapMounted - perfMem()) / 1024);
		}
	}

	const res: BenchResult = {};
	for (const [k, v] of Object.entries(m)) res[k] = stats(v);
	results[name] = res;
	return res;
}

export function writeResults(file: string) {
	afterAll(async () => {
		await commands.writeFile(
			`./bench/results/${__BENCH_LABEL__}/${file}.json`,
			JSON.stringify(results, null, 2)
		);
	});
}

/** Dispatch a keydown synchronously on `el` (cheaper + less noisy than userEvent). */
export function key(el: Element, k: string, init: KeyboardEventInit = {}) {
	el.dispatchEvent(
		new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init })
	);
}

export function pointer(el: Element, type: string, init: PointerEventInit = {}) {
	el.dispatchEvent(
		new PointerEvent(type, {
			bubbles: true,
			cancelable: true,
			pointerType: "mouse",
			button: 0,
			...init,
		})
	);
}

export function assert(cond: unknown, msg: string): asserts cond {
	if (!cond) throw new Error(`bench verify failed: ${msg}`);
}

export const $ = (target: ParentNode, sel: string) => target.querySelector(sel) as HTMLElement;
export const $$ = (target: ParentNode, sel: string) =>
	[...target.querySelectorAll(sel)] as HTMLElement[];
