<script lang="ts">
    import { parseSpec, astToDOM, SpecNode } from '@uwdata/mosaic-spec';
    import { type Spec, DataNode, FileDataNode } from '@uwdata/mosaic-spec';
    import { onMount } from 'svelte';
    import { parse } from 'yaml';
    import type { SpecManager } from './SpecManager.svelte';

    interface RenderSpecProps {
        specManager: SpecManager;
        context: any;
    }

    let mounted: boolean = $state(false);

    let { specManager, context }: RenderSpecProps = $props();
    let renderedHtml: HTMLElement | SVGSVGElement | undefined = $state();
    let vgContainer: HTMLElement;

    async function renderComponent(targetContainer: HTMLElement, ast: SpecNode) {
        const domPromise = await astToDOM(ast, { api: context });
        renderedHtml = domPromise.element;
        targetContainer.innerHTML = "";
        targetContainer.appendChild(renderedHtml);
    }

    onMount(() => {
        $effect(() => {
            if(specManager.specAST) {
                renderComponent(vgContainer, specManager.specAST);
            }
        });
        mounted = true;
    });

    
</script>

<div class="vg-container p-4 bg-white rounded-sm" bind:this={vgContainer}>
    {#if !mounted}
        <div class="text-slate-800 flex justify-center align-middle">
            ...Initializing
        </div>
    {:else if !renderedHtml}
        <div class="text-slate-400 flex justify-center align-middle">
            Nothing to render
        </div>
    {/if}
</div>




