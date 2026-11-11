---
name: migrate-vaul-svelte
description: Migrate Svelte apps and wrapper components from vaul-svelte to the Bits UI Drawer preview. Use when replacing vaul-svelte imports, shadcn-svelte drawers backed by vaul-svelte, or Vaul drawer props and styles.
---

# Migrate vaul-svelte drawers

Check that the target Bits UI package exports `unstable_Drawer` and that the app runs Svelte 5. For this preview, import it as `import { unstable_Drawer as Drawer } from "bits-ui"`. Check the installed declarations if migrating to a later release. Find imports, wrappers, forwarded props, `data-vaul-*` selectors, and Vaul CSS variables. Migrate the shared wrapper first when it owns the drawer structure.

Use this component hierarchy:

```svelte
<script lang="ts">
  import { unstable_Drawer as Drawer } from "bits-ui";
</script>

<Drawer.Root>
  <Drawer.Trigger>Open settings</Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Backdrop />
    <Drawer.Viewport>
      <Drawer.Popup>
        <Drawer.Content>
          <Drawer.Title>Settings</Drawer.Title>
          <Drawer.Description>Adjust your preferences.</Drawer.Description>
          <Drawer.Close>Close</Drawer.Close>
        </Drawer.Content>
      </Drawer.Popup>
    </Drawer.Viewport>
  </Drawer.Portal>
</Drawer.Root>
```

This illustrates structure. Port positioning and motion using the [Drawer docs](../../../docs/content/components/drawer.md) and [demos](../../../docs/src/lib/components/demos). For example, use a fixed viewport to position a bottom sheet, then style its popup using `--drawer-swipe-movement-y`, `data-starting-style`, and `data-ending-style`. For a snap drawer include `--drawer-snap-point-offset` in the transform. Keep focus, sizing, and surface styling on the popup and inner layout on content.

| Vaul                                                           | Bits UI Drawer                                                                                         |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `Overlay`                                                      | `Backdrop`                                                                                             |
| `NestedRoot` or `nested`                                       | A regular `Root` inside the parent Drawer tree                                                         |
| `direction`                                                    | `swipeDirection`: `bottom → down`, `top → up`, `left → left`, `right → right`                          |
| `activeSnapPoint`, `onActiveSnapPointChange`                   | `snapPoint`, `onSnapPointChange`                                                                       |
| `snapToSequentialPoint`                                        | `snapToSequentialPoints`                                                                               |
| `onAnimationEnd`                                               | `onOpenChangeComplete` for open and close completion                                                   |
| `container`                                                    | `Portal to={target}`                                                                                   |
| `shouldScaleBackground`, wrapper marker and body color styling | `Provider`, `Indent`, and `IndentBackground` with app-owned CSS                                        |
| Focus and outside-interaction options                          | Configure `onOpenAutoFocus`, `onCloseAutoFocus`, `onInteractOutside`, and `onEscapeKeydown` on `Popup` |

Keep `bind:open` and `onOpenChange`. For vertical snap points, use viewport fractions from 0 to 1, pixel numbers above 1, or `px` / `rem` strings. Initialize the bound snap value if the old drawer opened at a specific point. For non-modal drawers, turn off `trapFocus` and `preventScroll` on the popup, omit the backdrop when appropriate, and configure outside interaction separately.

Replace `data-vaul-no-drag` with `data-bits-ui-swipe-ignore` on the region where a drag should never start.

Review `Handle` / `handleOnly`, `dismissible`, `closeThreshold`, `scrollLockTimeout`, `fadeFromIndex`, `onDrag`, and `onRelease` explicitly. They have no direct mapping in this preview. For example, escape and outside interaction can be ignored individually, but that still leaves swipe dismissal enabled. Preserve behavior that the app depends on by flagging it for a decision before switching those call sites. For custom keyboard repositioning, check the viewport's `--drawer-keyboard-inset` and test real iOS Safari if available.

Verify the migrated wrapper's open and close paths, accessible name and restoration of the previously focused element, swipe direction and snap behavior, nested dismissal, and any forms or scrollable inputs. Remove the vaul-svelte dependency only after checking all app and test entry points for remaining imports.
