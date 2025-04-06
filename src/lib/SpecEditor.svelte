<script lang="ts">
    import { onMount } from 'svelte';
    import { EditorView, keymap, highlightSpecialChars, drawSelection, 
            lineNumbers, highlightActiveLineGutter 
        } from '@codemirror/view';
    import { EditorState, Transaction } from '@codemirror/state';
    import { defaultKeymap, historyKeymap, history } from '@codemirror/commands';
    import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
    import { yaml } from '@codemirror/lang-yaml';
    import type { SpecManager } from './SpecManager.svelte';

    interface SpecEditorProps {
        specManager: SpecManager;
    }

    let { specManager }: SpecEditorProps = $props();

    let container: HTMLDivElement;
    let editor_view: EditorView;

    let startState = EditorState.create({
        doc: specManager.yamlSpec,
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
                    specManager.debouncingUpdateYaml(view.state.doc.toString());
                }
            },
		});
    });

    $effect(() => {
        editor_view.dispatch({
            changes: { from: 0, to: editor_view.state.doc.length, insert: specManager.loadedYaml }
        });
    })

</script>

<div class="bg-white h-full rounded-sm" bind:this={container}>
</div>

