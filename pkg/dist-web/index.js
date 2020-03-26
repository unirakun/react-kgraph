import React, { memo, useRef, useCallback, useEffect, useState, useLayoutEffect } from 'react';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import { EventType, Layout } from 'webcola';
import cloneDeep from 'lodash.clonedeep';
import { tree, hierarchy } from 'd3-hierarchy';

// references: https://stackoverflow.com/questions/31804392/create-svg-arcs-between-two-points
const knownIndex = Symbol('knownIndex');
const isSamePoint = (source, target) => source.x === target.x && source.y === target.y;
const isSimilarLink = (a) => (b) => (isSamePoint(a.source, b.source) && isSamePoint(a.target, b.target)) ||
    (isSamePoint(a.source, b.target) && isSamePoint(a.target, b.source));
const scale = ({ source, target }, size) => ({
    source: {
        ...source,
        x: source.x * size,
        y: source.y * size,
    },
    target: {
        ...target,
        x: target.x * size,
        y: target.y * size,
    },
});
const createCurve = (link, i, inGroup, groups, { size, offset = 500 }) => {
    // use size to scale all positions
    const { source, target } = scale(link, size);
    // don't calcul the curve when only one link between two point
    if (i === (inGroup - 1) / 2) {
        return {
            ...link,
            d: `M ${source.x} ${source.y} ${target.x} ${target.y}`,
            quadraticPoint: {
                x: source.x + (target.x - source.x) / 2,
                y: source.y + (target.y - source.y) / 2,
            },
            sweep: 1,
        };
    }
    const cx = (source.x + target.x) / 2;
    const cy = (source.y + target.y) / 2;
    const dx = (target.x - source.x) / 2;
    const dy = (target.y - source.y) / 2;
    const dd = Math.sqrt(dx * dx + dy * dy);
    const sweep = link.source.x - link.target.x > 0 ? 1 : -1;
    const quadraticPoint = {
        x: cx + (dy / dd) * (offset / groups) * (i - (inGroup - 1) / 2) * sweep,
        y: cy - (dx / dd) * (offset / groups) * (i - (inGroup - 1) / 2) * sweep,
    };
    // add svg path of link
    return {
        ...link,
        d: `M ${source.x} ${source.y} Q ${quadraticPoint.x} ${quadraticPoint.y} ${target.x} ${target.y}`,
        quadraticPoint,
        sweep,
    };
};
const addSVGPath = (options) => (groups) => {
    return groups.map((link, index, { length }) => createCurve(link, index, length, groups.length, options));
};
var makeCurvedLinks = (links, { offset, size = 1 }) => {
    // adding known index to sort link after curves
    const linksWithIndex = links.map((link, index) => ({
        ...link,
        [knownIndex]: index,
    }));
    // groups of similar link
    const groupLinks = [];
    // construct a new array of links so we can mutate it while iterating on it
    const iterateLinks = [...linksWithIndex];
    while (iterateLinks.length > 0) {
        const [currentLink] = iterateLinks;
        const similarLinks = iterateLinks.filter(isSimilarLink(currentLink));
        groupLinks.push(similarLinks);
        similarLinks.forEach((sl) => iterateLinks.splice(iterateLinks.indexOf(sl), 1));
    }
    // output links with quadratic point, sweep and d path
    // they are output in same order than the input
    return groupLinks
        .flatMap(addSVGPath({ offset, size }))
        .sort((a, b) => a[knownIndex] - b[knownIndex]);
};

