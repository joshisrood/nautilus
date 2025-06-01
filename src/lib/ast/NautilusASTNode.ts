import { ASTNode as MosaicASTNode, OptionsNode as MosaicOptionsNode } from "@uwdata/mosaic-spec";
import { isMap, isSeq, type ParsedNode as YamlASTNode} from "yaml";

export class NautilusASTNode {
     public type:string;
     public children: NautilusASTNode[] | null = null;
     public yamlNode: YamlASTNode | null;
     public mosaicNode: MosaicASTNode;
     public attributeYamlNodes: Map<string, YamlASTNode | null> | null = null;
     public optionsYamlNodes: Map<string, YamlASTNode | null> | null = null;
     public unmapedYamlNodes: (YamlASTNode | null)[] = [];

     constructor(mosaicASTNode: MosaicASTNode, yamlASTNode: YamlASTNode | null = null) {
          this.type = mosaicASTNode.type;
          this.mosaicNode = mosaicASTNode;
          if(isMap(yamlASTNode) && yamlASTNode.has(this.mosaicNode.type)) {
               const valueNode = yamlASTNode.get(this.mosaicNode.type);
               this.yamlNode = valueNode ?? null;

               if(this.hasAttributes(this.mosaicNode)) {
                    this.attributeYamlNodes = new Map<string, YamlASTNode>();

                    const mosaicAttributes = this.mosaicNode.attributes;
                    yamlASTNode.items.forEach(pair => {
                         if(mosaicAttributes.some(mAttr => mAttr.name === pair.key.toString())) {
                              this.attributeYamlNodes?.set(pair.key.toString(), pair.value);
                         }
                         else {
                              this.unmapedYamlNodes.push(pair.value);
                         }
                    });

               }

               if(this.hasOptions(this.mosaicNode)) {
                    this.optionsYamlNodes = new Map<string, YamlASTNode>();

                    const mosaicOptions = this.mosaicNode.options;
                    yamlASTNode.items.forEach(pair => {
                         if(Object.entries(mosaicOptions.options).some(([key, value]) => key === pair.key.toString())) {
                              this.optionsYamlNodes?.set(pair.key.toString(), pair.value);
                         }
                         else {
                              this.unmapedYamlNodes.push(pair.value);
                         }
                    });
               }
          } else {
               this.yamlNode = yamlASTNode;
          }

          if(this.mosaicNode.children) {
               this.children = this.mosaicNode.children.map<NautilusASTNode>((mNode, index) => {
                    if(isSeq(this.yamlNode)) {
                         const childYamlNode = this.yamlNode.get(index);
                         return new NautilusASTNode(mNode, childYamlNode ?? null);
                    }
                    else if(isMap(this.yamlNode)) {
                         const childYamlNode = this.yamlNode.get(mNode.type);
                         return new NautilusASTNode(mNode, childYamlNode ?? null)
                    }

                    return new NautilusASTNode(mNode);
               });
          }
     }

     private hasAttributes(mosaicNode: MosaicASTNode): mosaicNode is MosaicASTNodeWithAttributes {
          return Object.hasOwn(mosaicNode, "attributes");
     }

     private hasOptions(mosaicNode: MosaicASTNode): mosaicNode is MosaicASTNodeWithOptions {
          return Object.hasOwn(mosaicNode, "options");
     }

}

interface MosaicASTNodeWithAttributes extends MosaicASTNode {
     attributes: MoasicAttributeASTNode[];
}

type MoasicAttributeASTNode = {
     name: string;
     value: any;
}

interface MosaicASTNodeWithOptions extends MosaicASTNode {
     options: MosaicOptionsNode;
}

