import { ASTNode as MosaicASTNode } from "@uwdata/mosaic-spec";
import { isCollection, isMap, isScalar, isSeq, type ParsedNode as YamlASTNode} from "yaml";

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
               this.children = this.mosaicNode.children.map<NautilusASTNode>((mn, index) => {
                    if(isSeq(yamlASTNode) && index < yamlASTNode.items.length) {
                         const childYamlNode = yamlASTNode.get(index);
                         return new NautilusASTNode(mn, childYamlNode ?? null);
                    }
                    else if(isMap(yamlASTNode)) {
                         const childYamlNode = yamlASTNode.get(mn.type);
                         return new NautilusASTNode(mn, childYamlNode ?? null)
                    }

                    return new NautilusASTNode(mn);
               });
          }
     }
}