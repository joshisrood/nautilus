<script lang="ts">
  import { PUBLIC_ENV_PLATFORM } from '$env/static/public';

  import { SplitPane } from '@rich_harris/svelte-split-pane';
  import { createAPIContext, wasmConnector } from '@uwdata/vgplot';
  import RenderSpec from '$lib/RenderSpec.svelte';
  import SpecEditor from '$lib/SpecEditor.svelte';
  import { debounce } from '$lib/utils/debounce';
  
  const context = createAPIContext();
  const wasm = wasmConnector();
  context.coordinator().databaseConnector(wasm);

  let { data } = $props();
  let yamlSpec = $state(data.text);

  let debouncingUpdate = $state(false);

  const deboucedUpdateSpec = debounce((updatedSpec: string) => {
      yamlSpec = updatedSpec;
      debouncingUpdate = false;
  }, 1000);

  function onSpecChange(updatedSpec: string) {
    debouncingUpdate = true;
    deboucedUpdateSpec(updatedSpec);
  }

</script>

<div class="flex flex-col p-2 fixed top-0 left-0 w-full h-full">
  {#if PUBLIC_ENV_PLATFORM == "Web"}
    <div class="mb-2">
      <nav class="p-2 bg-white w-full flex-none flex flex-row rounded-sm">
        <div class="pe-1 border-e-1">Nautilus</div>
      </nav>
    </div>
  {/if}
  <div class="flex-1 overflow-y-auto">
    <SplitPane id="editor-split" type="horizontal" min="400px" max="-400px" pos="40%">
      {#snippet a()}
        <div class="pe-1 w-full h-full">
          <SpecEditor {yamlSpec} {onSpecChange} />
        </div>
      {/snippet}
      {#snippet b()}
        <div class="ps-1 w-full h-full">
          <RenderSpec {context} {yamlSpec} />
        </div>
      {/snippet}
    </SplitPane>
  </div>
</div>

