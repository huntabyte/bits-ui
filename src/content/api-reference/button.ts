import type { APISchema } from "@/types";

export const root: APISchema = {
	title: "Root",
	description: "The root component used to set and manage the state of the avatar.",
	props: [
		{
			name: "delayMs",
			default: "0",
			type: "number",
			description:
				"How long to wait before showing the image after it has loaded. This can be useful to prevent a harsh flickering effect when the image loads quickly."
		},
		{
			name: "loadingStatus",
			type: "'loading' | 'loaded' | 'error'",
			description:
				"The loading status of the avatars source image. You can bind a variable to track the status outside of the component and use it to show a loading indicator or error message."
		},
		{
			name: "onLoadingStatusChange",
			type: "(status: 'loading' | 'loaded' | 'error') => void",
			description: "A callback function called when the loading status of the image changes."
		}
	]
};
