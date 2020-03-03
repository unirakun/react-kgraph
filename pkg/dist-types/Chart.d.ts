/// <reference types="react" />
declare const Chart: (props: {
    nodes: any[];
    links: any[];
    type: "graph" | "tree";
    onNodeClick?: ((node: any) => any) | undefined;
    onLinkClick?: ((link: any) => any) | undefined;
}) => JSX.Element | null;
export default Chart;
