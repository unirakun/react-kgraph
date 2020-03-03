// references: https://stackoverflow.com/questions/31804392/create-svg-arcs-between-two-points
const isSamePoint = (source, target) => source.x === target.x && source.y === target.y;
const isSimilarLink = (a) => (b) => (isSamePoint(a.source, b.source) && isSamePoint(a.target, b.target)) ||
    (isSamePoint(a.source, b.target) && isSamePoint(a.target, b.source));
const scale = ({ source, target }, size) => ({
    source: {
        x: source.x * size,
        y: source.y * size,
    },
    target: {
        x: target.x * size,
        y: target.y * size,
    },
});
const addSVGPath = ({ offset = 500, size }) => (links) => {
    return links.map((link, i, { length }) => {
        // use size to scale all positions
        const { source, target } = scale(link, size);
        // don't calcul the curve when only one link between two point
        if (i === (length - 1) / 2) {
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
        var cx = (source.x + target.x) / 2;
        var cy = (source.y + target.y) / 2;
        var dx = (target.x - source.x) / 2;
        var dy = (target.y - source.y) / 2;
        const dd = Math.sqrt(dx * dx + dy * dy);
        const sweep = link.source.x - link.target.x > 0 ? 1 : -1;
        const quadraticPoint = {
            x: cx +
                (dy / dd) * (offset / links.length) * (i - (length - 1) / 2) * sweep,
            y: cy -
                (dx / dd) * (offset / links.length) * (i - (length - 1) / 2) * sweep,
        };
        // add svg path of link
        return {
            ...link,
            d: `M ${source.x} ${source.y} Q ${quadraticPoint.x} ${quadraticPoint.y} ${target.x} ${target.y}`,
            quadraticPoint,
            sweep,
        };
    });
};
export default (links, { offset, size = 1 }) => {
    const groupLinks = [];
    const iterateLinks = [...links];
    while (iterateLinks.length > 0) {
        const [currentLink] = iterateLinks;
        const similarLinks = iterateLinks.filter(isSimilarLink(currentLink));
        groupLinks.push(similarLinks);
        similarLinks.forEach((sl) => iterateLinks.splice(iterateLinks.indexOf(sl), 1));
    }
    return groupLinks.flatMap(addSVGPath({ offset, size }));
};