const getColor = scaleOrdinal(schemeCategory10);
// TODO: create a MovableSvgItem ?
// TODO: remove the "node" parameter
// TODO: to integrate with Chart component and keep perf, use an other Component to "useCallback" the callbacks with "node" parameter
//      https://stackoverflow.com/questions/55963914/react-usecallback-hook-for-map-rendering
const Node = (props) => {
    const { id, size, group, label, hover, hidden, color, 
    // specific to this Node wrapper Component
    Component, onClick, onDrag, onStart, onEnd, onMouseEnter, onMouseLeave, ...gProps } = props;
    const nodeRef = useRef(null);
    const dragInfoRef = useRef({ thisIsMe: false, beforeX: 0, beforeY: 0 });
    const rafTimerRef = useRef(0);
    const mouseDown = useCallback((e) => {
        if (!nodeRef.current)
            return;
        dragInfoRef.current.thisIsMe = e
            .composedPath()
            .some((n) => n === nodeRef.current);
        if (dragInfoRef.current.thisIsMe) {
            dragInfoRef.current.beforeX = e.clientX;
            dragInfoRef.current.beforeY = e.clientY;
            onStart(id);
        }
    }, [onStart, id]);
    const mouseMove = useCallback((e) => {
        if (!nodeRef.current)
            return;
        if (!dragInfoRef.current.thisIsMe)
            return;
        e.preventDefault();
        e.stopPropagation();
        const deltaX = e.clientX - dragInfoRef.current.beforeX;
        const deltaY = e.clientY - dragInfoRef.current.beforeY;
        if (rafTimerRef.current)
            cancelAnimationFrame(rafTimerRef.current);
        rafTimerRef.current = requestAnimationFrame(() => {
            onDrag(id, e, { deltaX, deltaY });
            dragInfoRef.current.beforeX = e.clientX;
            dragInfoRef.current.beforeY = e.clientY;
        });
    }, [onDrag, id]);
    const mouseUp = useCallback(() => {
        if (dragInfoRef.current.thisIsMe) {
            onEnd(id);
        }
        dragInfoRef.current.thisIsMe = false;
    }, [onEnd, id]);
    const innerOnMouseLeave = useCallback(() => {
        if (onMouseLeave)
            onMouseLeave(id);
    }, [onMouseLeave, id]);
    const innerOnMouseEnter = useCallback(() => {
        if (onMouseEnter)
            onMouseEnter(id);
    }, [onMouseEnter, id]);
    useEffect(() => {
        window.addEventListener('mousedown', mouseDown);
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
        return () => {
            window.removeEventListener('mousedown', mouseDown);
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseup', mouseUp);
        };
    }, [mouseDown, mouseMove, mouseUp]);
    const onInnerClick = useCallback(() => {
        if (onClick)
            return onClick(id);
        return undefined;
    }, [onClick, id]);
    const getElement = () => {
        if (Component) {
            return (React.createElement(Component, { id: id, size: size, group: group, label: label, hover: hover, hidden: hidden, color: color }));
        }
        const innerSize = (size + 10) * 3;
        const outerSize = innerSize + 20;
        const style = {
            borderRadius: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(50, 50, 50, 0.4)',
            boxShadow: '0px 0px 10px -5px black',
            width: innerSize,
            height: innerSize,
            margin: '5px auto',
        };
        if (hover) {
            style.backgroundColor = '#f97975';
        }
        else if (group !== undefined && group !== null) {
            style.backgroundColor = getColor(group);
        }
        else {
            style.backgroundColor = color || '#1f77b4';
        }
        return (React.createElement("foreignObject", { width: outerSize, height: outerSize, x: -outerSize / 2, y: -outerSize / 2 },
            React.createElement("div", { style: style }, label)));
    };
    return (React.createElement("g", Object.assign({ ref: nodeRef }, gProps, { onClick: onInnerClick, className: `node-container ${hidden ? 'node-hidden' : ''}`, onMouseLeave: innerOnMouseLeave, onMouseEnter: innerOnMouseEnter }), getElement()));
};
var Node$1 = memo(Node);

const Path = (props) => {
    const { id, d, strokeWidth, stroke, markerEnd } = props;
    return (React.createElement("path", { id: `${id}`, d: d, strokeWidth: strokeWidth, fill: "transparent", stroke: stroke, markerEnd: markerEnd }));
};

const Label = (props) => {
    const { label, x, y, sweep, width, height } = props;
    const [position, setPosition] = useState({ x, y });
    useLayoutEffect(() => {
        if (sweep > 0) {
            setPosition({
                x: x - width / 2,
                y: y - height / 2,
            });
        }
        setPosition({
            x: x - width / 2,
            y,
        });
    }, [x, y, sweep, width, height]);
    return (React.createElement("foreignObject", Object.assign({}, position, { width: width, height: height }),
        React.createElement("div", { style: {
                borderRadius: '5px',
                backgroundColor: 'rgba(100, 100, 100, 0.2)',
                textAlign: 'center',
                padding: '1em',
                border: '1px solid rgba(50, 50, 50, 0.2)',
            } }, label)));
};

