---
title: Tooltip
description: Provides additional information or context when users hover over or interact with an element.
---

<script>
	import { ComponentPreviewV2, TooltipDemo, TooltipDemoCustom, TooltipDemoDelayDuration, APISection } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="tooltip-demo" comp="Tooltip">

{#snippet preview()}
<TooltipDemo />
{/snippet}

</ComponentPreviewV2>

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

<Tooltip.Provider delayDuration={0} disabledHoverableContent={true}>
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

It also ensures that only a single tooltip within the same provider can be open at a time. It's recommended to wrap your root layout content with the provider component.

```svelte title="+layout.svelte"
<script lang="ts">
	import { Tooltip } from "bits-ui";
	let { children } = $props();
</script>

<Tooltip.Provider>
	{@render children()}
</Tooltip.Provider>
```

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
		buttonText,
		triggerProps = {},
		...restProps
	}: Tooltip.RootProps = $props();
</script>

<!--
 Ensure you have a `Tooltip.Provider` component wrapping
 your root layout content
-->
<Tooltip.Root bind:open {onOpenChange}>
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

## Disable Close on Trigger Click

By default, the tooltip will close when the user clicks the trigger.

## Disable Hoverable Content

By default, the tooltip will be disabled if the user hovers over the trigger.

<APISection {schemas} />
