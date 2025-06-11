import type { Component } from "svelte";

export type PropTypeString = {
	_type: "string";
	type: string;
};

export type PropTypeComponent = {
	_type: "component";
	type: string;
	definition: Component;
	stringDefinition: string;
};

export type PropType = PropTypeString | PropTypeComponent;
export type PropDefault =
	| {
			_type: "string";
			value: string;
	  }
	| { _type: "component"; value: Component; stringValue: string };

export type PropSchema = {
	default?: PropDefault;
	type: PropType;
	description: string;
	required?: boolean;
	bindable?: boolean;
};

export type PropObj<T, U = Omit<T, "style">> = {
	[K in keyof U]-?: PropSchema;
};

export type DataAttrStringSchema = {
	_type: "string";
	value: string;
	description: string;
	stringValue: string;
	name: string;
};

export type DataAttrEnumSchema = {
	_type: "enum";
	value: Component;
	stringValue: string;
	description: string;
	name: string;
};

export type DataAttrSchema = DataAttrStringSchema | DataAttrEnumSchema;

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
