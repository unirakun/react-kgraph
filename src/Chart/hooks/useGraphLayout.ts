import { useRef, useCallback, useEffect, useState } from "react";
// @ts-ignore
import * as cola from "webcola";
import { SimplifiedLayout, ChartNode, WithCoords } from "../types";

let iterations = 1;

// from https://github.com/cawfree/react-cola/blob/master/index.js
class ReactColaLayout extends cola.Layout {
  kick() {
    // we don't use request animation frame and try to kick as fast as we can
    // but we also want to look at "ticks" betweens frames, so we use a timeout!
    setTimeout(() => !this.tick() && this.kick(), 0);
  }
}

const useGraphLayout = (
  nodes: any[],
  links: any[],
  { width, height }: { width: number; height: number }
): [
  SimplifiedLayout,
  () => void,
  {
    dragStart: (node: ChartNode) => void;
    drag: (node: ChartNode, newPos: WithCoords) => void;
  },
  () => void
] => {
  const [layout, setLayout] = useState<SimplifiedLayout>({
    nodes: [],
    links: []
  });
  const layoutRef = useRef<ReactColaLayout>();
  const layoutTickDraw = useRef(true);

  const startLayout = useCallback(() => {
    if (layoutRef.current) {
      layoutRef.current
        .nodes(nodes)
        .links(links)
        .start(iterations, 1, 1, 0, true, false);
    }
  }, [nodes, links]);

  useEffect(() => {
    if (!nodes || nodes.length === 0) return;
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
  }, [startLayout, nodes, height, width]);

  const relayout = useCallback(() => {
    layout.nodes.forEach(node => {
      cola.Layout.dragEnd(node);
    });
    layoutRef.current?.resume();
  }, [layout.nodes]);

  const drag = useCallback((node, newPos) => {
    cola.Layout.drag(node, newPos);
    if (layoutRef.current) {
      layoutRef.current.resume();
    }
  }, []);

  const dragStart = useCallback((node: ChartNode) => {
    cola.Layout.dragStart(node);
  }, []);

  const drawn = useCallback(() => {
    layoutTickDraw.current = true;
  }, []);

  return [layout, relayout, { dragStart, drag }, drawn];
};

export default useGraphLayout;

function mapLayout(layout: cola.Layout): SimplifiedLayout {
  return {
    nodes: layout.nodes(),
    links: layout.links()
  };
}
