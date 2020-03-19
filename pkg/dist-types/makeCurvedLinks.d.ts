interface Point {
    x: number;
    y: number;
}
declare const knownIndex: unique symbol;
interface Link {
    source: Point;
    target: Point;
    [knownIndex]: number;
}
interface OutputLink extends Link {
    d: string;
    quadraticPoint: Point;
    sweep: number;
}
interface LinksOptions {
    offset?: number;
    size: number;
}
declare const _default: (links: Link[], { offset, size }: LinksOptions) => OutputLink[];
export default _default;
