import joplin from 'api';
import { SettingItemType } from 'api/types';

export interface IndentSettings {
	indentWithTabs: boolean;
	indentUnit: number;
	tabSize: number;
	replaceChars: boolean;
	autoIndent: boolean;
	smartIndent: boolean;
}

export async function getAllSettings(): Promise<IndentSettings> {
	const settings = await joplin.settings.values([
		'indentWithTabs',
		'indentUnit',
		'tabSize',
		'replaceChars',
		'autoIndent',
		'smartIndent'
	]);
	return {
		indentWithTabs: settings.indentWithTabs as boolean,
		indentUnit: settings.indentUnit as number,
		tabSize: settings.tabSize as number,
		replaceChars: settings.replaceChars as boolean,
		autoIndent: settings.autoIndent as boolean,
		smartIndent: settings.smartIndent as boolean
	};
}

export async function registerAllSettings() {
	await joplin.settings.registerSection('settings.alondmnt.spaceindent', {
		label: 'Space Indenter',
		iconName: 'fas fa-user-astronaut'
	});

	await joplin.settings.registerSettings({
		'indentWithTabs': {
			value: false,
			type: SettingItemType.Bool,
			section: 'settings.alondmnt.spaceindent',
			public: true,
			label: 'Indent with tabs. Default is true.',
		},

		'indentUnit': {
			value: 4,
			type: SettingItemType.Int,
			section: 'settings.alondmnt.spaceindent',
			public: true,
			label: 'How many spaces a block should be indented. Defaults to 4.',
			description: 'When indenting with tabs, this should be a multiple of the tab width (below).'
		},

		'tabSize': {
			value: 4,
			type: SettingItemType.Int,
			section: 'settings.alondmnt.spaceindent',
			public: true,
			label: 'The width of a tab character. Defaults to 4.',
		},

		'replaceChars': {
			value: false,
			type: SettingItemType.Bool,
			section: 'settings.alondmnt.spaceindent',
			public: true,
			label: 'Automatic find & replace of tab --> space (or vice versa)',
			description: 'Will reformat each node while loading it. This may require switching notes / notebooks after setting it on. Instead of auto-formatting, you may also manually press the Space Indenter toolbar button.'
		},

		'autoIndent': {
			value: true,
			type: SettingItemType.Bool,
			section: 'settings.alondmnt.spaceindent',
			public: true,
			label: 'Auto indent. Default is true.',
			description: 'Automatically indent when starting a new line. (Requires CodeMirror 6 / the beta editor.)',
		},

		'smartIndent': {
			value: true,
			type: SettingItemType.Bool,
			section: 'settings.alondmnt.spaceindent',
			public: true,
			label: 'Smart indent. Default is true.',
			description: 'Use context-sensitive indentation in code blocks (or just indent the same as the line before). Auto-indent must be enabled.',
		},
	});
}
