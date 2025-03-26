<script lang="ts">
    import { onMount } from 'svelte';
    import { EditorView, keymap, highlightSpecialChars, drawSelection, 
            lineNumbers, highlightActiveLineGutter 
        } from '@codemirror/view';
    import { EditorState, Transaction } from '@codemirror/state';
    import { defaultKeymap, historyKeymap, history } from '@codemirror/commands';
    import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
    import { yaml } from '@codemirror/lang-yaml';

    interface SpecEditorProps {
        yamlSpec: string;
        onSpecChange?: (updatedSpec: string) => void
    }

    let { yamlSpec, onSpecChange = (updatedSpec) => {}}: SpecEditorProps = $props();

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

    onMount(() => {
        editor_view = new EditorView({
			parent: container,
            state: startState,
            dispatchTransactions(trs: readonly Transaction[], view: EditorView) {
                view.update(trs);

                if(trs.some(tr => tr.docChanged)) {
                    onSpecChange(view.state.doc.toString());
                }
            },
		});
    });
</script>

<div class="h-full w-full bg-white rounded-sm" bind:this={container}>
</div>

