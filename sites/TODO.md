## TODOs

These are outstanding tasks that need to be completed or addressed before the project is ready for release.

-   [x] Make the component which receives the `name` prop consistent across the `DateField` and `DateRangeField`, `DatePicker` and `DateRangePicker` components.
-   [ ] Determine how to handle validation for the various date and time components. Ideally in a way that those using libraries like `sveltekit-superforms` and those that aren't can both benefit from.
-   [ ] Determine the ideal approach for managing the `data-<component>` attributes.
-   [ ] Expose the various `open` states via snippet props for all compoents with the `forceMount` prop for controlled transitions and animations. Thinking more about this, we don't need to pass it via `children`, only via the `child` snippet.
-   [ ] Handle the `invalid` state for the `DateRangeField` component.
