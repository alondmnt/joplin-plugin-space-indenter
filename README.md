# Space Indenter (Joplin Plugin)

This plugin exposes CodeMirror's relevant [settings](https://codemirror.net/doc/manual.html#config) to Joplin users, which enable switching between tab indentation and space indentation, and... that's it.

After installing the plugin, expect the following behavior from the editor:

| key / event                                       | result |
|---------------------------------------------------|--------|
| Indent less/more command (Edit menu)              | SPACE  |
| TAB while text is selected                        | SPACE  |
| TAB on an empty bullet/checkbox line              | SPACE  |
| TAB on any other event (e.g., cursor in mid-line) | TAB    |

Thanks to [Rich Markdown](https://github.com/CalebJohn/joplin-rich-markdown) ([@CalebJohn](https://github.com/CalebJohn)), that heavily influenced this implementation.