const DefaultLink = (props) => {
    const { id, d, label, quadraticPoint, sweep, source, target, hover } = props;
    return (React.createElement(React.Fragment, null,
        React.createElement(Path, { id: id, d: d, strokeWidth: 5, stroke: "#d1d1d1", markerEnd: "url(#arrow-#d1d1d1)" }),
        hover && (React.createElement(Path, { id: id, d: d, strokeWidth: 20, stroke: "rgba(249, 121, 117, 0.5)" })),
        hover && (React.createElement(Label, Object.assign({}, quadraticPoint, { sweep: sweep, width: 250, height: 100, label: label || `${source.label} -> ${target.label}` })))));
};
const PROPS_TO_ALWAYS_COMPARE = ['id', 'hover'];
const propsAreEqual = (prevProps, nextProps) => {
    return !Object.entries(prevProps).some(([key, value]) => {
        if (PROPS_TO_ALWAYS_COMPARE.includes(key)) {
            // @ts-ignore TODO:
            const nextValue = nextProps[key];
            const hasChanged = nextValue !== value;
            return hasChanged;
        }
        if (key === 'target' || key === 'source') {
            const nextValue = nextProps[key];
            // TODO: should use zoom
            const treshold = 0.1;
            // there is a difference if we pass the treshold
            if (Math.abs(nextValue.x - value.x) > treshold ||
                Math.abs(nextValue.y - value.y) > treshold) {
                return true;
            }
        }
        // means this is equal (we have NOT found a difference)
        return false;
    });
};
var DefaultLink$1 = memo(DefaultLink, propsAreEqual);

const Link = (props) => {
    const { Component, onClick, id, ...restProps } = props;
    const innerOnClick = useCallback(() => {
        if (onClick)
            return onClick(id);
        return undefined;
    }, [onClick, id]);
    return (React.createElement("g", { onClick: innerOnClick }, React.createElement(Component || DefaultLink$1, {
        ...restProps,
        id,
    })));
};

const useHoverNode = (layout, { getMarkerColors }) => {
    const [hoverNode, setHoverNode] = useState();
    const [hiddenNodes, setHiddenNodes] = useState([]);
    const onOverNode = useCallback((nodeId) => {
        const notHiddenNodes = new Set();
        // get hidden links and NOT hidden nodes
        layout.links.forEach(({ source, target }) => {
            if (nodeId !== source.id && nodeId !== target.id) {
                return;
            }
            notHiddenNodes.add(source.id);
            notHiddenNodes.add(target.id);
        });
        // hidden nodes are NOT nodes that are NOT hidden
        const newHiddenNodes = layout.nodes.filter(({ id }) => !notHiddenNodes.has(id));
        setHiddenNodes(newHiddenNodes.map(({ id }) => id));
        setHoverNode(nodeId);
        requestAnimationFrame(getMarkerColors);
    }, [getMarkerColors, layout.links, layout.nodes]);
    const onLeaveNode = useCallback(() => {
        setHoverNode(undefined);
        setHiddenNodes([]);
    }, []);
    return [hoverNode, hiddenNodes, onOverNode, onLeaveNode];
};

