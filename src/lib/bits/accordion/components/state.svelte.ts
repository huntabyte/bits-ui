type AccordionValueProps =
	| {
			value: string;
			onValueChange?: (value: string) => void;
	  }
	| string;

export class AccordionValue {
	value = $state("");
	onValueChange?: (value: string) => void;

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
