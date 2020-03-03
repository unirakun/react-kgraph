import { ChartNode, WithCoords } from "../../types";
export interface Link {
    target: ChartNode;
    source: ChartNode;
}
export interface LayoutEngine {
    drag: (node: ChartNode, newPos: WithCoords) => void;
    dragStart: (node: ChartNode) => void;
    dragEnd: (node: ChartNode) => void;
    restart: () => void;
    start: (nodes: ChartNode[], links: Link[]) => void;
    stop: () => void;
    getLayout: () => {
        nodes: ChartNode[];
        links: Link[];
    };
    type: "graph" | "tree";
}
