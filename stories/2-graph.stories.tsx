import React from 'react'
import Graph from '../src/Graph'

export default {
  title: 'Graph',
  component: Graph,
}

const nodes = [
  {
    id: 'jack',
    label: 'Jack',
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

export const Readme = () => <Graph nodes={nodes} links={links} type="graph" />
Readme.story = {
  name: 'README example',
}

const tree = {
  id: 'john',
  label: 'John',
  children: [
    {
      id: 'meridith',
      label: 'Meridith',
    },
    {
      id: 'jack',
      label: 'Jack',
    },
  ],
}
export const Tree = () => <Graph nodes={[tree]} type="tree" />
Tree.story = {
  name: 'Layout: Tree',
}
