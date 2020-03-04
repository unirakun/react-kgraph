import React, { memo, useRef, useEffect, useCallback } from 'react'
import * as d3 from 'd3'

const getColor = d3.scaleOrdinal(d3.schemeCategory10)

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
  id: number | string
  size: number
  group: string
  label?: string
  hover: boolean
  hidden: boolean
  color?: string
  Component?: any
  onClick?: any // TODO: type
  onEnd?: any // TODO: type
  onStart?: any // TODO: type
  onDrag?: any // TODO: type
  onMouseEnter?: any // TODO: type
  onMouseLeave?: any // TODO: type
  [key: string]: any
}) => {
  const {
    id,
    size,
    group,
    label,
    hover,
    hidden,
    color,
    Component,
    onMouseEnter,
    onMouseLeave,
    ...gProps
  } = props

  const nodeRef = useRef<SVGGElement>(null)
  const dragInfoRef = useRef({ thisIsMe: false, beforeX: 0, beforeY: 0 })
  const rafTimerRef = useRef(0)

  const mouseDown = useCallback(
    (e: MouseEvent) => {
      if (!nodeRef.current) return

      dragInfoRef.current.thisIsMe = e
        .composedPath()
        .some((n) => n === nodeRef.current)

      if (dragInfoRef.current.thisIsMe) {
        dragInfoRef.current.beforeX = e.clientX
        dragInfoRef.current.beforeY = e.clientY

        onStart(id)
      }
    },
    [onStart, id],
  )

  const mouseMove = useCallback(
    (e: MouseEvent) => {
      if (!nodeRef.current) return
      if (!dragInfoRef.current.thisIsMe) return

      e.preventDefault()
      e.stopPropagation()

      const deltaX = e.clientX - dragInfoRef.current.beforeX
      const deltaY = e.clientY - dragInfoRef.current.beforeY

      if (rafTimerRef.current) cancelAnimationFrame(rafTimerRef.current)
      rafTimerRef.current = requestAnimationFrame(() => {
        onDrag(id, e, { deltaX, deltaY })

        dragInfoRef.current.beforeX = e.clientX
        dragInfoRef.current.beforeY = e.clientY
      })
    },
    [onDrag, id],
  )

  const mouseUp = useCallback(() => {
    if (dragInfoRef.current.thisIsMe) {
      onEnd(id)
    }

    dragInfoRef.current.thisIsMe = false
  }, [onEnd, id])

  const innerOnMouseLeave = useCallback(() => {
    if (onMouseLeave) onMouseLeave(id)
  }, [onMouseLeave, id])

  const innerOnMouseEnter = useCallback(() => {
    if (onMouseEnter) onMouseEnter(id)
  }, [onMouseEnter, id])

  useEffect(() => {
    window.addEventListener('mousedown', mouseDown)
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseup', mouseUp)

    return () => {
      window.removeEventListener('mousedown', mouseDown)
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mouseup', mouseUp)
    }
  }, [mouseDown, mouseMove, mouseUp])

  const onInnerClick = useCallback(() => {
    if (onClick) return onClick(id)
    return undefined
  }, [onClick, id])

  const innerSize = (size + 10) * 3
  const outerSize = innerSize + 20

  const style = {
    borderRadius: '100%',
    backgroundColor: hover ? '#f97975' : color || getColor(group),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(50, 50, 50, 0.4)',
    boxShadow: '0px 0px 10px -5px black',
    width: innerSize,
    height: innerSize,
    margin: '5px auto',
  }

  return (
    <g
      ref={nodeRef}
      {...gProps}
      onClick={onInnerClick}
      className={`node-container ${hidden ? 'node-hidden' : ''}`}
      onMouseLeave={innerOnMouseLeave}
      onMouseEnter={innerOnMouseEnter}
    >
      {Component ? (
        <Component style={style} outerSize={outerSize} {...props} />
      ) : (
        <foreignObject
          width={outerSize}
          height={outerSize}
          x={-outerSize / 2}
          y={-outerSize / 2}
        >
          <div style={style}>{label}</div>
        </foreignObject>
      )}
    </g>
  )
}

export default memo(Node)
