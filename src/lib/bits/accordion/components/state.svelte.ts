type AccordionValueProps =
	| {
			value: string;
			onValueChange?: (value: string) => void;
	  }
	| string;

export class AccordionValue {
	value = $state("");
	onValueChange?: (value: string) => void;

	isMulti = false as const;

	constructor(props: AccordionValueProps = "") {
		if (typeof props === "string") {
			this.value = props;
		} else {
			this.value = props.value;
			this.onValueChange = props.onValueChange;
		}

		$effect(() => {
			this.onValueChange?.(this.value);
		});
	}
}

type AccordionMultiValueProps =
	| {
			value: string[];
			onValueChange?: (value: string[]) => void;
	  }
	| string[];

export class AccordionMultiValue {
	value: string[] = $state([]);
	onValueChange?: (value: string[]) => void;

	isMulti = true as const;

	constructor(props: AccordionMultiValueProps = []) {
		if (Array.isArray(props)) {
			this.value.push(...props);
		} else {
			this.value = props.value;
			this.onValueChange = props.onValueChange;
		}

		$effect(() => {
			this.onValueChange?.(this.value);
		});
	}
}
