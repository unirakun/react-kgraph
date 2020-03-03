import React, { memo, useState, useLayoutEffect, useCallback } from "react";
const Link = ({ onClick, ...props }) => {
    const { Component, id, d, quadraticPoint, sweep, label, source, target, hover, size } = props;
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
    const height = 100;
    const width = 250;
    useLayoutEffect(() => {
        setTextPosition(sweep > 0
            ? {
                x: quadraticPoint.x - width / 2,
                y: quadraticPoint.y - height / 2
            }
            : {
                x: quadraticPoint.x - width / 2,
                y: quadraticPoint.y
            });
    }, [size, source.x, source.y, target.x, target.y, quadraticPoint, sweep]);
    const innerOnClick = useCallback(() => {
        if (!onClick)
            return;
        onClick(id);
    }, [onClick, id]);
    // useTraceUpdate(props)
    return (React.createElement("g", { key: d, onClick: innerOnClick }, Component ? (React.createElement(Component, Object.assign({}, props, { textPosition: textPosition }))) : (React.createElement(React.Fragment, null,
        React.createElement("path", { id: id + "", strokeWidth: 5, fill: "transparent", d: d, stroke: "#d1d1d1", markerEnd: "url(#arrow-#d1d1d1)" }),
        hover && (React.createElement("path", { id: id + "", strokeWidth: 20, fill: "transparent", d: d, stroke: "rgba(249, 121, 117, 0.5)" })),
        hover && (React.createElement("foreignObject", Object.assign({}, textPosition, { width: width, height: height }),
            React.createElement("div", { style: {
                    borderRadius: "5px",
                    backgroundColor: "rgba(100, 100, 100, 0.2)",
                    textAlign: "center",
                    padding: "1em",
                    border: "1px solid rgba(50, 50, 50, 0.2)"
                } }, label || `${source.label} -> ${target.label}`)))))));
};
const PROPS_TO_ALWAYS_COMPARE = ["onClick", "Component", "id", "hover"];
const propsAreEqual = (prevProps, nextProps) => {
    return !Object.entries(prevProps).some(([key, value]) => {
        if (PROPS_TO_ALWAYS_COMPARE.includes(key)) {
            // @ts-ignore TODO:
            const nextValue = nextProps[key];
            const hasChanged = nextValue !== value;
            return hasChanged;
        }
        if (key === "target" || key === "source") {
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
export default memo(Link, propsAreEqual);
