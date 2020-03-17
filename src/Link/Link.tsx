import React, { useCallback } from 'react'
import DefaultLink from './DefaultLink'
import { ChartNode, WithCoords } from '../types'

export interface LinkProps {
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
  onClick: (link: any) => void
}

const Link = (props: LinkProps) => {
  const { Component, onClick, id, ...restProps } = props

  const innerOnClick = useCallback(() => {
    if (onClick) return onClick(id)
    return undefined
  }, [onClick, id])

  return (
    <g onClick={innerOnClick}>
      {React.createElement(Component || DefaultLink, {
        ...restProps,
        id,
        onClick,
      })}
    </g>
  )
}

export default Link
