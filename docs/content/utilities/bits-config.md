---
title: BitsConfig
description: A utility to configure context-scoped settings for Bits UI components.
---

## Overview

The `BitsConfig` utility components allows changing context-scoped settings for Bits UI components.
Unset options will fall back to the parent component's settings.

## Usage

```svelte
<script lang="ts">
	import { BitsConfig } from "bits-ui";
</script>

<div id="element-1"></div>
<div id="element-2"></div>

<BitsConfig defaultPortalTo="#element-1">
	<!-- Portals in this scope will default target to #element-1 -->
	<BitsConfig exampleProp="exampleValue">
		<!-- Portals in this scope will default target to #element-1, exampleProp="exampleValue" -->
		<BitsConfig defaultPortalTo="#element-2">
			<!-- Portals in this scope will default target to #element-2, exampleProp="exampleValue" -->
		</BitsConfig>
	</BitsConfig>
</BitsConfig>
```
