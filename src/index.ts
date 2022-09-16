import joplin from 'api';
import { ContentScriptType, ToolbarButtonLocation } from 'api/types';
import { registerAllSettings, getAllSettings } from './settings'

const contentScriptId = 'space-indenter';

joplin.plugins.register({
	onStart: async function() {
		await registerAllSettings();

		await joplin.commands.register({
			name: 'spaceindent.reformatTabs',
			label: 'Reformat note with spaces/tabs',
			iconName: 'fas fa-user-astronaut',
			execute: async () => {
				const settings = await getAllSettings();

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
			},
		});

		await joplin.views.toolbarButtons.create('butSpaceIndent', 'spaceindent.reformatTabs', ToolbarButtonLocation.EditorToolbar);

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

		await joplin.workspace.onNoteSelectionChange(async () => {
			const settings = await getAllSettings();
			if (!settings.replaceChars) { return; }

			await joplin.commands.execute('spaceindent.reformatTabs');
		});
	},
});
