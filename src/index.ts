import joplin from 'api';
import { ContentScriptType, ToolbarButtonLocation } from 'api/types';
import { registerAllSettings, getAllSettings, IndentSettings } from './settings'

async function registerContentScript(sourcePath: string, contentScriptId: string) {
	await joplin.contentScripts.register(
		ContentScriptType.CodeMirrorPlugin,
		contentScriptId,
		sourcePath,
	);

	await joplin.contentScripts.onMessage(contentScriptId, async (message:any) => {
		if (message.name === 'getSettings') {
			return await getAllSettings();
		}
	});
}

async function reformatTabs(settings: IndentSettings) {
	let pattern: RegExp, replace: string;
	if (settings.indentWithTabs) {
		replace = '\t';
		pattern = RegExp(Array(settings.tabSize + 1).join(' '), 'g');
	} else {
		pattern = RegExp('\t', 'g');
		replace = Array(settings.tabSize + 1).join(' ');
	}

	const currentNote = await joplin.workspace.selectedNote();
	const newBody = currentNote.body.replace(pattern, replace);
	if (newBody != currentNote.body) {
		await joplin.commands.execute('editor.setText', newBody);
		await joplin.data.put(['notes', currentNote.id], null, { body: newBody });
	}
}

joplin.plugins.register({
	onStart: async function() {
		await registerAllSettings();

		await joplin.commands.register({
			name: 'spaceindent.reformatTabs',
			label: 'Reformat note with spaces/tabs',
			iconName: 'fas fa-user-astronaut',
			execute: async () => {
				const settings = await getAllSettings();
				reformatTabs(settings);
			},
		});

		await joplin.views.toolbarButtons.create('butSpaceIndent', 'spaceindent.reformatTabs', ToolbarButtonLocation.EditorToolbar);

		await registerContentScript('./contentScript/codeMirror5.js', 'space-indenter-cm5');
		await registerContentScript('./contentScript/codeMirror6.js', 'space-indenter-cm6');

		await joplin.workspace.onNoteSelectionChange(async () => {
			const settings = await getAllSettings();
			if (!settings.replaceChars) { return; }

			await reformatTabs(settings);
		});
	},
});
