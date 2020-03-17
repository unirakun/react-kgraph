// references: https://stackoverflow.com/questions/31804392/create-svg-arcs-between-two-points

interface Point {
  x: number
  y: number
}
const knownIndex = Symbol('knownIndex')
interface Link {
  source: Point
  target: Point
  [knownIndex]: number
}
interface OutputLink extends Link {
  d: string
  quadraticPoint: Point
  sweep: number
}

interface LinksOptions {
  offset?: number
  size: number
}

const isSamePoint = (source: Point, target: Point) =>
  source.x === target.x && source.y === target.y
const isSimilarLink = (a: Link) => (b: Link) =>
  (isSamePoint(a.source, b.source) && isSamePoint(a.target, b.target)) ||
  (isSamePoint(a.source, b.target) && isSamePoint(a.target, b.source))

const scale = ({ source, target }: Link, size: number) => ({
  source: {
    x: source.x * size,
    y: source.y * size,
  },
  target: {
    x: target.x * size,
    y: target.y * size,
  },
})

const createCurve = (
  link: any,
  i: number,
  inGroup: number,
  groups: number,
  { size, offset = 500 }: LinksOptions,
): OutputLink => {
  // use size to scale all positions
  const { source, target } = scale(link, size)

  // don't calcul the curve when only one link between two point
  if (i === (inGroup - 1) / 2) {
    return {
      ...link,
      d: `M ${source.x} ${source.y} ${target.x} ${target.y}`,
      quadraticPoint: {
        x: source.x + (target.x - source.x) / 2,
        y: source.y + (target.y - source.y) / 2,
      },
      sweep: 1,
    }
  }

  const cx = (source.x + target.x) / 2
  const cy = (source.y + target.y) / 2
  const dx = (target.x - source.x) / 2
  const dy = (target.y - source.y) / 2

  const dd = Math.sqrt(dx * dx + dy * dy)

  const sweep = link.source.x - link.target.x > 0 ? 1 : -1

  const quadraticPoint = {
    x: cx + (dy / dd) * (offset / groups) * (i - (inGroup - 1) / 2) * sweep,
    y: cy - (dx / dd) * (offset / groups) * (i - (inGroup - 1) / 2) * sweep,
  }

  // add svg path of link
  return {
    ...link,
    d: `M ${source.x} ${source.y} Q ${quadraticPoint.x} ${quadraticPoint.y} ${target.x} ${target.y}`,
    quadraticPoint,
    sweep,
  }
}

const addSVGPath = (options: LinksOptions) => (groups: Link[]) => {
  return groups.map((link, index, { length }) =>
    createCurve(link, index, length, groups.length, options),
  )
}

export default (
  links: Link[],
  { offset, size = 1 }: LinksOptions,
): OutputLink[] => {
  // adding known index to sort link after curves
  const linksWithIndex: Link[] = links.map((link, index) => ({
    ...link,
    [knownIndex]: index,
  }))

  // groups of similar link
  const groupLinks: Link[][] = []

  // construct a new array of links so we can mutate it while iterating on it
  const iterateLinks = [...linksWithIndex]
  while (iterateLinks.length > 0) {
    const [currentLink] = iterateLinks

    const similarLinks: Link[] = iterateLinks.filter(isSimilarLink(currentLink))

    groupLinks.push(similarLinks)
    similarLinks.forEach((sl) =>
      iterateLinks.splice(iterateLinks.indexOf(sl), 1),
    )
  }

  // output links with quadratic point, sweep and d path
  // they are output in same order than the input
  return groupLinks
    .flatMap(addSVGPath({ offset, size }))
    .sort((a, b) => a[knownIndex] - b[knownIndex])
}