const useCenterAndZoom = (layout, { size, padding, width, height, }) => {
    const [offsets, setOffsets] = useState({ x: 0, y: 0 });
    const blockAll = useRef(false);
    const [zoom, setZoom] = useState(1);
    // const [zoom, setZoom] = useTweenBetweenValues(1, {
    //   delay: 200,
    //   duration: 300
    // });
    const centerAndZoom = useCallback((nodes) => {
        if (nodes.length === 0)
            return;
        if (blockAll.current)
            return;
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        nodes.forEach(({ x, y }) => {
            if (minX > x)
                minX = x;
            if (minY > y)
                minY = y;
            if (maxX < x)
                maxX = x;
            if (maxY < y)
                maxY = y;
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
        const centerX = chartWidth / 2 + minX - (width * newZoom) / 2;
        const centerY = chartHeight / 2 + minY - (height * newZoom) / 2;
        setZoom(newZoom);
        setOffsets({ x: centerX, y: centerY });
    }, [setZoom, padding, size, height, width]);
    useLayoutEffect(() => {
        centerAndZoom(layout.nodes);
    }, [centerAndZoom, layout]);
    // TODO: should offset to the cursor mouse while zooming
    const onWheel = useCallback((e) => {
        const { deltaY } = e;
        setZoom((old) => old - deltaY / 1000);
    }, [setZoom]);
    const setBlockAll = useCallback((block) => {
        blockAll.current = block;
    }, []);
    const rafOffsetTimer = useRef();
    const mouseMovingInfos = useRef({ startX: 0, startY: 0, moving: false });
    const onMouseMove = useCallback((e) => {
        // TODO: add a timeout (with numbers, not setTimeout) instead of a boolean
        if (!mouseMovingInfos.current.moving)
            return;
        if (blockAll.current)
            return;
        const { startX, startY } = mouseMovingInfos.current;
        const { clientX, clientY } = e;
        if (rafOffsetTimer.current)
            cancelAnimationFrame(rafOffsetTimer.current);
        rafOffsetTimer.current = requestAnimationFrame(() => {
            mouseMovingInfos.current.startX = clientX;
            mouseMovingInfos.current.startY = clientY;
            setOffsets((old) => ({
                x: old.x + (startX - clientX) * zoom,
                y: old.y + (startY - clientY) * zoom,
            }));
        });
    }, [zoom]);
    const onMouseDown = useCallback((e) => {
        if (blockAll.current)
            return;
        mouseMovingInfos.current = {
            ...mouseMovingInfos.current,
            moving: true,
            startX: e.clientX,
            startY: e.clientY,
        };
    }, []);
    const onMouseUp = useCallback(() => {
        mouseMovingInfos.current = {
            ...mouseMovingInfos.current,
            moving: false,
        };
    }, []);
    return [
        zoom,
        offsets,
        centerAndZoom,
        onWheel,
        onMouseMove,
        onMouseDown,
        onMouseUp,
        setBlockAll,
    ];
};

// @ts-ignore
const iterations = 1;
// from https://github.com/cawfree/react-cola/blob/master/index.js
class ReactColaLayout extends Layout {
    stop() {
        super.stop();
        if (this.kickTimeoutTimer)
            clearTimeout(this.kickTimeoutTimer);
        return this;
    }
    kick() {
        // we don't use request animation frame and try to kick as fast as we can
        // but we also want to look at "ticks" betweens frames, so we use a timeout!
        this.kickTimeoutTimer = setTimeout(() => !this.tick() && this.kick(), 0);
    }
}
const createGraphLayout = ({ width, height, }) => {
    const layout = new ReactColaLayout();
    const view = {
        nodes: [],
        links: [],
    };
    // let ticks = 0
    layout
        .on(EventType.tick, () => {
        // ticks += 1
        // TODO: make copy!!!!
        view.nodes = layout.nodes();
        view.links = cloneDeep(layout.links());
    })
        .on(EventType.start, () => {
        // console.time('graph layout')
    })
        .on(EventType.end, () => {
        // console.log('ticks', ticks)
        // console.timeEnd('graph layout')
        // console.log(
        //   'links',
        //   layout.links().length,
        //   'nodes',
        //   layout.nodes().length,
        // )
        // mark all node as fixed (so this is performant)
        layout.nodes().forEach(Layout.dragStart);
    })
        .avoidOverlaps(true)
        .size([width, height])
        .jaccardLinkLengths(10);
    const start = (nodes, links) => {
        if (!nodes || nodes.length === 0)
            return;
        layout
            .nodes(nodes)
            .links(links)
            .start(iterations, 1, 1, 0, true, false);
    };
    const stop = () => {
        layout.stop();
    };
    const restart = () => {
        layout.nodes().forEach(Layout.dragEnd);
        layout.resume();
    };
    const drag = (node, newPos) => {
        Layout.drag(node, newPos);
        layout.resume();
    };
    const dragStart = (node) => {
        Layout.dragStart(node);
    };
    const dragEnd = () => {
        // we don't tell cola we finish to drag because we want the node to be fixed
        // cola.Layout.dragEnd(node);
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
        type: 'graph',
    };
};

const createTreeLayout = ({ size }) => {
    let previousRootNode;
    const view = {
        nodes: [],
        links: [],
    };
    const start = (nodes) => {
        const [rootNode] = nodes;
        previousRootNode = rootNode;
        const d3treelayout = tree().nodeSize([size / 2, size / 2])(hierarchy(rootNode));
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

const useLayout = (nodes, links, { width, height, size, type = 'graph', }) => {
    const engine = useRef();
    const framesPerView = useRef(10); // TODO: make it dynamic based on frame time
    // so we can move from 1 frame per view to previous value (used in drag)
    const previousFramesPerView = useRef(framesPerView.current);
    const [layout, setLayout] = useState({
        nodes: [],
        links: [],
    });
    const startEngine = useCallback(() => {
        if (!nodes || nodes.length === 0)
            return;
        if (engine.current) {
            engine.current.start(nodes, links);
            setLayout(engine.current.getLayout());
        }
    }, [nodes, links]);
    const initEngine = useCallback(() => {
        var _a;
        (_a = engine.current) === null || _a === void 0 ? void 0 : _a.stop();
        if (type === 'graph') {
            engine.current = createGraphLayout({ width, height });
        }
        else if (type === 'tree') {
            engine.current = createTreeLayout({ size });
        }
        // get the layout view once per frame
        let rafTimer;
        if (engine.current) {
            const getViewOnRaf = (frame) => {
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
    const previousInitEngineRef = useRef();
    const previousStartEngineRef = useRef();
    useEffect(() => {
        if (previousInitEngineRef.current !== initEngine) {
            previousInitEngineRef.current = initEngine;
            previousStartEngineRef.current = startEngine;
            initEngine();
            startEngine();
        }
        else if (previousStartEngineRef.current !== startEngine) {
            previousStartEngineRef.current = startEngine;
            startEngine();
        }
    }, [initEngine, startEngine]);
    const restart = useCallback(() => {
        var _a;
        (_a = engine.current) === null || _a === void 0 ? void 0 : _a.restart();
    }, []);
    const dragStart = useCallback((node) => {
        var _a;
        framesPerView.current = 1; // make it smooth
        (_a = engine.current) === null || _a === void 0 ? void 0 : _a.dragStart(node);
    }, []);
    const drag = useCallback((node, newPos) => {
        var _a;
        (_a = engine.current) === null || _a === void 0 ? void 0 : _a.drag(node, newPos);
    }, []);
    const dragEnd = useCallback((node) => {
        var _a;
        (_a = engine.current) === null || _a === void 0 ? void 0 : _a.dragEnd(node);
        framesPerView.current = previousFramesPerView.current;
    }, []);
    return [layout, { restart, dragStart, drag, dragEnd }];
};

/* eslint-disable jsx-a11y/anchor-is-valid */
function svgPoint(element, x, y) {
    if (!element)
        return { x, y };
    const pt = element.createSVGPoint();
    pt.x = x;
    pt.y = y;
    const screenCTM = element.getScreenCTM();
    if (screenCTM) {
        return pt.matrixTransform(screenCTM.inverse());
    }
    return {
        x,
        y,
    };
}
const height = 500;
const width = 800;
const padding = 20;
const size = 35;
const Graph = (props) => {
    const { style, className, nodes, links, type = 'graph', onNodeClick, onLinkClick, noZoom, noViewportMove, noDrag, } = props;
    const svgRef = useRef(null);
    const [layout, { drag, dragStart, dragEnd, restart }] = useLayout(nodes, links, {
        width,
        height,
        size,
        type,
    });
    const [zoom, offsets, centerAndZoom, onWheel, onMouseMove, onMouseDown, onMouseUp, blockCenterAndZoom,] = useCenterAndZoom(layout, { size, padding, width, height });
    const [lineMarkerColors, setLineMarkerColors] = useState(['#999']);
    const getMarkerColors = useCallback(() => {
        if (!svgRef.current)
            return;
        // get all path child from svg
        // to find stroke color and set new colors array
        // @ts-ignore
        const paths = [...svgRef.current.getElementsByTagName('path')];
        const colors = new Set(paths.map((path) => path.getAttribute('stroke')));
        // @ts-ignore
        setLineMarkerColors([...colors.values()].filter(Boolean));
    }, []);
    useEffect(getMarkerColors, [layout, getMarkerColors]);
    // TODO: move this to the layout engine?
    const findNode = useCallback((nodeId) => layout.nodes.find((n) => n.id === nodeId), [layout.nodes]);
    const findLink = useCallback((linkIndex) => layout.links[linkIndex], [
        layout.links,
    ]);
    const onDrag = useCallback((nodeId, e) => {
        const node = findNode(nodeId);
        if (!node)
            return;
        const newPos = svgPoint(svgRef.current, e.clientX, e.clientY);
        node.x = newPos.x / size;
        node.y = newPos.y / size;
        drag(node, { x: newPos.x / size, y: newPos.y / size });
    }, [findNode, drag]);
    const onStart = useCallback((nodeId) => {
        const node = findNode(nodeId);
        if (!node)
            return;
        dragStart(node);
        blockCenterAndZoom(true);
    }, [findNode, dragStart, blockCenterAndZoom]);
    const onEnd = useCallback((nodeId) => {
        const node = findNode(nodeId);
        if (!node)
            return;
        dragEnd(node);
        blockCenterAndZoom(false);
        centerAndZoom(layout.nodes);
    }, [centerAndZoom, blockCenterAndZoom, layout.nodes, dragEnd, findNode]);
    const [hoverNode, hiddenNodes, onOverNode, onLeaveNode,] = useHoverNode(layout, { getMarkerColors });
    const innerOnNodeClick = useCallback((id) => {
        if (!onNodeClick)
            return undefined;
        const node = findNode(id);
        return onNodeClick(node);
    }, [onNodeClick, findNode]);
    const innerOnLinkClick = useCallback((index) => {
        if (!onLinkClick)
            return undefined;
        return onLinkClick(findLink(index));
    }, [onLinkClick, findLink]);
    if (layout.nodes.length === 0)
        return null;
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { onClick: restart, type: "button" }, "Relayout"),
        React.createElement("svg", { className: className, style: style, ref: svgRef, width: width, height: height, viewBox: `${offsets.x} ${offsets.y} ${width * zoom} ${height * zoom}`, onWheel: noZoom ? undefined : onWheel, onMouseMove: noViewportMove ? undefined : onMouseMove, onMouseDown: noViewportMove ? undefined : onMouseDown, onMouseUp: noViewportMove ? undefined : onMouseUp, xmlns: "http://www.w3.org/2000/svg" },
            lineMarkerColors.map((color) => (React.createElement("marker", { id: `arrow-${color}`, key: `arrow-${color}`, viewBox: "0 0 10 10", refX: size / 2 + 11, refY: "2.5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" },
                React.createElement("path", { d: "M 0 0 L 5 2.5 L 0 5 z", fill: color })))),
            React.createElement("g", { stroke: "#999" }, makeCurvedLinks(layout.links, { size }).map((link, index) => {
                const { source, target } = link;
                return (React.createElement(Link, Object.assign({ id: index }, link, { size: size, onClick: innerOnLinkClick, hover: hoverNode === source.id || hoverNode === target.id })));
            })),
            React.createElement("g", { stroke: "#fff", strokeWidth: 1 }, layout.nodes.map((node) => {
                const { id, group, x, y, label, Component, color } = node;
                return (React.createElement("g", { transform: `translate(${x * size} ${y * size})` },
                    React.createElement(Node$1, { key: id, id: id, group: group, label: label, color: color, Component: Component, size: size, hover: hoverNode === id, hidden: hoverNode !== id && hiddenNodes.includes(id), onClick: innerOnNodeClick, onMouseEnter: onOverNode, onMouseLeave: onLeaveNode, onDrag: noDrag ? undefined : onDrag, onStart: noDrag ? undefined : onStart, onEnd: noDrag ? undefined : onEnd })));
            })))));
};

export default Graph;
//# sourceMappingURL=index.js.map
