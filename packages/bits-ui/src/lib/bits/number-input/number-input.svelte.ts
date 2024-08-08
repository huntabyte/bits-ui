import { untrack } from "svelte";
import type { NumberInputRoundingMode } from "./types.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { clearSelection, getSelection } from "$lib/internal/dom.js";
import { isBrowser, isNotEmpty } from "$lib/internal/is.js";
import { createContext } from "$lib/internal/createContext.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";

type InputOperation =
	| "range-insert"
	| "insert"
	| "delete-back-single"
	| "delete-single"
	| "delete-range"
	| "spin";

type NumberInputStateProps = WithRefProps<{}, HTMLInputElement> &
	WritableBoxedValues<{
		value: number | null;
	}> &
	ReadableBoxedValues<{
		format: boolean;
		locale: string;
		localeMatcher: "lookup" | "best fit";
		mode: "decimal" | "currency";
		prefix: string | undefined;
		suffix: string | undefined;
		currency: string | undefined;
		currencyDisplay: "symbol" | "code" | "name";
		useGrouping: boolean;
		minFractionDigits: number;
		maxFractionDigits: number;
		min: number | undefined;
		max: number | undefined;
		step: number;
		allowEmpty: boolean;
		readonly: boolean | null | undefined;
		roundingMode: NumberInputRoundingMode;
		disabled: boolean | null | undefined;
		highlightOnFocus: boolean;
	}>;

class NumberInputRootState {
	#id: NumberInputStateProps["id"];
	#ref: NumberInputStateProps["ref"];
	#value: NumberInputStateProps["value"];
	#format: NumberInputStateProps["format"];
	#locale: NumberInputStateProps["locale"];
	#localeMatcher: NumberInputStateProps["localeMatcher"];
	#mode: NumberInputStateProps["mode"];
	#currency: NumberInputStateProps["currency"];
	#currencyDisplay: NumberInputStateProps["currencyDisplay"];
	#useGrouping: NumberInputStateProps["useGrouping"];
	#minFractionDigits: NumberInputStateProps["minFractionDigits"];
	#maxFractionDigits: NumberInputStateProps["maxFractionDigits"];
	#roundingMode: NumberInputStateProps["roundingMode"];
	#prefixProp: NumberInputStateProps["prefix"];
	#suffixProp: NumberInputStateProps["suffix"];
	#min: NumberInputStateProps["min"];
	#max: NumberInputStateProps["max"];
	#step: NumberInputStateProps["step"];
	#allowEmpty: NumberInputStateProps["allowEmpty"];
	#readonly: NumberInputStateProps["readonly"];
	#disabled: NumberInputStateProps["disabled"];
	#highlightOnFocus: NumberInputStateProps["highlightOnFocus"];
	//
	#numberFormat = undefined as unknown as Intl.NumberFormat;
	#numeralExp = undefined as unknown as RegExp;
	#groupExp = undefined as unknown as RegExp;
	#minusSignExp = undefined as unknown as RegExp;
	#decimalExp = undefined as unknown as RegExp;
	#suffixExp = undefined as unknown as RegExp;
	#prefixExp = undefined as unknown as RegExp;
	#currencyExp = undefined as unknown as RegExp;
	#index = undefined as unknown as (n: string) => number | undefined;
	#groupChar: string = "";
	#isSpecialChar: boolean | null = null;
	#prefixChar: string | undefined = undefined;
	#suffixChar: string | undefined = undefined;

	#isDecimalMode = $derived.by(() => this.#mode.current === "decimal");
	#allowMinusSign = $derived.by(() => this.#min.current === null || (this.#min.current ?? 0) < 0);
	#focused = $state(false);
	#timer = $state<number | null>(null);
	#maxBoundary = $derived.by(() => (this.#value.current ?? 0) >= (this.#max.current ?? 0));
	#minBoundary = $derived.by(() => (this.#value.current ?? 0) <= (this.#min.current ?? 0));
	#lastValue = $state("");
	#indexMap = new Map<string, number>();
	formattedValue = $derived.by(() => {
		const val =
			this.#value.current === null && !this.#allowEmpty.current ? 0 : this.#value.current;
		console.log("formattedValue", val);
		return this.#formatValue(Number(val));
	});

