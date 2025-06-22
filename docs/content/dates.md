---
title: Dates and Times
description: How to work with the various date and time components in Bits UI.
---

The date and time components in Bits UI leverage the [@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/index.html) package, providing a unified API for working with dates and times across different locales and time zones. This package is inspired by the [Temporal](https://tc39.es/proposal-temporal/) proposal and is designed to seamlessly integrate with the Temporal API once it becomes available.

## Installation

You can install the package using your favorite package manager:

```bash
npm install @internationalized/date
```

It's highly recommended to familiarize yourself with the package's documentation before diving into the components. We'll cover the basics of how we use the package in Bits UI in the sections below, but their documentation provides much more detail on the various formats and how to work with them.

## DateValue Types

Bits UI uses `DateValue` objects from `@internationalized/date` to represent dates and times consistently. These immutable objects provide specific information about the type of date they represent:

We use the `DateValue` objects provided by `@internationalized/date` to represent dates and times in a consistent way. These objects are immutable and provide information about the type of date they represent. The `DateValue` is a union of the following three types:

| Type               | Description                 | Example                                          |
| ------------------ | --------------------------- | ------------------------------------------------ |
| `CalendarDate`     | Date without time component | `2024-07-10`                                     |
| `CalendarDateTime` | Date with time              | `2024-07-10T12:30:00`                            |
| `ZonedDateTime`    | Date with time and timezone | `2024-07-10T21:00:00:00-04:00[America/New_York]` |

Using these strongly-typed objects allows components to adapt appropriately to the date type you provide.

### CalendarDate

Represents a date without a time component.

```ts
// Creating a CalendarDate
import {
  CalendarDate,
  parseDate,
  today,
  getLocalTimeZone,
} from "@internationalized/date";

// From year, month, day parameters
const date = new CalendarDate(2024, 7, 10);

// From ISO 8601 string
const parsedDate = parseDate("2024-07-10");

// Current date in specific timezone
const losAngelesToday = today("America/Los_Angeles");

// Current date in user's timezone
const localToday = today(getLocalTimeZone());
```

See the [CalendarDate API Documentation](https://react-spectrum.adobe.com/internationalized/date/CalendarDate.html) for additional methods.

### CalendarDateTime

Represents a date with a time component, but without timezone information.

```ts
// Creating a CalendarDateTime
import { CalendarDateTime, parseDateTime } from "@internationalized/date";

// From date and time components
const dateTime = new CalendarDateTime(2024, 7, 10, 12, 30, 0);

// From ISO 8601 string
const parsedDateTime = parseDateTime("2024-07-10T12:30:00");
```

See the [CalendarDateTime API documentation](https://react-spectrum.adobe.com/internationalized/date/CalendarDateTime.html) for additional methods.

### ZonedDateTime

Represents a specific date and time in a specific timezone - crucial for events that occur at an exact moment regardless of the user's location (like conferences or live broadcasts).

```ts
// Creating a ZonedDateTime
import {
  ZonedDateTime,
  parseZonedDateTime,
  parseAbsolute,
  parseAbsoluteToLocal,
} from "@internationalized/date";

const date = new ZonedDateTime(
  2022,
  2,
  3, // Date (year, month, day)
  "America/Los_Angeles", // Timezone
  -28800000, // UTC offset in milliseconds
  9,
  15,
  0 // Time (hour, minute, second)
);

// From ISO 8601 strings using different parsing functions
const date1 = parseZonedDateTime("2024-07-12T00:45[America/New_York]");
const date2 = parseAbsolute("2024-07-12T07:45:00Z", "America/New_York");
const date3 = parseAbsoluteToLocal("2024-07-12T07:45:00Z");
```

See the [ZonedDateTime API documentation](https://react-spectrum.adobe.com/internationalized/date/ZonedDateTime.html) for more information.

## Working with Date Ranges

For components that require date ranges, Bits UI provides a `DateRange` type:

```ts
type DateRange = {
  start: DateValue;
  end: DateValue;
};
```

This type is used in components such as:

- [Date Range Field](/docs/components/date-range-field)
- [Date Range Picker](/docs/components/date-range-picker)
- [Range Calendar](/docs/components/range-calendar)

## Using the Placeholder

Each date/time component in Bits UI has a _bindable_ `placeholder` prop that serves multiple important functions:

1. **Starting Point**: Acts as the initial date when no value is selected
2. **Type Definition**: Determines what type of date/time to display if value is absent
3. **Calendar Navigation**: Controls the visible date range in calendar views

### Example: Using Placeholder with Calendar

```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import {
    today,
    getLocalTimeZone,
    type DateValue,
  } from "@internationalized/date";

  // Initialize placeholder with today's date
  let placeholder: DateValue = $state(today(getLocalTimeZone()));
  let selectedMonth: number = $state(placeholder.month);
</script>

<!-- Month selector to control calendar view -->
<select
  onchange={() => {
    placeholder = placeholder.set({ month: selectedMonth });
  }}
  bind:value={selectedMonth}
>
  <option value={1}>January</option>
  <option value={2}>February</option>
  <!-- Additional months... -->
</select>

<Calendar.Root bind:placeholder>
  <!-- Calendar components... -->
</Calendar.Root>
```

## Updating DateValue Objects

Since `DateValue` objects are immutable, you must create new instances when updating them:

```ts
// INCORRECT - will not work
let placeholder = new CalendarDate(2024, 7, 10);
placeholder.month = 8; // Error! DateValue objects are immutable

// CORRECT - using methods that return new instances
let placeholder = new CalendarDate(2024, 7, 10);

// Method 1: Using set()
placeholder = placeholder.set({ month: 8 });

// Method 2: Using add()
placeholder = placeholder.add({ months: 1 });

// Method 3: Using subtract()
placeholder = placeholder.subtract({ days: 5 });

// Method 4: Using cycle() - cycles through valid values
placeholder = placeholder.cycle("month", "forward", [1, 3, 5, 7, 9, 11]);
```

## Formatting and Parsing

### Formatting Dates for Display

For consistent, locale-aware date formatting, use the `DateFormatter` class:

```ts
import { DateFormatter } from "@internationalized/date";

// Create a formatter for the current locale
const formatter = new DateFormatter("en-US", {
  dateStyle: "full",
  timeStyle: "short",
});

// Format a DateValue
const formattedDate = formatter.format(myDateValue.toDate("America/New_York"));
// Example output: "Wednesday, July 10, 2024 at 12:30 PM"
```

The `DateFormatter` wraps the native [Intl.DateTimeFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) while fixing browser inconsistencies and polyfilling newer features.

### Parsing Date Strings

When working with date strings from APIs or databases, use the appropriate parsing function for your needs:

```ts
import {
  parseDate, // For CalendarDate
  parseDateTime, // For CalendarDateTime
  parseZonedDateTime, // For ZonedDateTime with timezone name
  parseAbsolute, // For ZonedDateTime from UTC string + timezone
  parseAbsoluteToLocal, // For ZonedDateTime in local timezone
} from "@internationalized/date";

// Examples
const date = parseDate("2024-07-10"); // CalendarDate
const dateTime = parseDateTime("2024-07-10T12:30:00"); // CalendarDateTime
const zonedDate = parseZonedDateTime("2024-07-12T00:45[America/New_York]"); // ZonedDateTime
const absoluteDate = parseAbsolute("2024-07-12T07:45:00Z", "America/New_York"); // ZonedDateTime
const localDate = parseAbsoluteToLocal("2024-07-12T07:45:00Z"); // ZonedDateTime in user's timezone
```

## Common Gotchas and Tips

- **Month Indexing**: Unlike JavaScript's Date object (which is 0-indexed), `@internationalized/date` uses 1-indexed months (January = 1).
- **Immutability**: Always reassign when modifying date objects: `date = date.add({ days: 1 })`.
- **Timezone Handling**: Use `ZonedDateTime` for schedule-critical events like meetings or appointments.
- **Type Consistency**: Match `placeholder` types to your needs - if you need time selection, use `CalendarDateTime` not `CalendarDate`.
- **Performance**: Create `DateFormatter` instances once and reuse them rather than creating new instances on each render.

## Related Resources

- [Date Field](/docs/components/date-field)
- [Date Range Field](/docs/components/date-range-field)
- [Date Picker](/docs/components/date-picker)
- [Date Range Picker](/docs/components/date-range-picker)
- [Calendar](/docs/components/calendar)
- [Range Calendar](/docs/components/range-calendar)
- [@internationalized/date documentation](https://react-spectrum.adobe.com/internationalized/date/index.html)
