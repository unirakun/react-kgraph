import React, { useCallback } from 'react'
import DefaultLink from './DefaultLink'
import { LinkProps } from '../types'

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
