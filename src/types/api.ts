export type PropType = {
	type: string;
	definition: string;
};

export type PropSchema = {
	default?: string;
	type: PropType | string;
	description: string;
	required?: boolean;
};

export type PropObj<T> = {
	[K in keyof T]-?: PropSchema;
};

export type SlotPropObj = Record<string, PropSchema>;

export type DataAttrSchema = {
	name: string;
	value?: string;
	description?: string;
	isEnum?: boolean;
};

export type APISchema<T = Record<string, unknown>> = {
	title: string;
	description: string;
	props?: PropObj<T>;
	slotProps?: SlotPropObj;
	dataAttributes?: DataAttrSchema[];
};
