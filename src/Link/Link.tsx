import React, { memo, useState, useLayoutEffect, useCallback } from 'react'
import Path from './Path'
import Label from './Label'
import { ChartNode } from '../types'

interface LinkProps {
  onClick: any
  Component: any
  id: string | number
  d: string
  quadraticPoint: any
  sweep: number
  length: number
  label?: string
  size: number
  hover: boolean
  source: ChartNode
  target: ChartNode
}

const propsAreEqual = (propsToCompare: string[]) => (
  prevProps: LinkProps,
  nextProps: LinkProps,
): boolean => {
  return !Object.entries(prevProps).some(([key, value]) => {
    let hasChanged = false
    if (propsToCompare.includes(key)) {
      // @ts-ignore TODO:
      const nextValue = nextProps[key]
      hasChanged = nextValue !== value
    }

    if (key === 'target' || key === 'source') {
      const nextValue = nextProps[key]
      // TODO: should use zoom
      const treshold = 0.1
      // there is a difference if we pass the treshold
      hasChanged =
        Math.abs(nextValue.x - value.x) > treshold ||
        Math.abs(nextValue.y - value.y) > treshold
    }

    // means this is equal (we have NOT found a difference)
    return hasChanged
  })
}

const Link = (props: LinkProps) => {
  const {
    Component,
    id,
    d,
    quadraticPoint,
    label,
    sweep,
    source,
    target,
    hover,
    size,
    onClick,
  } = props

  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })

  const height = 100
  const width = 250

  useLayoutEffect(() => {
    setTextPosition(
      sweep > 0
        ? {
            x: quadraticPoint.x - width / 2,
            y: quadraticPoint.y - height / 2,
          }
        : {
            x: quadraticPoint.x - width / 2,
            y: quadraticPoint.y,
          },
    )
  }, [size, source.x, source.y, target.x, target.y, quadraticPoint, sweep])

  const innerOnClick = useCallback(() => {
    if (!onClick) return
    onClick(id)
  }, [onClick, id])

  // console.count('Link')
  if (Component) {
    return (
      <Component
        onClick={innerOnClick}
        {...props}
        textProps={{ ...textPosition, width, height }}
      />
    )
  }

  return (
    <g key={d} onClick={innerOnClick}>
      <Path
        id={id}
        d={d}
        strokeWidth={5}
        stroke="#d1d1d1"
        markerEnd="url(#arrow-#d1d1d1)"
      />
      {hover && (
        <Path
          id={id}
          d={d}
          strokeWidth={20}
          stroke="rgba(249, 121, 117, 0.5)"
        />
      )}
      {hover && (
        <Label
          label={label || `${source.label} -> ${target.label}`}
          {...textPosition}
          width={width}
          height={height}
        />
      )}
    </g>
  )
}

export default memo(
  Link,
  propsAreEqual(['onClick', 'Component', 'id', 'hover']),
)
