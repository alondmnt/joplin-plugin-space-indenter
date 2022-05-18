import joplin from 'api';
import { ContentScriptType } from 'api/types';
import { registerAllSettings, getAllSettings } from './settings'

const contentScriptId = 'space-indenter';

joplin.plugins.register({
	onStart: async function() {
		await registerAllSettings();

		await joplin.contentScripts.register(
			ContentScriptType.CodeMirrorPlugin,
			contentScriptId,
			'./indent.js'
		);

		await joplin.contentScripts.onMessage(contentScriptId, async (message:any) => {
			if (message.name === 'getSettings') {
				return await getAllSettings();
			}
		});
	},
});
