import { useRef, useCallback, useEffect, useState } from "react";
import { SimplifiedLayout, ChartNode, WithCoords } from "../types";
import {
  createGraphLayout,
  createTreeLayout,
  LayoutEngine,
  Link
} from "./layoutEngines";

const useLayout = (
  nodes: ChartNode[],
  links: Link[],
  {
    width,
    height,
    size,
    type = "graph"
  }: { width: number; height: number; size: number; type: "tree" | "graph" }
): [
  SimplifiedLayout,
  {
    restart: () => void;
    dragStart: (node: ChartNode) => void;
    drag: (node: ChartNode, newPos: WithCoords) => void;
    dragEnd: (node: ChartNode) => void;
  }
] => {
  const engine = useRef<LayoutEngine>();
  const framesPerView = useRef<number>(10); // TODO: make it dynamic based on frame time

  // so we can move from 1 frame per view to previous value (used in drag)
  const previousFramesPerView = useRef<number>(framesPerView.current);

  const [layout, setLayout] = useState<SimplifiedLayout>({
    nodes: [],
    links: []
  });

  const startEngine = useCallback(() => {
    if (!nodes || nodes.length === 0) return;

    if (engine.current) {
      engine.current.start(nodes, links);
      setLayout(engine.current.getLayout());
    }
  }, [nodes, links]);

  const initEngine = useCallback(() => {
    engine.current?.stop();
    if (type === "graph") {
      engine.current = createGraphLayout({ width, height });
    } else if (type === "tree") {
      engine.current = createTreeLayout({ size });
    }

    // get the layout view once per frame
    let rafTimer: any;
    if (engine.current) {
      const getViewOnRaf = (frame: number) => {
        // TODO: make it stop when layout ends
        let innerFrame = frame + 1;
        if (frame >= framesPerView.current && engine.current) {
          innerFrame = 0;
          setLayout({ ...engine.current.getLayout() });
        }

        rafTimer = requestAnimationFrame(() => getViewOnRaf(innerFrame));
      };

      getViewOnRaf(0);
    }

    return () => {
      if (rafTimer) {
        cancelAnimationFrame(rafTimer);
      }
    };
  }, [type, width, height, size]);

  const previousInitEngineRef = useRef<any>();
  const previousStartEngineRef = useRef<any>();
  useEffect(() => {
    if (previousInitEngineRef.current !== initEngine) {
      previousInitEngineRef.current = initEngine;
      previousStartEngineRef.current = startEngine;
      initEngine();
      startEngine();
    } else if (previousStartEngineRef.current !== startEngine) {
      previousStartEngineRef.current = startEngine;
      startEngine();
    }
  }, [initEngine, startEngine]);

  const restart = useCallback(() => {
    engine.current?.restart();
  }, []);

  const dragStart = useCallback(node => {
    framesPerView.current = 1; // make it smooth
    engine.current?.dragStart(node);
  }, []);

  const drag = useCallback((node, newPos) => {
    engine.current?.drag(node, newPos);
  }, []);

  const dragEnd = useCallback(node => {
    engine.current?.dragEnd(node);
    framesPerView.current = previousFramesPerView.current;
  }, []);

  return [layout, { restart, dragStart, drag, dragEnd }];
};

export default useLayout;
