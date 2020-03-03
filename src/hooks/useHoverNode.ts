import { useState, useCallback } from 'react'
import { ChartNode, SimplifiedLayout } from '../types'

const useHoverNode = (
  layout: SimplifiedLayout,
  { getMarkerColors }: { getMarkerColors: () => void },
): [
  ChartNode | undefined,
  ChartNode[],
  (nodeId: number | string) => void,
  () => void,
] => {
  const [hoverNode, setHoverNode] = useState<ChartNode>()
  const [hiddenNodes, setHiddenNodes] = useState<any[]>([])

  const onOverNode = useCallback(
    (nodeId) => {
      const notHiddenNodes = new Set()

      // get hidden links and NOT hidden nodes
      layout.links.forEach(({ source, target }) => {
        if (nodeId !== source.id && nodeId !== target.id) {
          return
        }
        notHiddenNodes.add(source.id)
        notHiddenNodes.add(target.id)
      })

      // hidden nodes are NOT nodes that are NOT hidden
      const newHiddenNodes = layout.nodes.filter(
        ({ id }) => !notHiddenNodes.has(id),
      )

      setHiddenNodes(newHiddenNodes.map(({ id }) => id))
      setHoverNode(nodeId)
      requestAnimationFrame(getMarkerColors)
    },
    [getMarkerColors, layout.links, layout.nodes],
  )
  const onLeaveNode = useCallback(() => {
    setHoverNode(undefined)
    setHiddenNodes([])
  }, [])

  return [hoverNode, hiddenNodes, onOverNode, onLeaveNode]
}

export default useHoverNode
