/**
 * These types are exported from the root of the package for
 * convenience. We have to prefix them with the component name to avoid
 * conflicts with other components.
 */

import type {
	Props,
	ContentProps,
	TriggerProps,
	//
	// Events
	//
	TriggerEvents
} from "./types.js";

export type {
	Props as CollapsibleProps,
	ContentProps as CollapsibleContentProps,
	TriggerProps as CollapsibleTriggerProps,
	//
	// Events
	//
	TriggerEvents as CollapsibleTriggerEvents
};
