interface Link {
  source: { x: number; y: number };
  target: { x: number; y: number };
}

interface LinksOptions {
  offset?: number;
  size: number;
}

const isSimilarLink = (a: Link) => (b: Link) => (a.source.x === b.source.x && a.source.y === b.source.y && a.target.x === b.target.x && a.target.y === b.target.y) ||
  (a.source.x === b.target.x && a.source.y === b.target.y && a.target.x === b.source.x && a.target.y === b.source.y);

const scale = ({ source, target }: Link, size: number) => ({
  source: {
    x: source.x * size,
    y: source.y * size,
  },
  target: {
    x: target.x * size,
    y: target.y * size,
  }
})

const calculDx = ({ source, target }: Link) => Math.sqrt(
  (source.x - target.x) * (source.x - target.x) +
  (source.y - target.y) * (source.y - target.y)
);

const calculRadius = (dx: number, x: number) => !x ? 1e10 : (0.125 * dx * dx) / x + x / 2;

const addSVGPath = ({ offset = 20, size }: LinksOptions) => (links: Link[]) => {

  let reverseCount = 0;

  return links.map((link: any, i: number, { length }: { length: number }) => {
    // use size to scale all positions
    const { source, target } = scale(link, size);

    // calcul coordinate point to curve the link
    const dx = calculDx({ source, target });

    const linkNumber = length % 2 && i === length - 1 ? 0 : 1 + (i / 2);
    const radius = calculRadius(dx, offset * linkNumber);

    // 2 directions is possible with similar links.
    // Sweep depend of the direction and the number of link with this direction.
    let sweep = 0;
    if (link.source.x - link.target.x > 0) sweep = (i - reverseCount) % 2; // sweep for normal direction
    else sweep = (reverseCount++ % 2); // sweep for reverse direction

    // add svg path of link 
    return {
      ...link,
      d: `M ${source.x} ${source.y} A ${radius} ${radius} 0 0 ${sweep} ${target.x} ${target.y}`,
    }
  });
};

export default (
  links: Link[],
  { offset, size = 1 }: LinksOptions,
) => {
  const groupLinks: Link[][] = [];

  const iterateLinks = [...links];
  while (iterateLinks.length > 0) {
    const [currentLink] = iterateLinks;

    const similarLinks: Link[] = iterateLinks.filter(isSimilarLink(currentLink));

    groupLinks.push(similarLinks);
    similarLinks.forEach(sl => iterateLinks.splice(iterateLinks.indexOf(sl), 1));
  }

  return groupLinks.flatMap(addSVGPath({ offset, size }))
};
