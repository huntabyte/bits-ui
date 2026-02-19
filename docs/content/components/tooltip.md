---
title: Tooltip
description: Displays supplementary information when users hover over or interact with an element.
---

<script>
	import {
		ComponentPreview,
		TooltipDemo,
		TooltipDemoCustom,
		TooltipDemoCustomAnchor,
		TooltipDemoDelayDuration,
		TooltipDemoSkipDelay,
		TooltipDemoTransition,
		TooltipDemoSingleton,
		TooltipDemoTether,
		TooltipDemoControlledTriggerId,
		TooltipDemoSingletonForceMount,
		APISection,
		Callout
	} from '$lib/components'
	let { schemas } = $props()
</script>

<ComponentPreview name="tooltip-demo" componentName="Tooltip" variant="preview">

{#snippet preview()}
<TooltipDemo />
{/snippet}

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
  import { Tooltip } from "bits-ui";
</script>

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger />
    <Tooltip.Portal>
      <Tooltip.Content>
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

## Provider Component

The `Tooltip.Provider` component is required to be an ancestor of the `Tooltip.Root` component. It provides shared state for the tooltip components used within it. You can set a single `delayDuration` or `disableHoverableContent` prop on the provider component to apply to all the tooltip components within it.

```svelte
<script lang="ts">
  import { Tooltip } from "bits-ui";
</script>

<Tooltip.Provider delayDuration={0} disableHoverableContent={true}>
  <!-- Will have a delayDuration of 0 and disableHoverableContent of true -->
  <Tooltip.Root>
    <Tooltip.Trigger />
    <Tooltip.Portal>
      <Tooltip.Content>
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
  <!-- Will have a delayDuration of 0 and disableHoverableContent of true -->
  <Tooltip.Root>
    <Tooltip.Trigger />
    <Tooltip.Portal>
      <Tooltip.Content>
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

It also ensures that only a single tooltip within the same provider can be open at a time. It's recommended to wrap your root layout content with the provider component, setting your sensible default props there.

```svelte title="+layout.svelte"
<script lang="ts">
  import { Tooltip } from "bits-ui";
  let { children } = $props();
</script>

<Tooltip.Provider>
  {@render children()}
</Tooltip.Provider>
```

## Managing Open State

This section covers how to manage the `open` state of the component.

### Two-Way Binding

Use `bind:open` for simple, automatic state synchronization:

```svelte {3,6,8}
<script lang="ts">
  import { Tooltip } from "bits-ui";
  let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Tooltip</button>

<Tooltip.Root bind:open={isOpen}>
  <!-- ... -->
</Tooltip.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Tooltip } from "bits-ui";
  let myOpen = $state(false);

  function getOpen() {
    return myOpen;
  }

  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>

<Tooltip.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</Tooltip.Root>
```

## Tether

`tether` is a shared connection object that lets `Tooltip.Trigger` and `Tooltip.Root` communicate even when they are not in the same component subtree.

Without a tether, each root/trigger pair is local, which makes detached layouts harder (for example, a toolbar trigger rendered in one place and tooltip content rendered elsewhere). A tether solves that by giving both sides shared state for the active trigger, open/close behavior, and trigger payload, so you can build singleton-style tooltip patterns without duplicating tooltip content instances.

`tether` is inspired by [Base UI](https://base-ui.com/react/components/tooltip#detached-triggers)'s `handle` concept.

### Detached Triggers

Use a shared tether when action controls and the tooltip root are not colocated (for example, a dashboard with toolbar actions in different regions):

```svelte
<script lang="ts">
  import { Tooltip } from "bits-ui";
  const actionsTether = Tooltip.createTether<{
    label: string;
    description: string;
    shortcut: string;
  }>();
</script>

<Tooltip.Trigger
  tether={actionsTether}
  payload={{
    label: "Sync now",
    description:
      "Refreshes every connected source and recalculates all metrics.",
    shortcut: "S",
  }}
>
  Sync now
</Tooltip.Trigger>

