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

  const s = {
    x: source.x * size,
    y: source.y * size,
  }

  const t = {
    x: target.x * size,
    y: target.y * size,
  }

  const dx = Math.sqrt(
    (s.x - t.x) * (s.x - t.x) +
    (s.y - t.y) * (s.y - t.y)
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
      d: `M ${s.x} ${s.y} A ${radius} ${radius} 0 0 ${sweep} ${t.x} ${t.y}`
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
  const linksGroupBy: { [id: string]: { source: { x: number; y: number }, target: { x: number; y: number }, links: {}[] } } = {};
  links.forEach(({ source, target, ...link }) => {
    const id = `${source.x + target.x}_${source.y + target.y}`;

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
