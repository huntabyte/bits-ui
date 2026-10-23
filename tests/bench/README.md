# bits-ui perf benchmarks

Vitest browser-mode benchmarks (headless Chromium) that run against bits-ui **source** in
**production mode** (`compilerOptions.dev: false`, `production` export condition, `esm-env` `DEV === false`).
`env.bench.test.ts` fails if that ever stops being true.

## Commands (from `tests/`)

```sh
pnpm bench:snapshot                    # copy HEAD's packages/bits-ui/src/lib -> packages/bits-ui/.bench-baseline (BENCH_REF=<ref> for another ref)
pnpm bench:baseline                    # bench the snapshot      -> bench/results/baseline/
pnpm bench                             # bench working-tree src  -> bench/results/current/
pnpm bench:compare [base] [head] [--all]

# label results, filter by file and/or test name, raise sample count
BENCH_LABEL=me-base pnpm bench:baseline lists -t "select"
BENCH_LABEL=me BENCH_RUNS=40 pnpm bench lists -t "select"
pnpm bench:compare me-base me

# existing behaviour tests against source instead of dist (no rebuild needed)
pnpm test:src --run --browser.name=chromium src/tests/select
```

## Metrics

- Mount benches: `mount` (mount + `flushSync` + forced layout), `mountSettled` (+ two macrotasks so
  microtask/promise work such as floating-ui positioning lands), `unmount`, `heapKB` (JS heap while
  mounted minus after teardown; bimodal from V8 GC internals, so compare uses its **min**).
- Update benches (`run` given): `run` (action + flush + layout) and `runSettled`.
- `requestAnimationFrame` work is _not_ included (it would quantize to 16ms) unless a scenario awaits it.

## Noise

A/A runs (same code both sides) flag ~2% of rows at the default 10% / 0.5ms / 100KB band.
Re-run any win with `BENCH_RUNS=40` and both sides back-to-back before believing it, especially
when other processes are loading the machine.

## Adding scenarios

Fixtures live in `fixtures/` and take a `count` plus whatever state the scenario mutates. Use
`props({...})` from `props.svelte.ts` so `run` can mutate reactive props, and always give
interaction scenarios a `verify` so a no-op can't masquerade as a speedup.
