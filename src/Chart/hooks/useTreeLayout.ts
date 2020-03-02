import { useEffect, useState } from "react";
import { tree as d3tree, hierarchy } from "d3-hierarchy";
import { ChartNode, TreeNode, SimplifiedLayout } from "../types";

const useTreeLayout = (rootNode: ChartNode, { size }: { size: number }) => {
  const [layout, setLayout] = useState<SimplifiedLayout>({
    nodes: [],
    links: []
  });

  useEffect(() => {
    if (!rootNode) return;

    const d3treelayout = d3tree().nodeSize([size / 2, size / 2])(
      hierarchy(rootNode)
    );

    const nodes: TreeNode[] = [];
    const links: any[] = [];

    const mapNode = (d3node: any): TreeNode => ({ ...d3node.data, ...d3node });

    const addNodeAndChildren = (parentNode: TreeNode) => {
      nodes.push(mapNode(parentNode));

      if (parentNode.children) {
        parentNode.children.forEach(node => {
          links.push({
            label: node.id,
            source: mapNode(parentNode),
            target: mapNode(node),
            length: 2
          });
          addNodeAndChildren(node);
        });
      }
    };
    addNodeAndChildren(d3treelayout);

    setLayout({ nodes, links });
  }, [rootNode, size]);
  
  return layout
};

export default useTreeLayout;
