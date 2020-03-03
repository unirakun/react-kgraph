interface Point {
    x: number;
    y: number;
}
interface Link {
    source: Point;
    target: Point;
}
interface LinksOptions {
    offset?: number;
    size: number;
}
declare const _default: (links: Link[], { offset, size }: LinksOptions) => any[];
export default _default;
