import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect
} from "react";
// @ts-ignore
import * as cola from "webcola";
import makeCurvedLinks from "./makeCurvedLinks";
import Node from "./Node";
import Link from "./Link";
import { TreeNode, SimplifiedLayout } from "./types";
import { useHoverNodes, useTreeLayout, useCenterAndZoom } from "./hooks";

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
let iterations = 1;

// from https://github.com/cawfree/react-cola/blob/master/index.js
class ReactColaLayout extends cola.Layout {
  kick() {
    // we don't use request animation frame and try to kick as fast as we can
    // but we also want to look at "ticks" betweens frames, so we use a timeout!
    setTimeout(() => !this.tick() && this.kick(), 0);
  }
}

function mapLayout(layout: cola.Layout): SimplifiedLayout {
  return {
    nodes: layout.nodes(),
    links: layout.links()
  };
}

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

  const startLayout = useCallback(() => {
    if (layoutRef.current) {
      layoutRef.current
        .nodes(nodes)
        .links(links)
        .start(iterations, 1, 1, 0, true, false);
    }
  }, [nodes, links]);

  const layoutRef = useRef<ReactColaLayout>();
  const layoutTickDraw = useRef(true);

  useEffect(() => {
    if (tree) return;
    const layout = new ReactColaLayout();
    layoutRef.current = layout;

    let ticks = 0;
    let rafTimer = 0;
    layout
      .on(cola.EventType.tick, () => {
        console.log("new tick");
        console.timeEnd("tick");
        ticks += 1;
        console.time("tick");
        if (!layoutTickDraw.current) {
          console.log("SKIP this tick");
          return;
        }
        layoutTickDraw.current = false;
        if (!rafTimer) {
          rafTimer = requestAnimationFrame(() => {
            setLayout(() => mapLayout(layout));
            rafTimer = 0;
          });
        }
      })
      .on(cola.EventType.start, () => {
        console.time("graph layout");
      })
      .on(cola.EventType.end, () => {
        console.log("ticks", ticks);
        console.timeEnd("graph layout");

        console.log(
          "links",
          layout.links().length,
          "nodes",
          layout.nodes().length
        );

        // mark all node as fixed (so this is performant)
        layout.nodes().forEach(cola.Layout.dragStart);
      })
      .avoidOverlaps(true)
      .size([width, height])
      .jaccardLinkLengths(10);

    startLayout();
  }, [startLayout, tree]);

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
    return () => {
      layoutTickDraw.current = true;
    };
  }, [layout]);

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

  const onDrag = useCallback(
    (nodeId, e: React.MouseEvent) => {
      const node = findNode(nodeId);
      if (!node) return;

      const newPos = svgPoint(svgRef.current, e.clientX, e.clientY);
      node.x = newPos.x / size;
      node.y = newPos.y / size;
      cola.Layout.drag(node, {
        x: newPos.x / size,
        y: newPos.y / size
      });
      if (layoutRef.current) {
        layoutRef.current.resume();
      }
    },
    [findNode]
  );

  const onStart = useCallback(
    nodeId => {
      const node = findNode(nodeId);
      if (!node) return;

      cola.Layout.dragStart(node);
      blockCenterAndZoom(true);
    },
    [findNode, blockCenterAndZoom]
  );

  const onEnd = useCallback(
    node => {
      // unlock zoom and ask for a relayout (and a redaw as a consequence)
      blockCenterAndZoom(false);
      centerAndZoom();
    },
    [centerAndZoom, blockCenterAndZoom]
  );

  const [
    hoverNode,
    hiddenNodes,
    onOverNode,
    onLeaveNode
  ] = useHoverNodes(layout, { getMarkerColors });

  if (layout.nodes.length === 0) return null;

  return (
    <>
      <button // TODO: move it in parent code ?
        onClick={() => {
          layout.nodes.forEach(node => {
            cola.Layout.dragEnd(node);
          });
          layoutRef.current?.resume();
        }}
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
                onClick={onLinkClick}
                hover={
                  hoverNode === link.source.id || hoverNode === link.target.id
                }
              />
            );
          })}
        </g>
        <g stroke="#fff" strokeWidth={1}>
          {layout.nodes.map(node => {
            const { id, group, x, y, label, Component } = node;

            return (
              <g transform={`translate(${x * size} ${y * size})`}>
                <Node
                  key={id}
                  id={id}
                  group={group}
                  label={label}
                  Component={Component}
                  onClick={onNodeClick}
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
