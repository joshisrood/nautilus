<script lang="ts">
    import { parseSpec, astToDOM } from '@uwdata/mosaic-spec';
    import { type Spec, DataNode, FileDataNode } from '@uwdata/mosaic-spec';
    import { onMount } from 'svelte';
    import { parse } from 'yaml';

    let { yamlSpec, context } = $props();
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
            const spec = parse(yamlSpec);
            renderComponent(vgContainer, spec as Spec);
        });
    });
</script>

<div class="vg-container border border-gray-600 rounded p-4" bind:this={vgContainer}>
    ...Initializing
</div>



