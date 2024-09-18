# bits-ui

## 0.21.14

### Patch Changes

- fix(Date Pickers): expose `portal` prop ([#652](https://github.com/huntabyte/bits-ui/pull/652))

- fix(Pagination): call `onPageChange` _after_ setting the `page` ([#657](https://github.com/huntabyte/bits-ui/pull/657))

- fix(Date Range Picker): expose missing props ([#651](https://github.com/huntabyte/bits-ui/pull/651))

## 0.21.13

### Patch Changes

- fix: compatibility with `exactOptionalPropertyTypes` ([#621](https://github.com/huntabyte/bits-ui/pull/621))

## 0.21.12

### Patch Changes

- Add `nonpassive` modifier to `touchmove` and `touchstart` events ([#591](https://github.com/huntabyte/bits-ui/pull/591))

## 0.21.11

### Patch Changes

- fix: use the `dir` props for rtl support ([#531](https://github.com/huntabyte/bits-ui/pull/531))

## 0.21.10

### Patch Changes

- fix: allow overriding the combobox input id ([#553](https://github.com/huntabyte/bits-ui/pull/553))

## 0.21.9

### Patch Changes

- feat: forward additional events from `<Button>` ([#550](https://github.com/huntabyte/bits-ui/pull/550))

## 0.21.8

### Patch Changes

- fix: Updated `ComboboxLabelProps` to use `HTMLLabelAttributes` ([#544](https://github.com/huntabyte/bits-ui/pull/544))

- fix: ContentProps type ([#545](https://github.com/huntabyte/bits-ui/pull/545))

## 0.21.7

### Patch Changes

- chore: Updated a11y warnings for better Svelte 5 compatibility ([#529](https://github.com/huntabyte/bits-ui/pull/529))

## 0.21.6

### Patch Changes

- chore: update peer deps to include Svelte 5 ([#525](https://github.com/huntabyte/bits-ui/pull/525))

## 0.21.5

### Patch Changes

- chore: Replaced all self-closing non-void elements ([#518](https://github.com/huntabyte/bits-ui/pull/518))

## 0.21.4

### Patch Changes

- Fix binding button element ([#473](https://github.com/huntabyte/bits-ui/pull/473))

## 0.21.3

### Patch Changes

- fix: toolbar onValueChange firing ([#448](https://github.com/huntabyte/bits-ui/pull/448))

## 0.21.2

### Patch Changes

- chore: refactor types ([#434](https://github.com/huntabyte/bits-ui/pull/434))

## 0.21.1

### Patch Changes

- fix: context menu closeOnItemClick ([#421](https://github.com/huntabyte/bits-ui/pull/421))

## 0.21.0

### Minor Changes

- feat: Combobox `touchedInput` ([#417](https://github.com/huntabyte/bits-ui/pull/417))

### Patch Changes

- fix: touched input default value ([#419](https://github.com/huntabyte/bits-ui/pull/419))

## 0.20.1

### Patch Changes

- Update melt to v0.76.2 ([#414](https://github.com/huntabyte/bits-ui/pull/414))

## 0.20.0

### Minor Changes

- Expose `open` and `onOpenChange` props to `DatePicker.Root` component ([#404](https://github.com/huntabyte/bits-ui/pull/404))

- Forward `pointerenter` events from `Menu` items ([#403](https://github.com/huntabyte/bits-ui/pull/403))

### Patch Changes

- Change `contextmenu` event type to `MouseEvent` ([#402](https://github.com/huntabyte/bits-ui/pull/402))

## 0.19.7

### Patch Changes

- fix: Event type for `CustomEventHandler` (#389) ([#398](https://github.com/huntabyte/bits-ui/pull/398))

## 0.19.6

### Patch Changes

- Update Melt UI to [v0.76.0](https://github.com/melt-ui/melt-ui/releases/tag/v0.76.0] "[#393](https://github.com/huntabyte/bits-ui/pull/393")

## 0.19.5

### Patch Changes

- Button: fixed `Button.Props` type resolution issue ([#381](https://github.com/huntabyte/bits-ui/pull/381))

## 0.19.4

### Patch Changes

- Updated `@melt-ui/svelte` to `v0.75.3` for portal and floating bug fixes ([#379](https://github.com/huntabyte/bits-ui/pull/379))

## 0.19.3

### Patch Changes

- fixed path aliases causing errors ([#374](https://github.com/huntabyte/bits-ui/pull/374))

## 0.19.2

### Patch Changes

- fix: Adjusted internal import aliases to fix the malformed package build ([#371](https://github.com/huntabyte/bits-ui/pull/371))

## 0.19.1

### Patch Changes

- Scroll Area: simplify API ([#369](https://github.com/huntabyte/bits-ui/pull/369))

## 0.19.0

### Minor Changes

- New Component: Scroll Area ([#367](https://github.com/huntabyte/bits-ui/pull/367))

### Patch Changes

- Popover: fixed bug where `aria-controls` was applied to trigger when content wasn't rendered yet ([#367](https://github.com/huntabyte/bits-ui/pull/367))

## 0.18.6

### Patch Changes

- Menu Radio Group: fixed equality issue in change function condition ([#362](https://github.com/huntabyte/bits-ui/pull/362))

## 0.18.5

### Patch Changes

- Update Melt UI to [0.74.4](https://github.com/melt-ui/melt-ui/releases/tag/v0.74.4) ([#360](https://github.com/huntabyte/bits-ui/pull/360))

## 0.18.4

### Patch Changes

- fix: Export types for PIN Input and Toolbar ([#355](https://github.com/huntabyte/bits-ui/pull/355))

## 0.18.3

### Patch Changes

- fix: Updated internal import paths to support modern module resolution strategies ([#352](https://github.com/huntabyte/bits-ui/pull/352))

## 0.18.2

### Patch Changes

- Toolbar: forward click events from buttons and links ([#343](https://github.com/huntabyte/bits-ui/pull/343))

- Floating/Modal Components: improve handling of interact outside events ([#344](https://github.com/huntabyte/bits-ui/pull/344))

- Dialogs: Fix bug where dragging outside of dialog would close it ([#344](https://github.com/huntabyte/bits-ui/pull/344))

## 0.18.1

### Patch Changes

- Export Combobox types ([#329](https://github.com/huntabyte/bits-ui/pull/329))

## 0.18.0

### Minor Changes

- New Component: [Combobox](https://bits-ui.com/docs/components/combobox) ([#243](https://github.com/huntabyte/bits-ui/pull/243))

## 0.17.0

### Minor Changes

- Slider: `ticks` and `thumbs` are now arrays of builders passed via the `Slider.Root`s slot props and must be passed to the individual `Slider.Thumb` and `Slider.Tick` components ([#309](https://github.com/huntabyte/bits-ui/pull/309))

### Patch Changes

- Menubar: fixed bug preventing submenus from being disabled ([#309](https://github.com/huntabyte/bits-ui/pull/309))

## 0.16.0

### Minor Changes

- feat: forward/expose `touch` events on `Dialog.Content` & `AlertDialog.Content` components ([#300](https://github.com/huntabyte/bits-ui/pull/300))

## 0.15.1

### Patch Changes

- fix: floating arrow shifting content ([#291](https://github.com/huntabyte/bits-ui/pull/291))

## 0.15.0

### Minor Changes

- feat: expose `isSelected` slot prop from `Select.Item` ([#285](https://github.com/huntabyte/bits-ui/pull/285))

- feat: adds `data-placeholder` attribute to `Select.Value` when no value is selected / when the placeholder is being displayed ([#284](https://github.com/huntabyte/bits-ui/pull/284))

### Patch Changes

- fix: expose missing Floating UI content props ([#278](https://github.com/huntabyte/bits-ui/pull/278))

## 0.14.0

### Minor Changes

- Progress: update `value` type to include `null` for `'indeterminate'` state ([#272](https://github.com/huntabyte/bits-ui/pull/272))

- Menubar: move `preventScroll` prop from `Menubar.Menu` to `Menubar.Root` ([#272](https://github.com/huntabyte/bits-ui/pull/272))

- Date Field: add `readonlySegments` prop to specify certain segments as readonly ([#272](https://github.com/huntabyte/bits-ui/pull/272))

### Patch Changes

- Date Range Field: add `readonlySegments` prop to specify certain segments as 'readonly' to the user ([#272](https://github.com/huntabyte/bits-ui/pull/272))

- chore: array comparison perf improvements ([#229](https://github.com/huntabyte/bits-ui/pull/229))

- Alert Dialog: Fix bug with exit transitions ([#272](https://github.com/huntabyte/bits-ui/pull/272))

## 0.13.6

### Patch Changes

- fix: bug with exit transitions ([#268](https://github.com/huntabyte/bits-ui/pull/268))

## 0.13.5

### Patch Changes

- fix: bug with tooltip arrow causing it to increase offset on each toggle ([#264](https://github.com/huntabyte/bits-ui/pull/264))

## 0.13.4

### Patch Changes

- fix: pagination prop reactivity ([#262](https://github.com/huntabyte/bits-ui/pull/262))

## 0.13.3

### Patch Changes

- fix: date picker context issue ([#260](https://github.com/huntabyte/bits-ui/pull/260))

## 0.13.2

### Patch Changes

- fix: improve tree-shaking ([#257](https://github.com/huntabyte/bits-ui/pull/257))

## 0.13.1

### Patch Changes

- fix: issues with tree shaking ([#255](https://github.com/huntabyte/bits-ui/pull/255))

## 0.13.0

### Minor Changes

- - Forward pointerdown pointerup & pointermove events for AlertDialog.Content and Dialog.Content ([#249](https://github.com/huntabyte/bits-ui/pull/249))
  - Update Melt UI and add onOutsideClick prop to components that handle outside clicks. You can override the default behavior of closing the component by calling event.preventDefault() within that handler.
  - Added RTL support for the Slider via the dir prop which can be set to "ltr" | "rtl" defaulting to "ltr"

### Patch Changes

- fix: Set aspect ratio prop optional as default value is setted ([#238](https://github.com/huntabyte/bits-ui/pull/238))

## 0.12.0

### Minor Changes

- Expose `el` prop for all components to allow binding & interacting with the underlying element ([#244](https://github.com/huntabyte/bits-ui/pull/244))

## 0.11.8

### Patch Changes

- feat: add PIN Input component ([#227](https://github.com/huntabyte/bits-ui/pull/227))

## 0.11.7

### Patch Changes

- fix: bug with select menus inside popovers not restoring scroll ([#209](https://github.com/huntabyte/bits-ui/pull/209))

- add `closeOnItemClick` prop to menu components ([#209](https://github.com/huntabyte/bits-ui/pull/209))

## 0.11.6

### Patch Changes

- feat: add `Pagination` component ([#223](https://github.com/huntabyte/bits-ui/pull/223))

- feat: add Toolbar component ([#219](https://github.com/huntabyte/bits-ui/pull/219))

## 0.11.5

### Patch Changes

- fix: calendar `months` type & range calendar `numberOfMonths` prop ([#224](https://github.com/huntabyte/bits-ui/pull/224))

## 0.11.4

### Patch Changes

- Fix: bugs with reactive slot props & `multiple` value bindings ([#221](https://github.com/huntabyte/bits-ui/pull/221))

## 0.11.3

### Patch Changes

- fix: generic type inference for `Select` component ([#217](https://github.com/huntabyte/bits-ui/pull/217))

## 0.11.2

### Patch Changes

- fix: exported `SelectProps` type ([#214](https://github.com/huntabyte/bits-ui/pull/214))

## 0.11.1

### Patch Changes

- feat: readonly startValue prop ([#212](https://github.com/huntabyte/bits-ui/pull/212))

## 0.11.0

### Minor Changes

- breaking: rename `Date` to `Day` in Calendar components ([#210](https://github.com/huntabyte/bits-ui/pull/210))

## 0.10.3

### Patch Changes

- Calendar & Range Calendar: add `initialFocus` prop to autofocus dates on mount ([#207](https://github.com/huntabyte/bits-ui/pull/207))

## 0.10.2

### Patch Changes

- fix: calendar `data-selected` attribute ([#205](https://github.com/huntabyte/bits-ui/pull/205))

## 0.10.1

### Patch Changes

- fix: Update `Builder` type to support all Melt UI builders ([#201](https://github.com/huntabyte/bits-ui/pull/201))

## 0.10.0

### Minor Changes

- remove `arrowSize` prop from menu Root components in favor of passing it as a prop to the Arrow components ([#184](https://github.com/huntabyte/bits-ui/pull/184))

- New component: Date Range Picker ([#184](https://github.com/huntabyte/bits-ui/pull/184))

- feat: Calendar ([#184](https://github.com/huntabyte/bits-ui/pull/184))

- Breaking change: separate floating `positioning` props into individual props and move them to content components ([#184](https://github.com/huntabyte/bits-ui/pull/184))

- New components: Range Calendar, Date Field, Date Range Field ([#184](https://github.com/huntabyte/bits-ui/pull/184))

## 0.10.0-next.0

### Minor Changes

- remove `arrowSize` prop from menu Root components in favor of passing it as a prop to the Arrow components ([#184](https://github.com/huntabyte/bits-ui/pull/184))

- New component: Date Range Picker ([#184](https://github.com/huntabyte/bits-ui/pull/184))

- feat: Calendar ([#184](https://github.com/huntabyte/bits-ui/pull/184))

- Breaking change: separate floating `positioning` props into individual props and move them to content components ([#184](https://github.com/huntabyte/bits-ui/pull/184))

- New components: Range Calendar, Date Field, Date Range Field ([#184](https://github.com/huntabyte/bits-ui/pull/184))

## 0.9.9

### Patch Changes

- fix: bug where menu `onChange` functions were being called before change ([#191](https://github.com/huntabyte/bits-ui/pull/191))

## 0.9.8

### Patch Changes

- Update melt ([#186](https://github.com/huntabyte/bits-ui/pull/186))

## 0.9.7

### Patch Changes

- change: `kind` prop to `type` in toggle group ([#181](https://github.com/huntabyte/bits-ui/pull/181))

## 0.9.6

### Patch Changes

- fix: correct item events ([#179](https://github.com/huntabyte/bits-ui/pull/179))

## 0.9.5

### Patch Changes

- feat: add autofocus & closefocus to alert dialog ([#176](https://github.com/huntabyte/bits-ui/pull/176))

## 0.9.4

### Patch Changes

- chore: new lockfile ([#168](https://github.com/huntabyte/bits-ui/pull/168))

- feat: allow setting AlertDialog openFocus & closeFocus props ([#167](https://github.com/huntabyte/bits-ui/pull/167))

## 0.9.3

### Patch Changes

- fix: id synchronization ([#165](https://github.com/huntabyte/bits-ui/pull/165))

## 0.9.2

### Patch Changes

- Chore: Remove transition workaround in favor of Melt fix ([#162](https://github.com/huntabyte/bits-ui/pull/162))

## 0.9.1

### Patch Changes

- [Checkbox]: Fix bug with `disabled` attribute on the button ([#158](https://github.com/huntabyte/bits-ui/pull/158))

## 0.9.0

### Minor Changes

- New Component: Toggle Group ([#154](https://github.com/huntabyte/bits-ui/pull/154))

### Patch Changes

- add default type="button" to all components using button element ([#150](https://github.com/huntabyte/bits-ui/pull/150))

## 0.8.5

### Patch Changes

- Remove `ToggleInput` & fix bugs ([#149](https://github.com/huntabyte/bits-ui/pull/149))

## 0.8.4

### Patch Changes

- Pass ids as slot props to components with managed ids ([#147](https://github.com/huntabyte/bits-ui/pull/147))

## 0.8.3

### Patch Changes

- Pass controlled `ids` as slot props to each `Component.Root` ([#145](https://github.com/huntabyte/bits-ui/pull/145))

## 0.8.2

### Patch Changes

- add controlled popover focus prop ([#143](https://github.com/huntabyte/bits-ui/pull/143))

## 0.8.1

### Patch Changes

- Update Melt UI to v0.57.0 ([#141](https://github.com/huntabyte/bits-ui/pull/141))

## 0.8.0

### Minor Changes

- Update Melt UI version & include new `openFocus` & `closeFocus` props ([#138](https://github.com/huntabyte/bits-ui/pull/138))

## 0.7.0

### Minor Changes

- Add support for Anchor dropdown items ([#131](https://github.com/huntabyte/bits-ui/pull/131))

### Patch Changes

- Improve prop and `onChange` types ([#134](https://github.com/huntabyte/bits-ui/pull/134))

## 0.6.3

### Patch Changes

- 8655546: fix popover content bug

## 0.6.2

### Patch Changes

- a780302: - cleanup types and lint issues
- 30ed8d5: - Fix: Bug preventing avatar `src` from clearing

## 0.6.1

### Patch Changes

- e788665: expose additional events

## 0.6.0

### Minor Changes

- 4c9aca7: - update to the latest Melt UI version

## 0.5.7

### Patch Changes

- 52819ef: - Update Melt UI for a bug fix that allows the menubar triggers to properly toggle.

## 0.5.6

### Patch Changes

- 5e1c692: – Update Melt UI version for a bug fix that was preventing the dialog portal divs from being cleaned up on `unmount`.

## 0.5.5

### Patch Changes

- b66e02a: Fix: cleanup dialog timeout

## 0.5.4

### Patch Changes

- 984ca98: fix: dialog crashing when back-to-back trigger clicks

## 0.5.3

### Patch Changes

- b595e60: Fix: remove background overlay from menu components

## 0.5.2

### Patch Changes

- af9a922: - Upgrade Melt UI to resolve `Select` portal bug

## 0.5.1

### Patch Changes

- f4dbdc5: Add `click` event listener type to `Menubar.Item` Events

## 0.5.0

### Minor Changes

- 38c2afb: - Export `CheckboxInput`

## 0.1.0

### Minor Changes

- 97ebef8: - Export `CheckboxInput`

### Patch Changes

- 0f9ed31: - Add transition support & improve events
  - `Select.Root` now takes a `selected` prop instead of `value`, to align with [Melt UI](https://melt-ui.com/docs/builders/select)'s recent update.

## 0.0.31

### Patch Changes

- 64db7da: hotfix: bug

## 0.0.30

### Patch Changes

- 9f21863: Fix: Select events

## 0.0.29

### Patch Changes

- 6d35961: Fix: `isBrowser` import

## 0.0.28

### Patch Changes

- 5d2e054: Feat: Improve transition props to support `in` and `out` transitions.

## 0.0.27

### Patch Changes

- 4ecd3ea: Fix: Add transparent menu overlay
- 879ab10: Fix: issue preventing dialog transitions

## 0.0.26

### Patch Changes

- b6302eb: Improve component custom event types

## 0.0.25

### Patch Changes

- 855a961: - Improve types
  - Fix bug with `Menubar` props
  - Add `Arrow` components for the floating Bits
  - Fix `asChild` bug affecting multiple Bits

## 0.0.24

### Patch Changes

- 23ef6d1: Export `LinkPreview`

## 0.0.23

### Patch Changes

- 8f72add: fix menubar & rename hovercard

## 0.0.22

### Patch Changes

- 4fe9ccc: Revert menubar changes
- 331c599: Fix menubar keyboard

## 0.0.21

### Patch Changes

- 77d1a14: Fix Menubar bug
- 3bbeda0: Properly type Accordion

## 0.0.20

### Patch Changes

- 169fcbe: rename to bits

## 0.0.19

### Patch Changes

- e72b839: - Add arrow components to floating UI bits
  - Rename indicators for menu `CheckboxItem` and `RadioItem`
  - Add inputs for elements that have them

## 0.0.18

### Patch Changes

- f8ffe55: - Update button events

## 0.0.17

### Patch Changes

- 3c326a2: Fix menubar kbd navigation bug

## 0.0.16

### Patch Changes

- a70a5ed: fix popover aschild
- 6ea08d1: fix button type

## 0.0.15

### Patch Changes

- 0f4cac5: Add `asChild` everywhere

## 0.0.14

### Patch Changes

- 897a55d: add disabled types to menus

## 0.0.13

### Patch Changes

- 05cdcad: Add disable prop to menu primitives

## 0.0.12

### Patch Changes

- 1b78453: Update dependencies

## 0.0.11

### Patch Changes

- ee2a6d8: remove menubar bracket

## 0.0.10

### Patch Changes

- ca0f8ed: fix radio group types

## 0.0.9

### Patch Changes

- 1b3a7d2: fix radio button type

## 0.0.8

### Patch Changes

- 0850698: Fix Select Value Bug

## 0.0.7

### Patch Changes

- 34b4346: - Add types to component events
  - Forward component events
  - Add transition options

## 0.0.6

### Patch Changes

- 7937960: update dependencies

## 0.0.5

### Patch Changes

- 2c923c5: add asChild & onChange functions

## 0.0.4

### Patch Changes

- 8219393: [Button] Remove default role
- fe27357: [Menu Primitives] Fix `sideOffset` prop

## 0.0.3

### Patch Changes

- 540c6ed: Add avatar primitive

## 0.0.2

### Patch Changes

- 141f007: Cleanup exports and peer deps
- 5e47fc9: pnpm lock sync
