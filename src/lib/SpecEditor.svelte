<script lang="ts">
    import { EditorView, keymap, highlightSpecialChars, drawSelection, 
            lineNumbers, highlightActiveLineGutter 
        } from '@codemirror/view';
    import { EditorState } from '@codemirror/state';
    import { defaultKeymap, historyKeymap, history } from '@codemirror/commands';
    import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
    import { yaml } from '@codemirror/lang-yaml';

    let { yamlSpec } = $props();

    let container: HTMLDivElement;
    let editor_view: EditorView;

    let startState = EditorState.create({
        doc: yamlSpec,
        extensions: [
            lineNumbers(),
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            history(),
            drawSelection(),
            syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
            keymap.of([
                ...defaultKeymap,
                ...historyKeymap,
            ]),
            yaml()
        ]
    });

    $effect(() => {
        editor_view = new EditorView({
			parent: container,
            state: startState
		});
    });
</script>

<div class="h-full w-full bg-white rounded-sm" bind:this={container}>
</div>

