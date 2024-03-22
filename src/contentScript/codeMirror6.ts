import getSettings from "./getSettings";
import type { PluginContext } from "./types";
import { Prec, EditorState } from "@codemirror/state";
import { indentService, indentUnit } from "@codemirror/language";

export default function(context: PluginContext) {
	return {
		plugin: async function plugin(CodeMirror: any) {
			if (!CodeMirror.cm6) return;

			const settings = await getSettings(context);
			const indentCharacter = settings.indentWithTabs ? '\t' : ' ';

			// Returning null means to use the indentation of the line above the current:
			// https://codemirror.net/docs/ref/#language.indentService
			const continueIndentIndenter = indentService.of(() => null);

			CodeMirror.addExtension([
				Prec.high([
					indentUnit.of(indentCharacter.repeat(settings.indentUnit)),
					EditorState.tabSize.of(settings.tabSize),
					settings.smartIndent ? [] : continueIndentIndenter,
				]),
			]);
		},
	};
};
