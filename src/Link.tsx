import React, { memo } from "react";

interface LinkProps {
  onClick: any;
  Component: any;
  id: string | number;
  d: string;
  length: number;
  label?: string;
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
  const { Component, id, d, length, source, target, label } = props;

  return (
    <g key={d} onClick={onClick}>
      {Component ? (
        <Component {...props} />
      ) : (
        <>
          <path
            id={id + ""}
            strokeWidth={Math.sqrt(length) * 10}
            fill="transparent"
            d={d}
            markerEnd="url(#arrow-#999)"
          ></path>
          {/* <text x="100" transform="translate(0, 30)"> */}
          {/* TODO: offset to process (not hardcoded) */}
          {/* <textPath href={`#${id}`}>
              {label || `${source.label} -> ${target.label}`}
            </textPath>
          </text> */}
        </>
      )}
    </g>
  );
};

const PROPS_TO_ALWAYS_COMPARE = ["onClick", "Component", "id", "length"];

const propsAreEqual = (prevProps: LinkProps, nextProps: LinkProps): boolean => {
  return !Object.entries(prevProps).some(([key, value]) => {
    if (PROPS_TO_ALWAYS_COMPARE.includes(key)) {
      // @ts-ignore TODO:
      const nextValue = nextProps[key];
      return nextValue !== value;
    }

    if (key === "target" || key === "source") {
      const nextValue = nextProps[key];
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
