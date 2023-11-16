export type PropType = {
	type: string;
	definition: string;
};

export type PropSchema<T> = {
	name: T;
	default?: string;
	type: PropType | string;
	description: string;
	required?: boolean;
};

export type DataAttrSchema = {
	name: string;
	value?: string;
	description?: string;
};

export type APISchema<T> = {
	title: string;
	description: string;
	props?: PropSchema<keyof T>[];
	dataAttributes?: DataAttrSchema[];
};
