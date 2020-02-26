import React, { memo, useState, useLayoutEffect } from "react";

interface LinkProps {
  onClick: any;
  Component: any;
  id: string | number;
  d: string;
  length: number;
  label?: string;
  size: number;
  hover: boolean;
  source: {
    x: number;
    y: number;
    label: string;
  };
  target: {
    x: number;
    y: number;
    label: string;
  };
}

const Link = ({ onClick, ...props }: LinkProps) => {
  const {
    Component,
    id,
    d,
    length,
    label,
    source,
    target,
    hover,
    size
  } = props;

  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    setTextPosition({
      x: size * (source.x + (target.x - source.x) / 2),
      y: size * (source.y + (target.y - source.y) / 2)
    });
  }, [size, source.x, source.y, target.x, target.y]);

  return (
    <g key={d} onClick={onClick} stroke={hover ? "red" : undefined}>
      {Component ? (
        <Component {...props} textPosition={textPosition} />
      ) : (
        <>
          <path
            id={id + ""}
            strokeWidth={Math.sqrt(length) * (hover ? 12 : 10)}
            fill="transparent"
            d={d}
            markerEnd="url(#arrow-#999)"
          ></path>
          {hover && (
            <foreignObject {...textPosition} width={250} height={100}>
              <div
                style={{
                  borderRadius: "5px",
                  backgroundColor: "rgba(100, 100, 100, 0.2)",
                  textAlign: "center",
                  padding: "1em",
                  border: "1px solid rgba(50, 50, 50, 0.2)"
                }}
              >
                {label || `${source.label} -> ${target.label}`}
              </div>
            </foreignObject>
          )}
        </>
      )}
    </g>
  );
};

const PROPS_TO_ALWAYS_COMPARE = [
  "onClick",
  "Component",
  "id",
  "length",
  "hover"
];

const propsAreEqual = (prevProps: LinkProps, nextProps: LinkProps): boolean => {
  return !Object.entries(prevProps).some(([key, value]) => {
    if (PROPS_TO_ALWAYS_COMPARE.includes(key)) {
      // @ts-ignore TODO:
      const nextValue = nextProps[key];
      return nextValue !== value;
    }

    if (key === "target" || key === "source") {
      const nextValue = nextProps[key];
      // TODO: should use zoom
      const treshold = 0.1;

      // there is a difference if we pass the treshold
      if (
        Math.abs(nextValue.x - value.x) > treshold ||
        Math.abs(nextValue.y - value.y) > treshold
      ) {
        return true;
      }
    }

    // means this is not equal (we found a difference)
    return false;
  });
};

export default memo(Link, propsAreEqual);
