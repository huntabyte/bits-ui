declare module "style-object-to-css-string" {
	export default objToString;
	/**
	 * Translate a style object into a CSS string
	 * @param {object} styleObj - The object to run a particular parser against
	 * @returns {string} - The CSS string
	 */
	// eslint-disable-next-line ts/no-explicit-any
	declare function objToString(styleObj: any): string;
}
