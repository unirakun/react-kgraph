import { useRef, useState, useCallback, useLayoutEffect } from "react";
const useCenterAndZoom = (layout, { size, padding, width, height }) => {
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
        let centerX = chartWidth / 2 + minX - (width * newZoom) / 2;
        let centerY = chartHeight / 2 + minY - (height * newZoom) / 2;
        setZoom(newZoom);
        setOffsets({ x: centerX, y: centerY });
    }, [setZoom, padding, size, height, width]);
    useLayoutEffect(() => {
        centerAndZoom(layout.nodes);
    }, [centerAndZoom, layout]);
    // TODO: should offset to the cursor mouse while zooming
    const onWheel = useCallback((e) => {
        const { deltaY } = e;
        setZoom(old => old - deltaY / 1000);
    }, [setZoom]);
    const setBlockAll = useCallback((block) => {
        blockAll.current = block;
    }, []);
    const rafOffsetTimer = useRef();
    const mouseMovingInfos = useRef({ startX: 0, startY: 0, moving: false });
    const onMouseMove = useCallback(e => {
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
            setOffsets(old => ({
                x: old.x + (startX - clientX) * zoom,
                y: old.y + (startY - clientY) * zoom
            }));
        });
    }, [zoom]);
    const onMouseDown = useCallback(e => {
        if (blockAll.current)
            return;
        mouseMovingInfos.current = {
            ...mouseMovingInfos.current,
            moving: true,
            startX: e.clientX,
            startY: e.clientY
        };
    }, []);
    const onMouseUp = useCallback(() => {
        mouseMovingInfos.current = {
            ...mouseMovingInfos.current,
            moving: false
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
        setBlockAll
    ];
};
export default useCenterAndZoom;
