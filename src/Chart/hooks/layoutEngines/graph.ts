// @ts-ignore
import * as cola from "webcola";
import { ChartNode, WithCoords, SimplifiedLayout } from "../../types";
import { LayoutEngine, Link } from "./layoutEngine";

let iterations = 1;

// from https://github.com/cawfree/react-cola/blob/master/index.js
class ReactColaLayout extends cola.Layout {
  private kickTimeoutTimer: any;

  stop() {
    super.stop();
    if (this.kickTimeoutTimer) clearTimeout(this.kickTimeoutTimer);
    return this;
  }

  kick() {
    // we don't use request animation frame and try to kick as fast as we can
    // but we also want to look at "ticks" betweens frames, so we use a timeout!
    this.kickTimeoutTimer = setTimeout(() => !this.tick() && this.kick(), 0);
  }
}

const createGraphLayout = ({
  width,
  height
}: {
  width: number;
  height: number;
}): LayoutEngine => {
  const layout = new ReactColaLayout();
  const view: SimplifiedLayout = {
    nodes: [],
    links: []
  };

  let ticks = 0;
  layout
    .on(cola.EventType.tick, () => {
      ticks += 1;

      // TODO: make copy!!!!
      view.nodes = layout.nodes();
      view.links = layout.links();
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

  const start = (nodes: ChartNode[], links: Link[]) => {
    if (!nodes || nodes.length === 0) return;

    layout
      .nodes(nodes)
      .links(links)
      .start(iterations, 1, 1, 0, true, false);
  };

  const stop = () => {
    layout.stop();
  };

  const restart = () => {
    layout.nodes().forEach(cola.Layout.dragEnd);
    layout.resume();
  };

  const drag = (node: ChartNode, newPos: WithCoords) => {
    cola.Layout.drag(node, newPos);
    layout.resume();
  };

  const dragStart = (node: ChartNode) => {
    cola.Layout.dragStart(node);
  };

  const dragEnd = (node: ChartNode) => {
    // we don't tell cola we finish to drag because we want the node to be fixed
    // cola.Layout.dragEnd(node);
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
    type: "graph"
  };
};

export default createGraphLayout;
