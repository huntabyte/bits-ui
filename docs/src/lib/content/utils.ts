import type { Component } from "svelte";
import type {
	APISchema,
	ComponentAPISchema,
	CSSVarSchema,
	DataAttrEnumSchema,
	DataAttrSchema,
	DataAttrStringSchema,
	PropSchema,
	PropSchemaComponent,
	PropSchemaString,
	PropTypeComponent,
	UtilityAPISchema,
} from "./types.js";

/**
 * Escapes special characters in a string to prevent them from
 * being interpreted as HTML or Svelte code.
 */
function escape(str: string): string {
	const entities = [
		[/</g, "&lt;"],
		[/>/g, "&gt;"],
		[/\{/g, "&#123;"],
		[/\}/g, "&#125;"],
	] as const;
	for (let i = 0; i < entities.length; i += 1) {
		str = str.replace(entities[i][0], entities[i][1]);
	}
	return str;
}

/**
 * Takes a list of types and returns a string containing each type
 * joined by a pipe.
 */
function union(...types: string[]): string {
	return escape(types.join(" | "));
}

/**
 * Takes a list of values and returns a string of each value wrapped
 * in single quotes and joined by a pipe.
 */
export function enums(...values: string[]): string {
	return values.map((value) => `'${value}'`).join(" | ");
}

/** Defines an API schema. */
export function defineApiSchema<T>(schema: APISchema<T>) {
	return schema;
}

export function defineComponentApiSchema<T>(
	schema: Omit<ComponentAPISchema<T>, "type" | "cssVars" | "dataAttributes"> & {
		cssVars?: CSSVarSchema[];
		dataAttributes?: DataAttrSchema[];
	}
): ComponentAPISchema<T> {
	return defineApiSchema({
		...schema,
		type: "component",
		cssVars: schema.cssVars ?? [],
		dataAttributes: schema.dataAttributes ?? [],
	}) as ComponentAPISchema<T>;
}

export function defineUtilityApiSchema<T>(schema: Omit<UtilityAPISchema<T>, "type">) {
	return defineApiSchema({
		...schema,
		type: "utility",
	});
}

/** Defines a prop schema. */
export function definePropSchema(schema: PropSchema) {
	return schema;
}

/** Defines a data attribute schema. */
export function defineDataAttrSchema(schema: DataAttrSchema) {
	return schema;
}

type SharedPropOpts = Pick<PropSchema, "description"> & {
	required?: boolean;
	bindable?: boolean;
};

function componentType(opts: Omit<PropTypeComponent, "_type">): PropTypeComponent {
	return {
		_type: "component",
		type: opts.type,
		definition: opts.definition,
		stringDefinition: escape(opts.stringDefinition),
	};
}

type DefineUnionPropOpts = SharedPropOpts & {
	options: string[];
	definition: Component;
	default?: string;
};

type DefineComponentPropOpts = Omit<PropSchemaComponent, "type" | "required" | "bindable"> & {
	type: string;
	definition: Component;
	stringDefinition: string;
	required?: boolean;
	bindable?: boolean;
};

export function defineComponentPropSchema(_opts: DefineComponentPropOpts) {
	const opts = { ...defaults, ..._opts };
	return definePropSchema({
		...opts,
		type: componentType({
			definition: opts.definition,
			stringDefinition: opts.stringDefinition,
			type: opts.type,
		}),
	});
}

type DefineStringPropSchemaOpts = Omit<
	PropSchemaString,
	"type" | "default" | "required" | "bindable"
> & {
	type: string;
	default?: string | number | boolean;
	required?: boolean;
	bindable?: boolean;
};

const defaults = { required: false, bindable: false };

export function defineStringPropSchema(_opts: DefineStringPropSchemaOpts) {
	const opts = { ...defaults, ..._opts };
	return definePropSchema({
		...opts,
		default: opts.default
			? {
					_type: "string",
					value: `${opts.default}`,
				}
			: undefined,
		type: {
			_type: "string",
			type: opts.type,
		},
	});
}

export function defineUnionProp(_opts: DefineUnionPropOpts): PropSchema {
	const opts = { ...defaults, ..._opts };
	return defineComponentPropSchema({
		...opts,
		type: "union",
		definition: opts.definition,
		stringDefinition: union(...opts.options),
		default: opts.default
			? {
					_type: "string",
					value: opts.default,
				}
			: undefined,
	});
}

type DefineEnumPropOpts = DefineUnionPropOpts;

export function defineEnumProp(opts: DefineEnumPropOpts) {
	return defineComponentPropSchema({
		...opts,
		type: "enum",
		definition: opts.definition,
		stringDefinition: enums(...opts.options),
		default: opts.default
			? {
					_type: "string",
					value: opts.default,
				}
			: undefined,
	});
}

type OptionalComponentDefault = { default?: never } | { default: Component; stringDefault: string };

type DefineObjectPropOpts = SharedPropOpts &
	Pick<PropTypeComponent, "definition" | "stringDefinition"> &
	OptionalComponentDefault;

export function defineObjectProp(opts: DefineObjectPropOpts) {
	return defineComponentPropSchema({
		...opts,
		type: "object",
		definition: opts.definition,
		stringDefinition: opts.stringDefinition,
		default: opts.default
			? {
					_type: "component",
					value: opts.default,
					stringValue: escape(opts.stringDefault),
				}
			: undefined,
	});
}

type DefineFunctionPropOpts = DefineObjectPropOpts;

export function defineFunctionProp(opts: DefineFunctionPropOpts) {
	return defineComponentPropSchema({
		...opts,
		type: "function",
		definition: opts.definition,
		stringDefinition: opts.stringDefinition,
		default: opts.default
			? {
					_type: "component",
					value: opts.default,
					stringValue: escape(opts.stringDefault),
				}
			: undefined,
	});
}

export type DefineBooleanPropOpts = SharedPropOpts & {
	default?: boolean;
};

export function defineBooleanProp(_opts: DefineBooleanPropOpts) {
	const opts = { ...defaults, ..._opts };
	return defineStringPropSchema({
		type: "boolean",
		...opts,
		default: opts.default,
	});
}

export type DefineStringPropOpts = SharedPropOpts & {
	default?: string;
};

export function defineStringProp(_opts: DefineStringPropOpts) {
	const opts = { ...defaults, ..._opts };
	return defineStringPropSchema({
		type: "string",
		...opts,
		default: opts.default,
	});
}

export type DefineNumberPropOpts = SharedPropOpts & {
	default?: number;
};

export function defineNumberProp(_opts: DefineNumberPropOpts) {
	const opts = { ...defaults, ..._opts };
	return defineStringPropSchema({
		type: "number",
		...opts,
		default: opts.default,
	});
}

type DefineEnumDataAttrOpts = Omit<DataAttrEnumSchema, "_type" | "stringValue"> & {
	options: string[];
};

export function defineEnumDataAttr(opts: DefineEnumDataAttrOpts) {
	const { options: enumOptions, ...rest } = opts;
	return defineDataAttrSchema({
		_type: "enum",
		stringValue: enums(...enumOptions),
		...rest,
	});
}

export function defineStringDataAttr(
	opts: Omit<DataAttrStringSchema, "_type" | "value"> & { value?: string }
) {
	return defineDataAttrSchema({
		_type: "string",
		value: opts.value ?? "''",
		...opts,
	});
}

export function defineCSSVarSchema(opts: CSSVarSchema) {
	return opts;
}
