import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect
} from "react";
import makeCurvedLinks from "./makeCurvedLinks";
import Node from "./Node";
import Link from "./Link";
import { TreeNode, SimplifiedLayout } from "./types";
import {
  useHoverNodes,
  useTreeLayout,
  useCenterAndZoom,
  useGraphLayout
} from "./hooks";

function svgPoint(element: SVGSVGElement | null, x: number, y: number) {
  if (!element) return { x, y };

  let pt = element.createSVGPoint();

  pt.x = x;
  pt.y = y;

  let screenCTM = element.getScreenCTM();
  if (screenCTM) {
    return pt.matrixTransform(screenCTM.inverse());
  }

  return {
    x,
    y
  };
}

let height = 500;
let width = 800;
let padding = 20;

let size = 35;
const Chart = (props: {
  nodes: any[];
  links: any[];
  tree: boolean;
  root: TreeNode;
  onNodeClick?: (node: any) => any;
  onLinkClick?: (link: any) => any;
}) => {
  const { nodes, links, tree = false, root, onNodeClick, onLinkClick } = props;
  const svgRef = useRef<SVGSVGElement>(null);

  // layout part and it request animation frame timer
  const [layout, setLayout] = useState<SimplifiedLayout>({
    nodes: [],
    links: []
  });

  const [graphLayout, relayout, { dragStart, drag }, drawn] = useGraphLayout(
    nodes,
    links,
    {
      width,
      height
    }
  );
  useEffect(() => {
    setLayout(graphLayout);
  }, [graphLayout]);

  const treeLayout = useTreeLayout(root, { size });
  useEffect(() => {
    setLayout(treeLayout);
  }, [treeLayout]);

  const [
    zoom,
    offsets,
    centerAndZoom,
    onWheel,
    onMouseMove,
    onMouseDown,
    onMouseUp,
    blockCenterAndZoom
  ] = useCenterAndZoom(layout, { size, padding, width, height });

  useLayoutEffect(() => {
    return drawn;
  }, [layout, drawn]);

  const [lineMarkerColors, setLineMarkerColors] = useState<string[]>(["#999"]);
  const getMarkerColors = useCallback(() => {
    if (!svgRef.current) return;

    // get all path child from svg
    // to find stroke color and set new colors array
    // @ts-ignore
    const paths = [...svgRef.current.getElementsByTagName("path")];
    const colors = new Set(paths.map(path => path.getAttribute("stroke")));
    // @ts-ignore
    setLineMarkerColors([...colors.values()].filter(Boolean));
  }, []);
  useEffect(getMarkerColors, [layout, getMarkerColors]);

  const findNode = useCallback(
    nodeId => layout.nodes.find(n => n.id === nodeId),
    [layout.nodes]
  );

  const findLink = useCallback(linkIndex => layout.links[linkIndex], [
    layout.links
  ]);

  const onDrag = useCallback(
    (nodeId, e: React.MouseEvent) => {
      const node = findNode(nodeId);
      if (!node) return;

      const newPos = svgPoint(svgRef.current, e.clientX, e.clientY);
      node.x = newPos.x / size;
      node.y = newPos.y / size;
      drag(node, { x: newPos.x / size, y: newPos.y / size });
    },
    [findNode, drag]
  );

  const onStart = useCallback(
    nodeId => {
      const node = findNode(nodeId);
      if (!node) return;

      dragStart(node);
      blockCenterAndZoom(true);
    },
    [findNode, dragStart, blockCenterAndZoom]
  );

  const onEnd = useCallback(() => {
    // unlock zoom and ask for a relayout (and a redaw as a consequence)
    blockCenterAndZoom(false);
    centerAndZoom(layout.nodes);
  }, [centerAndZoom, blockCenterAndZoom, layout.nodes]);

  const [
    hoverNode,
    hiddenNodes,
    onOverNode,
    onLeaveNode
  ] = useHoverNodes(layout, { getMarkerColors });

  const innerOnNodeClick = useCallback(
    id => {
      if (!onNodeClick) return undefined;
      const node = findNode(id);
      return onNodeClick(node);
    },
    [onNodeClick, findNode]
  );

  const innerOnLinkClick = useCallback(
    index => {
      if (!onLinkClick) return undefined;
      return onLinkClick(findLink(index));
    },
    [onLinkClick, findLink]
  );

  if (layout.nodes.length === 0) return null;

  return (
    <>
      <button // TODO: move it in parent code ?
        onClick={relayout}
      >
        Relayout
      </button>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`${offsets.x} ${offsets.y} ${width * zoom} ${height * zoom}`}
        onWheel={onWheel}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        xmlns="http://www.w3.org/2000/svg"
      >
        {lineMarkerColors.map(color => (
          <marker
            id={`arrow-${color}`}
            key={`arrow-${color}`}
            viewBox="0 0 10 10"
            refX={size / 2 + 11} // FIXME: find a function to process this number
            refY="2.5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 5 2.5 L 0 5 z" fill={color} />
          </marker>
        ))}

        <g stroke="#999">
          {makeCurvedLinks(layout.links, { size }).map((link: any, index) => {
            const {
              length,
              d,
              quadraticPoint,
              sweep,
              label,
              source,
              target,
              Component
            } = link;
            return (
              <Link
                id={index}
                length={length}
                d={d}
                quadraticPoint={quadraticPoint}
                sweep={sweep}
                label={label}
                size={size}
                source={{ x: source.x, y: source.y, label: source.label }}
                target={{ x: target.x, y: target.y, label: target.label }}
                Component={Component}
                onClick={innerOnLinkClick}
                hover={
                  hoverNode === link.source.id || hoverNode === link.target.id
                }
              />
            );
          })}
        </g>
        <g stroke="#fff" strokeWidth={1}>
          {layout.nodes.map(node => {
            const { id, group, x, y, label, Component, color } = node;

            return (
              <g transform={`translate(${x * size} ${y * size})`}>
                <Node
                  key={id}
                  id={id}
                  group={group}
                  label={label}
                  color={color}
                  Component={Component}
                  onClick={innerOnNodeClick}
                  onMouseEnter={onOverNode}
                  onMouseLeave={onLeaveNode}
                  size={size}
                  onDrag={onDrag}
                  onStart={onStart}
                  onEnd={onEnd}
                  drag={!tree}
                  hover={hoverNode === id}
                  hidden={hoverNode !== id && hiddenNodes.includes(id)}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </>
  );
};

export default Chart;
