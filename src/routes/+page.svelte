<script lang="ts">
  import { createAPIContext, wasmConnector } from '@uwdata/vgplot';
  import { parseSpec, astToDOM } from '@uwdata/mosaic-spec';
  import { type Spec, DataNode, FileDataNode } from '@uwdata/mosaic-spec';
  
  const vg = createAPIContext();
  const wasm = wasmConnector();
  vg.coordinator().databaseConnector(wasm);

  let { data } = $props();

  async function init() {
    const ast = parseSpec(data as Spec);

    for(const dataKey in ast.data) {
      const datasetNode: DataNode = ast.data[dataKey];
      if(datasetNode instanceof FileDataNode) {
        datasetNode.file = window.location + datasetNode.file;
      }
    }

    const domPromise = await astToDOM(ast, { api: vg });
    document.body.appendChild(domPromise.element);
  }
</script>

{#await init()}
  Initializing...
{/await}

