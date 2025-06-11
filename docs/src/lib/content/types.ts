import type { Component } from "svelte";

export type PropTypeSimple = {
	variant: "simple";
	type: string;
};

export type PropTypeComplex = {
	variant: "complex";
	type: string;
	definition: Component;
	stringDefinition: string;
};

export type PropType = PropTypeSimple | PropTypeComplex;

export type PropDefaultSimple = {
	variant: "simple";
	value: string;
};

export type PropDefaultComplex = {
	variant: "complex";
	value: Component;
	stringValue: string;
};

export type PropDefault = PropDefaultSimple | PropDefaultComplex;

type PropSchemaBase = {
	description: string;
	required: boolean;
	bindable: boolean;
	default?: PropDefault;
};

export type PropSchemaSimple = PropSchemaBase & {
	type: PropTypeSimple;
};

export type PropSchemaComplex = PropSchemaBase & {
	type: PropTypeComplex;
};

export type PropSchema = PropSchemaSimple | PropSchemaComplex;

export type PropObj<T, U = Omit<T, "style">> = {
	[K in keyof U]-?: PropSchema;
};

export type DataAttrSimpleSchema = {
	variant: "simple";
	value: string;
	description: string;
	name: string;
};

export type DataAttrEnumSchema = {
	variant: "enum";
	value: Component;
	stringValue: string;
	description: string;
	name: string;
};

export type DataAttrSchema = DataAttrSimpleSchema | DataAttrEnumSchema;

export type CSSVarSchema = {
	name: string;
	description: string;
};

export type ComponentAPISchema<T = Record<string, unknown>> = {
	title: string;
	description: string;
	type: "component";
	props?: PropObj<T>;
	dataAttributes: DataAttrSchema[];
	cssVars: CSSVarSchema[];
};

export type UtilityAPISchema<T = Record<string, unknown>> = {
	title: string;
	description: string;
	type: "utility";
	props?: PropObj<T>;
};

export type APISchema<T = Record<string, unknown>> = ComponentAPISchema<T> | UtilityAPISchema<T>;
