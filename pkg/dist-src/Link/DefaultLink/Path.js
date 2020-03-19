import React from 'react';
const Path = (props) => {
    const { id, d, strokeWidth, stroke, markerEnd } = props;
    return (React.createElement("path", { id: `${id}`, d: d, strokeWidth: strokeWidth, fill: "transparent", stroke: stroke, markerEnd: markerEnd }));
};
export default Path;
