<script lang="ts">
    import { parseSpec, astToDOM } from '@uwdata/mosaic-spec';
    import { type Spec, DataNode, FileDataNode } from '@uwdata/mosaic-spec';
    import { onMount } from 'svelte';
    import { parse } from 'yaml';

    let { yamlSpec, context } = $props();
    let spec: Spec = $derived(parse(yamlSpec));
    let renderedHtml: HTMLElement | SVGSVGElement | undefined = $state();
    let vgContainer: HTMLElement;

    async function renderComponent(targetContainer: HTMLElement, spec: Spec) {
        const ast = parseSpec(spec);

        for(const dataKey in ast.data) {
            const datasetNode: DataNode = ast.data[dataKey];
            if(datasetNode instanceof FileDataNode) {
                datasetNode.file = window.location + datasetNode.file;
            }
        }

        const domPromise = await astToDOM(ast, { api: context });
        renderedHtml = domPromise.element;
        targetContainer.innerHTML = "";
        targetContainer.appendChild(renderedHtml);
    }

    onMount(() => {
        $effect(() => {
            renderComponent(vgContainer, spec);
        });
    });
</script>

<div class="vg-container p-4 bg-white rounded-sm" bind:this={vgContainer}>
    <div class="text-slate-800 flex justify-center align-middle">
        ...Initializing
    </div>
</div>



