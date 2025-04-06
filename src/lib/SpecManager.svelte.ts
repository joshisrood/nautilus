import { parseSpec, type Spec, type SpecNode } from "@uwdata/mosaic-spec";
import { parse, stringify } from "yaml";
import { debounce } from "./utils/debounce";

export class SpecManager {

    yamlSpec: string = $state("");
    loadedYaml: string = $state("");
    specJSON: Spec | null = $derived(parse(this.yamlSpec));

    specAST: SpecNode | null = $state(null);

    debouncingSpecUpdate: boolean = $state(false);

    debouncingUpdateYaml: (updatedSpec: string) => void;

    constructor(
        initialYamlSpec: string,
        {
            debounceTime = 1000
        } : {
            debounceTime?: number
        } = {}
    ) {
        this.loadedYaml = initialYamlSpec;
        this.updateYaml(initialYamlSpec);
        
        const deboucedUpdateSpec = debounce((updatedSpec: string) => {
            this.updateYaml(updatedSpec);
            this.debouncingSpecUpdate = false;
        }, debounceTime);
        this.debouncingUpdateYaml = (updatedSpec: string) => {
            this.debouncingSpecUpdate = true;
            deboucedUpdateSpec(updatedSpec);
        }
    }

    updateYaml(updatedSpec: string) {
        this.yamlSpec = updatedSpec;
        if(this.specJSON) {
            this.specAST = this.parseMosaicSpec(this.specJSON);
        }
    }

    loadYaml(spec: string) {
        if(spec !== this.yamlSpec) {
            this.loadedYaml = "";
            this.loadedYaml = spec;
        }
    }

    exportNormalizedYaml(): string {
        return stringify(this.exportNormalizedJson());
    }

    exportNormalizedJson(): Spec | null {
        return this.specAST?.toJSON();
    }

    private parseMosaicSpec(mosaicSpec: Spec): SpecNode {
        return parseSpec(mosaicSpec);
    }
}