const calculRadius = (d: number, x: number) =>
  !x ? 1e10 : (0.125 * d * d) / x + x / 2;

const curves = ({ offset, size }: { offset: number; size: number }) => ({
  source,
  target,
  links
}: {
  source: { x: number; y: number };
  target: { x: number; y: number };
  links: {}[]
}) => {
  const dx = Math.sqrt(
    (source.x - target.x) * (source.x - target.x) +
      (source.y - target.y) * (source.y - target.y)
  );

  return links.map((link, i) => {
    const nbOfCurve =
      links.length % 2 && i === links.length - 1 ? 0 : 1 + (i / 2);

    const radius = calculRadius(dx, offset * nbOfCurve);
    const sweep = i % 2;

    return {
      source,
      target,
      ...link,
      d: `M ${source.x * size} ${source.y * size} A ${radius} ${radius} 0 0 ${sweep} ${target.x * size} ${target.y * size}`
    };
  });
};

export default (
  links: {
    source: { x: number; y: number };
    target: { x: number; y: number };
  }[],
  { offset = 20, size = 1 }
) => {
  // group links by source and target
  const linksGroupBy: { [id: string]: { source:  { x: number; y: number }, target: { x: number; y: number }, links: {}[]  } } = { };
  links.forEach(({ source, target, ...link }) => {
    const id = `${source.x}_${source.y}_${target.x}_${target.y}`;

    if (linksGroupBy[id] === undefined) {
      linksGroupBy[id] = {
        source,
        target,
        links: [link]
      };
    } else {
      linksGroupBy[id] = {
        source,
        target,
        links: [...linksGroupBy[id].links, link]
      };
    }
  });

  return Object.values(linksGroupBy)
    .flatMap(curves({ offset, size }))
};
