import React, { useState, useEffect, useRef, useCallback } from "react";
// @ts-ignore
import * as cola from "webcola";
import { drag } from "d3-drag";
// import useTweenBetweenValues from "./useTweenBetweenValues";
import makeCurvedLinks from "./makeCurvedLinks";
import Node from "./Node";
import Link from "./Link";

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

type WithCoords = { x: number; y: number };
interface ChartNode extends WithCoords {
  [key: string]: any;
}

interface SimplifiedLayout {
  nodes: ChartNode[];
  links: any[];
}

// from https://github.com/cawfree/react-cola/blob/master/index.js
class ReactColaLayout extends cola.Layout {
  kick() {
    requestAnimationFrame(() => !this.tick() && this.kick());
  }
}

function mapLayout(layout: cola.Layout): SimplifiedLayout {
  return {
    nodes: layout.nodes(),
    links: layout.links()
  };
}

let size = 35;
const Chart = ({
  nodes,
  links,
  onNodeClick,
  onLinkClick
}: {
  nodes: any[];
  links: any[];
  onNodeClick?: (node: any) => any;
  onLinkClick?: (link: any) => any;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // layout part and it request animation frame timer
  const rafTimer = useRef<number>();
  const [layout, setLayout] = useState<SimplifiedLayout>({
    nodes: [],
    links: []
  });

  const mouseMovingInfos = useRef({ startX: 0, startY: 0, moving: false });
  const rafOffsetTimer = useRef<number>();
  const [offsets, setOffsets] = useState({ x: 0, y: 0 });

  const blockZoom = useRef(false);
  const rafZoomTimer = useRef<number>();
  const [zoom, setZoom] = useState(1);
  // const [zoom, setZoom] = useTweenBetweenValues(1, {
  //   delay: 200,
  //   duration: 300
  // });

  const centerAndZoom = useCallback(() => {
    if (layout.nodes.length === 0) return;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    layout.nodes.forEach(({ x, y }) => {
      if (minX > x) minX = x;
      if (minY > y) minY = y;
      if (maxX < x) maxX = x;
      if (maxY < y) maxY = y;
    });
    minX = minX * size - size * 2;
    minY = minY * size - size * 2;
    maxX = maxX * size + size * 2;
    maxY = maxY * size + size * 2;
    let chartWidth = maxX - minX;
    let chartHeight = maxY - minY;
    // intermediate zoom to process paddings
    let newZoom = Math.max(chartWidth / width, chartHeight / height);
    minX -= padding * newZoom;
    minY -= padding * newZoom;
    maxX += padding * newZoom;
    maxY += padding * newZoom;
    chartWidth = maxX - minX;
    chartHeight = maxY - minY;
    // final zoom
    newZoom = Math.max(chartWidth / width, chartHeight / height);
    // process center
    let centerX = chartWidth / 2 + minX - (width * newZoom) / 2;
    let centerY = chartHeight / 2 + minY - (height * newZoom) / 2;
    if (!blockZoom.current) {
      setZoom(newZoom);
      setOffsets({ x: centerX, y: centerY });
    }
  }, [layout, setZoom]);

  const startLayout = useCallback(() => {
    if (layoutRef.current) {
      layoutRef.current
        .nodes(nodes)
        .links(links)
        .start(iterations, 0, 0, 0, true, true);
    }
  }, [nodes, links]);

  const layoutRef = useRef<ReactColaLayout>();
  useEffect(() => {
    const setLayoutOnRaf = (layout: SimplifiedLayout) => {
      if (rafTimer.current) {
        cancelAnimationFrame(rafTimer.current);
      }

      rafTimer.current = requestAnimationFrame(() => {
        setLayout(layout);
      });
    };

    const layout = new ReactColaLayout();
    layoutRef.current = layout;

    layout
      .on(cola.EventType.tick, () => {
        console.timeEnd("tick");
        setLayoutOnRaf(mapLayout(layout));
        console.time("tick");
      })
      .on(cola.EventType.start, () => {
        console.time("graph layout");
      })
      .on(cola.EventType.end, () => {
        console.timeEnd("graph layout");
        console.log(
          "links",
          layout.links().length,
          "nodes",
          layout.nodes().length
        );
      })
      .avoidOverlaps(true)
      .size([width, height])
      .jaccardLinkLengths(10);

    startLayout();
  }, [startLayout]);

  useEffect(() => {
    centerAndZoom();
  }, [layout, centerAndZoom]);

  const canMoveViewportRef = useRef(false);

  const onMouseMove = useCallback(
    e => {
      // TODO: add a timeout (with numbers, not setTimeout) instead of a boolean
      if (!mouseMovingInfos.current.moving) return;

      const { startX, startY } = mouseMovingInfos.current;
      const { clientX, clientY } = e;

      if (rafOffsetTimer.current) cancelAnimationFrame(rafOffsetTimer.current);
      rafOffsetTimer.current = requestAnimationFrame(() => {
        mouseMovingInfos.current.startX = clientX;
        mouseMovingInfos.current.startY = clientY;
        setOffsets(old => ({
          x: old.x + (startX - clientX) * zoom,
          y: old.y + (startY - clientY) * zoom
        }));
      });
    },
    [zoom]
  );
  const onMouseDown = useCallback(e => {
    if (!canMoveViewportRef.current) return;
    mouseMovingInfos.current = {
      ...mouseMovingInfos.current,
      moving: true,
      startX: e.clientX,
      startY: e.clientY
    };
  }, []);
  const onMouseUp = useCallback(() => {
    mouseMovingInfos.current = {
      ...mouseMovingInfos.current,
      moving: false
    };
  }, []);

  // TODO: should offset to the cursor mouse while zooming
  const onWheel = useCallback(
    e => {
      const { deltaY } = e;

      if (rafZoomTimer.current) cancelAnimationFrame(rafZoomTimer.current);
      rafZoomTimer.current = requestAnimationFrame(() => {
        // console.log("WHEEL?");
        setZoom((old: number) => old - deltaY / 1000);
      });
    },
    [setZoom]
  );

  const [lineMarkerColors] = useState(["#999"]);

  const findNode = useCallback(
    nodeId => layout.nodes.find(n => n.id === nodeId),
    [layout.nodes]
  );

  const onDrag = useCallback(
    (nodeId, e: MouseEvent) => {
      canMoveViewportRef.current = false;
      onMouseUp();

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
    [onMouseUp, findNode]
  );

  const onStart = useCallback(
    nodeId => {
      const node = findNode(nodeId);
      if (!node) return;

      cola.Layout.dragStart(node);
      blockZoom.current = true;
    },
    [findNode]
  );

  const onEnd = useCallback(node => {
    // cola.Layout.dragEnd(node);

    // unlock zoom and ask for a relayout (and a redaw as a consequence)
    blockZoom.current = false;
    if (layoutRef.current) {
      layoutRef.current.resume();
    }
  }, []);

  if (layout.nodes.length === 0) return null;
  // FIXME:
  // sometimes offsets are not ready, we have to dig why
  // but for now we fix this bug like that...
  if (Number.isNaN(offsets.x)) return null;

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
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        xmlns="http://www.w3.org/2000/svg"
      >
        {lineMarkerColors.map(color => (
          <marker
            id={`arrow-${color}`}
            key={`arrow-${color}`}
            viewBox="0 0 10 10"
            refX={size / 2 - 2.5} // FIXME: find a function to process this number
            refY="2.5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 5 2.5 L 0 5 z" fill={color} />
          </marker>
        ))}

        <g stroke="#999" strokeOpacity={0.8}>
          {
          makeCurvedLinks(layout.links, { size }) // TODO: memoize this
            // layout.links
            .map((link: any, index) => {
              const { length, d, label, source, target, Component } = link;
              return (
                <Link
                  id={index}
                  length={length}
                  d={d}
                  source={{ x: source.x, y: source.y, label: source.label }}
                  target={{ x: target.x, y: target.y, label: target.label }}
                  Component={Component}
                  onClick={onLinkClick}
                />
              );
              // return (
              //   <g key={d} onClick={() => onLinkClick && onLinkClick(link)}>
              //     {Component ? (
              //       <Component {...link} />
              //     ) : (
              //       <>
              //         <path
              //           id={index + ""}
              //           strokeWidth={Math.sqrt(length) * 10}
              //           fill="transparent"
              //           d={d}
              //           markerEnd="url(#arrow-#999)"
              //         ></path>
              //         {/* <text x="100" transform="translate(0, 30)"> */}
              //         {/* TODO: offset to process (not hardcoded) */}
              //         {/* <textPath href={`#${index}`}>
              //           {label || `${source.label} -> ${target.label}`}
              //         </textPath>
              //       </text> */}
              //       </>
              //     )}
              //   </g>
              // );
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
                  size={size}
                  onDrag={onDrag}
                  onStart={onStart}
                  onEnd={onEnd}
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
