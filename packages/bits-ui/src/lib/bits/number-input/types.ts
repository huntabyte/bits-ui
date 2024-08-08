import type { PrimitiveInputAttributes, WithChild, Without } from "$lib/shared/index.js";

export type NumberInputRoundingMode =
	| "ceil"
	| "floor"
	| "expand"
	| "trunc"
	| "halfCeil"
	| "halfFloor"
	| "halfExpand"
	| "halfTrunc"
	| "halfEven";

export type NumberInputRootPropsWithoutHTML = WithChild<{
	/**
	 * The value of the input.
	 *
	 * @bindable
	 */
	value?: number | null;

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: (value: number | null) => void;

	/**
	 * Whether to format the value
	 *
	 * @defaultValue true
	 */
	format?: boolean;

	/**
	 * The locale to use for formatting the value.
	 */
	locale?: string | undefined;

	/**
	 * The locale matching algorithm to use. Possible values are 'lookup' and 'best fit'; the default is 'best fit'.
	 * See [Locale Negotation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locale_negotiation) for details.
	 * @defaultValue best fit
	 */
	localeMatcher?: "lookup" | "best fit";

	/**
	 * The formatting style to use. Possible values are 'decimal' and 'currency'; the default is 'decimal'.
	 * @defaultValue decimal
	 */
	mode?: "decimal" | "currency";

	/**
	 * Text to display before the value
	 */
	prefix?: string;

	/**
	 * Text to display after the value
	 */
	suffix?: string;

	/**
	 * The currency to use in currency formatting. Possible values are the [ISO 4217 currency codes](https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=maintenance-agency), such as 'USD' for the US dollar, 'EUR' for the euro, or 'CNY' for the Chinese RMB.
	 * There is no default value; if the style is 'currency', the currency property must be provided.
	 */
	currency?: string | undefined;

	/**
	 * How to display the currency in currency formatting. Possible values are 'symbol' to use
	 * a localized currency symbol such as €, 'code' to use the ISO currency code, 'name' to use
	 * a localized currency name such as 'dollar'.
	 */
	currencyDisplay?: "symbol" | "code" | "name";

	/**
	 * Whether to use a grouping separator, such as a comma, between thousands in large numbers.
	 *
	 * @defaultValue true
	 */
	useGrouping?: boolean;

	/**
	 * The minimum number of fraction digits to use. Possible values are from 0 to 20, inclusive.
	 */
	minFractionDigits?: number;

	/**
	 * The maximum number of fraction digits to use. Possible values are from 0 to 20, inclusive.
	 */
	maxFractionDigits?: number;

	/**
	 * How the decimals should be rounded.
	 */
	roundingMode?: NumberInputRoundingMode;

	/**
	 * The minimum value to allow.
	 */
	min?: number;

	/**
	 * The maximum value to allow.
	 */
	max?: number;

	/**
	 * The step to increment the value by.
	 */
	step?: number;

	/**
	 * Whether to allow empty values in the input
	 */
	allowEmpty?: boolean;

	/**
	 * Whether to highlight the value on focus
	 */
	highlightOnFocus?: boolean;

	/**
	 * Whether the input is disabled
	 */
	disabled?: boolean | null | undefined;

	/**
	 * Whether the input is readonly
	 */
	readonly?: boolean | null | undefined;

	/**
	 * The placeholder value of the input
	 */
	placeholder?: string | undefined | null;
}>;

export type NumberInputRootProps = NumberInputRootPropsWithoutHTML &
	Without<PrimitiveInputAttributes, NumberInputRootPropsWithoutHTML>;
