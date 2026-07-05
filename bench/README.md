# Bits UI Benchmarks

Performance benchmarks for the floating/popup components. Chromium via Playwright, CDP CPU throttling, open scenarios measured activation-to-visible-paint, mount scenarios measured as scripted render + layout.

The bench app compiles `bits-ui` **directly from `packages/bits-ui/src`** (see
`vite.config.ts` aliases), so library edits are picked up by a plain rebuild —
no `svelte-package` step needed.

## Scenarios

| scenario               | what it measures                                              | CPU throttle |
| ---------------------- | ------------------------------------------------------------- | ------------ |
| `dialog-open`          | trigger click → dialog visible, 10k outside DOM nodes         | 20x          |
| `popover-open`         | trigger click → popover visible, 50-field form content        | 6x           |
| `select-open`          | Enter on trigger → listbox visible, 1,000 items               | 6x           |
| `menu-open`            | Enter on trigger → menu visible, 1,000 items                  | 6x           |
| `combobox-open`        | ArrowDown on input → listbox visible, 1,000 items             | 6x           |
| `tooltip-mount`        | mount 1,000 `Tooltip.Root` + `Trigger` (avg of 20 iters)      | 1x           |
| `select-trigger-mount` | mount 1,000 `Select.Root` + `Trigger`, 10 items each          | 1x           |
| `menu-highlight`       | pointermove sweep over open menu items, per-item flush+layout | 1x           |

Open scenarios: 2 warmup runs + 5 samples, median reported. Each sample is a
full open/close cycle; only activation → first painted frame with visible
content is timed.

## Usage

```bash
# full suite (builds first)
node runner.mjs --label my-run

# subset, compare against a saved baseline
node runner.mjs --scenarios select-open,menu-open --compare results/baseline.json

# skip the vite build (reuse dist/)
node runner.mjs --skip-build

# CPU-profile one scenario (unminified build, prints hottest functions)
node profile.mjs select-open --runs 3

# trace main-thread breakdown (style recalc / layout / paint) for one scenario
node trace.mjs dialog-open
```

Results are written to `results/<label>.json`.

## Caveats

- Absolute numbers drift with machine state (thermals, background load) —
  **always compare A/B in the same session**, e.g. stash/unstash library
  changes and run back-to-back. Numbers are not comparable across machines.
- `menu-highlight` measures dispatch → reactivity flush → forced style/layout
  per item (not frame-to-frame, which would be vsync-bound).
