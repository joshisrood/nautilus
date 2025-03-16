<script lang="ts">
  import { createAPIContext, wasmConnector } from '@uwdata/vgplot';
  import RenderSpec from '$lib/RenderSpec.svelte';
  import SpecEditor from '$lib/SpecEditor.svelte';
  
  const context = createAPIContext();
  const wasm = wasmConnector();
  context.coordinator().databaseConnector(wasm);

  let { data } = $props();
</script>

<div class="flex p-5">
  <div class="me-4">
    <SpecEditor yamlSpec={data.text} />
  </div>
  <div class="ms-4">
    <RenderSpec {context} yamlSpec={data.text} />
  </div>
</div>

