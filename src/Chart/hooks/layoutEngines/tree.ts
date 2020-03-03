import { tree as d3tree, hierarchy } from "d3-hierarchy";
import { ChartNode, WithCoords, SimplifiedLayout, TreeNode } from "../../types";
import { LayoutEngine, Link } from "./layoutEngine";

const createTreeLayout = ({ size }: { size: number }): LayoutEngine => {
  let previousRootNode: TreeNode;
  const view: SimplifiedLayout = {
    nodes: [],
    links: []
  };

  const start = (nodes: TreeNode[], links: Link[]) => {
    const [rootNode] = nodes;
    previousRootNode = rootNode;

    const d3treelayout = d3tree().nodeSize([size / 2, size / 2])(
      hierarchy(rootNode)
    );

    const mappedNodes: TreeNode[] = [];
    const mappedLinks: any[] = [];

    const mapNode = (d3node: any): TreeNode => ({ ...d3node.data, ...d3node });

    const addNodeAndChildren = (parentNode: TreeNode) => {
      mappedNodes.push(mapNode(parentNode));

      if (parentNode.children) {
        parentNode.children.forEach(node => {
          mappedLinks.push({
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
    
    view.nodes = mappedNodes
    view.links = mappedLinks
  };

  const stop = () => {
    // n/a
  };

  const restart = () => {
    if (previousRootNode) start([previousRootNode], []);
  };

  const drag = (node: ChartNode, newPos: WithCoords) => {
    // n/a
  };

  const dragStart = (node: ChartNode) => {
    // n/a
  };

  const dragEnd = (node: ChartNode) => {
    // n/a
  };

  const getLayout = (): SimplifiedLayout => view;

  return {
    drag,
    dragStart,
    dragEnd,
    restart,
    start,
    stop,
    getLayout,
    type: "tree"
  };
};

export default createTreeLayout;