<Tooltip.Root tether={actionsTether}>
  {#snippet children({ payload })}
    <Tooltip.Portal>
      <Tooltip.Content>
        <p>{payload?.label}</p>
        <p>{payload?.description}</p>
        <kbd>{payload?.shortcut}</kbd>
      </Tooltip.Content>
    </Tooltip.Portal>
  {/snippet}
</Tooltip.Root>
```

<ComponentPreview name="tooltip-demo-tether" componentName="Tooltip Detached Triggers" containerClass="mt-4">

{#snippet preview()}
<TooltipDemoTether />
{/snippet}

</ComponentPreview>

### Singleton Tooltip with Payload

A single tooltip can be reused by multiple triggers. The active trigger payload is available from `Tooltip.Root` snippet props:

```svelte
<script lang="ts">
  import { Tooltip } from "bits-ui";
  const boardTether = Tooltip.createTether<{
    name: string;
    description: string;
  }>();
</script>

<Tooltip.Root tether={boardTether}>
  {#snippet children({ payload })}
    <Tooltip.Trigger
      tether={boardTether}
      payload={{
        name: "Blocked",
        description: "Waiting on an external dependency.",
      }}
    >
      Blocked
    </Tooltip.Trigger>
    <Tooltip.Trigger
      tether={boardTether}
      payload={{
        name: "Done",
        description: "Ready for release notes and QA sign-off.",
      }}
    >
      Done
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content>
        <p>{payload?.name}</p>
        <p>{payload?.description}</p>
      </Tooltip.Content>
    </Tooltip.Portal>
  {/snippet}
</Tooltip.Root>
```

<ComponentPreview name="tooltip-demo-singleton" componentName="Tooltip Singleton" containerClass="mt-4">

{#snippet preview()}
<TooltipDemoSingleton />
{/snippet}

</ComponentPreview>

### Controlled Active Trigger

In controlled mode, bind both `open` and `triggerId` to open a specific trigger programmatically (useful for guided onboarding flows):

```svelte
<script lang="ts">
  import { Tooltip } from "bits-ui";
  const setupTether = Tooltip.createTether<{
    title: string;
    description: string;
  }>();
  let open = $state(false);
  let triggerId = $state<string | null>(null);
</script>

<button
  onclick={() => {
    triggerId = "setup-members";
    open = true;
  }}
>
  Show members tip
</button>

<Tooltip.Root tether={setupTether} bind:open bind:triggerId>
  <!-- ... -->
</Tooltip.Root>
```

<ComponentPreview name="tooltip-demo-controlled-trigger-id" componentName="Tooltip Controlled Trigger" containerClass="mt-4">

{#snippet preview()}
<TooltipDemoControlledTriggerId />
{/snippet}

</ComponentPreview>

## Mobile Tooltips

Tooltips are _not_ supported on mobile devices. The intent of a tooltip is to provide a "tip" about a "tool" before the user interacts with that tool (in most cases, a button).

This is not possible on mobile devices, because there is no sense of hover on mobile. If a user were to press/touch a button with a tooltip, the action that button triggers would be taken before they were even able to see the tooltip, which renders it useless.

If you are using a tooltip on a button without an action, you should consider using a [Popover](/docs/components/popover) instead.

If you'd like to learn more about how we came to this decision, here are some useful resources:

> The tooltip is not the appropriate role for the more information "i" icon, ⓘ. A tooltip is directly associated with the owning element. The ⓘ isn't 'described by' detailed information; the tool or control is.
>
> [MDN ARIA Tooltips](https://arc.net/l/quote/zfvjgalg)

<br />

> Tooltips should only ever contain non-essential content. The best approach to writing tooltip content is to always assume it may never be read.
>
> [Tooltips in the time of WCAG 2.1](https://arc.net/l/quote/gdrkepxb)

## Reusable Components

It's recommended to use the `Tooltip` primitives to build your own custom tooltip component that can be used throughout your application.

Below is an example of how you might create a reusable tooltip component that can be used throughout your application. Of course, this isn't the only way to do it, but it should give you a good idea of how to compose the primitives.

```svelte title="MyTooltip.svelte"
<script lang="ts">
  import { Tooltip } from "bits-ui";
  import { type Snippet } from "svelte";

  type Props = Tooltip.RootProps & {
    trigger: Snippet;
    triggerProps?: Tooltip.TriggerProps;
  };

  let {
    open = $bindable(false),
    children,
    trigger,
    triggerProps = {},
    ...restProps
  }: Props = $props();
</script>

<!--
 Ensure you have a `Tooltip.Provider` component wrapping
 your root layout content
-->
<Tooltip.Root bind:open {...restProps}>
  <Tooltip.Trigger {...triggerProps}>
    {@render trigger()}
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content>
      <Tooltip.Arrow />
      {@render children?.()}
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>
```

You could then use the `MyTooltip` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
  import MyTooltip from "$lib/components/MyTooltip.svelte";
  import BoldIcon from "..some-icon-library"; // not real
</script>

<MyTooltip triggerProps={{ onclick: () => alert("changed to bold!") }}>
  {#snippet trigger()}
    <BoldIcon />
  {/snippet}
  Change font to bold
</MyTooltip>
```

## Delay Duration

You can change how long a user needs to hover over a trigger before the tooltip appears by setting the `delayDuration` prop on the `Tooltip.Root` or `Tooltip.Provider` component.

```svelte /delayDuration={200}/
<Tooltip.Root delayDuration={200}>
  <!-- .... -->
</Tooltip.Root>
```

<TooltipDemoDelayDuration />

## Skip Delay Duration

When multiple tooltips share a `Tooltip.Provider`, moving quickly from one trigger to another would normally require waiting through the full `delayDuration` each time. The `skipDelayDuration` prop controls a grace period: if the user re-enters any trigger within that window after closing a tooltip, it opens instantly instead of waiting.

```svelte /skipDelayDuration={200}/
<Tooltip.Provider delayDuration={600} skipDelayDuration={200}>
  <Tooltip.Root><!-- ... --></Tooltip.Root>
  <Tooltip.Root><!-- ... --></Tooltip.Root>
  <Tooltip.Root><!-- ... --></Tooltip.Root>
</Tooltip.Provider>
```

This is ideal for toolbars, nav items, or any group of controls where the user's intent to scan tooltips is clear once they've opened the first one. Hover any button below, then move across the rest. Subsequent tooltips will open without the delay.

<ComponentPreview name="tooltip-demo-skip-delay" componentName="Tooltip Skip Delay" containerClass="mt-4">

{#snippet preview()}
<TooltipDemoSkipDelay />
{/snippet}

</ComponentPreview>

## Close on Trigger Click

By default, the tooltip will close when the user clicks the trigger. If you want to disable this behavior, you can set the `disableCloseOnTriggerClick` prop to `true`.

```svelte /disableCloseOnTriggerClick/
<Tooltip.Root disableCloseOnTriggerClick>
  <!-- .... -->
</Tooltip.Root>
```

## Hoverable Content

By default, the tooltip will remain open when the user hovers over the content. If you instead want the tooltip to close as the user moves their mouse towards the content, you can set the `disableHoverableContent` prop to `true`.

```svelte /disableHoverableContent/
<Tooltip.Root disableHoverableContent>
  <!-- .... -->
</Tooltip.Root>
```

## Non-Keyboard Focus

If you want to prevent opening the tooltip when the user focuses the trigger without using the keyboard, you can set the `ignoreNonKeyboardFocus` prop to `true`.

```svelte /ignoreNonKeyboardFocus/
<Tooltip.Root ignoreNonKeyboardFocus>
  <!-- .... -->
</Tooltip.Root>
```

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `Tooltip.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fade/ /transition:fly/
<script lang="ts">
	import { Tooltip } from "bits-ui";
	import { fly, fade } from "svelte/transition";
</script>

<Tooltip.Root>
	<!-- ... other tooltip components -->
	<Tooltip.Content forceMount>
		{#snippet child({ wrapperProps, props, open })}
			{#if open}
				<div {...wrapperProps}>
					<div {...props} transition:fly>
						<!-- ... -->
					</div>
				</div>
			{/if}
		{/snippet}
	</Tooltip.Content>
</Dialog.Root>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content components that handles this logic if you intend to use this approach throughout your app. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<ComponentPreview name="tooltip-demo-transition" componentName="Tooltip" containerClass="mt-4">

{#snippet preview()}
<TooltipDemoTransition />
{/snippet}

</ComponentPreview>

You can combine the same force-mount transition pattern with singleton triggers:

<ComponentPreview name="tooltip-demo-singleton-force-mount" componentName="Tooltip Singleton Force Mount" containerClass="mt-4">

{#snippet preview()}
<TooltipDemoSingletonForceMount />
{/snippet}

</ComponentPreview>

## Opt-out of Floating UI

When you use the `Tooltip.Content` component, Bits UI uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger, similar to other popover-like components.

You can opt-out of this behavior by instead using the `Tooltip.ContentStatic` component. This component does not use Floating UI and leaves positioning the content entirely up to you.

```svelte /Tooltip.ContentStatic/
<Tooltip.Root>
  <Tooltip.Trigger>Hello</Tooltip.Trigger>
  <Tooltip.ContentStatic>
    <!-- ... -->
  </Tooltip.ContentStatic>
</Tooltip.Root>
```

<Callout>

When using the `Tooltip.ContentStatic` component, the `Tooltip.Arrow` component will not be rendered relative to it as it is designed to be used with `Tooltip.Content`.

</Callout>

## Custom Anchor

By default, the `Tooltip.Content` is anchored to the `Tooltip.Trigger` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector `string` or an `HTMLElement` to the `customAnchor` prop of the `Tooltip.Content` component.

```svelte /customAnchor/
<script lang="ts">
  import { Tooltip } from "bits-ui";
  let customAnchor = $state<HTMLElement>(null!);
</script>

<div bind:this={customAnchor}></div>

<Tooltip.Root>
  <Tooltip.Trigger />
  <Tooltip.Content {customAnchor}>
    <!-- ... -->
  </Tooltip.Content>
</Tooltip.Root>
```

<ComponentPreview name="tooltip-demo-custom-anchor" componentName="Tooltip Custom Anchor">

{#snippet preview()}
<TooltipDemoCustomAnchor />
{/snippet}

</ComponentPreview>

<APISection {schemas} />
