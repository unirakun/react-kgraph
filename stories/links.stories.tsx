import React from 'react'
import Graph from '../src/Graph'

interface Point {
  x: number
  y: number
}
interface Link {
  source: number
  target: number
  label: string
}

const isSimilarLink = (a: Link) => (b: Link) =>
  (a.source === b.source && a.target === b.target) ||
  (a.source === b.target && a.target === b.source)

export default {
  title: 'Links',
  component: Graph,
}

const nodes = [
  {
    id: 'jack',
    label: 'Jack',
    color: 'yellow',
  },
  {
    id: 'john',
    label: 'John',
    color: '#4f9ceb',
  },
  {
    id: 'meridith',
    label: 'Meridith',
    color: 'green',
  },
]

const links = [
  {
    source: 0,
    target: 1,
    label: '200€',
  },
  {
    source: 1,
    target: 2,
    label: '100€',
  },
  {
    source: 1,
    target: 0,
    label: '150€',
  },
]

const LinkComponent = ({ id, d, source, target }: any) => (
  <g>
    <defs>
      <linearGradient id={`gradient-${id}`}>
        <stop offset="5%" stop-color={source.color} />
        <stop offset="95%" stop-color={target.color} />
      </linearGradient>
    </defs>
    <path
      id={`${id}`}
      strokeWidth={5}
      fill="transparent"
      d={d}
      stroke={`url(#gradient-${id})`}
    />
  </g>
)

export const LinkCluster = () => {
  const linkClusters: Link[] = []
  const iterateLinks = [...links]
  while (iterateLinks.length > 0) {
    const [currentLink] = iterateLinks

    const similarLinks: Link[] = iterateLinks.filter(isSimilarLink(currentLink))

    const [firstLink] = similarLinks

    const cluster: any = {
      source: firstLink.source,
      target: firstLink.target,
      label: similarLinks.map(({ label }) => label).join(', '),
      Component: LinkComponent,
    }

    linkClusters.push(cluster)

    similarLinks.forEach((sl) =>
      iterateLinks.splice(iterateLinks.indexOf(sl), 1),
    )
  }

  return <Graph nodes={nodes} links={linkClusters} type="graph" />
}

LinkCluster.story = {
  name: 'Clustering',
}
