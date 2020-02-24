import React, { memo, useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";

let color = d3.scaleOrdinal(d3.schemeCategory10);

// TODO: create a MovableSvgItem ?
// TODO: remove the "node" parameter
// TODO: to integrate with Chart component and keep perf, use an other Component to "useCallback" the callbacks with "node" parameter
//      https://stackoverflow.com/questions/55963914/react-usecallback-hook-for-map-rendering
const Node = ({
  onClick,
  onDrag,
  onStart,
  onEnd,
  ...props
}: {
  id: number | string;
  size: number;
  group: string;
  label?: string;
  Component?: any;
  onClick?: any; // TODO: type
  onEnd?: any; // TODO: type
  onStart?: any; // TODO: type
  onDrag?: any; // TODO: type
  [key: string]: any;
}) => {
  const { id, size, group, label, Component, ...gProps } = props;

  const nodeRef = useRef<SVGGElement>(null);
  const dragInfoRef = useRef({ thisIsMe: false, beforeX: 0, beforeY: 0 });
  const rafTimerRef = useRef(0);

  const mouseDown = useCallback(
    (e: MouseEvent) => {
      if (!nodeRef.current) return;

      dragInfoRef.current.thisIsMe = e
        .composedPath()
        .some(n => n === nodeRef.current);

      if (dragInfoRef.current.thisIsMe) {
        dragInfoRef.current.beforeX = e.clientX;
        dragInfoRef.current.beforeY = e.clientY;

        onStart(id);
      }
    },
    [onStart, id]
  );

  const mouseMove = useCallback(
    (e: MouseEvent) => {
      if (!nodeRef.current) return;
      if (!dragInfoRef.current.thisIsMe) return;

      e.preventDefault();
      e.stopPropagation();

      let deltaX = e.clientX - dragInfoRef.current.beforeX;
      let deltaY = e.clientY - dragInfoRef.current.beforeY;

      if (rafTimerRef.current) cancelAnimationFrame(rafTimerRef.current);
      rafTimerRef.current = requestAnimationFrame(() => {
        onDrag(id, e, { deltaX, deltaY });

        dragInfoRef.current.beforeX = e.clientX;
        dragInfoRef.current.beforeY = e.clientY;
      });
    },
    [onDrag, id]
  );

  const mouseUp = useCallback(
    (e: MouseEvent) => {
      if (dragInfoRef.current.thisIsMe) {
        onEnd(id);
      }

      dragInfoRef.current.thisIsMe = false;
    },
    [onEnd, id]
  );

  useEffect(() => {
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);

    return () => {
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [mouseDown, mouseMove, mouseUp]);

  const onInnerClick = useCallback(() => {
    if (onClick) return onClick(id);
    return undefined;
  }, [onClick, id]);

  console.log('in node')

  return (
    <g
      ref={nodeRef}
      {...gProps}
      onClick={onInnerClick}
    >
      {Component ? (
        <Component {...props} />
      ) : (
        <>
          <circle r={size * 2} fill={color(group)} cx={0} cy={0}></circle>
          <text stroke="#333" textAnchor="middle" dy="0.5em" fontSize="1em">
            {label}
          </text>
        </>
      )}
    </g>
  );
};

export default memo(Node);
