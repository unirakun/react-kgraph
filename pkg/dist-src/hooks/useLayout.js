import { useRef, useCallback, useEffect, useState } from "react";
import { createGraphLayout, createTreeLayout } from "./layoutEngines/index";
const useLayout = (nodes, links, { width, height, size, type = "graph" }) => {
    const engine = useRef();
    const framesPerView = useRef(10); // TODO: make it dynamic based on frame time
    // so we can move from 1 frame per view to previous value (used in drag)
    const previousFramesPerView = useRef(framesPerView.current);
    const [layout, setLayout] = useState({
        nodes: [],
        links: []
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
        if (type === "graph") {
            engine.current = createGraphLayout({ width, height });
        }
        else if (type === "tree") {
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
    const dragStart = useCallback(node => {
        var _a;
        framesPerView.current = 1; // make it smooth
        (_a = engine.current) === null || _a === void 0 ? void 0 : _a.dragStart(node);
    }, []);
    const drag = useCallback((node, newPos) => {
        var _a;
        (_a = engine.current) === null || _a === void 0 ? void 0 : _a.drag(node, newPos);
    }, []);
    const dragEnd = useCallback(node => {
        var _a;
        (_a = engine.current) === null || _a === void 0 ? void 0 : _a.dragEnd(node);
        framesPerView.current = previousFramesPerView.current;
    }, []);
    return [layout, { restart, dragStart, drag, dragEnd }];
};
export default useLayout;
