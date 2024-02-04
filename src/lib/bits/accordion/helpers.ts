import { AccordionMultiState, AccordionSingleState } from "./state.svelte.js";

export function isMulti(v: unknown): v is AccordionMultiState {
	return v instanceof AccordionMultiState;
}

export function isSingle(v: unknown): v is AccordionSingleState {
	return v instanceof AccordionSingleState;
}

type SingleInitAccordionProps = {
	type: "single";
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value?: any;
};

type MultiInitAccordionProps = {
	type: "multiple";
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value?: any;
};

export function initAccordionState(props: SingleInitAccordionProps | MultiInitAccordionProps) {
	const { type, value } = props;
	return type === "single"
		? new AccordionSingleState({ value: value })
		: new AccordionMultiState({ value: value });
}
