import { ASTNode as MosaicASTNode, PLOT } from "@uwdata/mosaic-spec";
import { isMap, isSeq, type ParsedNode as YamlASTNode} from "yaml";

export class NautilusASTNode {
     public type:string;
     public children: NautilusASTNode[] | null = null;
     public yamlNode: YamlASTNode | null;
     public mosaicNode: MosaicASTNode;

     constructor(mosaicASTNode: MosaicASTNode, yamlASTNode: YamlASTNode | null = null) {
          this.type = mosaicASTNode.type;
          this.yamlNode = yamlASTNode;
          this.mosaicNode = mosaicASTNode;

          if(this.mosaicNode.children) {
               this.children = this.mosaicNode.children.map<NautilusASTNode>((mNode, index) => {
                    if(isSeq(yamlASTNode) && index < yamlASTNode.items.length) {
                         const childYamlNode = yamlASTNode.get(index);
                         if(isMap(childYamlNode)) {
                              const valueYamlNode = childYamlNode.get(mNode.type);
                              return new NautilusASTNode(mNode, valueYamlNode ?? null);
                         }
                         return new NautilusASTNode(mNode, childYamlNode ?? null);
                    }
                    else if(isMap(yamlASTNode)) {
                         const childYamlNode = yamlASTNode.get(mNode.type);
                         return new NautilusASTNode(mNode, childYamlNode ?? null)
                    }

                    return new NautilusASTNode(mNode);
               });
          }
     }
}