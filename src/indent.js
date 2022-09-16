module.exports = {
	default: function(context) {
		return {
			plugin: function plugin(CodeMirror) {
				async function get_settings() {
					return await context.postMessage({name: 'getSettings'});
				}

				CodeMirror.defineOption('enable-space-indenter', false, async function(cm, val, old) {
					// trying to do what Rich Markdown does
					// https://github.com/CalebJohn/joplin-rich-markdown/blob/a32b087fa9d317ae7cf518a4ba79b3bca7556983/src/richMarkdown.ts
					if (val) {
						// retry to get settings until success
						async function backoff(timeout) {
							const settings = await get_settings();

							if (!settings) {
								setTimeout(backoff, timeout * 2, timeout * 2);
							}
							else {
								cm.updateIndentSettings(settings);
							}
						};
						// Set the first timeout to 50 because settings are usually ready immediately
						// Set the first backoff to (100*2) to give a little extra time
						setTimeout(backoff, 50, 100);
					}
				});

				CodeMirror.defineExtension('updateIndentSettings', function(newSettings) {
					if (!newSettings.indentWithTabs) {
						// based on: https://github.com/codemirror/codemirror5/issues/988#issuecomment-549644684
						this.setOption('extraKeys', {
							Tab: (cm) => {
								if (cm.getMode().name === 'null') {
									cm.execCommand('insertTab');
								} else {
									firstChar = cm.getLine(cm.getCursor().line).trim()[0];
									if (cm.somethingSelected() ||
										(firstChar == '-') ||
										(firstChar == '*')) {
										cm.execCommand('indentMore');
									} else {
										cm.execCommand('insertSoftTab');
									}
								}
								},
							'Shift-Tab': (cm) => cm.execCommand('indentLess')
						});
					}
					this.setOption('indentWithTabs', newSettings.indentWithTabs);
					this.setOption('indentUnit', newSettings.indentUnit);
					this.setOption('tabSize', newSettings.tabSize);
				});
			},

			codeMirrorOptions: {
				'enable-space-indenter': true,
			},
		}
	},
}
