import type { IndentSettings } from "../settings";
import { PluginContext } from "./types";

export default function getSettings(context: PluginContext) {
	async function get_settings() {
		return await context.postMessage({name: 'getSettings'});
	}

	return new Promise<IndentSettings>(resolve => {
		// trying to do what Rich Markdown does
		// https://github.com/CalebJohn/joplin-rich-markdown/blob/a32b087fa9d317ae7cf518a4ba79b3bca7556983/src/richMarkdown.ts
		//
		// retry to get settings until success
		async function backoff(timeout: number) {
			const settings = await get_settings();

			if (!settings) {
				setTimeout(backoff, timeout * 2, timeout * 2);
			}
			else {
				resolve(settings);
			}
		};
		// Set the first timeout to 50 because settings are usually ready immediately
		// Set the first backoff to (100*2) to give a little extra time
		setTimeout(backoff, 50, 100);
	});
}