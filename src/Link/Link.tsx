import React, { useCallback } from 'react'
import DefaultLink from './DefaultLink'
import { ChartNode, WithCoords } from '../types'

interface TypeProps {
  Component: any // TODO types
  id: string | number
  d: string
  quadraticPoint: WithCoords
  sweep: number
  length: number
  label?: string
  size: number
  hover: boolean
  source: ChartNode
  target: ChartNode
  onClick: any // TODO types
}

const Link = (props: TypeProps) => {
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
    onClick,
  } = props

  const innerOnClick = useCallback(() => {
    if (onClick) return onClick(id)
    return undefined
  }, [onClick, id])

  // console.count('Link')
  if (Component) {
    return (
      <g onClick={innerOnClick}>
        <Component
          key={d}
          id={id}
          d={d}
          source={source}
          target={target}
          hover={hover}
          label={label}
          labelPosition={quadraticPoint}
          sweep={sweep}
        />
      </g>
    )
  }

  return (
    <DefaultLink
      key={d}
      id={id}
      d={d}
      source={source}
      target={target}
      hover={hover}
      label={label}
      labelPosition={quadraticPoint}
      sweep={sweep}
      onClick={innerOnClick}
    />
  )
}

export default Link
