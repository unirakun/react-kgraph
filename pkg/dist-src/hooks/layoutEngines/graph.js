// @ts-ignore
import * as cola from 'webcola';
import cloneDeep from 'lodash.clonedeep';
const iterations = 1;
// from https://github.com/cawfree/react-cola/blob/master/index.js
class ReactColaLayout extends cola.Layout {
    stop() {
        super.stop();
        if (this.kickTimeoutTimer)
            clearTimeout(this.kickTimeoutTimer);
        return this;
    }
    kick() {
        // we don't use request animation frame and try to kick as fast as we can
        // but we also want to look at "ticks" betweens frames, so we use a timeout!
        this.kickTimeoutTimer = setTimeout(() => !this.tick() && this.kick(), 0);
    }
}
const createGraphLayout = ({ width, height, }) => {
    const layout = new ReactColaLayout();
    const view = {
        nodes: [],
        links: [],
    };
    // let ticks = 0
    layout
        .on(cola.EventType.tick, () => {
        // ticks += 1
        // TODO: make copy!!!!
        view.nodes = layout.nodes();
        view.links = cloneDeep(layout.links());
    })
        .on(cola.EventType.start, () => {
        // console.time('graph layout')
    })
        .on(cola.EventType.end, () => {
        // console.log('ticks', ticks)
        // console.timeEnd('graph layout')
        // console.log(
        //   'links',
        //   layout.links().length,
        //   'nodes',
        //   layout.nodes().length,
        // )
        // mark all node as fixed (so this is performant)
        layout.nodes().forEach(cola.Layout.dragStart);
    })
        .avoidOverlaps(true)
        .size([width, height])
        .jaccardLinkLengths(10);
    const start = (nodes, links) => {
        if (!nodes || nodes.length === 0)
            return;
        layout
            .nodes(nodes)
            .links(links)
            .start(iterations, 1, 1, 0, true, false);
    };
    const stop = () => {
        layout.stop();
    };
    const restart = () => {
        layout.nodes().forEach(cola.Layout.dragEnd);
        layout.resume();
    };
    const drag = (node, newPos) => {
        cola.Layout.drag(node, newPos);
        layout.resume();
    };
    const dragStart = (node) => {
        cola.Layout.dragStart(node);
    };
    const dragEnd = () => {
        // we don't tell cola we finish to drag because we want the node to be fixed
        // cola.Layout.dragEnd(node);
    };
    const getLayout = () => view;
    return {
        drag,
        dragStart,
        dragEnd,
        restart,
        start,
        stop,
        getLayout,
        type: 'graph',
    };
};
export default createGraphLayout;
