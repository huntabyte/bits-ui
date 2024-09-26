---
title: PIN Input
description: Allows users to input a sequence of one-character alphanumeric inputs.
---

<script>
	import { APISection, ComponentPreviewV2, PinInputDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="pin-input-demo" comp="PinInput">

{#snippet preview()}
<PinInputDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The PIN Input component provides a customizable solution for One-Time Password (OTP), Two-Factor Authentication (2FA), or Multi-Factor Authentication (MFA) input fields. Due to the lack of a native HTML element for these purposes, developers often resort to either basic input fields or custom implementations. This component offers a robust, accessible, and flexible alternative.

<Callout type="tip" title="Credits">

This component is derived from and would not have been possible without the work done by [Guilherme Rodz](https://x.com/guilhermerodz) with [Input OTP](https://github.com/guilhermerodz/input-otp).

</Callout>

## Key Features

-   **Invisible Input Technique**: Utilizes an invisible input element for seamless integration with form submissions and browser autofill functionality.
-   **Customizable Appearance**: Allows for custom designs while maintaining core functionality.
-   **Accessibility**: Ensures keyboard navigation and screen reader compatibility.
-   **Flexible Configuration**: Supports various PIN lengths and input types (numeric, alphanumeric).

## Architecture

1. **Root Container**: A relatively positioned root element that encapsulates the entire component.
2. **Invisible Input**: A hidden input field that manages the actual value and interacts with the browser's built-in features.
3. **Visual Cells**: Customizable elements representing each character of the PIN, rendered as siblings to the invisible input.

This structure allows for a seamless user experience while providing developers with full control over the visual representation.

## Structure

```svelte
<script lang="ts">
	import { PinInput } from "bits-ui";
</script>

<PinInput.Root maxlength={6}>
	{#snippet children({ cells })}
		{#each cells as cell}
			<PinInput.Cell {cell} />
		{/each}
	{/snippet}
</PinInput.Root>
```

<APISection {schemas} />
