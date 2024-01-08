import type { APISchema, PropObj } from "@/types";
import { enums, transitionProps } from "@/content/api-reference/helpers.js";
import type * as Collapsible from "$lib/bits/collapsible/_types";
import * as C from "@/content/constants";
import { builderAndAttrsSlotProps, domElProps } from "./helpers";

export const root: APISchema<Collapsible.Props> = {
	title: "Root",
	description: "The root collapsible container which manages the state of the collapsible.",
	props: {
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description:
				"Whether or not the collapsible is disabled. This prevents the user from interacting with it."
		},
		open: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description:
				"The open state of the collapsible. The content will be visible when this is true, and hidden when it's false."
		},
		onOpenChange: {
			type: {
				type: C.FUNCTION,
				definition: "(open: boolean) => void"
			},
			description: "A callback that is fired when the collapsible's open state changes."
		},
		...domElProps("HTMLDivElement")
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "disabled",
			description: "Present when the checkbox is disabled."
		},
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The collapsible's open state.",
			isEnum: true
		},
		{
			name: "collapsible-root",
			description: "Present on the root element."
		}
	]
};

export const trigger: APISchema<Collapsible.TriggerProps> = {
	title: "Trigger",
	description: "The button responsible for toggling the collapsible's open state.",
	props: domElProps("HTMLButtonElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "disabled",
			description: "Present when the checkbox is disabled."
		},
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The collapsible's open state.",
			isEnum: true
		},
		{
			name: "collapsible-trigger",
			description: "Present on the trigger element."
		}
	]
};

const contentProps = {
	...transitionProps,
	...domElProps("HTMLDivElement")
} satisfies PropObj<Collapsible.ContentProps>;

export const content: APISchema<Collapsible.ContentProps> = {
	title: "Content",
	description: "The content displayed when the collapsible is open.",
	props: contentProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "disabled",
			description: "Present when the checkbox is disabled."
		},
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The collapsible's open state.",
			isEnum: true
		},
		{
			name: "collapsible-content",
			description: "Present on the content element."
		}
	]
};

export const collapsible = [root, trigger, content];
