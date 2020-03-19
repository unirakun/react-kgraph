# react-kgraph

> A graph lib that uses SVG and webcola to render.

[![Documentation](https://img.shields.io/badge/doc-storybook-ff69b4)](https://unirakun.github.io/react-kgraph)
[![npm](https://img.shields.io/npm/v/react-kgraph)](https://www.npmjs.com/package/react-kgraph)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-kgraph)](https://bundlephobia.com/result?p=react-kgraph@0.1.4)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/unirakun/react-kgraph/Quality)](https://github.com/unirakun/react-kgraph/actions?query=branch%3Amaster)

## Installation

`npm install --save react-kgraph d3@^5.15.0 d3-hierarchy@^1.1.9`

## API

There is only one component exported by this lib: `Graph`
This component takes this props:

- `nodes` which is an array of nodes
- `links` which is an array of links
- `type` the type of graph to render (either **tree** or **graph**)
- `onNodeClick` the function to call when a node is clicked
- `onLinkClick` the function to call when a link is clicked

### node

A node as this fields

| field     | required             | description                                                         |
| --------- | -------------------- | ------------------------------------------------------------------- |
| id        | ✔                    | the node id, it has to be uniq!                                     |
| group     | ✖                    | the group, this is used for default colors only                     |
| label     | ✖                    | the label to print in the node                                      |
| color     | ✖                    | color to set in the node background, overrides the default colors   |
| children  | ✖ (graph) / ✔ (tree) | only needed for tree layout, all children nodes                     |
| Component | ✖                    | the custom React component to use to render this node in particular |
| ...       | ✖                    | all you other data                                                  |

### link

| field     | required | description                                                         |
| --------- | -------- | ------------------------------------------------------------------- |
| source    | ✔        | the index of the node that is the source of this link               |
| target    | ✔        | the index of the node that is the target of this link               |
| label     | ✖        | the label to print on the link                                      |
| Component | ✖        | the custom React component to use to render this link in particular |

## Simple example

```tsx
import React from 'react'
import Graph from 'react-kgraph'

const nodes = [
  {
    id: 'jack',
    label: 'Jack',
  },
  {
    id: 'john',
    label: 'Jhon',
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

const Example = () => (
  <div>
    <div>Money flow</div>
    <Graph type="graph" nodes={nodes} links={links} />
  </div>
)

export default Example
```

<p align="center">
<img src="https://user-images.githubusercontent.com/17828231/75869548-01bbf300-5e0a-11ea-8837-1bcaf059d327.png" width=300 />
<img src="https://user-images.githubusercontent.com/17828231/75869545-01235c80-5e0a-11ea-9528-cbdf75bf1223.png" width=320 />
</p>
