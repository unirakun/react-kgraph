import React, { useCallback } from 'react'
import DefaultLink from './DefaultLink'
import { WithCoords, ChartNode, LinkProps } from '../types'

interface PropTypes {
  Component?: React.FunctionComponent<LinkProps>
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
  onClick: (link: string | number) => void
}

const Link = (props: PropTypes) => {
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
        onClick: innerOnClick,
      })}
    </g>
  )
}

export default Link
