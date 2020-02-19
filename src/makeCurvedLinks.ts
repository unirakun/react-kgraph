const calculRadius = (d: number, x: number) =>
  !x ? 1e10 : (0.125 * d * d) / x + x / 2;

const curves = ({ offset, size }: { offset: number; size: number }) => (links
  : {
    source: { x: number; y: number };
    target: { x: number; y: number };
  }[]) => {

  let index1 = 0;
  let index2 = 0;
  return links.map((link, i) => {

    const { source, target } = link;
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

    let sweep;
    if ((s.x - t.x) > 0) {
      sweep = (index1++ % 2)
    } else {
      sweep = (index2++ % 2)
    }

    const nbOfCurve =
      links.length % 2 && i === links.length - 1 ? 0 : 1 + (i / 2);

    const radius = calculRadius(dx, offset * nbOfCurve);

    return {
      ...link,
      d: `M ${s.x} ${s.y} A ${radius} ${radius} 0 0 ${sweep} ${t.x} ${t.y}`
    };
  });
};

const isSimilarLink = (a: any) => (b: any) => (a.source.x === b.source.x && a.source.y === b.source.y && a.target.x === b.target.x && a.target.y === b.target.y) ||
  (a.source.x === b.target.x && a.source.y === b.target.y && a.target.x === b.source.x && a.target.y === b.source.y);

export default (
  links: {
    source: { x: number; y: number };
    target: { x: number; y: number };
  }[],
  { offset = 20, size = 1 }
) => {
  // group links by source and target
  //const linksGroupBy: { [id: string]: { source: { x: number; y: number }, target: { x: number; y: number }, links: {}[] } } = {};
  const groupLinks: any[] = [];
  const tmp = [...links];

  while (tmp.length > 0) {
    const similarLinks = tmp.filter(isSimilarLink(tmp[0]));
    groupLinks.push(similarLinks);
    similarLinks.forEach(sl => tmp.splice(tmp.indexOf(sl), 1));
  }


  console.log("group", groupLinks)
  return groupLinks.flatMap(curves({ offset, size }))
};
