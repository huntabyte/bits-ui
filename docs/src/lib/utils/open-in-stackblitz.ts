import { stackblitzData } from "$lib/generated/stackblitz-data.js";
import sdk from "@stackblitz/sdk";

export async function openInStackBlitz(demoName: string) {
	try {
		const res = await fetch(`/api/demos.json?name=${demoName}`);
		if (!res.ok) {
			throw new Error("Failed to fetch demo code");
		}
		const { code: demoCode } = await res.json();

		sdk.openProject(
			{
				title: "Bits UI Demo",
				files: {
					...stackblitzData.files,
					"pnpm-lock.yaml": "",
					"src/routes/+page.svelte": demoCode,
				},
				template: "node",
			},
			{
				newWindow: true,
				openFile: "src/routes/+page.svelte",
				terminalHeight: 200,
			}
		);
	} catch (err) {
		console.error(err);
	}
}
