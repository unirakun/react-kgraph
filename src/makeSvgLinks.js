const calculRadius = (d, x) => (!x ? 1e10 : (0.125 * d * d) / x + x / 2);

const curves = offset => ({ source, target, links }) => {
  const dx = Math.sqrt(
    (source.x - target.x) * (source.x - target.x) +
      (source.y - target.y) * (source.y - target.y)
  );

  return links.map((link, i) => {
    const nbOfCurve =
      links.length % 2 && i === links.length - 1 ? 0 : 1 + parseInt(i / 2);

    const radius = calculRadius(dx, offset * nbOfCurve);
    const sweep = i % 2;

    return {
      ...link,
      stroke: link.color,
      d: `M ${source.x} ${source.y} A ${radius} ${radius} 0 0 ${sweep} ${target.x} ${target.y}`
    };
  });
};

export default (links, offset = 20) => {
  // group links by source and target
  const linksGroupBy = {};
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
    .map(curves(offset))
    .flat();
};
