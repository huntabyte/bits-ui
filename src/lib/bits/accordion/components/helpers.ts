import { AccordionMultiValue, AccordionValue } from "./state.svelte.js";

export function isMulti(v: unknown): v is AccordionMultiValue {
	return v instanceof AccordionMultiValue;
}

export function isSingle(v: unknown): v is AccordionValue {
	return v instanceof AccordionValue;
}

export function getAccordionValue(type: "single" | "multiple") {
	return type === "single" ? new AccordionValue() : new AccordionMultiValue();
}