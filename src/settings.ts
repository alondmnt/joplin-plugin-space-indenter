import joplin from 'api';
import { SettingItemType } from 'api/types';

export interface IndentSettings {
	indentWithTabs: boolean;
	indentUnit: number;
	tabSize: number;
}

export async function getAllSettings(): Promise<IndentSettings> {
	const settings: IndentSettings = {
		indentWithTabs: await joplin.settings.value('indentWithTabs'),
		indentUnit: await joplin.settings.value('indentUnit'),
		tabSize: await joplin.settings.value('tabSize'),
	}
	return settings;
}

export async function registerAllSettings() {
	await joplin.settings.registerSection('settings.alondmnt.spaceindent', {
		label: 'Space Indenter',
		iconName: 'fas fa-user-astronaut'
	});

	await joplin.settings.registerSettings({
		'indentWithTabs': {
			value: true,
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
	});
}
