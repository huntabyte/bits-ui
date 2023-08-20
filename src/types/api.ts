export type PropSchema = {
	name: string;
	default?: string;
	type: string;
	description: string;
};

export type DataAttrSchema = {
	name: string;
	value?: string;
	description?: string;
};

export type APISchema = {
	title: string;
	description: string;
	props?: PropSchema[];
	dataAttributes?: DataAttrSchema[];
};
