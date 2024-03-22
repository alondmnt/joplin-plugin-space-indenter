import getSettings from "./getSettings";
import type { PluginContext } from "./types";
import { Prec, EditorState } from "@codemirror/state";
import { indentService, indentUnit } from "@codemirror/language";

export default function(context: PluginContext) {
	return {
		plugin: async function plugin(CodeMirror: any) {
			if (!CodeMirror.cm6) return;

			const settings = await getSettings(context);

			// CodeMirror 6 uses a string indent unit
			let indentation = ' '.repeat(settings.indentUnit);
			if (settings.indentWithTabs) {
				indentation = '\t'.repeat(Math.floor(settings.indentUnit / settings.tabSize));
			}

			// Returning null: Makes the editor use the indentation of the line above the current.
			// See https://codemirror.net/docs/ref/#language.indentService
			const continueIndentIndenter = indentService.of(() => null);

			CodeMirror.addExtension([
				Prec.high([
					indentUnit.of(indentation),
					EditorState.tabSize.of(settings.tabSize),
					settings.smartIndent ? [] : continueIndentIndenter,
				]),
			]);
		},
	};
};
