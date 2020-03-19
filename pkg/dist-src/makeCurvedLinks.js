// references: https://stackoverflow.com/questions/31804392/create-svg-arcs-between-two-points
const knownIndex = Symbol('knownIndex');
const isSamePoint = (source, target) => source.x === target.x && source.y === target.y;
const isSimilarLink = (a) => (b) => (isSamePoint(a.source, b.source) && isSamePoint(a.target, b.target)) ||
    (isSamePoint(a.source, b.target) && isSamePoint(a.target, b.source));
const scale = ({ source, target }, size) => ({
    source: {
        ...source,
        x: source.x * size,
        y: source.y * size,
    },
    target: {
        ...target,
        x: target.x * size,
        y: target.y * size,
    },
});
const createCurve = (link, i, inGroup, groups, { size, offset = 500 }) => {
    // use size to scale all positions
    const { source, target } = scale(link, size);
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
        };
    }
    const cx = (source.x + target.x) / 2;
    const cy = (source.y + target.y) / 2;
    const dx = (target.x - source.x) / 2;
    const dy = (target.y - source.y) / 2;
    const dd = Math.sqrt(dx * dx + dy * dy);
    const sweep = link.source.x - link.target.x > 0 ? 1 : -1;
    const quadraticPoint = {
        x: cx + (dy / dd) * (offset / groups) * (i - (inGroup - 1) / 2) * sweep,
        y: cy - (dx / dd) * (offset / groups) * (i - (inGroup - 1) / 2) * sweep,
    };
    // add svg path of link
    return {
        ...link,
        d: `M ${source.x} ${source.y} Q ${quadraticPoint.x} ${quadraticPoint.y} ${target.x} ${target.y}`,
        quadraticPoint,
        sweep,
    };
};
const addSVGPath = (options) => (groups) => {
    return groups.map((link, index, { length }) => createCurve(link, index, length, groups.length, options));
};
export default (links, { offset, size = 1 }) => {
    // adding known index to sort link after curves
    const linksWithIndex = links.map((link, index) => ({
        ...link,
        [knownIndex]: index,
    }));
    // groups of similar link
    const groupLinks = [];
    // construct a new array of links so we can mutate it while iterating on it
    const iterateLinks = [...linksWithIndex];
    while (iterateLinks.length > 0) {
        const [currentLink] = iterateLinks;
        const similarLinks = iterateLinks.filter(isSimilarLink(currentLink));
        groupLinks.push(similarLinks);
        similarLinks.forEach((sl) => iterateLinks.splice(iterateLinks.indexOf(sl), 1));
    }
    // output links with quadratic point, sweep and d path
    // they are output in same order than the input
    return groupLinks
        .flatMap(addSVGPath({ offset, size }))
        .sort((a, b) => a[knownIndex] - b[knownIndex]);
};
