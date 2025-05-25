---
title: Time Field
description: Enables users to input a time within a designated field.
---

<script>
	import { CalendarDateTime, CalendarDate, now, getLocalTimeZone, parseDate, today } from "@internationalized/date";
	import { APISection, ComponentPreviewV2, TimeFieldDemo, DemoContainer, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="time-field-demo" componentName="Time Field">

{#snippet preview()}
<TimeFieldDemo />
{/snippet}

</ComponentPreviewV2>

<Callout type="tip" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

</Callout>

<APISection {schemas} />
