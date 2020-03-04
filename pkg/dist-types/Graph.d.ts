import React from 'react';
interface GraphNode {
    id: string;
    group?: string;
    label?: string;
    color?: string;
    Component?: React.Component;
    [key: string]: any;
}
interface TreeNode extends GraphNode {
    children: GraphNode[];
}
interface GraphLink {
    source: number;
    target: number;
    label?: string;
    Component?: React.Component;
}
interface TreeGraphProps {
    nodes: TreeNode[];
    type: 'tree';
    onNodeClick?: (node: any) => void;
    onLinkClick?: (link: any) => void;
}
interface GraphGraphProps {
    nodes: GraphNode[];
    links?: GraphLink[];
    type: 'graph';
    onNodeClick?: (node: any) => void;
    onLinkClick?: (link: any) => void;
}
declare const Graph: (props: TreeGraphProps | GraphGraphProps) => JSX.Element | null;
export default Graph;
