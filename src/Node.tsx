import React, { useRef, useEffect, useCallback } from "react";

// TODO: rename it MovableSvgItem
// TODO: remove the "node" parameter
// TODO: to integrate with Chart component and keep perf, use an other Component to "useCallback" the callbacks with "node" parameter
//      https://stackoverflow.com/questions/55963914/react-usecallback-hook-for-map-rendering
const Node = ({
  children,
  onDrag,
  onStart,
  onEnd,
  node,
  ...props
}: {
  children: any;
  onEnd?: any; // TODO: type
  onStart?: any; // TODO: type
  onDrag?: any; // TODO: type
  node: any;
  [key: string]: any;
}) => {
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

        onStart(node);
      }
    },
    [onStart, node]
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
        onDrag(node, e, { deltaX, deltaY });

        dragInfoRef.current.beforeX = e.clientX;
        dragInfoRef.current.beforeY = e.clientY;
      });
    },
    [onDrag, node]
  );

  const mouseUp = useCallback(
    (e: MouseEvent) => {
      if (dragInfoRef.current.thisIsMe) {
        onEnd(node);
      }

      dragInfoRef.current.thisIsMe = false;
    },
    [onEnd, node]
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

  return (
    <g ref={nodeRef} {...props}>
      {children}
    </g>
  );
};

export default Node;
