import getSettings from "./getSettings";
import type { IndentSettings } from "../settings";
import type { PluginContext } from "./types";

export default function(context: PluginContext) {
	return {
		plugin: function plugin(CodeMirror: any) {
			if (CodeMirror.cm6) return;

			CodeMirror.defineOption('enable-space-indenter', false, async function(cm: any, val: boolean, _old: boolean) {
				if (val) {
					const settings = await getSettings(context);
					cm.updateIndentSettings(settings);
				}
			});

			CodeMirror.defineExtension('updateIndentSettings', function(newSettings: IndentSettings) {
				if (!newSettings.indentWithTabs) {
					// based on: https://github.com/codemirror/codemirror5/issues/988#issuecomment-549644684
					this.setOption('extraKeys', {
						Tab: (cm: any) => {
							const isListItem = /^-|^\*|^\d\./g;
							if (cm.getMode().name === 'null') {
								cm.execCommand('insertTab');
							} else {
								const line = cm.getLine(cm.getCursor().line).trim();
								if (cm.somethingSelected() ||
									isListItem.test(line)) {
									cm.execCommand('indentMore');
								} else {
									cm.execCommand('insertSoftTab');
								}
							}
							},
						'Shift-Tab': (cm: any) => cm.execCommand('indentLess')
					});
				}
				this.setOption('indentWithTabs', newSettings.indentWithTabs);
				this.setOption('indentUnit', newSettings.indentUnit);
				this.setOption('tabSize', newSettings.tabSize);
				this.setOption('smartIndent', newSettings.smartIndent);
			});
		},

		codeMirrorOptions: {
			'enable-space-indenter': true,
		},
	}
};
