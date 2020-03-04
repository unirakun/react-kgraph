import { tree as d3tree, hierarchy } from 'd3-hierarchy';
const createTreeLayout = ({ size }) => {
    let previousRootNode;
    const view = {
        nodes: [],
        links: [],
    };
    const start = (nodes) => {
        const [rootNode] = nodes;
        previousRootNode = rootNode;
        const d3treelayout = d3tree().nodeSize([size / 2, size / 2])(hierarchy(rootNode));
        const mappedNodes = [];
        const mappedLinks = [];
        const mapNode = (d3node) => ({ ...d3node.data, ...d3node });
        const addNodeAndChildren = (parentNode) => {
            mappedNodes.push(mapNode(parentNode));
            if (parentNode.children) {
                parentNode.children.forEach((node) => {
                    mappedLinks.push({
                        label: node.id,
                        source: mapNode(parentNode),
                        target: mapNode(node),
                        length: 2,
                    });
                    addNodeAndChildren(node);
                });
            }
        };
        addNodeAndChildren(d3treelayout);
        view.nodes = mappedNodes;
        view.links = mappedLinks;
    };
    const stop = () => {
        // n/a
    };
    const restart = () => {
        if (previousRootNode)
            start([previousRootNode]);
    };
    const drag = () => {
        // n/a
    };
    const dragStart = () => {
        // n/a
    };
    const dragEnd = () => {
        // n/a
    };
    const getLayout = () => view;
    return {
        drag,
        dragStart,
        dragEnd,
        restart,
        start,
        stop,
        getLayout,
        type: 'tree',
    };
};
export default createTreeLayout;
