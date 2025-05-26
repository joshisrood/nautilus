import { parseSpec, type Spec as MosaicSpec, type SpecNode as MosaicASTNode } from "@uwdata/mosaic-spec";
import { parseDocument, stringify, LineCounter, type Document, type ParsedNode as YamlASTNode } from "yaml";
import { debounce } from "./utils/debounce";
import { NautilusASTNode } from "./ast/NautilusASTNode";

export class SpecManager {

    lineCounter: LineCounter = new LineCounter();

    yamlSpec: string = $state("");
    loadedYaml: string = $state("");

    yamlAST: Document = $derived(parseDocument(this.yamlSpec, {lineCounter: this.lineCounter }));
    specJSON: MosaicSpec | null = $derived(this.yamlAST.toJSON());
    mosaicSpecNode: MosaicASTNode | null =  $state(null);

    specAST: NautilusASTNode | null = $state(null);

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
            this.specAST = this.parseNautilusSpec(this.specJSON, this.yamlAST);
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

    exportNormalizedJson(): MosaicSpec | null {
        return this.specAST?.mosaicNode.toJSON();
    }

    private parseNautilusSpec(mosaicSpec: MosaicSpec, yamlDocument?: Document): NautilusASTNode {
        const mosaicNode: MosaicASTNode = parseSpec(mosaicSpec);
        this.mosaicSpecNode = mosaicNode;
        return new NautilusASTNode(mosaicNode, yamlDocument?.contents as YamlASTNode)
    }
}