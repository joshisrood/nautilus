<script lang="ts">
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

<div class="flex p-5 fixed top-0 left-0 w-full h-full">
  <SplitPane id="editor-split" type="horizontal" min="400px" max="-400px" pos="40%">
    {#snippet a()}
      <div class="pe-2 relative w-full h-full">
        <SpecEditor {yamlSpec} {onSpecChange} />
      </div>
    {/snippet}
    {#snippet b()}
      <div class="ps-2">
        <RenderSpec {context} {yamlSpec} />
      </div>
    {/snippet}
  </SplitPane>
</div>

