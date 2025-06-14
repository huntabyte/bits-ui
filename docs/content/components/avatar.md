---
title: Avatar
description: Represents a user or entity with a recognizable image or placeholder in UI elements.
---

<script>
	import { APISection, ComponentPreviewV2, AvatarDemo, AvatarDemoLinkPreview } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="avatar-demo" componentName="Avatar">

{#snippet preview()}
<AvatarDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Avatar component provides a consistent way to display user or entity images throughout your application. It handles image loading states gracefully and offers fallback options when images fail to load, ensuring your UI remains resilient.

## Features

- **Smart Image Loading**: Automatically detects and handles image loading states
- **Fallback System**: Displays alternatives when images are unavailable or slow to load
- **Compound Structure**: Flexible primitives that can be composed and customized
- **Customizable**: Choose to show the image immediately without a load check when you're certain the image will load.

## Architecture

The Avatar component follows a compound component pattern with three key parts:

- **Avatar.Root**: Container that manages the state of the image and its fallback
- **Avatar.Image**: Displays user or entity image
- **Avatar.Fallback**: Shows when the image is loading or fails to load

## Quick Start

To get started with the Avatar component, you can use the `Avatar.Root`, `Avatar.Image`, and `Avatar.Fallback` primitives to create a basic avatar component:

```svelte
<script lang="ts">
  import { Avatar } from "bits-ui";
</script>

<Avatar.Root>
  <Avatar.Image
    src="https://github.com/huntabyte.png"
    alt="Huntabyte's avatar"
  />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

## Reusable Components

You can create your own reusable Avatar component to maintain consistent styling and behavior throughout your application:

```svelte title="UserAvatar.svelte"
<script lang="ts">
  import { Avatar, type WithoutChildrenOrChild } from "bits-ui";

  let {
    src,
    alt,
    fallback,
    ref = $bindable(null),
    imageRef = $bindable(null),
    fallbackRef = $bindable(null),
    ...restProps
  }: WithoutChildrenOrChild<Avatar.RootProps> & {
    src: string;
    alt: string;
    fallback: string;
    imageRef?: HTMLImageElement | null;
    fallbackRef?: HTMLElement | null;
  } = $props();
</script>

<Avatar.Root {...restProps} bind:ref>
  <Avatar.Image {src} {alt} bind:ref={imageRef} />
  <Avatar.Fallback bind:ref={fallbackRef}>
    {fallback}
  </Avatar.Fallback>
</Avatar.Root>
```

Then use it throughout your application:

```svelte title="+page.svelte"
<script lang="ts">
  import UserAvatar from "$lib/components/UserAvatar.svelte";

  const users = [
    { handle: "huntabyte", initials: "HJ" },
    { handle: "pavelstianko", initials: "PS" },
    { handle: "adriangonz97", initials: "AG" },
  ];
</script>

{#each users as user}
  <UserAvatar
    src="https://github.com/{user.handle}.png"
    alt="{user.name}'s avatar"
    fallback={user.initials}
  />
{/each}
```

## Customization

### Skip Loading Check

When you're confident that an image will load (such as local assets), you can bypass the loading check:

```svelte /loadingStatus="loaded"/
<script lang="ts">
  import { Avatar } from "bits-ui";

  // local asset that's guaranteed to be available
  import localAvatar from "/avatar.png";
</script>

<Avatar.Root loadingStatus="loaded">
  <Avatar.Image src={localAvatar} alt="User avatar" />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

## Examples

### Clickable with Link Preview

This example demonstrates how to create a clickable avatar composed with a [Link Preview](/docs/components/link-preview):

<ComponentPreviewV2 name="avatar-demo-link-preview" componentName="Avatar with Link Preview">

{#snippet preview()}
<AvatarDemoLinkPreview />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
