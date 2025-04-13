<script lang="ts">
  import { PUBLIC_ENV_PLATFORM, PUBLIC_ENV_MODE } from '$env/static/public';

  import { SplitPane } from '@rich_harris/svelte-split-pane';
  import { createAPIContext, wasmConnector } from '@uwdata/vgplot';
  import RenderSpec from '$lib/RenderSpec.svelte';
  import SpecEditor from '$lib/SpecEditor.svelte';
  import { SpecManager } from '$lib/SpecManager.svelte';
  
  const context = createAPIContext();
  const wasm = wasmConnector();
  context.coordinator().databaseConnector(wasm);

  let { data } = $props();

  let specManager: SpecManager = $state(new SpecManager(""));

  let importFiles: FileList | null | undefined = $state();
  let importInput: HTMLInputElement | undefined = $state();

  $effect(() => {
    if(importFiles && importFiles.length > 0) {
      const importFile = importFiles[0];
      if(importFile.type === "application/x-yaml") {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          if(typeof fileReader.result === "string") {
            specManager.loadYaml(fileReader.result);
          }

          if(importInput) {
            importInput.value = "";
          }
        };

        fileReader.readAsText(importFile);

      }
    }
  });

  function downloadSpec() {
    const yaml = specManager.exportNormalizedYaml();

    const downloadLink = document.createElement("a");
    const specFile = new Blob([yaml], { type: "application/x-yaml"});
    downloadLink.href = URL.createObjectURL(specFile);
    downloadLink.download = "mosaic-spec.yaml";
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
  }
</script>

<div class="flex flex-col p-2 fixed top-0 left-0 w-full h-full">
  {#if PUBLIC_ENV_PLATFORM == "web"}
    <div class="mb-2">
      <nav class="p-2 bg-white w-full flex-none flex flex-row items-center rounded-sm">
        <div class="pe-1 grow">
          <img class="h-7" src="/assets/base-icon.svg" alt="Nautilus" />
        </div>
        <div class="px-1">
          <label for="file-import" class="flex bg-slate-200 py-1 px-2 rounded-sm cursor-pointer">
            <span>Import Spec</span>
            <input type="file" accept=".yml,.yaml" id="file-import" name="file-import" bind:this={importInput} bind:files={importFiles} hidden/>
          </label>
        </div>
        {#if PUBLIC_ENV_MODE == "playground"}
          <div class="px-1">
            <button type="button" onclick={downloadSpec} class="bg-slate-200 py-1 px-2 rounded-sm cursor-pointer">
              Download
            </button>
          </div>
        {/if}
      </nav>
    </div>
  {/if}
  <div class="flex-1 overflow-y-auto">
    <SplitPane id="editor-split" type="horizontal" min="400px" max="-400px" pos="40%">
      {#snippet a()}
        <div class="pe-1 w-full h-full">
          <SpecEditor {specManager} />
        </div>
      {/snippet}
      {#snippet b()}
        <div class="ps-1 w-full h-full">
          <RenderSpec {context} {specManager} />
        </div>
      {/snippet}
    </SplitPane>
  </div>
</div>

