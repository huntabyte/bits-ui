# bits-ui

## 2.16.0

### Minor Changes

- feat(Tooltip): introduce `tether` functionality/singleton tooltip support ([#1962](https://github.com/huntabyte/bits-ui/pull/1962))

### Patch Changes

- fix(Tooltip): resolve issue where SafePolygon wasn't respected under specific conditions ([#1962](https://github.com/huntabyte/bits-ui/pull/1962))

## 2.15.8

### Patch Changes

- perf(Popover): optimized hover tracking for openOnHover ([#1959](https://github.com/huntabyte/bits-ui/pull/1959))

- perf: reduced rapid toggle overhead by avoiding unnecessary positioning/observer work while closed ([#1959](https://github.com/huntabyte/bits-ui/pull/1959))

- perf(Tooltip): use only a single scroll listener per provider ([#1959](https://github.com/huntabyte/bits-ui/pull/1959))

- fix(Tooltip): improve hover-close reliability ([#1959](https://github.com/huntabyte/bits-ui/pull/1959))

- perf: optimize safe polygon and floating layers ([#1959](https://github.com/huntabyte/bits-ui/pull/1959))

## 2.15.7

### Patch Changes

- fix(Select): restore initial highlight in unpadded Select.Viewport ([#1956](https://github.com/huntabyte/bits-ui/pull/1956))

## 2.15.6

### Patch Changes

- fix(Dialog): remove paint containment ([#1946](https://github.com/huntabyte/bits-ui/pull/1946))

- fix(Popover): remove paint containment ([#1946](https://github.com/huntabyte/bits-ui/pull/1946))

- fix(Menu): remove paint containment ([#1946](https://github.com/huntabyte/bits-ui/pull/1946))

## 2.15.5

### Patch Changes

- fix(Tooltip): allow overriding trigger tabindex ([#1932](https://github.com/huntabyte/bits-ui/pull/1932))

- fix(Pin Input): keyboard navigation ([#1872](https://github.com/huntabyte/bits-ui/pull/1872))

- fix(ScrollArea): cleanup when pointercapture is lost ([#1935](https://github.com/huntabyte/bits-ui/pull/1935))

- fix(Accordion): allow overriding trigger tabindex ([#1932](https://github.com/huntabyte/bits-ui/pull/1932))

- fix(Presence): optimize animation detection for large DOMs ([#1924](https://github.com/huntabyte/bits-ui/pull/1924))

- fix: floating components should respect `style` prop ([#1934](https://github.com/huntabyte/bits-ui/pull/1934))

- fix(FocusScope): ensure focus scopes works with only 1 tabbable item ([#1933](https://github.com/huntabyte/bits-ui/pull/1933))

## 2.15.4

### Patch Changes

- fix(Popover): openOnHover trigger click while open behavior ([#1921](https://github.com/huntabyte/bits-ui/pull/1921))

## 2.15.3

### Patch Changes

- fix(ContextMenu): Ensure props are applied correctly when force mounted ([#1919](https://github.com/huntabyte/bits-ui/pull/1919))

## 2.15.2

### Patch Changes

- fix(Tooltip): content should not have pointer events if `disableHoverableContent` is `true` ([#1917](https://github.com/huntabyte/bits-ui/pull/1917))

## 2.15.1

### Patch Changes

- fix(Tooltip): inconsistent grace area ([#1915](https://github.com/huntabyte/bits-ui/pull/1915))

- fix(LinkPreview): inconsistent grace area ([#1915](https://github.com/huntabyte/bits-ui/pull/1915))

## 2.15.0

### Minor Changes

- feat(Popover): add `openOnHover` prop to `Popover.Trigger` ([#1913](https://github.com/huntabyte/bits-ui/pull/1913))

### Patch Changes

- fix(Checkbox): allow form submission when pressing enter on a checkbox that has `type="submit"` ([#1895](https://github.com/huntabyte/bits-ui/pull/1895))

- fix(LinkPreview): add customAnchor to LinkPreviewContent type ([#1905](https://github.com/huntabyte/bits-ui/pull/1905))

- fix(ContextMenu): Add side, sideOffset, and align ([#1911](https://github.com/huntabyte/bits-ui/pull/1911))

- fix(imports): resolve circular dependency ([#1898](https://github.com/huntabyte/bits-ui/pull/1898))

- fix: ensure scroll locking respects stable gutter ([#1914](https://github.com/huntabyte/bits-ui/pull/1914))

- fix(Menu): only call onValueChange once per change to CheckboxGroup value ([#1902](https://github.com/huntabyte/bits-ui/pull/1902))

## 2.14.4

### Patch Changes

- fix(Command): scroll initial selected into view ([#1896](https://github.com/huntabyte/bits-ui/pull/1896))

## 2.14.3

### Patch Changes

- fix(ContextMenu): allow overriding tabindex of trigger ([#1887](https://github.com/huntabyte/bits-ui/pull/1887))

- fix(Calendar, DateField, DatePicker, DateRangeField, DateRangePicker, RangeCalendar): Change default placeholder behaviour to choose the closest available value to current date, in case current date is outside of allowed range by minValue and maxValue. ([#1874](https://github.com/huntabyte/bits-ui/pull/1874))

## 2.14.2

### Patch Changes

- added $bindable to menu.root value ([#1868](https://github.com/huntabyte/bits-ui/pull/1868))
- fix(Tooltip): ensure hovering between triggers of the same provider is smooth ([#1875](https://github.com/huntabyte/bits-ui/pull/1875))

## 2.14.1

### Patch Changes

- chore: simplify internals ([#1853](https://github.com/huntabyte/bits-ui/pull/1853))

- fix(DateField): fallback to infer hour cycle from locale ([#1859](https://github.com/huntabyte/bits-ui/pull/1859))

## 2.14.0

### Minor Changes

- feat(Popover): add `Popover.Overlay` component ([#1851](https://github.com/huntabyte/bits-ui/pull/1851))

## 2.13.1

### Patch Changes

- fix(ContextMenu): left clicking the trigger when open should register as outside click event ([#1848](https://github.com/huntabyte/bits-ui/pull/1848))

## 2.13.0

### Minor Changes

- feat(Menu): expose `openDelay` prop on `*Menu.SubTrigger` to control open delay ([#1845](https://github.com/huntabyte/bits-ui/pull/1845))

## 2.12.0

### Minor Changes

- feat(AlertDialog): add nested attributes and CSS vars for better styling of nested dialogs ([#1841](https://github.com/huntabyte/bits-ui/pull/1841))

- feat(Dialog): add nested attributes and CSS vars for better styling of nested dialogs ([#1841](https://github.com/huntabyte/bits-ui/pull/1841))

## 2.11.8

### Patch Changes

- fix(Command): allow selection of the initial value when passed as the `value` prop ([#1837](https://github.com/huntabyte/bits-ui/pull/1837))

- fix(Select): prevent interrupting scroll when virtual select items are added ([#1830](https://github.com/huntabyte/bits-ui/pull/1830))

- chore: update `runed` and `svelte-toolbelt` ([#1838](https://github.com/huntabyte/bits-ui/pull/1838))

## 2.11.7

### Patch Changes

- fix(ContextMenu): not opening under certain conditions ([#1831](https://github.com/huntabyte/bits-ui/pull/1831))

## 2.11.6

### Patch Changes

- fix(DropdownMenu): focus restoration issue ([#1827](https://github.com/huntabyte/bits-ui/pull/1827))

## 2.11.5

### Patch Changes

- fix(Select): don't submit empty string when no values are selected in multiple mode ([#1816](https://github.com/huntabyte/bits-ui/pull/1816))

## 2.11.4

### Patch Changes

- fix(Combobox): recompute whether the `ScrollDown` but should render when the input value changes ([#1799](https://github.com/huntabyte/bits-ui/pull/1799))

- fix(Combobox): dont set the input value to an unselected item when `type='multiple'` ([#1799](https://github.com/huntabyte/bits-ui/pull/1799))

## 2.11.3

### Patch Changes

- fix: removed leftover console.logs in timeout-fn.ts ([#1794](https://github.com/huntabyte/bits-ui/pull/1794))

## 2.11.2

### Patch Changes

- fix(Tooltip): dont eagerly start timer ([#1791](https://github.com/huntabyte/bits-ui/pull/1791))

## 2.11.1

### Patch Changes

- fix(ContextMenu): ensure context menus respect interact outside of other dismissable layers ([#1788](https://github.com/huntabyte/bits-ui/pull/1788))

- improve(ContextMenu): allow users to override `pointer-events` style on `ContextMenu.Trigger` ([#1790](https://github.com/huntabyte/bits-ui/pull/1790))

## 2.11.0

### Minor Changes

- feat(Collapsible): add `hiddenUntilFound` prop to expand collapsible when the content matches a browser search ([#1782](https://github.com/huntabyte/bits-ui/pull/1782))

- feat(Accordion): `hiddenUntilFound` to expand on browser search match ([#1782](https://github.com/huntabyte/bits-ui/pull/1782))

### Patch Changes

- perf: optimizations ([#1777](https://github.com/huntabyte/bits-ui/pull/1777))

- fix(Tooltip): expose `strategy` prop ([#1780](https://github.com/huntabyte/bits-ui/pull/1780))

## 2.10.0

### Minor Changes

- feat(Rating Group): remove `unstable_` prefix. `RatingGroup` now considered stable. ([#1767](https://github.com/huntabyte/bits-ui/pull/1767))

### Patch Changes

- fix(Select): selected item should be in view on open ([#1765](https://github.com/huntabyte/bits-ui/pull/1765))

- fix(Combobox): selected item should be in view on open ([#1765](https://github.com/huntabyte/bits-ui/pull/1765))

## 2.9.9

### Patch Changes

- fix(Dropdown Menu): ensure menu can open on `V0+Space` when using VoiceOver on Safari/Firefox ([#1761](https://github.com/huntabyte/bits-ui/pull/1761))

## 2.9.8

### Patch Changes

- fix(DateField): ensure attribute reassignment doesn't create invalid state ([#1751](https://github.com/huntabyte/bits-ui/pull/1751))

## 2.9.7

### Patch Changes

- fix(Checkbox): ensure focus does not go to hidden input on invalid form submission ([#1750](https://github.com/huntabyte/bits-ui/pull/1750))

- fix(RadioGroup): ensure focus does not go to hidden input on invalid form submission ([#1750](https://github.com/huntabyte/bits-ui/pull/1750))

- fix(Command): ensure value is properly registered when using textContent instead of value prop ([#1748](https://github.com/huntabyte/bits-ui/pull/1748))

- fix(TimeField): include `'timeZoneName'` in `TimeSegmentPart` type ([#1744](https://github.com/huntabyte/bits-ui/pull/1744))

## 2.9.6

### Patch Changes

- fix: restore focus to element that triggered the dialog/popover ([#1729](https://github.com/huntabyte/bits-ui/pull/1729))

## 2.9.5

### Patch Changes

- fix(LinkPreview): add disabled state functionality ([#1726](https://github.com/huntabyte/bits-ui/pull/1726))

- fix: body scroll lock restoration ([#1714](https://github.com/huntabyte/bits-ui/pull/1714))

## 2.9.4

### Patch Changes

- fix(MenuCheckboxItem): ensure onchange is only called when the value changes ([#1709](https://github.com/huntabyte/bits-ui/pull/1709))

## 2.9.3

### Patch Changes

- fix(LinkPreview): ensure forceMount pointerleave doesn't open without remaining on trigger ([#1705](https://github.com/huntabyte/bits-ui/pull/1705))

## 2.9.2

### Patch Changes

- fix: handle race conditions in scroll lock / restore ([#1700](https://github.com/huntabyte/bits-ui/pull/1700))

- fix(LinkPreview): ensure grace area exists when `forceMount=true` ([#1698](https://github.com/huntabyte/bits-ui/pull/1698))

## 2.9.1

### Patch Changes

- fix(Checkbox): ensure `type='submit'` submits the form as expected ([#1691](https://github.com/huntabyte/bits-ui/pull/1691))

## 2.9.0

### Minor Changes

- feat(CheckboxGroup): add `readonly` prop/functionality ([#1688](https://github.com/huntabyte/bits-ui/pull/1688))

- feat(Checkbox): add `readonly` prop/functionality ([#1688](https://github.com/huntabyte/bits-ui/pull/1688))

### Patch Changes

- fix(Calendar): resolve race condition in month navigation ([#1686](https://github.com/huntabyte/bits-ui/pull/1686))

## 2.8.14

### Patch Changes

- fix(Menubar): ensure extension exists in import ([#1684](https://github.com/huntabyte/bits-ui/pull/1684))

- fix(Popover): ensure when using a `customAnchor`, outside interactions are properly handled ([#1679](https://github.com/huntabyte/bits-ui/pull/1679))

- fix(TimeField): ensure input value is string ([#1681](https://github.com/huntabyte/bits-ui/pull/1681))

- fix(Select): ensure required enforced when type='multiple' ([#1685](https://github.com/huntabyte/bits-ui/pull/1685))

## 2.8.13

### Patch Changes

- fix: only call onCloseAutoFocus handler if defined ([#1674](https://github.com/huntabyte/bits-ui/pull/1674))

  If popovers or other elements have been removed from the DOM, then
  onCloseAutoFocus.current may be undefined.

## 2.8.12

### Patch Changes

- fix(Checkbox): prevent default onclick to support wrapping checkboxes with labels ([#1671](https://github.com/huntabyte/bits-ui/pull/1671))

## 2.8.11

### Patch Changes

- fix(Combobox): prevent selection of last highlighted item on invalid input (#1644) ([#1646](https://github.com/huntabyte/bits-ui/pull/1646))

- fix: dont handle prevented contextmenu events ([#1645](https://github.com/huntabyte/bits-ui/pull/1645))

## 2.8.10

### Patch Changes

- fix(Menu): respect `closeOnSelect` for subitems ([#1636](https://github.com/huntabyte/bits-ui/pull/1636))

## 2.8.9

### Patch Changes

- fix(NavigationMenu): Ensure MenuItem ref is bindable ([#1629](https://github.com/huntabyte/bits-ui/pull/1629))

- chore: update `runed` and `svelte-toolbelt` to resolve issues with default exports ([#1631](https://github.com/huntabyte/bits-ui/pull/1631))

## 2.8.8

### Patch Changes

- fix(Checkbox): only call onValueChange once per change to CheckboxGroup value ([#1620](https://github.com/huntabyte/bits-ui/pull/1620))

## 2.8.7

### Patch Changes

- fix(Calendar): ensure days are disabled when outside month and `disableDaysOutsideMonth` ([#1619](https://github.com/huntabyte/bits-ui/pull/1619))

- fix(Checkbox): ensure `Checkbox.Group` `onValueChange` isn't called more than once per change ([#1617](https://github.com/huntabyte/bits-ui/pull/1617))

## 2.8.6

### Patch Changes

- fix(ScrollArea): use correct ref for thumbs ([#1615](https://github.com/huntabyte/bits-ui/pull/1615))

## 2.8.5

### Patch Changes

- fix(Command): Ensure selected item is visible when command is in grid mode ([#1610](https://github.com/huntabyte/bits-ui/pull/1610))

## 2.8.4

### Patch Changes

- fix: replace `css.escape` to prevent `this` issue ([#1608](https://github.com/huntabyte/bits-ui/pull/1608))

## 2.8.3

### Patch Changes

- fix: ensure node ids are updated properly ([#1605](https://github.com/huntabyte/bits-ui/pull/1605))

## 2.8.2

### Patch Changes

- perf: stable attachments ([#1599](https://github.com/huntabyte/bits-ui/pull/1599))

## 2.8.1

### Patch Changes

- fix(ContextMenu): support portalling `ContextMenu.SubContent` ([#1591](https://github.com/huntabyte/bits-ui/pull/1591))

- fix(FocusScope): decouple `onCloseAutoFocus` and `onOpenAutoFocus` from `trapFocus` conditional ([#1591](https://github.com/huntabyte/bits-ui/pull/1591))

- fix: issue where `ref` would become `null` during state transitions ([#1591](https://github.com/huntabyte/bits-ui/pull/1591))

- fix(DropdownMenu): support portalling `DropdownMenu.SubContent` ([#1591](https://github.com/huntabyte/bits-ui/pull/1591))

## 2.8.0

### Minor Changes

- feat(ContextMenu): add `onOpenChangeComplete` prop which is called after the open/close animations have finished ([#1589](https://github.com/huntabyte/bits-ui/pull/1589))

- feat(Combobox): add `onOpenChangeComplete` prop which is called after the open/close animations have finished ([#1589](https://github.com/huntabyte/bits-ui/pull/1589))

- feat(AlertDialog): add `onOpenChangeComplete` prop which is called after the open/close animations have finished ([#1589](https://github.com/huntabyte/bits-ui/pull/1589))

- feat(Collapsible): add `onOpenChangeComplete` prop which is called after the open/close animations have finished ([#1589](https://github.com/huntabyte/bits-ui/pull/1589))

- feat(Select): add `onOpenChangeComplete` prop which is called after the open/close animations have finished ([#1589](https://github.com/huntabyte/bits-ui/pull/1589))

- feat(LinkPreview): add `onOpenChangeComplete` prop which is called after the open/close animations have finished ([#1589](https://github.com/huntabyte/bits-ui/pull/1589))

- feat(Dialog): add `onOpenChangeComplete` prop which is called after the open/close animations have finished ([#1589](https://github.com/huntabyte/bits-ui/pull/1589))

- feat(DateRangePicker): add `onOpenChangeComplete` prop which is called after the open/close animations have finished ([#1589](https://github.com/huntabyte/bits-ui/pull/1589))

- feat(DatePicker): add `onOpenChangeComplete` prop which is called after the open/close animations have finished ([#1589](https://github.com/huntabyte/bits-ui/pull/1589))

- feat(Popover): add `onOpenChangeComplete` prop which is called after the open/close animations have finished ([#1589](https://github.com/huntabyte/bits-ui/pull/1589))

- feat(DropdownMenu): add `onOpenChangeComplete` prop which is called after the open/close animations have finished ([#1589](https://github.com/huntabyte/bits-ui/pull/1589))

- feat(Tooltip): add `onOpenChangeComplete` prop which is called after the open/close animations have finished ([#1589](https://github.com/huntabyte/bits-ui/pull/1589))

### Patch Changes

- perf: simplify/optimize internals ([#1586](https://github.com/huntabyte/bits-ui/pull/1586))

## 2.7.0

### Minor Changes

- feat(RadioGroup): add `readonly` prop to make the `RadioGroup` readonly ([#1579](https://github.com/huntabyte/bits-ui/pull/1579))

### Patch Changes

- fix(Select): ensure the disabled prop is respect for touch events ([#1582](https://github.com/huntabyte/bits-ui/pull/1582))

## 2.6.2

### Patch Changes

- fix: ensure body styles aren't touched when `preventScroll={false}` ([#1577](https://github.com/huntabyte/bits-ui/pull/1577))

## 2.6.1

### Patch Changes

- fix: Expose `data-orientation` on `Tabs.Content` ([#1571](https://github.com/huntabyte/bits-ui/pull/1571))

## 2.6.0

### Minor Changes

- feat(Command): add `disableInitialScroll` prop to `Command.Root` to prevent undesired scrolling on initial mount ([#1548](https://github.com/huntabyte/bits-ui/pull/1548))

- feat(command): Add `columns` prop for grid functionality ([#1548](https://github.com/huntabyte/bits-ui/pull/1548))

## 2.5.0

### Minor Changes

- feat(RangeCalendar): add `minDays` and `maxDays` props to require min/max number days in a range ([#1558](https://github.com/huntabyte/bits-ui/pull/1558))

- feat(RangeCalendar): add `excludeDisabled` prop that when `true`, will reset the range if it includes a disabled date ([#1558](https://github.com/huntabyte/bits-ui/pull/1558))

- feat(Calendar): add `maxDays` prop to limit the number of days that can be selected when `type="multiple"` ([#1558](https://github.com/huntabyte/bits-ui/pull/1558))

- feat(RangeCalendar): add `data-range-middle` attribute to `Day` and `Cell` components to indicate items within the selected range, but not the start or end. Useful for conditional styling. ([#1558](https://github.com/huntabyte/bits-ui/pull/1558))

- feat(Select): expose `autocomplete` prop on `Select.Root` for passing `autocomplete` attribute to the hidden input ([#1547](https://github.com/huntabyte/bits-ui/pull/1547))

### Patch Changes

- fix(RangeCalendar): ensure props are synced with months ([#1558](https://github.com/huntabyte/bits-ui/pull/1558))

- fix(Calendar): issue where props weren't being synced with the months ([#1558](https://github.com/huntabyte/bits-ui/pull/1558))

## 2.4.1

### Patch Changes

- fix(FloatingComponents): ensure bad coordinates aren't used when anchor becomes hidden/removed ([#1546](https://github.com/huntabyte/bits-ui/pull/1546))

- fix(Slider): shadow DOM support ([#1544](https://github.com/huntabyte/bits-ui/pull/1544))

## 2.4.0

### Minor Changes

- feat: introduce `BitsConfig` provider component for globally configuring default component props via context. ([#1530](https://github.com/huntabyte/bits-ui/pull/1530))

### Patch Changes

- fix(Select): ensure typeahead enabled state is reactive to item updates ([#1540](https://github.com/huntabyte/bits-ui/pull/1540))

## 2.3.1

### Patch Changes

- fix(rating-group): Ensure `data-state` reflects value when showing preview ([#1533](https://github.com/huntabyte/bits-ui/pull/1533))

## 2.3.0

### Minor Changes

- feat: Introduce experimental [RatingGroup](https://bits-ui.com/docs/components/rating-group) component, exported as `unstable_RatingGroup` pending API stabilization and community feedback. ([#1525](https://github.com/huntabyte/bits-ui/pull/1525))

## 2.2.1

### Patch Changes

- fix(Tooltip): ensure `Tooltip.Trigger`s can be composed with other floating component triggers ([#1527](https://github.com/huntabyte/bits-ui/pull/1527))

- fix(Slider): ensure floating point precision aligns with step ([#1529](https://github.com/huntabyte/bits-ui/pull/1529))

## 2.2.0

### Minor Changes

- feat(Combobox): expose `inputValue` prop on `Combobox.Root` to synchronize input value with programmatic updates to the value from outside Bits UI ([#1517](https://github.com/huntabyte/bits-ui/pull/1517))

### Patch Changes

- fix: Support Shadow DOM ([#1515](https://github.com/huntabyte/bits-ui/pull/1515))

## 2.1.0

(Had to publish 2.1.0 instead of 2.0.0 as someone published 2.0.x to NPM many years ago)

### Major Changes

- breaking: bump minimum Svelte peer dependency to `^5.33.0` to support [Attachments](https://svelte.dev/docs/svelte/svelte-attachments) and ][$props.id()](<https://svelte.dev/docs/svelte/$props#$props.id()>). ([#1494](https://github.com/huntabyte/bits-ui/pull/1494))

- breaking: `@internationalized/date` is now a required peer dependency. ([#1494](https://github.com/huntabyte/bits-ui/pull/1494))

### Minor Changes

- feat(Slider): add `Slider.ThumbLabel` for rendering a label positioned relative to a `Slider.Thumb`. ([#1494](https://github.com/huntabyte/bits-ui/pull/1494))

- feat(Slider): add `Slider.TickLabel` for rendering a label positioned relative to a `Slider.Tick`. ([#1494](https://github.com/huntabyte/bits-ui/pull/1494))

- feat(Slider): introduce `tickItems` snippet prop to `Slider.Root` as a replacement for `ticks` which is now deprecated. Prefer `tickItems` going forward. ([#1494](https://github.com/huntabyte/bits-ui/pull/1494))

- feat(Slider): support discrete step values via `steps`: `number[] | number` on `Slider.Root`. If an array is passed, it defines the selectable values directly, and `min`/`max` default to the array's bounds. ([#1494](https://github.com/huntabyte/bits-ui/pull/1494))

- feat: add `TimeField` component for time input with segmented control and full keyboard support. ([#1494](https://github.com/huntabyte/bits-ui/pull/1494))

- feat(Slider): introduce the `tickItems` snippet prop on `Slider.Root` as a replacement for the now-deprecated `ticks`, enabling a more flexible API that better supports rendering `TickLabels`. Prefer `tickItems` going forward. ([#1494](https://github.com/huntabyte/bits-ui/pull/1494))

- feat: add `TimeRangeField` component for selecting a start and end time. ([#1494](https://github.com/huntabyte/bits-ui/pull/1494))

- feat(Slider): introduce the `thumbItems` snippet prop on `Slider.Root` as a replacement for the now-deprecated `thumbs`, enabling a more flexible API that better supports rendering `ThumbLabels`. Prefer `thumbItems` going forward. ([#1494](https://github.com/huntabyte/bits-ui/pull/1494))

- feat(Slider): add `trackPadding` prop to `Slider.Root` as an SSR-friendly alternative to `thumbPositioning="contain"`, which requires client-side measurement. ([#1494](https://github.com/huntabyte/bits-ui/pull/1494))

### Patch Changes

- fix(Button): add missing fallback to `null` for `ref` prop to align with other components. ([#1494](https://github.com/huntabyte/bits-ui/pull/1494))

## 1.8.0

### Minor Changes

- feat(Slider): `thumbPositioning` for more granular control of thumb positioning ([#1470](https://github.com/huntabyte/bits-ui/pull/1470))

### Patch Changes

- fix(NavigationMenu): moving from submenu trigger to menu item in the same menu should close the submenu ([#1489](https://github.com/huntabyte/bits-ui/pull/1489))

- feat(NavigationMenu): `openOnHover` prop to control whether menu items open on hover or not ([#1491](https://github.com/huntabyte/bits-ui/pull/1491))

- fix(NavigationMenu): issues with non-viewport transitions ([#1489](https://github.com/huntabyte/bits-ui/pull/1489))

## 1.7.0

### Minor Changes

- feat(DropdownMenu): new `DropdownMenu.CheckboxGroup` component ([#1486](https://github.com/huntabyte/bits-ui/pull/1486))

- feat(ContextMenu): new `ContextMenu.CheckboxGroup` component ([#1486](https://github.com/huntabyte/bits-ui/pull/1486))

- feat(Menubar): new `Menubar.CheckboxGroup` component ([#1486](https://github.com/huntabyte/bits-ui/pull/1486))

### Patch Changes

- fix(Select): ensure scroll buttons render on subsequent mounts ([#1484](https://github.com/huntabyte/bits-ui/pull/1484))

- fix(Combobox): ensure scroll buttons render on subsequent mounts ([#1484](https://github.com/huntabyte/bits-ui/pull/1484))

## 1.6.1

### Patch Changes

- fix(Tooltip): ensure only one tooltip within a Provider can be open at a time ([#1481](https://github.com/huntabyte/bits-ui/pull/1481))

- fix(Command): replace `encodeURIComponent` with `css.escape` for attribute values ([#1482](https://github.com/huntabyte/bits-ui/pull/1482))

## 1.6.0

### Minor Changes

- feat(Slider): expose thumb `active` state ([#1471](https://github.com/huntabyte/bits-ui/pull/1471))

### Patch Changes

- fix(DateRangeField): ensure prepopulated value takes priority over placeholder for validation ([#1479](https://github.com/huntabyte/bits-ui/pull/1479))

- fix(NavigationMenu): do not close `Sub` content when clicking the trigger ([#1473](https://github.com/huntabyte/bits-ui/pull/1473))

- fix(NavigationMenu): render `Content` without `Viewport` ([#1474](https://github.com/huntabyte/bits-ui/pull/1474))

- fix(DateField): ensure prepopulated value takes priority over placeholder for validation ([#1479](https://github.com/huntabyte/bits-ui/pull/1479))

## 1.5.3

### Patch Changes

- chore: remove internal uses of parameter properties ([#1466](https://github.com/huntabyte/bits-ui/pull/1466))

## 1.5.2

### Patch Changes

- fix(RangeCalendar): ensure `weekStartsOn` is absolute and fallback to locale if not provided ([#1462](https://github.com/huntabyte/bits-ui/pull/1462))

- fix(DateRangePicker): use current field to determine max days in month ([#1460](https://github.com/huntabyte/bits-ui/pull/1460))

- fix(DateRangePicker): ensure `weekStartsOn` is absolute and fallback to locale if not provided ([#1462](https://github.com/huntabyte/bits-ui/pull/1462))

- fix(DatePicker): ensure `weekStartsOn` is absolute and fallback to locale if not provided ([#1462](https://github.com/huntabyte/bits-ui/pull/1462))

- fix(Calendar): ensure `weekStartsOn` is absolute and fallback to locale if not provided ([#1462](https://github.com/huntabyte/bits-ui/pull/1462))

- fix(DateRangeField): use current field to determine max days in month ([#1460](https://github.com/huntabyte/bits-ui/pull/1460))

## 1.5.1

### Patch Changes

- fix(NavigationMenu): allow roving focus to link items ([#1457](https://github.com/huntabyte/bits-ui/pull/1457))

## 1.5.0

### Minor Changes

- feat(Menu): add `onSelect` for SubTrigger ([#1454](https://github.com/huntabyte/bits-ui/pull/1454))

### Patch Changes

- fix(ScrollArea): ensure thumb properly restores previous position ([#1455](https://github.com/huntabyte/bits-ui/pull/1455))

- fix(DatePicker): export `Portal` parts ([#1451](https://github.com/huntabyte/bits-ui/pull/1451))

- fix(Menu): remove unused `closeOnSelect` prop from SubTrigger components ([#1453](https://github.com/huntabyte/bits-ui/pull/1453))

## 1.4.8

### Patch Changes

- fix(Checkbox): ensure Checkbox.Group value setter is called ([#1440](https://github.com/huntabyte/bits-ui/pull/1440))

## 1.4.7

### Patch Changes

- fix(Multiple): ensure `preventOverflowTextSelection` prop is applied ([#1435](https://github.com/huntabyte/bits-ui/pull/1435))

## 1.4.6

### Patch Changes

- fix(Command): fallback to id when no group value ([#1428](https://github.com/huntabyte/bits-ui/pull/1428))

## 1.4.5

### Patch Changes

- fix(Command): ensure groups without headings have a fallback ([#1425](https://github.com/huntabyte/bits-ui/pull/1425))

## 1.4.4

### Patch Changes

- fix(Dialog): ensure `role="heading"` exists on title ([#1420](https://github.com/huntabyte/bits-ui/pull/1420))

## 1.4.3

### Patch Changes

- fix(DateRangeField): do not update start date automatically ([#1406](https://github.com/huntabyte/bits-ui/pull/1406))

- fix(DateRangePicker): do not update start date automatically ([#1406](https://github.com/huntabyte/bits-ui/pull/1406))

## 1.4.2

### Patch Changes

- fix(Dialog): ensure conditional content doesn't break nested focus ([#1410](https://github.com/huntabyte/bits-ui/pull/1410))

- fix(Command): ensure asynchronously loaded items register properly ([#1405](https://github.com/huntabyte/bits-ui/pull/1405))

- fix(Command): list restoration after empty state ([#1405](https://github.com/huntabyte/bits-ui/pull/1405))

## 1.4.1

### Patch Changes

- fix(Multiple Components): ensure default values are set if entire spread props object is reassigned outside the component ([#1401](https://github.com/huntabyte/bits-ui/pull/1401))

- fix(Command): ensure `onValueChange` only fires when the value changes ([#1403](https://github.com/huntabyte/bits-ui/pull/1403))

- fix(Select): ensure typeahead ignores leading and trailing spaces ([#1399](https://github.com/huntabyte/bits-ui/pull/1399))

- fix(Select): disabled items should not be highlighted ([#1399](https://github.com/huntabyte/bits-ui/pull/1399))

## 1.4.0

### Minor Changes

- feat(Combobox): add `delay` prop to scroll buttons for custom scroll delay ([#1395](https://github.com/huntabyte/bits-ui/pull/1395))

- feat(Select): add `delay` prop to scroll buttons for custom scroll delay ([#1395](https://github.com/huntabyte/bits-ui/pull/1395))

### Patch Changes

- fix(Slider): update tick position calculation for consistent scaling ([#1375](https://github.com/huntabyte/bits-ui/pull/1375))

- chore(Popover): export `PopoverPortalPropsWithoutHTML` from Popover types ([#1397](https://github.com/huntabyte/bits-ui/pull/1397))

- fix(FocusScope): safely call onCloseAutoFocus handler if defined ([#1366](https://github.com/huntabyte/bits-ui/pull/1366))

- fix(Select): ensure `scrollAlignment` prop is used (if provided) when scrolling ([#1390](https://github.com/huntabyte/bits-ui/pull/1390))

## 1.3.19

### Patch Changes

- fix(Calendar): ensure time set outside persists when new day is selected ([#1359](https://github.com/huntabyte/bits-ui/pull/1359))

- fix(Command): ensure filtered is always defined, even if not filtering ([#1363](https://github.com/huntabyte/bits-ui/pull/1363))

- fix(Calendar): ensure default value is not a string ([#1362](https://github.com/huntabyte/bits-ui/pull/1362))

## 1.3.18

### Patch Changes

- fix: bug with date formatting in date-value attribute ([#1347](https://github.com/huntabyte/bits-ui/pull/1347))

## 1.3.17

### Patch Changes

- fix(Pagination): ensure `range.start` starts at 1 instead of 0 ([#1354](https://github.com/huntabyte/bits-ui/pull/1354))

- fix(Avatar): fix invalid display style being applied to fallback ([#1352](https://github.com/huntabyte/bits-ui/pull/1352))

## 1.3.16

### Patch Changes

- fix(Slider): Prevent Thumb from exceeding track bounds ([#1338](https://github.com/huntabyte/bits-ui/pull/1338))

## 1.3.15

### Patch Changes

- fix(Select): enable space support in typeahead logic ([#1335](https://github.com/huntabyte/bits-ui/pull/1335))

- fix(Command): command sort only once per tick ([#1321](https://github.com/huntabyte/bits-ui/pull/1321))

## 1.3.14

### Patch Changes

- fix(Menubar): Add `onOpenChange` prop to `<Menubar.Menu/>` ([#1324](https://github.com/huntabyte/bits-ui/pull/1324))

## 1.3.13

### Patch Changes

- fix(Context Menu): forward `trapFocus` prop ([#1303](https://github.com/huntabyte/bits-ui/pull/1303))

## 1.3.12

### Patch Changes

- fix(Radio Group): ensure currently selected value receives focus when entering radio group via tab ([#1296](https://github.com/huntabyte/bits-ui/pull/1296))

- fix(Command): ensure original order is properly restored when search is cleared ([#1293](https://github.com/huntabyte/bits-ui/pull/1293))

## 1.3.11

### Patch Changes

- fix(Command): ensure correct `aria-activedescendant` is applied to `Command.Input` ([#1288](https://github.com/huntabyte/bits-ui/pull/1288))

- improve(Combobox): add `aria-multiselectable` attribute to the content when type is `multiple` ([#1288](https://github.com/huntabyte/bits-ui/pull/1288))

- fix(AlertDialog): ensure `AlertDialog.Content` receives focus first on open to read alert title/description to screen readers ([#1288](https://github.com/huntabyte/bits-ui/pull/1288))

- fix(Context Menu): ensure `onOpenAutoFocus` prop is exposed and forwarded ([#1291](https://github.com/huntabyte/bits-ui/pull/1291))

- improve(Select): add `aria-multiselectable` attribute to the content when type is `multiple` ([#1288](https://github.com/huntabyte/bits-ui/pull/1288))

## 1.3.10

### Patch Changes

- fix: accessibility issues on `Select.Trigger` ([#1285](https://github.com/huntabyte/bits-ui/pull/1285))

## 1.3.9

### Patch Changes

- fix: expose `customAnchor` type for `Tooltip.Content` props ([#1280](https://github.com/huntabyte/bits-ui/pull/1280))

## 1.3.8

### Patch Changes

- fix: menubar focus restore on escape ([#1277](https://github.com/huntabyte/bits-ui/pull/1277))

## 1.3.7

### Patch Changes

- fix: multiple submenus in the same menu being open at the same time if too close ([#1275](https://github.com/huntabyte/bits-ui/pull/1275))

- chore: cleanup `MenubarContent` internals ([#1271](https://github.com/huntabyte/bits-ui/pull/1271))

## 1.3.6

### Patch Changes

- fix(Calendar): ensure outside days are not focusable when `disableOutsideDays` is `true` ([#1264](https://github.com/huntabyte/bits-ui/pull/1264))

- fix(Range Calendar): ensure outside days are not focusable when `disableOutsideDays` is `true` ([#1264](https://github.com/huntabyte/bits-ui/pull/1264))

- fix: ensure default placeholder is not a disabled date, which would prevent users from navigating the calendar using tab/keyboard ([#1264](https://github.com/huntabyte/bits-ui/pull/1264))

## 1.3.5

### Patch Changes

- fix: Checkboxes within a group not reflecting correct `checked` state during SSR ([#1254](https://github.com/huntabyte/bits-ui/pull/1254))

## 1.3.4

### Patch Changes

- fix: ensure all hidden inputs are not in the tab order ([#1245](https://github.com/huntabyte/bits-ui/pull/1245))

## 1.3.3

### Patch Changes

- fix: `Switch` hidden input receiving focus ([#1243](https://github.com/huntabyte/bits-ui/pull/1243))

## 1.3.2

### Patch Changes

- fix: `Select.Trigger` toggle on touch devices ([#1219](https://github.com/huntabyte/bits-ui/pull/1219))

- fix: `Popover.Trigger` receiving focusable when closed with outside click ([#1218](https://github.com/huntabyte/bits-ui/pull/1218))

## 1.3.1

### Patch Changes

- fix: issue where selected item in select/combobox wouldnt scroll into view if scroll down button was present on open ([#1209](https://github.com/huntabyte/bits-ui/pull/1209))

- fix: Include `data-button-root` on `<Button/>` ([#1212](https://github.com/huntabyte/bits-ui/pull/1212))

- fix: `Select.Trigger` receiving `focus-visible` even though it was never interacted with via keyboard ([#1209](https://github.com/huntabyte/bits-ui/pull/1209))

## 1.3.0

### Minor Changes

- New Component: `Meter` [documentation](https://bits-ui.com/docs/components/meter) ([#1199](https://github.com/huntabyte/bits-ui/pull/1199))

### Patch Changes

- fix: issue where `RadioGroup` tabindex wasn't calculated before other focus logic kicks in, causing a value to be unintentionally overwritten ([#1200](https://github.com/huntabyte/bits-ui/pull/1200))

## 1.2.1

### Patch Changes

- fix: issue where `Dialog` would apply `:focus-visible` to trigger on close, even if opened and closed via pointer ([#1197](https://github.com/huntabyte/bits-ui/pull/1197))

- fix: `DateRangePicker` not allowing range selection under certain value conditions ([#1195](https://github.com/huntabyte/bits-ui/pull/1195))

## 1.2.0

### Minor Changes

- feat: expose `min` prop on `Progress.Root` to specify a custom minimum value for the progress bar (defaults to `0`) ([#1193](https://github.com/huntabyte/bits-ui/pull/1193))

- feat: apply `data-indeterminate` to `Progress.Root` when the `value` is `null` for easier styling of indeterminate state ([#1193](https://github.com/huntabyte/bits-ui/pull/1193))

- feat: apply `data-min` attribute to `Progress.Root` for custom styling based on the minimum value of the progress bar ([#1193](https://github.com/huntabyte/bits-ui/pull/1193))

### Patch Changes

- fix: don't apply `aria-valuenow` and `data-value` attributes when `Progress.Root`'s `value === null` ([#1193](https://github.com/huntabyte/bits-ui/pull/1193))

- fix: remove invalid `max` attribute applied to the `Progress.Root` element as it is redundant to `aria-valuemax` ([#1193](https://github.com/huntabyte/bits-ui/pull/1193))

- fix: bug causing `disableCloseOnTriggerClick` to not be respected in `Tooltip` ([#1191](https://github.com/huntabyte/bits-ui/pull/1191))

- fix: removed improperly exposed/unused `onCloseAutoFocus` prop from `Combobox.Content/ContentStatic` and `Select.Content/ContentStatic` ([#1191](https://github.com/huntabyte/bits-ui/pull/1191))

- fix: change `Progress.Root` `role` from `"meter"` to `"progressbar"` to improve accessibility ([#1193](https://github.com/huntabyte/bits-ui/pull/1193))

## 1.1.0

_(NPM doesn't allow us to publish 1.0.0)_

Bits UI v1 (Svelte 5). This release includes many breaking changes, bug fixes, and new features. ([#690](https://github.com/huntabyte/bits-ui/pull/690))

Please see the [Migration Guide](https://bits-ui.com/docs/migration-guide) and [Documentation](https://bits-ui.com/docs) to learn more.

## 1.0.0-next.98

### Patch Changes

- breaking: rename `PinInput` `onPaste` to `pasteTransformer` ([#1152](https://github.com/huntabyte/bits-ui/pull/1152))

## 1.0.0-next.97

### Patch Changes

- fix: use `getAttribute("style")` instead of `getComputedStyle()` when restoring styles on body scroll lock removal ([#1045](https://github.com/huntabyte/bits-ui/pull/1045))

## 1.0.0-next.96

### Patch Changes

- feat: expose imperative methods on `Command.Root` for more advanced use cases ([#1141](https://github.com/huntabyte/bits-ui/pull/1141))

## 1.0.0-next.95

### Patch Changes

- fix: `Checkbox.Group` not firing `onValueChange` ([#1146](https://github.com/huntabyte/bits-ui/pull/1146))

## 1.0.0-next.94

### Patch Changes

- fix: `onStateChange` of `Command.Root` not firing after initial mount ([#1138](https://github.com/huntabyte/bits-ui/pull/1138))

## 1.0.0-next.93

### Patch Changes

- fix: infinite loops caused by rapid open/close of nested focus scopes ([#1132](https://github.com/huntabyte/bits-ui/pull/1132))

- fix: tooltip not closing when pointer leave ([#1133](https://github.com/huntabyte/bits-ui/pull/1133))

## 1.0.0-next.92

### Patch Changes

- feat: export `computeCommandScore` for use in custom Command filters ([#1127](https://github.com/huntabyte/bits-ui/pull/1127))

## 1.0.0-next.91

### Patch Changes

- feat: Navigation Menu Submenu support ([#1001](https://github.com/huntabyte/bits-ui/pull/1001))

- fix: forward user-defined `Menubar.Content` props ([#1123](https://github.com/huntabyte/bits-ui/pull/1123))

- fix: issues with select/combobox highlighted for mobile ([#1124](https://github.com/huntabyte/bits-ui/pull/1124))

- fix: bug causing focus scopes to conflict ([#1123](https://github.com/huntabyte/bits-ui/pull/1123))

## 1.0.0-next.90

### Patch Changes

- feat: add `clearOnDeselect` prop to `Combobox.Input` to clear the input's value when the last (multiple) or only (single) item is deselected. ([#1118](https://github.com/huntabyte/bits-ui/pull/1118))

## 1.0.0-next.89

### Patch Changes

- fix: Menu grace areas to enable top/bottom submenus ([#1114](https://github.com/huntabyte/bits-ui/pull/1114))

## 1.0.0-next.88

### Patch Changes

- fix: allow tabbing out of menus to previous and next tabbable item in the dom ([#1111](https://github.com/huntabyte/bits-ui/pull/1111))

## 1.0.0-next.87

### Patch Changes

- fix: click events firing on elements behind the content when selecting Combobox.Item ([#1109](https://github.com/huntabyte/bits-ui/pull/1109))

## 1.0.0-next.86

### Patch Changes

- fix: Pin Input allowing paste on non-matching ([#1101](https://github.com/huntabyte/bits-ui/pull/1101))

## 1.0.0-next.85

### Patch Changes

- fix: Pin Input paste behavior ([#1096](https://github.com/huntabyte/bits-ui/pull/1096))

## 1.0.0-next.84

### Patch Changes

- fix: RangeCalendar allow selecting `maxValue` as complete range ([#1091](https://github.com/huntabyte/bits-ui/pull/1091))

- fix: Dialog/Popover clientX/Y detection to prevent password managers and other injected elements from closing the dialog when pressed ([#1089](https://github.com/huntabyte/bits-ui/pull/1089))

## 1.0.0-next.83

### Patch Changes

- fix: Pin Input paste behavior ([#1085](https://github.com/huntabyte/bits-ui/pull/1085))

- fix: Select/Combo scroll ([#1083](https://github.com/huntabyte/bits-ui/pull/1083))

## 1.0.0-next.82

### Patch Changes

- fix issue with default `open` and `disabled` Portal ([#1080](https://github.com/huntabyte/bits-ui/pull/1080))

## 1.0.0-next.81

### Patch Changes

- update `runed` to support Astro builds ([#1078](https://github.com/huntabyte/bits-ui/pull/1078))

## 1.0.0-next.80

### Patch Changes

- fix: clean up event listeners for menus ([#1071](https://github.com/huntabyte/bits-ui/pull/1071))

- fix(RangeCalendar): allow `value` to be cleared ([#1075](https://github.com/huntabyte/bits-ui/pull/1075))

## 1.0.0-next.79

### Patch Changes

- fix: floating focus loops ([#1072](https://github.com/huntabyte/bits-ui/pull/1072))

## 1.0.0-next.78

### Patch Changes

- Allow `<Button/>` with `href` to be disabled. ([#1055](https://github.com/huntabyte/bits-ui/pull/1055))

- BREAKING: `Select` - change default value of `allowDeselect` to `false` to align with native HTML `<select>` ([#1049](https://github.com/huntabyte/bits-ui/pull/1049))

- fix: ensure `disabled` is passed through to `Dialog.Trigger` and `Dialog.Close` ([#1057](https://github.com/huntabyte/bits-ui/pull/1057))

## 1.0.0-next.77

### Patch Changes

- breaking: remove `controlled<State>` props in favor of Svelte's [Function Bindings](https://svelte.dev/docs/svelte/bind#Function-bindings) ([#1034](https://github.com/huntabyte/bits-ui/pull/1034))

## 1.0.0-next.76

### Patch Changes

- breaking: `Slider.Root` now requires a `type` prop to specify whether the slider should be a `"single"` or `"multiple"` slider, which determines whether the value and change function arguments should be of type `number` or `number[]` ([#1032](https://github.com/huntabyte/bits-ui/pull/1032))

- fix: `Popover` trigger close detection ([#1030](https://github.com/huntabyte/bits-ui/pull/1030))

- Dialog/Alert Dialog: change `Dialog.Close` and `AlertDialog.Cancel` events from `pointerdown` to `click` ([#1028](https://github.com/huntabyte/bits-ui/pull/1028))

## 1.0.0-next.75

### Patch Changes

- fix: expose `updatePositionStrategy` prop for tooltip content ([#1026](https://github.com/huntabyte/bits-ui/pull/1026))

- cleanup internals, update Svelte ([#1024](https://github.com/huntabyte/bits-ui/pull/1024))

## 0.22.0

### Minor Changes

- Resolves peer dependency issues for Svelte 5 projects ([#868](https://github.com/huntabyte/bits-ui/pull/868))

## 1.0.0-next.74

### Patch Changes

- revert to `onclick` events for most components except where it makes sense (like menus, select, etc.) ([#1011](https://github.com/huntabyte/bits-ui/pull/1011))

## 1.0.0-next.73

### Patch Changes

- Update Svelte `peerDependency` from `^5.0.0-next.1` to `^5.0.0` ([#869](https://github.com/huntabyte/bits-ui/pull/869))

## 1.0.0-next.72

### Minor Changes

- feat: `Checkbox.Group` and `Checkbox.GroupLabel` components ([#1003](https://github.com/huntabyte/bits-ui/pull/1003))

## 1.0.0-next.71

### Patch Changes

- fix: `Command` arrow navigation after empty state displayed ([#997](https://github.com/huntabyte/bits-ui/pull/997))

## 1.0.0-next.70

### Patch Changes

- feat: add `onStateChange` callback to `Command` component ([#972](https://github.com/huntabyte/bits-ui/pull/972))

- BREAKING: Update `child` snippet behavior of Floating UI-based `Content` components ([#994](https://github.com/huntabyte/bits-ui/pull/994))

- fix: issue where you were unable to navigate to the previous menu from within a menu of the menubar via arrow keys ([#990](https://github.com/huntabyte/bits-ui/pull/990))

- perf: optimize command methods ([#992](https://github.com/huntabyte/bits-ui/pull/992))

## 1.0.0-next.69

### Patch Changes

- fix: allow resetting `DateField` value ([#988](https://github.com/huntabyte/bits-ui/pull/988))

- optimize classes via prototype bindings ([#986](https://github.com/huntabyte/bits-ui/pull/986))

## 1.0.0-next.68

### Patch Changes

- fix: `avoidCollisions` in Floating UI components ([#984](https://github.com/huntabyte/bits-ui/pull/984))

## 1.0.0-next.67

### Patch Changes

- fix: allow `Select` to handle empty string values via keyboard ([#979](https://github.com/huntabyte/bits-ui/pull/979))

## 1.0.0-next.66

### Patch Changes

- fix: make `open` prop of `DateRangePicker` and `DatePicker` `$bindable` ([#975](https://github.com/huntabyte/bits-ui/pull/975))

## 1.0.0-next.65

### Patch Changes

- improve export strategy ([#966](https://github.com/huntabyte/bits-ui/pull/966))

## 1.0.0-next.64

### Patch Changes

- fix: only submit values with `FormData` on Combobox/Select `type="multiple"` if a value is selected to align with native `<select multiple>` behavior ([#961](https://github.com/huntabyte/bits-ui/pull/961))

## 1.0.0-next.63

### Patch Changes

- fix: export `Portal` from `Menubar` namespace ([#955](https://github.com/huntabyte/bits-ui/pull/955))

## 1.0.0-next.62

### Patch Changes

- DropdownMenu.Trigger `type="button"` by default ([#953](https://github.com/huntabyte/bits-ui/pull/953))

## 1.0.0-next.61

### Patch Changes

- `DropdownMenu.Trigger` should default to `type="button"` while enabling users to override via the `type` prop ([#951](https://github.com/huntabyte/bits-ui/pull/951))

- fix: `TabTrigger` default tabindex handling ([#949](https://github.com/huntabyte/bits-ui/pull/949))

## 1.0.0-next.60

### Patch Changes

- fix: DateField 24 hour cycling ([#945](https://github.com/huntabyte/bits-ui/pull/945))

- fix: issue causing labels associated with radio group items not to select the item ([#943](https://github.com/huntabyte/bits-ui/pull/943))

## 1.0.0-next.59

### Patch Changes

- fix: radio group onValueChange loop ([#939](https://github.com/huntabyte/bits-ui/pull/939))

## 1.0.0-next.58

### Patch Changes

- fix: cleanup focus scope handlers ([#936](https://github.com/huntabyte/bits-ui/pull/936))

- Allow users to override the `type` attribute on `Checkbox.Root` ([#934](https://github.com/huntabyte/bits-ui/pull/934))

- fix: Dialog buttons not responding on certain mobile platforms ([#937](https://github.com/huntabyte/bits-ui/pull/937))

## 1.0.0-next.57

### Patch Changes

- fix: Avatar should render fallback if src is updated and is `null`/`undefined` ([#929](https://github.com/huntabyte/bits-ui/pull/929))

## 1.0.0-next.56

### Patch Changes

- fix: don't auto select first radio item unless there is already a selected value ([#927](https://github.com/huntabyte/bits-ui/pull/927))

## 1.0.0-next.55

### Patch Changes

- fix: `Select` and `Combobox` infinite loop on item selection ([#925](https://github.com/huntabyte/bits-ui/pull/925))

## 1.0.0-next.54

### Patch Changes

- fix: ensure highlighted item is reset when items mount/unmount ([#919](https://github.com/huntabyte/bits-ui/pull/919))

## 1.0.0-next.53

### Patch Changes

- fix: ensure `disabled` attribute is passed to a disabled tooltip trigger ([#916](https://github.com/huntabyte/bits-ui/pull/916))

- fix: ensure `disabled` is passed to `Popover.Trigger` ([#918](https://github.com/huntabyte/bits-ui/pull/918))

## 1.0.0-next.52

### Patch Changes

- fix(Pagination): disable prev/next buttons when no prev/next page ([#910](https://github.com/huntabyte/bits-ui/pull/910))

## 1.0.0-next.51

### Patch Changes

- add tooltip data-attr ([#908](https://github.com/huntabyte/bits-ui/pull/908))

## 1.0.0-next.50

### Patch Changes

- add `data-arrow` attribute to floating arrow svg ([#906](https://github.com/huntabyte/bits-ui/pull/906))

## 1.0.0-next.49

### Patch Changes

- fix: make `*Menu.CheckboxItem` `indeterminate` prop bindable ([#900](https://github.com/huntabyte/bits-ui/pull/900))

## 1.0.0-next.48

### Patch Changes

- BREAKING: `Checkbox` and `*Menu.CheckboxItem` `checked` prop is now of type `boolean` with `indeterminate` being a separate prop ([#898](https://github.com/huntabyte/bits-ui/pull/898))

## 1.0.0-next.47

### Patch Changes

- fix: issue with nested scroll prevention ([#896](https://github.com/huntabyte/bits-ui/pull/896))

- fix: pagination with `count={0}` displaying page 0 ([#893](https://github.com/huntabyte/bits-ui/pull/893))

- fix: pin input paste not working without pattern ([#897](https://github.com/huntabyte/bits-ui/pull/897))

## 1.0.0-next.46

### Patch Changes

- fix: issue with `LinkPreview` where content wouldn't close when the trigger was entered and exited quickly ([#889](https://github.com/huntabyte/bits-ui/pull/889))

## 1.0.0-next.45

### Patch Changes

- fix: slider disabled still allowed pointer to change value ([#882](https://github.com/huntabyte/bits-ui/pull/882))

## 1.0.0-next.44

### Patch Changes

- fix: remove defaults from `Tooltip.Root` to favor `Tooltip.Provider` ([#880](https://github.com/huntabyte/bits-ui/pull/880))

## 1.0.0-next.43

### Patch Changes

- fix: ensure `Tooltip.Provider` props are applied to `Tooltip.Root` unless overridden ([#878](https://github.com/huntabyte/bits-ui/pull/878))

## 1.0.0-next.42

### Patch Changes

- fix: nested outside clicks ([#875](https://github.com/huntabyte/bits-ui/pull/875))

## 1.0.0-next.41

### Patch Changes

- fix: make layers global for use with other libs that depend on Bits UI (like `vaul-svelte`) ([#873](https://github.com/huntabyte/bits-ui/pull/873))

## 1.0.0-next.40

### Patch Changes

- fix: dont use `display: table` in scroll area ([#863](https://github.com/huntabyte/bits-ui/pull/863))

## 1.0.0-next.39

### Patch Changes

- add `closeOnSelect` prop to all the menu item components ([#859](https://github.com/huntabyte/bits-ui/pull/859))

## 1.0.0-next.38

### Patch Changes

- fix: add role="option" to select items ([#857](https://github.com/huntabyte/bits-ui/pull/857))

## 1.0.0-next.37

### Patch Changes

- fix: pagination page aria-label ([#854](https://github.com/huntabyte/bits-ui/pull/854))

## 1.0.0-next.36

### Patch Changes

- fix: Range Calendar external value updates ([#851](https://github.com/huntabyte/bits-ui/pull/851))

## 1.0.0-next.35

### Patch Changes

- fix: pin input pattern checking ([#848](https://github.com/huntabyte/bits-ui/pull/848))

## 1.0.0-next.34

### Patch Changes

- fix: Combobox `forceMount` ([#844](https://github.com/huntabyte/bits-ui/pull/844))

- fix: Tooltip `forceMount` ([#844](https://github.com/huntabyte/bits-ui/pull/844))

- fix: DropdownMenu & ContextMenu `forceMount` ([#844](https://github.com/huntabyte/bits-ui/pull/844))

- fix: Select `forceMount` ([#844](https://github.com/huntabyte/bits-ui/pull/844))

- fix: popover `forceMount` ([#844](https://github.com/huntabyte/bits-ui/pull/844))

- fix: LinkPreview `forceMount` ([#844](https://github.com/huntabyte/bits-ui/pull/844))

## 1.0.0-next.33

### Patch Changes

- ensure minimum esm-env version is a working version ([#840](https://github.com/huntabyte/bits-ui/pull/840))

## 1.0.0-next.32

### Patch Changes

- fix: `Dialog` and `AlertDialog` `child` transition and add `restoreScrollDelay` prop to support custom transitions ([#831](https://github.com/huntabyte/bits-ui/pull/831))

## 1.0.0-next.31

### Patch Changes

- Add ID Attribute to Toggle Root Component ([#823](https://github.com/huntabyte/bits-ui/pull/823))

- fix: Link preview not closing on pointer leave ([#825](https://github.com/huntabyte/bits-ui/pull/825))

## 1.0.0-next.30

### Patch Changes

- export REGEXP helpers from pin input ([#821](https://github.com/huntabyte/bits-ui/pull/821))

## 1.0.0-next.29

### Patch Changes

- Select/Combobox: add `allowDeselect` prop ([#819](https://github.com/huntabyte/bits-ui/pull/819))

## 1.0.0-next.28

### Patch Changes

- fix: command click events ([#816](https://github.com/huntabyte/bits-ui/pull/816))

## 1.0.0-next.27

### Patch Changes

- fix: toolbar item events ([#813](https://github.com/huntabyte/bits-ui/pull/813))

## 1.0.0-next.26

### Patch Changes

- fix: scrollbar flicker ([#806](https://github.com/huntabyte/bits-ui/pull/806))

## 1.0.0-next.25

### Patch Changes

- fix: Scroll Area scrollbar positioning issue after scroll then hide ([#804](https://github.com/huntabyte/bits-ui/pull/804))

## 1.0.0-next.24

### Patch Changes

- fix: Combobox & Select trigger default to `type="button"` ([#802](https://github.com/huntabyte/bits-ui/pull/802))

- fix: derived updates ([#802](https://github.com/huntabyte/bits-ui/pull/802))

## 1.0.0-next.23

### Patch Changes

- fix(Button): make `ref` prop `$bindable` ([#798](https://github.com/huntabyte/bits-ui/pull/798))

## 1.0.0-next.22

### Patch Changes

- fix: various pointer/click issues ([#794](https://github.com/huntabyte/bits-ui/pull/794))

## 1.0.0-next.21

### Patch Changes

- Allow `Select` to be opened with the `Enter` key. ([#785](https://github.com/huntabyte/bits-ui/pull/785))

- fix: issues with dismissable layer siblings being confused ([#785](https://github.com/huntabyte/bits-ui/pull/785))

## 1.0.0-next.20

### Patch Changes

- Select: add `data-placeholder` to `Select.Trigger` when the select doesn't have a value ([#778](https://github.com/huntabyte/bits-ui/pull/778))

## 1.0.0-next.19

### Patch Changes

- fix: issues with body scroll lock not resetting on destroy with no transition time ([#775](https://github.com/huntabyte/bits-ui/pull/775))

- fix: bug with calendar months sometimes not rendering the first day of the month ([#777](https://github.com/huntabyte/bits-ui/pull/777))

- breaking: rename `onValueChangeEnd` to `onValueCommit` ([#774](https://github.com/huntabyte/bits-ui/pull/774))

## 1.0.0-next.18

### Patch Changes

- Breaking: replace existing `Select` implementation with `Listbox` and remove standalone `Listbox` as `Select` now has the exact functionality ([#769](https://github.com/huntabyte/bits-ui/pull/769))

- Add support for typeahead select when the trigger is focused and content is closed via the `items` prop on `Select.Root`. ([#769](https://github.com/huntabyte/bits-ui/pull/769))

## 1.0.0-next.17

### Patch Changes

- update `PaginationSnippetProps` type ([#761](https://github.com/huntabyte/bits-ui/pull/761))

## 1.0.0-next.16

### Patch Changes

- expose `currentPage` to the `Pagination.Root` snippets ([#759](https://github.com/huntabyte/bits-ui/pull/759))

## 1.0.0-next.15

### Patch Changes

- fix: cleanup a few untracks that were left unhandled ([#746](https://github.com/huntabyte/bits-ui/pull/746))

## 1.0.0-next.14

### Patch Changes

- rename various `BitsHTMLAttributes` types to avoid autocomplete interference with Svelte's `HTMLAttributes` types ([#744](https://github.com/huntabyte/bits-ui/pull/744))

## 1.0.0-next.13

### Patch Changes

- Radio Group: allow both arrow up/down and left/right per WAI-ARIA spec ([#742](https://github.com/huntabyte/bits-ui/pull/742))

## 1.0.0-next.12

### Patch Changes

- change: don't include `open` on `children` snippet props, only `child` ([#737](https://github.com/huntabyte/bits-ui/pull/737))

## 1.0.0-next.11

### Patch Changes

- fix: Select trigger refocus in firefox/safari ([#735](https://github.com/huntabyte/bits-ui/pull/735))

## 1.0.0-next.10

### Patch Changes

- next: improve tree-shaking ([#728](https://github.com/huntabyte/bits-ui/pull/728))

## 1.0.0-next.9

### Patch Changes

- gracefully handle internally cancelled interactoutside events ([#726](https://github.com/huntabyte/bits-ui/pull/726))

## 1.0.0-next.8

### Patch Changes

- fix: ensure `crossorigin` isn't applied to image if it is `undefined` or not passed as a prop ([#724](https://github.com/huntabyte/bits-ui/pull/724))

## 1.0.0-next.7

### Patch Changes

- Alert Dialog: `Action` button no longer closes the dialog to accomodate form submission / other asynchronous action ([#718](https://github.com/huntabyte/bits-ui/pull/718))

- fix bug preventing `crossorigin` and `referrerpolicy` attributes to work with `Avatar.Image` component ([#721](https://github.com/huntabyte/bits-ui/pull/721))

## 1.0.0-next.6

### Patch Changes

- feat: export and document `Portal` utility component ([#716](https://github.com/huntabyte/bits-ui/pull/716))

## 1.0.0-next.5

### Patch Changes

- next: fix command `scrollIntoView` issues ([#714](https://github.com/huntabyte/bits-ui/pull/714))

- Listbox/Combobox: gracefully handle deselect when `type="single"` ([#713](https://github.com/huntabyte/bits-ui/pull/713))

## 1.0.0-next.4

### Patch Changes

- set `preventScroll` to `true` by default on `ContextMenu` ([#709](https://github.com/huntabyte/bits-ui/pull/709))

- update Svelte to `5.0.0-next.260` ([#707](https://github.com/huntabyte/bits-ui/pull/707))

## 1.0.0-next.3

### Patch Changes

- fix: align `Tabs` component ARIA attribute with W3C spec ([#702](https://github.com/huntabyte/bits-ui/pull/702))

## 1.0.0-next.2

### Patch Changes

- Forward `dir` prop to underling elements ([#701](https://github.com/huntabyte/bits-ui/pull/701))

- fix(Combobox): scroll highlighted item into view when navigating the list with keyboard ([#699](https://github.com/huntabyte/bits-ui/pull/699))

## 1.0.0-next.1

### Patch Changes

- next: fix pointer event restoration ([#695](https://github.com/huntabyte/bits-ui/pull/695))

## 1.0.0-next.0

### Major Changes

- Svelte 5 pre-release. This release includes many breaking changes, bug fixes, and new features that are not possible to include in the previous release. Please see the [@next documentation](https://huntabyte-next.bits-ui.pages.dev/) for more information. ([#690](https://github.com/huntabyte/bits-ui/pull/690))

## 0.21.16

### Patch Changes

- fix: Changed svelte event handlers in favor of CustomEventHandler ([#536](https://github.com/huntabyte/bits-ui/pull/536))

## 0.21.16

### Patch Changes

- fix: Changed svelte event handlers in favor of CustomEventHandler ([#536](https://github.com/huntabyte/bits-ui/pull/536))

## 0.21.15

### Patch Changes

- fix: `Select` typeahead prop ([#666](https://github.com/huntabyte/bits-ui/pull/666))

- fix: Accordion item disabled reactivity ([#668](https://github.com/huntabyte/bits-ui/pull/668))

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