	constructor(props: NumberInputStateProps) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#value = props.value;
		this.#format = props.format;
		this.#locale = props.locale;
		this.#localeMatcher = props.localeMatcher;
		this.#mode = props.mode;
		this.#prefixProp = props.prefix;
		this.#suffixProp = props.suffix;
		this.#currency = props.currency;
		this.#currencyDisplay = props.currencyDisplay;
		this.#useGrouping = props.useGrouping;
		this.#minFractionDigits = props.minFractionDigits;
		this.#maxFractionDigits = props.maxFractionDigits;
		this.#min = props.min;
		this.#max = props.max;
		this.#step = props.step;
		this.#allowEmpty = props.allowEmpty;
		this.#readonly = props.readonly;
		this.#disabled = props.disabled;
		this.#roundingMode = props.roundingMode;
		this.#highlightOnFocus = props.highlightOnFocus;

		$effect(() => {
			this.#numberFormat = new Intl.NumberFormat(
				this.#locale.current,
				this.#numberFormatOpts
			);

			const numerals = [
				...new Intl.NumberFormat(this.#locale.current, { useGrouping: false }).format(
					9876543210
				),
			].reverse();
			this.#indexMap = new Map(numerals.map((d, i) => [d, i]));
			this.#numeralExp = new RegExp(`[${numerals.join("")}]`, "g");
			this.#groupExp = this.#getGroupingExp();
			this.#minusSignExp = this.#getMinusSignExp();
			this.#decimalExp = this.#getDecimalExp();
			this.#suffixExp = this.#getSuffixExp();
			this.#prefixExp = this.#getPrefixExp();
			this.#currencyExp = this.#getCurrencyExp();
			this.#index = (d) => this.#indexMap.get(d);
		});

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		$effect(() => {});
	}

	#createParser = () => {
		// will need to update when the dependent props change, just dont want to create infnite loop atm
		untrack(() => {
			this.#numberFormat = new Intl.NumberFormat(
				this.#locale.current,
				this.#numberFormatOpts
			);
			const numerals = [
				...new Intl.NumberFormat(this.#locale.current, { useGrouping: false }).format(
					9876543210
				),
			].reverse();
			const index = new Map(numerals.map((d, i) => [d, i]));

			this.#numeralExp = new RegExp(`[${numerals.join("")}]`, "g");
			this.#groupExp = this.#getGroupingExp();
			this.#minusSignExp = this.#getMinusSignExp();
			this.#currencyExp = this.#getCurrencyExp();
			this.#decimalExp = this.#getDecimalExp();
			this.#suffixExp = this.#getSuffixExp();
			this.#prefixExp = this.#getPrefixExp();
			this.#index = (d) => index.get(d);
		});
	};

	#numberFormatOpts: Intl.NumberFormatOptions = $derived.by(() => ({
		localeMatcher: this.#localeMatcher.current,
		style: this.#mode.current,
		currency: this.#currency.current,
		currencyDisplay: this.#currencyDisplay.current,
		minimumFractionDigits: this.#minFractionDigits.current,
		maximumFractionDigits: this.#maxFractionDigits.current,
		useGrouping: this.#useGrouping.current,
		roundingMode: this.#roundingMode.current,
	}));

	#escapeRegExp = (str: string): string => {
		return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};

	#getDecimalExp = (): RegExp => {
		const formatter = new Intl.NumberFormat(this.#locale.current, {
			...this.#numberFormatOpts,
			useGrouping: false,
		});

		return new RegExp(
			`[${formatter.format(1.1).replace(this.#currencyExp, "").trim().replace(this.#numeralExp, "")}]`,
			"g"
		);
	};

	#getGroupingExp = (): RegExp => {
		const formatter = new Intl.NumberFormat(this.#locale.current, { useGrouping: true });

		this.#groupChar = formatter.format(1000000).trim().replace(this.#numeralExp, "").charAt(0);

		return new RegExp(`[${this.#groupChar}]`, "g");
	};

	#getMinusSignExp = (): RegExp => {
		const formatter = new Intl.NumberFormat(this.#locale.current, { useGrouping: false });

		return new RegExp(`[${formatter.format(-1).trim().replace(this.#numeralExp, "")}]`, "g");
	};

	#getCurrencyExp = (): RegExp => {
		if (this.#currency.current) {
			const formatter = new Intl.NumberFormat(this.#locale.current, {
				style: "currency",
				currency: this.#currency.current,
				currencyDisplay: this.#currencyDisplay.current,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
				roundingMode: this.#roundingMode.current,
			});

			return new RegExp(
				`[${formatter.format(1).replace(/\s/g, "").replace(this.#numeralExp, "").replace(this.#groupExp, "")}]`,
				"g"
			);
		}

		// eslint-disable-next-line prefer-regex-literals, regexp/no-empty-character-class
		return new RegExp(`[]`, "g");
	};

	#getPrefixExp = (): RegExp => {
		if (this.#prefixProp.current) {
			this.#prefixChar = this.#prefixProp.current;
		} else {
			const formatter = new Intl.NumberFormat(this.#locale.current, {
				style: this.#mode.current,
				currency: this.#currency.current,
				currencyDisplay: this.#currencyDisplay.current,
			});

			this.#prefixChar = formatter.format(1).split("1")[0];
		}

		return new RegExp(`${this.#escapeRegExp(this.#prefixChar || "")}`, "g");
	};

	#getSuffixExp = (): RegExp => {
		if (this.#suffixProp.current) {
			this.#suffixChar = this.#suffixProp.current;
		} else {
			const formatter = new Intl.NumberFormat(this.#locale.current, {
				style: this.#mode.current,
				currency: this.#currency.current,
				currencyDisplay: this.#currencyDisplay.current,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
				roundingMode: this.#roundingMode.current,
			});

			this.#suffixChar = formatter.format(1).split("1")[1];
		}

		return new RegExp(`${this.#escapeRegExp(this.#suffixChar || "")}`, "g");
	};

	#repeat = (interval: number, dir: number) => {
		if (this.#readonly.current) return;

		let i = interval || 500;

		this.#clearTimer();
		this.#timer = window.setTimeout(() => {
			this.#repeat(40, dir);
		}, i);

		this.#spin(dir);
	};

	#formatValue = (value: number | string) => {
		if (value == null) return "";
		if (value === "-") return value;

		if (this.#format.current) {
			let formatter = new Intl.NumberFormat(this.#locale.current, this.#numberFormatOpts);
			let formattedValue = formatter.format(value as number);

			if (this.#prefixProp.current) {
				formattedValue = this.#prefixProp.current + formattedValue;
			}

			if (this.#suffixProp.current) {
				formattedValue = formattedValue + this.#suffixProp.current;
			}

			return formattedValue;
		}

		return value.toString();
	};

	#parseValue = (v: string) => {
		const filteredValue = v
			.replace(this.#suffixExp, "")
			.replace(this.#prefixExp, "")
			.trim()
			.replace(/\s/g, "")
			.replace(this.#currencyExp, "")
			.replace(this.#groupExp, "")
			.replace(this.#minusSignExp, "-")
			.replace(this.#decimalExp, ".")
			// @ts-expect-error - we're using a custom index function
			.replace(this.#numeralExp, this.#index);

		// value is an empty string, return null
		if (!filteredValue) return null;

		// if the user is starting with a `-` we just return it as is
		if (filteredValue === "-") return filteredValue;

		// after going through the above checks, the value should be a string with
		// a number that can be safely parsed
		const parsedValue = Number(filteredValue);

		// if the parsed value is NaN, return null, otherwise return the parsed value
		return Number.isNaN(parsedValue) ? null : parsedValue;
	};

	/**
	 * Validates the value to ensure it is a number and within the min and max bounds
	 */
	#validateValue = (value: "-" | number | null): number | null => {
		if (value === "-" || value == null) return null;
		const min = this.#min.current;
		const max = this.#max.current;

		if (min != null && Number(value) < min) return min;
		if (max != null && Number(value) > max) return max;
		return value;
	};

	#insert = (text: string, sign = { isDecimalSign: false, isMinusSign: false }) => {
		const minusCharIndexOnText = text.search(this.#minusSignExp);

		this.#minusSignExp.lastIndex = 0;

		if (!this.#allowMinusSign && minusCharIndexOnText !== -1) {
			return;
		}
		const node = this.#ref.current;
		if (!node) return;

		const selectionStart = node.selectionStart ?? 0;
		const selectionEnd = node.selectionEnd ?? 0;
		const inputValue = node.value.trim();
		const { decimalCharIndex, minusCharIndex, suffixCharIndex, currencyCharIndex } =
			this.#getCharIndexes(inputValue);
		let newValueStr;

		if (sign.isMinusSign) {
			if (selectionStart === 0) {
				newValueStr = inputValue;

				if (minusCharIndex === -1 || selectionEnd !== 0) {
					newValueStr = this.#insertText(inputValue, text, 0, selectionEnd);
				}

				this.#updateValue(newValueStr, text, "insert");
			}
		} else if (sign.isDecimalSign) {
			if (decimalCharIndex > 0 && selectionStart === decimalCharIndex) {
				this.#updateValue(inputValue, text, "insert");
			} else if (decimalCharIndex > selectionStart && decimalCharIndex < selectionEnd) {
				newValueStr = this.#insertText(inputValue, text, selectionStart, selectionEnd);
				this.#updateValue(newValueStr, text, "insert");
			} else if (decimalCharIndex === -1 && this.#maxFractionDigits.current) {
				newValueStr = this.#insertText(inputValue, text, selectionStart, selectionEnd);
				this.#updateValue(newValueStr, text, "insert");
			}
		} else {
			const maxFractionDigits = this.#numberFormat.resolvedOptions().maximumFractionDigits;
			const operation = selectionStart !== selectionEnd ? "range-insert" : "insert";

			if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
				if (selectionStart + text.length - (decimalCharIndex + 1) <= maxFractionDigits!) {
					const charIndex =
						currencyCharIndex >= selectionStart
							? currencyCharIndex - 1
							: suffixCharIndex >= selectionStart
								? suffixCharIndex
								: inputValue.length;

					newValueStr =
						inputValue.slice(0, selectionStart) +
						text +
						inputValue.slice(selectionStart + text.length, charIndex) +
						inputValue.slice(charIndex);
					this.#updateValue(newValueStr, text, operation);
				}
			} else {
				newValueStr = this.#insertText(inputValue, text, selectionStart, selectionEnd);
				this.#updateValue(newValueStr, text, operation);
			}
		}
	};

	#getCharIndexes = (val: string) => {
		const decimalCharIndex = val.search(this.#decimalExp);

		this.#decimalExp.lastIndex = 0;
		const minusCharIndex = val.search(this.#minusSignExp);

		this.#minusSignExp.lastIndex = 0;
		const suffixCharIndex = val.search(this.#suffixExp);

		this.#suffixExp.lastIndex = 0;
		const currencyCharIndex = val.search(this.#currencyExp);

		this.#currencyExp.lastIndex = 0;

		return { decimalCharIndex, minusCharIndex, suffixCharIndex, currencyCharIndex };
	};

	// #isValueChanged = (
	// 	currentValue: string | number | null | undefined,
	// 	newValue: string | number | null | undefined
	// ) => {
	// 	if (newValue === null && currentValue !== null) return true;

	// 	if (newValue != null) {
	// 		const parsedCurrentValue =
	// 			typeof currentValue === "string" ? this.#parseValue(currentValue) : currentValue;

	// 		return newValue !== parsedCurrentValue;
	// 	}

	// 	return false;
	// };

	#insertText = (value: string, text: string, start: number, end: number) => {
		let textSplit = text === "." ? text : text.split(".");

		if (textSplit.length === 2) {
			const decimalCharIndex = value.slice(start, end).search(this.#decimalExp);

			this.#decimalExp.lastIndex = 0;

			return decimalCharIndex > 0
				? value.slice(0, start) + this.#formatValue(text) + value.slice(end)
				: this.#formatValue(text) || value;
		} else if (end - start === value.length) {
			return this.#formatValue(text);
		} else if (start === 0) {
			return text + value.slice(end);
		} else if (end === value.length) {
			return value.slice(0, start) + text;
		} else {
			return value.slice(0, start) + text + value.slice(end);
		}
	};

	#deleteRange = (value: string, start: number, end: number) => {
		let newValueStr;

		if (end - start === value.length) newValueStr = "";
		else if (start === 0) newValueStr = value.slice(end);
		else if (end === value.length) newValueStr = value.slice(0, start);
		else newValueStr = value.slice(0, start) + value.slice(end);

		return newValueStr;
	};

	#isNumeralChar = (char: string): boolean => {
		if (
			char.length === 1 &&
			(this.#numeralExp.test(char) ||
				this.#decimalExp.test(char) ||
				this.#groupExp.test(char) ||
				this.#minusSignExp.test(char))
		) {
			this.#resetRegex();
			return true;
		}

		return false;
	};

	#isMinusSign = (char: string) => {
		if (this.#minusSignExp.test(char) || char === "-") {
			this.#minusSignExp.lastIndex = 0;
			return true;
		}

		return false;
	};

	#isDecimalSign = (char: string) => {
		if (this.#decimalExp.test(char)) {
			this.#decimalExp.lastIndex = 0;
			return true;
		}

		return false;
	};

	#spin = (dir: number) => {
		const node = this.#ref.current;
		if (!node) return;
		const step = this.#step.current * dir;
		const currValue = this.#parseValue(node.value) || 0;
		if (currValue === "-") return;
		const newValue = this.#validateValue(currValue + step);
		this.#updateInput(newValue!, null, "spin");
		this.#value.current = Number(newValue);
	};

	#updateInput = (
		value: string | number,
		insertedValueStr: string | null | undefined,
		operation: InputOperation,
		valueStr?: string
	) => {
		insertedValueStr = insertedValueStr || "";
		const node = this.#ref.current;
		if (!node) return;

		let inputValue = node.value;
		let newValue = this.#formatValue(value);
		let currentLength = inputValue.length;

		if (newValue !== valueStr) {
			newValue = this.#concatValues(newValue, valueStr);
		}

		if (currentLength === 0) {
			node.value = newValue;
			node.setSelectionRange(0, 0);
			const index = this.#initCursor();
			const selectionEnd = index + insertedValueStr.length;

			node.setSelectionRange(selectionEnd, selectionEnd);
		} else {
			let selectionStart = node.selectionStart ?? 0;
			let selectionEnd = node.selectionEnd ?? 0;

			node.value = newValue;
			let newLength = newValue.length;

			if (operation === "range-insert") {
				const startValue = this.#parseValue((inputValue || "").slice(0, selectionStart));
				const startValueStr = startValue !== null ? startValue.toString() : "";
				const startExpr = startValueStr.split("").join(`(${this.#groupChar})?`);
				const sRegex = new RegExp(startExpr, "g");

				sRegex.test(newValue);

				const tExpr = insertedValueStr.split("").join(`(${this.#groupChar})?`);
				const tRegex = new RegExp(tExpr, "g");

				tRegex.test(newValue.slice(sRegex.lastIndex));

				selectionEnd = sRegex.lastIndex + tRegex.lastIndex;
				node.setSelectionRange(selectionEnd, selectionEnd);
			} else if (newLength === currentLength) {
				if (operation === "insert" || operation === "delete-back-single") {
					node.setSelectionRange(selectionEnd + 1, selectionEnd + 1);
				} else if (operation === "delete-single") {
					node.setSelectionRange(selectionEnd - 1, selectionEnd - 1);
				} else if (operation === "delete-range" || operation === "spin") {
					node.setSelectionRange(selectionEnd, selectionEnd);
				}
			} else if (operation === "delete-back-single") {
				let prevChar = inputValue.charAt(selectionEnd - 1);
				let nextChar = inputValue.charAt(selectionEnd);
				let diff = currentLength - newLength;
				let isGroupChar = this.#groupExp.test(nextChar);

				if (isGroupChar && diff === 1) {
					selectionEnd += 1;
				} else if (!isGroupChar && this.#isNumeralChar(prevChar)) {
					selectionEnd += -1 * diff + 1;
				}

				this.#groupExp.lastIndex = 0;
				node.setSelectionRange(selectionEnd, selectionEnd);
			} else if (inputValue === "-" && operation === "insert") {
				node.setSelectionRange(0, 0);
				const index = this.#initCursor();
				const selectionEnd = index + insertedValueStr.length + 1;

				node.setSelectionRange(selectionEnd, selectionEnd);
			} else {
				selectionEnd = selectionEnd + (newLength - currentLength);
				node.setSelectionRange(selectionEnd, selectionEnd);
			}
		}

		node.setAttribute("aria-valuenow", `${value}`);
	};

	#getDecimalCharIndexes = (val: string) => {
		const decimalCharIndex = val.search(this.#decimalExp);

		this.#decimalExp.lastIndex = 0;

		const filteredVal = val
			.replace(this.#prefixExp, "")
			.trim()
			.replace(/\s/g, "")
			.replace(this.#currencyExp, "");
		const decimalCharIndexWithoutPrefix = filteredVal.search(this.#decimalExp);

		this.#decimalExp.lastIndex = 0;

		return { decimalCharIndex, decimalCharIndexWithoutPrefix };
	};

	#getDecimalLength = (v: string | null) => {
		if (v) {
			const valueSplit = v.split(this.#decimalExp);

			if (valueSplit.length === 2) {
				return valueSplit[1]!
					.replace(this.#suffixExp, "")
					.trim()
					.replace(/\s/g, "")
					.replace(this.#currencyExp, "").length;
			}
		}

		return 0;
	};

	#updateValue = (
		valueStr: string | null,
		insertedValueStr: string | null,
		operation: InputOperation
	) => {
		const node = this.#ref.current;
		if (!node) return;
		let newValue = null;

		if (valueStr != null) {
			newValue = this.#parseValue(valueStr);
			newValue = !newValue && !this.#allowEmpty.current ? 0 : newValue;
			this.#updateInput(newValue!, insertedValueStr, operation, valueStr);
		}
	};

	#concatValues = (v1: string, v2?: string) => {
		if (!v1 || !v2) return v1;

		const decimalCharIndex = v2.search(this.#decimalExp);

		this.#decimalExp.lastIndex = 0;

		if (this.#suffixChar) {
			return decimalCharIndex !== -1
				? v1.replace(this.#suffixChar, "").split(this.#decimalExp)[0] +
						v2.replace(this.#suffixChar, "").slice(decimalCharIndex) +
						this.#suffixChar
				: v1;
		} else {
			return decimalCharIndex !== -1
				? v1.split(this.#decimalExp)[0] + v2.slice(decimalCharIndex)
				: v1;
		}
	};

	#resetRegex = () => {
		this.#numeralExp.lastIndex = 0;
		this.#decimalExp.lastIndex = 0;
		this.#groupExp.lastIndex = 0;
		this.#minusSignExp.lastIndex = 0;
	};

	#initCursor = () => {
		const node = this.#ref.current;
		if (!node) return 0;

		let selectionStart = node.selectionStart ?? 0;
		let inputValue = node.value;
		const valueLength = inputValue.length;
		let index = null;

		const prefixLength = (this.#prefixChar || "").length;

		inputValue = inputValue.replace(this.#prefixExp, "");
		selectionStart = selectionStart - prefixLength;

		let char = inputValue.charAt(selectionStart);

		if (this.#isNumeralChar(char)) {
			return selectionStart + prefixLength;
		}

		//left
		let i = selectionStart - 1;

		while (i >= 0) {
			char = inputValue.charAt(i);

			if (this.#isNumeralChar(char)) {
				index = i + prefixLength;
				break;
			} else {
				i--;
			}
		}

		if (index !== null) {
			node.setSelectionRange(index + 1, index + 1);
		} else {
			i = selectionStart;

			while (i < valueLength) {
				char = inputValue.charAt(i);

				if (this.#isNumeralChar(char)) {
					index = i + prefixLength;
					break;
				} else {
					i++;
				}
			}

			if (index !== null) {
				node.setSelectionRange(index, index);
			}
		}

		return index || 0;
	};

	#clearTimer = () => {
		if (this.#timer === null) return;
		clearInterval(this.#timer);
	};

	#onfocus = (e: FocusEvent & { currentTarget: HTMLInputElement }) => {
		this.#focused = true;

		if (
			!this.#disabled.current &&
			!this.#readonly.current &&
			this.#ref.current?.value !== getSelection() &&
			this.#highlightOnFocus.current
		) {
			e.currentTarget.select();
		}
	};

	#onblur = (e: FocusEvent & { currentTarget: HTMLInputElement }) => {
		this.#focused = false;

		const input = e.currentTarget;
		const newValue = this.#validateValue(this.#parseValue(input.value));

		input.value = this.#formatValue(newValue ?? "");
		input.setAttribute("aria-valuenow", `${newValue}`);
		this.#value.current = Number(newValue);

		if (!this.#disabled.current && !this.#readonly.current && this.#highlightOnFocus.current) {
			clearSelection();
		}
	};

	#onpaste = (e: ClipboardEvent & { currentTarget: HTMLInputElement }) => {
		e.preventDefault();
		const data = e.clipboardData?.getData("Text");

		if (!data) return;

		const filteredData = this.#parseValue(data);
		if (filteredData != null) {
			this.#insert(filteredData.toString());
		}
	};

	#onkeypress = (e: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
		if (this.#readonly.current) return;

		const char = e.key;
		const isDecimalSign = this.#isDecimalSign(char);
		const isMinusSign = this.#isMinusSign(char);

		if (e.code !== "Enter") {
			e.preventDefault();
		}

		const numChar = Number(char);

		if ((numChar >= 0 && numChar <= 9) || isMinusSign || isDecimalSign) {
			this.#insert(char, { isDecimalSign, isMinusSign });
		}
	};

	#onkeydown = (e: KeyboardEvent & { target: HTMLInputElement }) => {
		if (this.#readonly.current) return;
		const node = this.#ref.current;
		if (!node) return;

		if (e.altKey || e.ctrlKey || e.metaKey) {
			this.#isSpecialChar = true;
			this.#lastValue = node.value;

			return;
		}

		this.#lastValue = e.target.value;

		let selectionStart = e.target.selectionStart ?? 0;
		let selectionEnd = e.target.selectionEnd ?? 0;
		let inputValue = e.target.value;
		let newValueStr = null;

		switch (e.code) {
			case "ArrowUp":
				this.#spin(1);
				e.preventDefault();
				break;

			case "ArrowDown":
				this.#spin(-1);
				e.preventDefault();
				break;

			case "ArrowLeft":
				if (!this.#isNumeralChar(inputValue.charAt(selectionStart - 1))) {
					e.preventDefault();
				}

				break;

			case "ArrowRight":
				if (!this.#isNumeralChar(inputValue.charAt(selectionStart))) {
					e.preventDefault();
				}

				break;

			case "Tab":
			case "Enter":
			case "NumpadEnter":
				newValueStr = this.#validateValue(this.#parseValue(inputValue));
				node.value = this.#formatValue(newValueStr!);
				node.setAttribute("aria-valuenow", `${newValueStr}`);
				this.#value.current = Number(newValueStr);
				break;

			case "Backspace": {
				e.preventDefault();

				if (selectionStart === selectionEnd) {
					const deleteChar = inputValue.charAt(selectionStart - 1);
					const { decimalCharIndex, decimalCharIndexWithoutPrefix } =
						this.#getDecimalCharIndexes(inputValue);

					if (this.#isNumeralChar(deleteChar)) {
						const decimalLength = this.#getDecimalLength(inputValue);

						if (this.#groupExp.test(deleteChar)) {
							this.#groupExp.lastIndex = 0;
							newValueStr =
								inputValue.slice(0, selectionStart - 2) +
								inputValue.slice(selectionStart - 1);
						} else if (this.#decimalExp.test(deleteChar)) {
							this.#decimalExp.lastIndex = 0;

							if (decimalLength) {
								node.setSelectionRange(selectionStart - 1, selectionStart - 1);
							} else {
								newValueStr =
									inputValue.slice(0, selectionStart - 1) +
									inputValue.slice(selectionStart);
							}
						} else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
							const insertedText =
								this.#isDecimalMode &&
								(this.#minFractionDigits.current || 0) < decimalLength
									? ""
									: "0";

							newValueStr =
								inputValue.slice(0, selectionStart - 1) +
								insertedText +
								inputValue.slice(selectionStart);
						} else if (decimalCharIndexWithoutPrefix === 1) {
							newValueStr = `${inputValue.slice(0, selectionStart - 1)}0${inputValue.slice(selectionStart)}`;
							newValueStr =
								(this.#parseValue(newValueStr) ?? 0 > 0) ? newValueStr : "";
						} else {
							newValueStr =
								inputValue.slice(0, selectionStart - 1) +
								inputValue.slice(selectionStart);
						}
					}

					this.#updateValue(newValueStr, null, "delete-single");
				} else {
					newValueStr = this.#deleteRange(inputValue, selectionStart, selectionEnd);
					this.#updateValue(newValueStr, null, "delete-range");
				}

				break;
			}

			case "Delete":
				e.preventDefault();

				if (selectionStart === selectionEnd) {
					const deleteChar = inputValue.charAt(selectionStart);
					const { decimalCharIndex, decimalCharIndexWithoutPrefix } =
						this.#getDecimalCharIndexes(inputValue);

					if (this.#isNumeralChar(deleteChar)) {
						const decimalLength = this.#getDecimalLength(inputValue);

						if (this.#groupExp.test(deleteChar)) {
							this.#groupExp.lastIndex = 0;
							newValueStr =
								inputValue.slice(0, selectionStart) +
								inputValue.slice(selectionStart + 2);
						} else if (this.#decimalExp.test(deleteChar)) {
							this.#decimalExp.lastIndex = 0;

							if (decimalLength) {
								node.setSelectionRange(selectionStart + 1, selectionStart + 1);
							} else {
								newValueStr =
									inputValue.slice(0, selectionStart) +
									inputValue.slice(selectionStart + 1);
							}
						} else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
							const insertedText =
								this.#isDecimalMode &&
								(this.#minFractionDigits.current || 0) < decimalLength
									? ""
									: "0";

							newValueStr =
								inputValue.slice(0, selectionStart) +
								insertedText +
								inputValue.slice(selectionStart + 1);
						} else if (decimalCharIndexWithoutPrefix === 1) {
							newValueStr = `${inputValue.slice(0, selectionStart)}0${inputValue.slice(selectionStart + 1)}`;
							const parsedV = this.#parseValue(newValueStr);
							if (typeof parsedV === "number") {
								newValueStr = parsedV > 0 ? newValueStr : "";
							}
						} else {
							newValueStr =
								inputValue.slice(0, selectionStart) +
								inputValue.slice(selectionStart + 1);
						}
					}

					this.#updateValue(newValueStr, null, "delete-back-single");
				} else {
					newValueStr = this.#deleteRange(inputValue, selectionStart, selectionEnd);
					this.#updateValue(newValueStr, null, "delete-range");
				}

				break;

			case "Home":
				e.preventDefault();

				if (isNotEmpty(this.#min.current)) {
					this.#value.current = this.#min.current!;
				}

				break;

			case "End":
				e.preventDefault();

				if (isNotEmpty(this.#max.current)) {
					this.#value.current = this.#max.current!;
				}

				break;

			default:
				break;
		}
	};

	#onclick = () => {
		const node = this.#ref.current;
		if (!node) return;
		const currValue = node.value;

		if (!this.#readonly.current && currValue !== getSelection()) {
			this.#initCursor();
		}
	};

	#oninput = (e: Event & { currentTarget: HTMLInputElement }) => {
		if (this.#isSpecialChar) {
			e.currentTarget.value = this.#lastValue;
		}
		this.#isSpecialChar = false;
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "spinbutton",
				value: this.formattedValue,
				"aria-valuemin": this.#min.current,
				"aria-valuemax": this.#max.current,
				"aria-valuenow": this.#value.current,
				inputmode:
					this.#mode.current === "decimal" && !this.#minFractionDigits.current
						? "numeric"
						: "decimal",
				disabled: this.#disabled.current,
				readonly: this.#readonly.current,
				//
				oninput: this.#oninput,
				onkeydown: this.#onkeydown,
				onkeypress: this.#onkeypress,
				onpaste: this.#onpaste,
				onclick: this.#onclick,
				onfocus: this.#onfocus,
				onblur: this.#onblur,
			}) as const
	);
}

const [setNumberInputRootContext, getNumberInputRootContext] =
	createContext<NumberInputRootState>("NumberInput.Root");

export function useNumberInputRoot(props: NumberInputStateProps) {
	return setNumberInputRootContext(new NumberInputRootState(props));
}

////////////////////////////////////
// Helpers
////////////////////////////////////

function getSelectionBounds(node: HTMLInputElement) {
	return {
		selectionStart: node.selectionStart ?? 0,
		selectionEnd: node.selectionEnd ?? 0,
	};
}
