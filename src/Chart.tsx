import React, { useState, useEffect, useRef, useCallback } from "react";
// @ts-ignore
import * as cola from "webcola";
import * as d3 from "d3";
import { drag } from "d3-drag";
import useTweenBetweenValues from "./useTweenBetweenValues";
import makeCurvedLinks from "./makeCurvedLinks";

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
  const [zoom, setZoom] = useTweenBetweenValues(-1, {
    delay: 200,
    duration: 300
  });

  const centerAndZoom = useCallback(() => {
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
    if (
      !blockZoom.current &&
      !Number.isNaN(newZoom) &&
      Math.abs(newZoom) !== Infinity
    ) {
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
        console.log("tick");
        setLayoutOnRaf(mapLayout(layout));
      })
      .on(cola.EventType.start, () => {
        console.log("start");
        // blockZoom.current = false;
      })
      .on(cola.EventType.end, () => {
        console.log("end");
        // blockZoom.current = true;
      })
      .avoidOverlaps(true)
      .size([width, height])
      .jaccardLinkLengths(10);

    startLayout();
  }, [startLayout]);

  useEffect(() => {
    startLayout();
  }, [nodes, links, startLayout]);

  useEffect(() => {
    centerAndZoom();
  }, [layout, centerAndZoom]);

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
  const onWheel = useCallback(
    e => {
      const { deltaY } = e;

      if (rafZoomTimer.current) cancelAnimationFrame(rafZoomTimer.current);
      rafZoomTimer.current = requestAnimationFrame(() => {
        console.log("WHEEL?");
        setZoom((old: number) => old - deltaY / 1000);
      });
    },
    [setZoom]
  );

  const [, setTick] = useState(0);

  if (layout.nodes.length === 0) return null;
  // FIXME:
  // sometimes offsets are not ready, we have to dig why
  // but for now we fix this bug like that...
  if (Number.isNaN(offsets.x)) return null;

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
        {makeCurvedLinks(layout.links, { size }).map((link: any) => {
          const { source, target, length, d } = link;
          return (
            <path
              key={`${source.index}--${target.index}`}
              strokeWidth={Math.sqrt(length) * 10}
              d={d}
              onClick={() => onLinkClick && onLinkClick(link)}
            ></path>
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
              style={{ cursor: "pointer" }}
              onClick={() => onNodeClick && onNodeClick(node)}
              ref={elem => {
                if (!elem) return;

                let rafTimer = 0;
                let nodeDraggable = drag();
                let fullDeltaX = 0;
                let fullDeltaY = 0;
                nodeDraggable.on("start", () => {
                  cola.Layout.dragStart(node);
                });
                nodeDraggable.on("drag", () => {
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
                    const nodeWithNewPos = getWithNewPos(node);

                    // direct mutation for webcola
                    node.x = nodeWithNewPos.x;
                    node.y = nodeWithNewPos.y;

                    // force webcola to process a new layout
                    if (layoutRef.current) {
                      layoutRef.current.kick();
                    }

                    // all deltas are computed, we reset them all
                    fullDeltaX = 0;
                    fullDeltaY = 0;

                    // force react to rerender :( (since we mutate object for webcola)
                    setTick(old => old + 1);
                  });
                });
                nodeDraggable.on("end", () => {
                  cola.Layout.dragEnd(node);
                  startLayout();
                });
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
