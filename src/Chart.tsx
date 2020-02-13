import React, { useState, useEffect, useRef, useCallback } from "react";
// @ts-ignore
import * as cola from "webcola";
import * as d3 from "d3";
import { drag } from "d3-drag";

let height = 500;
let width = 800;
let padding = 20;
let iterations = 1;
let color = d3.scaleOrdinal(d3.schemeCategory10);

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

let chart = async (
  {
    nodes,
    links,
    onTick,
    onEnd,
    onStart
  }: {
    nodes: any[];
    links: any[];
    onTick?: (layout: SimplifiedLayout) => void;
    onEnd?: (layout: SimplifiedLayout) => void;
    onStart?: (layout: SimplifiedLayout) => void;
  } = { nodes: [], links: [] }
) => {
  const layout = new ReactColaLayout();
  const on = (callback?: (layout: SimplifiedLayout) => void) => (): void => {
    if (callback) {
      callback(mapLayout(layout));
    }
  };
  layout
    .on(cola.EventType.tick, on(onTick))
    .on(cola.EventType.start, on(onStart))
    .on(cola.EventType.end, on(onEnd))
    .avoidOverlaps(true)
    .size([width, height])
    .nodes(nodes)
    .links(links)
    .jaccardLinkLengths(10)
    .start(iterations);
};

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
  const rafTimer = useRef<number>();
  const [layout, setLayout] = useState<SimplifiedLayout>({
    nodes: [],
    links: []
  });

  const mouseMovingInfos = useRef({ startX: 0, startY: 0, moving: false });
  const rafOffsetTimer = useRef<number>();
  const [offsets, setOffsets] = useState({ x: 0, y: 0 });

  const rafZoomTimer = useRef<number>();
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    if (nodes.length === 0) return;

    const setLayoutOnRaf = (layout: SimplifiedLayout) => {
      if (rafTimer.current) {
        cancelAnimationFrame(rafTimer.current);
      }

      rafTimer.current = requestAnimationFrame(() => {
        setLayout(layout);

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
        setZoom(newZoom);
        setOffsets({ x: centerX, y: centerY });
      });
    };

    chart({
      nodes,
      links,
      onTick: setLayoutOnRaf,
      onEnd: setLayoutOnRaf
    });
  }, [nodes, links]);

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
    // return;
    // FIXME: this is commented because we try d'n'd
    mouseMovingInfos.current = {
      ...mouseMovingInfos.current,
      moving: true,
      startX: e.clientX,
      startY: e.clientY
    };
  }, []);
  const onMouseUp = useCallback(e => {
    mouseMovingInfos.current = {
      ...mouseMovingInfos.current,
      moving: false
    };
  }, []);

  // TODO: should offset to the cursor mouse while zooming
  const onWheel = useCallback(e => {
    const { deltaY } = e;

    if (rafZoomTimer.current) cancelAnimationFrame(rafZoomTimer.current);
    rafZoomTimer.current = requestAnimationFrame(() => {
      setZoom(old => old - deltaY / 1000);
    });
  }, []);

  if (nodes.length === 0) return null;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`${offsets.x} ${offsets.y} ${width * zoom} ${height * zoom}`}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      <g stroke="#999" strokeOpacity={0.8}>
        {layout.links.map(link => {
          const { source, target, length } = link;
          return (
            // <path
            //   strokeWidth={Math.sqrt(length)}
            //   d={`
            //     M ${source.x * size} ${source.y * size}
            //     Q 10 10
            //     ${target.x * size} ${target.y * size}
            //   `}
            //   stroke="black"
            //   fill="transparent"
            // />
            <line
              key={`${source.index}--${target.index}`}
              strokeWidth={Math.sqrt(length) * 10}
              x1={source.x * size}
              y1={source.y * size}
              x2={target.x * size}
              y2={target.y * size}
              onClick={() => onLinkClick && onLinkClick(link)}
            ></line>
          );
        })}
      </g>
      <g stroke="#fff" strokeWidth={1.5}>
        {layout.nodes.map(node => {
          const { id, group, x, y, value, Component } = node;

          return (
            <g
              key={id}
              transform={`translate(${x * size} ${y * size})`}
              onClick={() => onNodeClick && onNodeClick(node)}
              ref={elem => {
                if (!elem) return;

                let rafTimer = 0;
                let nodeDraggable = drag();
                let fullDeltaX = 0;
                let fullDeltaY = 0;
                nodeDraggable.on("start", (e: any) => {});
                nodeDraggable.on("drag", (e: any) => {
                  const { dx, dy } = d3.event;

                  fullDeltaX += dx;
                  fullDeltaY += dy;

                  const getWithNewPos = (o: {
                    x: number;
                    y: number;
                    [key: string]: any;
                  }) => ({
                    ...o,
                    x: o.x + fullDeltaX / size,
                    y: o.y + fullDeltaY / size
                  });

                  if (rafTimer) cancelAnimationFrame(rafTimer);
                  rafTimer = requestAnimationFrame(() => {
                    setLayout(old => ({
                      ...old,
                      nodes: [
                        ...old.nodes.map(currNode => {
                          if (currNode.id !== node.id) return currNode;
                          return getWithNewPos(currNode);
                        })
                      ],
                      links: [
                        ...old.links.map(currLink => {
                          if (currLink.target.id === node.id) {
                            return {
                              ...currLink,
                              target: getWithNewPos(currLink.target)
                            };
                          }

                          if (currLink.source.id === node.id) {
                            return {
                              ...currLink,
                              source: getWithNewPos(currLink.source)
                            };
                          }

                          return currLink;
                        })
                      ]
                    }));
                    fullDeltaX = 0;
                    fullDeltaY = 0;
                  });
                });
                nodeDraggable.on("end", (e: any) => {});
                nodeDraggable(d3.select(elem as Element));
              }}
            >
              {Component ? (
                <Component {...node} />
              ) : (
                <>
                  <circle
                    r={size * 2}
                    fill={color(group)}
                    cx={0}
                    cy={0}
                  ></circle>
                  <text
                    stroke="#333"
                    textAnchor="middle"
                    dy="0.5em"
                    fontSize="1em"
                  >
                    {value}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default Chart;
