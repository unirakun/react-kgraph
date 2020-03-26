;(window.webpackJsonp = window.webpackJsonp || []).push([
  [0],
  {
    184: function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var _graph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(325)
      __webpack_require__.d(
        __webpack_exports__,
        'createGraphLayout',
        function() {
          return _graph__WEBPACK_IMPORTED_MODULE_0__.a
        },
      )
      var _tree__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(332)
      __webpack_require__.d(
        __webpack_exports__,
        'createTreeLayout',
        function() {
          return _tree__WEBPACK_IMPORTED_MODULE_1__.a
        },
      )
      __webpack_require__(333)
      try {
        ;(layoutEngines.displayName = 'layoutEngines'),
          (layoutEngines.__docgenInfo = {
            description: '',
            displayName: 'layoutEngines',
            props: {
              size: {
                defaultValue: null,
                description: '',
                name: 'size',
                required: !0,
                type: { name: 'number' },
              },
            },
          }),
          'undefined' != typeof STORYBOOK_REACT_CLASSES &&
            (STORYBOOK_REACT_CLASSES[
              'src/hooks/layoutEngines/index.ts#layoutEngines'
            ] = {
              docgenInfo: layoutEngines.__docgenInfo,
              name: 'layoutEngines',
              path: 'src/hooks/layoutEngines/index.ts#layoutEngines',
            })
      } catch (__react_docgen_typescript_loader_error) {}
    },
    325: function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var webcola__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(41),
        lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          335,
        ),
        lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(
          lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1__,
        )
      class ReactColaLayout extends webcola__WEBPACK_IMPORTED_MODULE_0__.Layout {
        stop() {
          return (
            super.stop(),
            this.kickTimeoutTimer && clearTimeout(this.kickTimeoutTimer),
            this
          )
        }
        kick() {
          this.kickTimeoutTimer = setTimeout(
            () => !this.tick() && this.kick(),
            0,
          )
        }
      }
      __webpack_exports__.a = ({ width: width, height: height }) => {
        const layout = new ReactColaLayout(),
          view = { nodes: [], links: [] }
        layout
          .on(webcola__WEBPACK_IMPORTED_MODULE_0__.EventType.tick, () => {
            ;(view.nodes = layout.nodes()),
              (view.links = lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1___default()(
                layout.links(),
              ))
          })
          .on(webcola__WEBPACK_IMPORTED_MODULE_0__.EventType.start, () => {})
          .on(webcola__WEBPACK_IMPORTED_MODULE_0__.EventType.end, () => {
            layout
              .nodes()
              .forEach(webcola__WEBPACK_IMPORTED_MODULE_0__.Layout.dragStart)
          })
          .avoidOverlaps(!0)
          .size([width, height])
          .jaccardLinkLengths(10)
        return {
          drag: (node, newPos) => {
            webcola__WEBPACK_IMPORTED_MODULE_0__.Layout.drag(node, newPos),
              layout.resume()
          },
          dragStart: (node) => {
            webcola__WEBPACK_IMPORTED_MODULE_0__.Layout.dragStart(node)
          },
          dragEnd: () => {},
          restart: () => {
            layout
              .nodes()
              .forEach(webcola__WEBPACK_IMPORTED_MODULE_0__.Layout.dragEnd),
              layout.resume()
          },
          start: (nodes, links) => {
            nodes &&
              0 !== nodes.length &&
              layout
                .nodes(nodes)
                .links(links)
                .start(1, 1, 1, 0, !0, !1)
          },
          stop: () => {
            layout.stop()
          },
          getLayout: () => view,
          type: 'graph',
        }
      }
      try {
        ;(graph.displayName = 'graph'),
          (graph.__docgenInfo = {
            description: '',
            displayName: 'graph',
            props: {
              width: {
                defaultValue: null,
                description: '',
                name: 'width',
                required: !0,
                type: { name: 'number' },
              },
              height: {
                defaultValue: null,
                description: '',
                name: 'height',
                required: !0,
                type: { name: 'number' },
              },
            },
          }),
          'undefined' != typeof STORYBOOK_REACT_CLASSES &&
            (STORYBOOK_REACT_CLASSES[
              'src/hooks/layoutEngines/graph.ts#graph'
            ] = {
              docgenInfo: graph.__docgenInfo,
              name: 'graph',
              path: 'src/hooks/layoutEngines/graph.ts#graph',
            })
      } catch (__react_docgen_typescript_loader_error) {}
    },
    332: function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var d3_hierarchy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(701),
        d3_hierarchy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(186)
      __webpack_exports__.a = ({ size: size }) => {
        let previousRootNode
        const view = { nodes: [], links: [] },
          start = (nodes) => {
            const [rootNode] = nodes
            previousRootNode = rootNode
            const d3treelayout = Object(
                d3_hierarchy__WEBPACK_IMPORTED_MODULE_0__.a,
              )().nodeSize([size / 2, size / 2])(
                Object(d3_hierarchy__WEBPACK_IMPORTED_MODULE_1__.b)(rootNode),
              ),
              mappedNodes = [],
              mappedLinks = [],
              mapNode = (d3node) => ({ ...d3node.data, ...d3node }),
              addNodeAndChildren = (parentNode) => {
                mappedNodes.push(mapNode(parentNode)),
                  parentNode.children &&
                    parentNode.children.forEach((node) => {
                      mappedLinks.push({
                        label: node.id,
                        source: mapNode(parentNode),
                        target: mapNode(node),
                        length: 2,
                      }),
                        addNodeAndChildren(node)
                    })
              }
            addNodeAndChildren(d3treelayout),
              (view.nodes = mappedNodes),
              (view.links = mappedLinks)
          }
        return {
          drag: () => {},
          dragStart: () => {},
          dragEnd: () => {},
          restart: () => {
            previousRootNode && start([previousRootNode])
          },
          start: start,
          stop: () => {},
          getLayout: () => view,
          type: 'tree',
        }
      }
      try {
        ;(tree.displayName = 'tree'),
          (tree.__docgenInfo = {
            description: '',
            displayName: 'tree',
            props: {
              size: {
                defaultValue: null,
                description: '',
                name: 'size',
                required: !0,
                type: { name: 'number' },
              },
            },
          }),
          'undefined' != typeof STORYBOOK_REACT_CLASSES &&
            (STORYBOOK_REACT_CLASSES['src/hooks/layoutEngines/tree.ts#tree'] = {
              docgenInfo: tree.__docgenInfo,
              name: 'tree',
              path: 'src/hooks/layoutEngines/tree.ts#tree',
            })
      } catch (__react_docgen_typescript_loader_error) {}
    },
    333: function(module, exports) {},
    352: function(module, exports, __webpack_require__) {
      __webpack_require__(353),
        __webpack_require__(499),
        (module.exports = __webpack_require__(500))
    },
    417: function(module, exports) {},
    500: function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var _storybook_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            334,
          )
          ;(module._StorybookPreserveDecorators = !0),
            Object(_storybook_react__WEBPACK_IMPORTED_MODULE_0__.configure)(
              [__webpack_require__(684)],
              module,
            )
        }.call(this, __webpack_require__(501)(module))
    },
    684: function(module, exports, __webpack_require__) {
      var map = { './2-graph.stories.tsx': 699 }
      function webpackContext(req) {
        var id = webpackContextResolve(req)
        return __webpack_require__(id)
      }
      function webpackContextResolve(req) {
        if (!__webpack_require__.o(map, req)) {
          var e = new Error("Cannot find module '" + req + "'")
          throw ((e.code = 'MODULE_NOT_FOUND'), e)
        }
        return map[req]
      }
      ;(webpackContext.keys = function webpackContextKeys() {
        return Object.keys(map)
      }),
        (webpackContext.resolve = webpackContextResolve),
        (module.exports = webpackContext),
        (webpackContext.id = 684)
    },
    699: function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(__webpack_exports__, 'Readme', function() {
          return Readme
        }),
        __webpack_require__.d(__webpack_exports__, 'Tree', function() {
          return Tree
        }),
        __webpack_require__.d(__webpack_exports__, 'CustomLink', function() {
          return CustomLink
        }),
        __webpack_require__.d(__webpack_exports__, 'CustomNode', function() {
          return CustomNode
        }),
        __webpack_require__.d(__webpack_exports__, 'BlockZoom', function() {
          return BlockZoom
        }),
        __webpack_require__.d(__webpack_exports__, 'BlockMove', function() {
          return BlockMove
        }),
        __webpack_require__.d(__webpack_exports__, 'BlockDrag', function() {
          return BlockDrag
        }),
        __webpack_require__.d(__webpack_exports__, 'StaticView', function() {
          return StaticView
        })
      var react = __webpack_require__(0),
        react_default = __webpack_require__.n(react)
      const knownIndex = Symbol('knownIndex'),
        isSamePoint = (source, target) =>
          source.x === target.x && source.y === target.y,
        isSimilarLink = (a) => (b) =>
          (isSamePoint(a.source, b.source) &&
            isSamePoint(a.target, b.target)) ||
          (isSamePoint(a.source, b.target) && isSamePoint(a.target, b.source)),
        addSVGPath = (options) => (groups) =>
          groups.map((link, index, { length: length }) =>
            ((
              link,
              i,
              inGroup,
              groups,
              { size: size, offset: offset = 500 },
            ) => {
              const { source: source, target: target } = ((
                { source: source, target: target },
                size,
              ) => ({
                source: { ...source, x: source.x * size, y: source.y * size },
                target: { ...target, x: target.x * size, y: target.y * size },
              }))(link, size)
              if (i === (inGroup - 1) / 2)
                return {
                  ...link,
                  d: `M ${source.x} ${source.y} ${target.x} ${target.y}`,
                  quadraticPoint: {
                    x: source.x + (target.x - source.x) / 2,
                    y: source.y + (target.y - source.y) / 2,
                  },
                  sweep: 1,
                }
              const cx = (source.x + target.x) / 2,
                cy = (source.y + target.y) / 2,
                dx = (target.x - source.x) / 2,
                dy = (target.y - source.y) / 2,
                dd = Math.sqrt(dx * dx + dy * dy),
                sweep = link.source.x - link.target.x > 0 ? 1 : -1,
                quadraticPoint = {
                  x:
                    cx +
                    (dy / dd) *
                      (offset / groups) *
                      (i - (inGroup - 1) / 2) *
                      sweep,
                  y:
                    cy -
                    (dx / dd) *
                      (offset / groups) *
                      (i - (inGroup - 1) / 2) *
                      sweep,
                }
              return {
                ...link,
                d: `M ${source.x} ${source.y} Q ${quadraticPoint.x} ${quadraticPoint.y} ${target.x} ${target.y}`,
                quadraticPoint: quadraticPoint,
                sweep: sweep,
              }
            })(link, index, length, groups.length, options),
          )
      var d3 = __webpack_require__(185)
      const getColor = d3.a(d3.b),
        Node = (props) => {
          const {
              id: id,
              size: size,
              group: group,
              label: label,
              hover: hover,
              hidden: hidden,
              color: color,
              Component: Component,
              onClick: onClick,
              onDrag: onDrag,
              onStart: onStart,
              onEnd: onEnd,
              onMouseEnter: onMouseEnter,
              onMouseLeave: onMouseLeave,
              ...gProps
            } = props,
            nodeRef = Object(react.useRef)(null),
            dragInfoRef = Object(react.useRef)({
              thisIsMe: !1,
              beforeX: 0,
              beforeY: 0,
            }),
            rafTimerRef = Object(react.useRef)(0),
            mouseDown = Object(react.useCallback)(
              (e) => {
                nodeRef.current &&
                  ((dragInfoRef.current.thisIsMe = e
                    .composedPath()
                    .some((n) => n === nodeRef.current)),
                  dragInfoRef.current.thisIsMe &&
                    ((dragInfoRef.current.beforeX = e.clientX),
                    (dragInfoRef.current.beforeY = e.clientY),
                    onStart(id)))
              },
              [onStart, id],
            ),
            mouseMove = Object(react.useCallback)(
              (e) => {
                if (!nodeRef.current) return
                if (!dragInfoRef.current.thisIsMe) return
                e.preventDefault(), e.stopPropagation()
                const deltaX = e.clientX - dragInfoRef.current.beforeX,
                  deltaY = e.clientY - dragInfoRef.current.beforeY
                rafTimerRef.current &&
                  cancelAnimationFrame(rafTimerRef.current),
                  (rafTimerRef.current = requestAnimationFrame(() => {
                    onDrag(id, e, { deltaX: deltaX, deltaY: deltaY }),
                      (dragInfoRef.current.beforeX = e.clientX),
                      (dragInfoRef.current.beforeY = e.clientY)
                  }))
              },
              [onDrag, id],
            ),
            mouseUp = Object(react.useCallback)(() => {
              dragInfoRef.current.thisIsMe && onEnd(id),
                (dragInfoRef.current.thisIsMe = !1)
            }, [onEnd, id]),
            innerOnMouseLeave = Object(react.useCallback)(() => {
              onMouseLeave && onMouseLeave(id)
            }, [onMouseLeave, id]),
            innerOnMouseEnter = Object(react.useCallback)(() => {
              onMouseEnter && onMouseEnter(id)
            }, [onMouseEnter, id])
          Object(react.useEffect)(
            () => (
              window.addEventListener('mousedown', mouseDown),
              window.addEventListener('mousemove', mouseMove),
              window.addEventListener('mouseup', mouseUp),
              () => {
                window.removeEventListener('mousedown', mouseDown),
                  window.removeEventListener('mousemove', mouseMove),
                  window.removeEventListener('mouseup', mouseUp)
              }
            ),
            [mouseDown, mouseMove, mouseUp],
          )
          const onInnerClick = Object(react.useCallback)(() => {
            if (onClick) return onClick(id)
          }, [onClick, id])
          return react_default.a.createElement(
            'g',
            Object.assign({ ref: nodeRef }, gProps, {
              onClick: onInnerClick,
              className: `node-container ${hidden ? 'node-hidden' : ''}`,
              onMouseLeave: innerOnMouseLeave,
              onMouseEnter: innerOnMouseEnter,
            }),
            (() => {
              if (Component)
                return react_default.a.createElement(Component, {
                  id: id,
                  size: size,
                  group: group,
                  label: label,
                  hover: hover,
                  hidden: hidden,
                  color: color,
                })
              const innerSize = 3 * (size + 10),
                outerSize = innerSize + 20,
                style = {
                  borderRadius: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(50, 50, 50, 0.4)',
                  boxShadow: '0px 0px 10px -5px black',
                  width: innerSize,
                  height: innerSize,
                  margin: '5px auto',
                }
              return (
                (style.backgroundColor = hover
                  ? '#f97975'
                  : null != group
                  ? getColor(group)
                  : color || '#1f77b4'),
                react_default.a.createElement(
                  'foreignObject',
                  {
                    width: outerSize,
                    height: outerSize,
                    x: -outerSize / 2,
                    y: -outerSize / 2,
                  },
                  react_default.a.createElement('div', { style: style }, label),
                )
              )
            })(),
          )
        }
      var src_Node = Object(react.memo)(Node)
      try {
        ;(Node.displayName = 'Node'),
          (Node.__docgenInfo = {
            description: '',
            displayName: 'Node',
            props: {
              id: {
                defaultValue: null,
                description: '',
                name: 'id',
                required: !0,
                type: { name: 'string | number' },
              },
              size: {
                defaultValue: null,
                description: '',
                name: 'size',
                required: !0,
                type: { name: 'number' },
              },
              group: {
                defaultValue: null,
                description: '',
                name: 'group',
                required: !1,
                type: { name: 'string' },
              },
              label: {
                defaultValue: null,
                description: '',
                name: 'label',
                required: !1,
                type: { name: 'string' },
              },
              hover: {
                defaultValue: null,
                description: '',
                name: 'hover',
                required: !1,
                type: { name: 'boolean' },
              },
              hidden: {
                defaultValue: null,
                description: '',
                name: 'hidden',
                required: !1,
                type: { name: 'boolean' },
              },
              color: {
                defaultValue: null,
                description: '',
                name: 'color',
                required: !1,
                type: { name: 'string' },
              },
              Component: {
                defaultValue: null,
                description: '',
                name: 'Component',
                required: !1,
                type: { name: 'any' },
              },
              onClick: {
                defaultValue: null,
                description: '',
                name: 'onClick',
                required: !1,
                type: { name: 'any' },
              },
              onEnd: {
                defaultValue: null,
                description: '',
                name: 'onEnd',
                required: !1,
                type: { name: 'any' },
              },
              onStart: {
                defaultValue: null,
                description: '',
                name: 'onStart',
                required: !1,
                type: { name: 'any' },
              },
              onDrag: {
                defaultValue: null,
                description: '',
                name: 'onDrag',
                required: !1,
                type: { name: 'any' },
              },
              onMouseEnter: {
                defaultValue: null,
                description: '',
                name: 'onMouseEnter',
                required: !1,
                type: { name: 'any' },
              },
              onMouseLeave: {
                defaultValue: null,
                description: '',
                name: 'onMouseLeave',
                required: !1,
                type: { name: 'any' },
              },
            },
          }),
          'undefined' != typeof STORYBOOK_REACT_CLASSES &&
            (STORYBOOK_REACT_CLASSES['src/Node.tsx#Node'] = {
              docgenInfo: Node.__docgenInfo,
              name: 'Node',
              path: 'src/Node.tsx#Node',
            })
      } catch (__react_docgen_typescript_loader_error) {}
      const Path = (props) => {
        const {
          id: id,
          d: d,
          strokeWidth: strokeWidth,
          stroke: stroke,
          markerEnd: markerEnd,
        } = props
        return react_default.a.createElement('path', {
          id: `${id}`,
          d: d,
          strokeWidth: strokeWidth,
          fill: 'transparent',
          stroke: stroke,
          markerEnd: markerEnd,
        })
      }
      var DefaultLink_Path = Path
      try {
        ;(Path.displayName = 'Path'),
          (Path.__docgenInfo = {
            description: '',
            displayName: 'Path',
            props: {
              id: {
                defaultValue: null,
                description: '',
                name: 'id',
                required: !0,
                type: { name: 'string | number' },
              },
              d: {
                defaultValue: null,
                description: '',
                name: 'd',
                required: !0,
                type: { name: 'string' },
              },
              strokeWidth: {
                defaultValue: null,
                description: '',
                name: 'strokeWidth',
                required: !0,
                type: { name: 'number' },
              },
              stroke: {
                defaultValue: null,
                description: '',
                name: 'stroke',
                required: !0,
                type: { name: 'string' },
              },
              markerEnd: {
                defaultValue: null,
                description: '',
                name: 'markerEnd',
                required: !1,
                type: { name: 'string' },
              },
            },
          }),
          'undefined' != typeof STORYBOOK_REACT_CLASSES &&
            (STORYBOOK_REACT_CLASSES['src/Link/DefaultLink/Path.tsx#Path'] = {
              docgenInfo: Path.__docgenInfo,
              name: 'Path',
              path: 'src/Link/DefaultLink/Path.tsx#Path',
            })
      } catch (__react_docgen_typescript_loader_error) {}
      const Label = (props) => {
        const {
            label: label,
            x: x,
            y: y,
            sweep: sweep,
            width: width,
            height: height,
          } = props,
          [position, setPosition] = Object(react.useState)({ x: x, y: y })
        return (
          Object(react.useLayoutEffect)(() => {
            sweep > 0 && setPosition({ x: x - width / 2, y: y - height / 2 }),
              setPosition({ x: x - width / 2, y: y })
          }, [x, y, sweep, width, height]),
          react_default.a.createElement(
            'foreignObject',
            Object.assign({}, position, { width: width, height: height }),
            react_default.a.createElement(
              'div',
              {
                style: {
                  borderRadius: '5px',
                  backgroundColor: 'rgba(100, 100, 100, 0.2)',
                  textAlign: 'center',
                  padding: '1em',
                  border: '1px solid rgba(50, 50, 50, 0.2)',
                },
              },
              label,
            ),
          )
        )
      }
      var DefaultLink_Label = Label
      try {
        ;(Label.displayName = 'Label'),
          (Label.__docgenInfo = {
            description: '',
            displayName: 'Label',
            props: {
              label: {
                defaultValue: null,
                description: '',
                name: 'label',
                required: !0,
                type: { name: 'string' },
              },
              x: {
                defaultValue: null,
                description: '',
                name: 'x',
                required: !0,
                type: { name: 'number' },
              },
              y: {
                defaultValue: null,
                description: '',
                name: 'y',
                required: !0,
                type: { name: 'number' },
              },
              sweep: {
                defaultValue: null,
                description: '',
                name: 'sweep',
                required: !0,
                type: { name: 'number' },
              },
              width: {
                defaultValue: null,
                description: '',
                name: 'width',
                required: !0,
                type: { name: 'number' },
              },
              height: {
                defaultValue: null,
                description: '',
                name: 'height',
                required: !0,
                type: { name: 'number' },
              },
            },
          }),
          'undefined' != typeof STORYBOOK_REACT_CLASSES &&
            (STORYBOOK_REACT_CLASSES['src/Link/DefaultLink/Label.tsx#Label'] = {
              docgenInfo: Label.__docgenInfo,
              name: 'Label',
              path: 'src/Link/DefaultLink/Label.tsx#Label',
            })
      } catch (__react_docgen_typescript_loader_error) {}
      const DefaultLink = (props) => {
          const {
            id: id,
            d: d,
            label: label,
            quadraticPoint: quadraticPoint,
            sweep: sweep,
            source: source,
            target: target,
            hover: hover,
          } = props
          return react_default.a.createElement(
            react_default.a.Fragment,
            null,
            react_default.a.createElement(DefaultLink_Path, {
              id: id,
              d: d,
              strokeWidth: 5,
              stroke: '#d1d1d1',
              markerEnd: 'url(#arrow-#d1d1d1)',
            }),
            hover &&
              react_default.a.createElement(DefaultLink_Path, {
                id: id,
                d: d,
                strokeWidth: 20,
                stroke: 'rgba(249, 121, 117, 0.5)',
              }),
            hover &&
              react_default.a.createElement(
                DefaultLink_Label,
                Object.assign({}, quadraticPoint, {
                  sweep: sweep,
                  width: 250,
                  height: 100,
                  label: label || `${source.label} -> ${target.label}`,
                }),
              ),
          )
        },
        PROPS_TO_ALWAYS_COMPARE = ['id', 'hover']
      var DefaultLink_DefaultLink = Object(react.memo)(
        DefaultLink,
        (prevProps, nextProps) =>
          !Object.entries(prevProps).some(([key, value]) => {
            if (PROPS_TO_ALWAYS_COMPARE.includes(key)) {
              return nextProps[key] !== value
            }
            if ('target' === key || 'source' === key) {
              const nextValue = nextProps[key],
                treshold = 0.1
              if (
                Math.abs(nextValue.x - value.x) > treshold ||
                Math.abs(nextValue.y - value.y) > treshold
              )
                return !0
            }
            return !1
          }),
      )
      try {
        ;(DefaultLink.displayName = 'DefaultLink'),
          (DefaultLink.__docgenInfo = {
            description: '',
            displayName: 'DefaultLink',
            props: {
              id: {
                defaultValue: null,
                description: '',
                name: 'id',
                required: !0,
                type: { name: 'string | number' },
              },
              d: {
                defaultValue: null,
                description: '',
                name: 'd',
                required: !0,
                type: { name: 'string' },
              },
              quadraticPoint: {
                defaultValue: null,
                description: '',
                name: 'quadraticPoint',
                required: !0,
                type: { name: 'WithCoords' },
              },
              sweep: {
                defaultValue: null,
                description: '',
                name: 'sweep',
                required: !0,
                type: { name: 'number' },
              },
              length: {
                defaultValue: null,
                description: '',
                name: 'length',
                required: !0,
                type: { name: 'number' },
              },
              label: {
                defaultValue: null,
                description: '',
                name: 'label',
                required: !1,
                type: { name: 'string' },
              },
              size: {
                defaultValue: null,
                description: '',
                name: 'size',
                required: !0,
                type: { name: 'number' },
              },
              hover: {
                defaultValue: null,
                description: '',
                name: 'hover',
                required: !0,
                type: { name: 'boolean' },
              },
              source: {
                defaultValue: null,
                description: '',
                name: 'source',
                required: !0,
                type: { name: 'ChartNode' },
              },
              target: {
                defaultValue: null,
                description: '',
                name: 'target',
                required: !0,
                type: { name: 'ChartNode' },
              },
            },
          }),
          'undefined' != typeof STORYBOOK_REACT_CLASSES &&
            (STORYBOOK_REACT_CLASSES[
              'src/Link/DefaultLink/DefaultLink.tsx#DefaultLink'
            ] = {
              docgenInfo: DefaultLink.__docgenInfo,
              name: 'DefaultLink',
              path: 'src/Link/DefaultLink/DefaultLink.tsx#DefaultLink',
            })
      } catch (__react_docgen_typescript_loader_error) {}
      const Link = (props) => {
        const {
            Component: Component,
            onClick: onClick,
            id: id,
            ...restProps
          } = props,
          innerOnClick = Object(react.useCallback)(() => {
            if (onClick) return onClick(id)
          }, [onClick, id])
        return react_default.a.createElement(
          'g',
          { onClick: innerOnClick },
          react_default.a.createElement(Component || DefaultLink_DefaultLink, {
            ...restProps,
            id: id,
          }),
        )
      }
      var Link_Link = Link
      try {
        ;(Link.displayName = 'Link'),
          (Link.__docgenInfo = {
            description: '',
            displayName: 'Link',
            props: {
              id: {
                defaultValue: null,
                description: '',
                name: 'id',
                required: !0,
                type: { name: 'string | number' },
              },
              d: {
                defaultValue: null,
                description: '',
                name: 'd',
                required: !0,
                type: { name: 'string' },
              },
              quadraticPoint: {
                defaultValue: null,
                description: '',
                name: 'quadraticPoint',
                required: !0,
                type: { name: 'WithCoords' },
              },
              sweep: {
                defaultValue: null,
                description: '',
                name: 'sweep',
                required: !0,
                type: { name: 'number' },
              },
              length: {
                defaultValue: null,
                description: '',
                name: 'length',
                required: !0,
                type: { name: 'number' },
              },
              label: {
                defaultValue: null,
                description: '',
                name: 'label',
                required: !1,
                type: { name: 'string' },
              },
              size: {
                defaultValue: null,
                description: '',
                name: 'size',
                required: !0,
                type: { name: 'number' },
              },
              hover: {
                defaultValue: null,
                description: '',
                name: 'hover',
                required: !0,
                type: { name: 'boolean' },
              },
              source: {
                defaultValue: null,
                description: '',
                name: 'source',
                required: !0,
                type: { name: 'ChartNode' },
              },
              target: {
                defaultValue: null,
                description: '',
                name: 'target',
                required: !0,
                type: { name: 'ChartNode' },
              },
              Component: {
                defaultValue: null,
                description: '',
                name: 'Component',
                required: !1,
                type: { name: 'any' },
              },
              onClick: {
                defaultValue: null,
                description: '',
                name: 'onClick',
                required: !0,
                type: { name: '(link: string | number) => void' },
              },
            },
          }),
          'undefined' != typeof STORYBOOK_REACT_CLASSES &&
            (STORYBOOK_REACT_CLASSES['src/Link/Link.tsx#Link'] = {
              docgenInfo: Link.__docgenInfo,
              name: 'Link',
              path: 'src/Link/Link.tsx#Link',
            })
      } catch (__react_docgen_typescript_loader_error) {}
      var hooks_useHoverNode = (
        layout,
        { getMarkerColors: getMarkerColors },
      ) => {
        const [hoverNode, setHoverNode] = Object(react.useState)(),
          [hiddenNodes, setHiddenNodes] = Object(react.useState)([])
        return [
          hoverNode,
          hiddenNodes,
          Object(react.useCallback)(
            (nodeId) => {
              const notHiddenNodes = new Set()
              layout.links.forEach(({ source: source, target: target }) => {
                ;(nodeId !== source.id && nodeId !== target.id) ||
                  (notHiddenNodes.add(source.id), notHiddenNodes.add(target.id))
              })
              const newHiddenNodes = layout.nodes.filter(
                ({ id: id }) => !notHiddenNodes.has(id),
              )
              setHiddenNodes(newHiddenNodes.map(({ id: id }) => id)),
                setHoverNode(nodeId),
                requestAnimationFrame(getMarkerColors)
            },
            [getMarkerColors, layout.links, layout.nodes],
          ),
          Object(react.useCallback)(() => {
            setHoverNode(void 0), setHiddenNodes([])
          }, []),
        ]
      }
      var hooks_useCenterAndZoom = (
          layout,
          { size: size, padding: padding, width: width, height: height },
        ) => {
          const [offsets, setOffsets] = Object(react.useState)({ x: 0, y: 0 }),
            blockAll = Object(react.useRef)(!1),
            [zoom, setZoom] = Object(react.useState)(1),
            centerAndZoom = Object(react.useCallback)(
              (nodes) => {
                if (0 === nodes.length) return
                if (blockAll.current) return
                let minX = 1 / 0,
                  minY = 1 / 0,
                  maxX = -1 / 0,
                  maxY = -1 / 0
                nodes.forEach(({ x: x, y: y }) => {
                  minX > x && (minX = x),
                    minY > y && (minY = y),
                    maxX < x && (maxX = x),
                    maxY < y && (maxY = y)
                }),
                  (minX = minX * size - 2 * size),
                  (minY = minY * size - 2 * size),
                  (maxX = maxX * size + 2 * size),
                  (maxY = maxY * size + 2 * size)
                let chartWidth = maxX - minX,
                  chartHeight = maxY - minY,
                  newZoom = Math.max(chartWidth / width, chartHeight / height)
                ;(minX -= padding * newZoom),
                  (minY -= padding * newZoom),
                  (maxX += padding * newZoom),
                  (maxY += padding * newZoom),
                  (chartWidth = maxX - minX),
                  (chartHeight = maxY - minY),
                  (newZoom = Math.max(chartWidth / width, chartHeight / height))
                const centerX = chartWidth / 2 + minX - (width * newZoom) / 2,
                  centerY = chartHeight / 2 + minY - (height * newZoom) / 2
                setZoom(newZoom), setOffsets({ x: centerX, y: centerY })
              },
              [setZoom, padding, size, height, width],
            )
          Object(react.useLayoutEffect)(() => {
            centerAndZoom(layout.nodes)
          }, [centerAndZoom, layout])
          const onWheel = Object(react.useCallback)(
              (e) => {
                const { deltaY: deltaY } = e
                setZoom((old) => old - deltaY / 1e3)
              },
              [setZoom],
            ),
            setBlockAll = Object(react.useCallback)((block) => {
              blockAll.current = block
            }, []),
            rafOffsetTimer = Object(react.useRef)(),
            mouseMovingInfos = Object(react.useRef)({
              startX: 0,
              startY: 0,
              moving: !1,
            }),
            onMouseMove = Object(react.useCallback)(
              (e) => {
                if (!mouseMovingInfos.current.moving) return
                if (blockAll.current) return
                const {
                    startX: startX,
                    startY: startY,
                  } = mouseMovingInfos.current,
                  { clientX: clientX, clientY: clientY } = e
                rafOffsetTimer.current &&
                  cancelAnimationFrame(rafOffsetTimer.current),
                  (rafOffsetTimer.current = requestAnimationFrame(() => {
                    ;(mouseMovingInfos.current.startX = clientX),
                      (mouseMovingInfos.current.startY = clientY),
                      setOffsets((old) => ({
                        x: old.x + (startX - clientX) * zoom,
                        y: old.y + (startY - clientY) * zoom,
                      }))
                  }))
              },
              [zoom],
            ),
            onMouseDown = Object(react.useCallback)((e) => {
              blockAll.current ||
                (mouseMovingInfos.current = {
                  ...mouseMovingInfos.current,
                  moving: !0,
                  startX: e.clientX,
                  startY: e.clientY,
                })
            }, []),
            onMouseUp = Object(react.useCallback)(() => {
              mouseMovingInfos.current = {
                ...mouseMovingInfos.current,
                moving: !1,
              }
            }, [])
          return [
            zoom,
            offsets,
            centerAndZoom,
            onWheel,
            onMouseMove,
            onMouseDown,
            onMouseUp,
            setBlockAll,
          ]
        },
        layoutEngines = __webpack_require__(184)
      var hooks_useLayout = (
        nodes,
        links,
        { width: width, height: height, size: size, type: type = 'graph' },
      ) => {
        const engine = Object(react.useRef)(),
          framesPerView = Object(react.useRef)(10),
          previousFramesPerView = Object(react.useRef)(framesPerView.current),
          [layout, setLayout] = Object(react.useState)({
            nodes: [],
            links: [],
          }),
          startEngine = Object(react.useCallback)(() => {
            nodes &&
              0 !== nodes.length &&
              engine.current &&
              (engine.current.start(nodes, links),
              setLayout(engine.current.getLayout()))
          }, [nodes, links]),
          initEngine = Object(react.useCallback)(() => {
            var _a
            let rafTimer
            if (
              (null === (_a = engine.current) || void 0 === _a || _a.stop(),
              'graph' === type
                ? (engine.current = Object(layoutEngines.createGraphLayout)({
                    width: width,
                    height: height,
                  }))
                : 'tree' === type &&
                  (engine.current = Object(layoutEngines.createTreeLayout)({
                    size: size,
                  })),
              engine.current)
            ) {
              const getViewOnRaf = (frame) => {
                let innerFrame = frame + 1
                frame >= framesPerView.current &&
                  engine.current &&
                  ((innerFrame = 0),
                  setLayout({ ...engine.current.getLayout() })),
                  (rafTimer = requestAnimationFrame(() =>
                    getViewOnRaf(innerFrame),
                  ))
              }
              getViewOnRaf(0)
            }
            return () => {
              rafTimer && cancelAnimationFrame(rafTimer)
            }
          }, [type, width, height, size]),
          previousInitEngineRef = Object(react.useRef)(),
          previousStartEngineRef = Object(react.useRef)()
        return (
          Object(react.useEffect)(() => {
            previousInitEngineRef.current !== initEngine
              ? ((previousInitEngineRef.current = initEngine),
                (previousStartEngineRef.current = startEngine),
                initEngine(),
                startEngine())
              : previousStartEngineRef.current !== startEngine &&
                ((previousStartEngineRef.current = startEngine), startEngine())
          }, [initEngine, startEngine]),
          [
            layout,
            {
              restart: Object(react.useCallback)(() => {
                var _a
                null === (_a = engine.current) || void 0 === _a || _a.restart()
              }, []),
              dragStart: Object(react.useCallback)((node) => {
                var _a
                ;(framesPerView.current = 1),
                  null === (_a = engine.current) ||
                    void 0 === _a ||
                    _a.dragStart(node)
              }, []),
              drag: Object(react.useCallback)((node, newPos) => {
                var _a
                null === (_a = engine.current) ||
                  void 0 === _a ||
                  _a.drag(node, newPos)
              }, []),
              dragEnd: Object(react.useCallback)((node) => {
                var _a
                null === (_a = engine.current) ||
                  void 0 === _a ||
                  _a.dragEnd(node),
                  (framesPerView.current = previousFramesPerView.current)
              }, []),
            },
          ]
        )
      }
      const Graph = (props) => {
        const {
            style: style,
            className: className,
            nodes: nodes,
            links: links,
            type: type = 'graph',
            onNodeClick: onNodeClick,
            onLinkClick: onLinkClick,
            noZoom: noZoom,
            noViewportMove: noViewportMove,
            noDrag: noDrag,
          } = props,
          svgRef = Object(react.useRef)(null),
          [
            layout,
            {
              drag: drag,
              dragStart: dragStart,
              dragEnd: dragEnd,
              restart: restart,
            },
          ] = hooks_useLayout(nodes, links, {
            width: 800,
            height: 500,
            size: 35,
            type: type,
          }),
          [
            zoom,
            offsets,
            centerAndZoom,
            onWheel,
            onMouseMove,
            onMouseDown,
            onMouseUp,
            blockCenterAndZoom,
          ] = hooks_useCenterAndZoom(layout, {
            size: 35,
            padding: 20,
            width: 800,
            height: 500,
          }),
          [lineMarkerColors, setLineMarkerColors] = Object(react.useState)([
            '#999',
          ]),
          getMarkerColors = Object(react.useCallback)(() => {
            if (!svgRef.current) return
            const paths = [...svgRef.current.getElementsByTagName('path')],
              colors = new Set(paths.map((path) => path.getAttribute('stroke')))
            setLineMarkerColors([...colors.values()].filter(Boolean))
          }, [])
        Object(react.useEffect)(getMarkerColors, [layout, getMarkerColors])
        const findNode = Object(react.useCallback)(
            (nodeId) => layout.nodes.find((n) => n.id === nodeId),
            [layout.nodes],
          ),
          findLink = Object(react.useCallback)(
            (linkIndex) => layout.links[linkIndex],
            [layout.links],
          ),
          onDrag = Object(react.useCallback)(
            (nodeId, e) => {
              const node = findNode(nodeId)
              if (!node) return
              const newPos = (function svgPoint(element, x, y) {
                if (!element) return { x: x, y: y }
                const pt = element.createSVGPoint()
                ;(pt.x = x), (pt.y = y)
                const screenCTM = element.getScreenCTM()
                return screenCTM
                  ? pt.matrixTransform(screenCTM.inverse())
                  : { x: x, y: y }
              })(svgRef.current, e.clientX, e.clientY)
              ;(node.x = newPos.x / 35),
                (node.y = newPos.y / 35),
                drag(node, { x: newPos.x / 35, y: newPos.y / 35 })
            },
            [findNode, drag],
          ),
          onStart = Object(react.useCallback)(
            (nodeId) => {
              const node = findNode(nodeId)
              node && (dragStart(node), blockCenterAndZoom(!0))
            },
            [findNode, dragStart, blockCenterAndZoom],
          ),
          onEnd = Object(react.useCallback)(
            (nodeId) => {
              const node = findNode(nodeId)
              node &&
                (dragEnd(node),
                blockCenterAndZoom(!1),
                centerAndZoom(layout.nodes))
            },
            [
              centerAndZoom,
              blockCenterAndZoom,
              layout.nodes,
              dragEnd,
              findNode,
            ],
          ),
          [
            hoverNode,
            hiddenNodes,
            onOverNode,
            onLeaveNode,
          ] = hooks_useHoverNode(layout, { getMarkerColors: getMarkerColors }),
          innerOnNodeClick = Object(react.useCallback)(
            (id) => {
              if (!onNodeClick) return
              const node = findNode(id)
              return onNodeClick(node)
            },
            [onNodeClick, findNode],
          ),
          innerOnLinkClick = Object(react.useCallback)(
            (index) => {
              if (onLinkClick) return onLinkClick(findLink(index))
            },
            [onLinkClick, findLink],
          )
        return 0 === layout.nodes.length
          ? null
          : react_default.a.createElement(
              react_default.a.Fragment,
              null,
              react_default.a.createElement(
                'button',
                { onClick: restart, type: 'button' },
                'Relayout',
              ),
              react_default.a.createElement(
                'svg',
                {
                  className: className,
                  style: style,
                  ref: svgRef,
                  width: 800,
                  height: 500,
                  viewBox: `${offsets.x} ${offsets.y} ${800 * zoom} ${500 *
                    zoom}`,
                  onWheel: noZoom ? void 0 : onWheel,
                  onMouseMove: noViewportMove ? void 0 : onMouseMove,
                  onMouseDown: noViewportMove ? void 0 : onMouseDown,
                  onMouseUp: noViewportMove ? void 0 : onMouseUp,
                  xmlns: 'http://www.w3.org/2000/svg',
                },
                lineMarkerColors.map((color) =>
                  react_default.a.createElement(
                    'marker',
                    {
                      id: `arrow-${color}`,
                      key: `arrow-${color}`,
                      viewBox: '0 0 10 10',
                      refX: 28.5,
                      refY: '2.5',
                      markerWidth: '6',
                      markerHeight: '6',
                      orient: 'auto-start-reverse',
                    },
                    react_default.a.createElement('path', {
                      d: 'M 0 0 L 5 2.5 L 0 5 z',
                      fill: color,
                    }),
                  ),
                ),
                react_default.a.createElement(
                  'g',
                  { stroke: '#999' },
                  ((links, { offset: offset, size: size = 1 }) => {
                    const groupLinks = [],
                      iterateLinks = [
                        ...links.map((link, index) => ({
                          ...link,
                          [knownIndex]: index,
                        })),
                      ]
                    for (; iterateLinks.length > 0; ) {
                      const [currentLink] = iterateLinks,
                        similarLinks = iterateLinks.filter(
                          isSimilarLink(currentLink),
                        )
                      groupLinks.push(similarLinks),
                        similarLinks.forEach((sl) =>
                          iterateLinks.splice(iterateLinks.indexOf(sl), 1),
                        )
                    }
                    return groupLinks
                      .flatMap(addSVGPath({ offset: offset, size: size }))
                      .sort((a, b) => a[knownIndex] - b[knownIndex])
                  })(layout.links, { size: 35 }).map((link, index) => {
                    const { source: source, target: target } = link
                    return react_default.a.createElement(
                      Link_Link,
                      Object.assign({ key: index, id: index }, link, {
                        size: 35,
                        onClick: innerOnLinkClick,
                        hover:
                          hoverNode === source.id || hoverNode === target.id,
                      }),
                    )
                  }),
                ),
                react_default.a.createElement(
                  'g',
                  { stroke: '#fff', strokeWidth: 1 },
                  layout.nodes.map((node) => {
                    const {
                      id: id,
                      group: group,
                      x: x,
                      y: y,
                      label: label,
                      Component: Component,
                      color: color,
                    } = node
                    return react_default.a.createElement(
                      'g',
                      { key: id, transform: `translate(${35 * x} ${35 * y})` },
                      react_default.a.createElement(src_Node, {
                        key: id,
                        id: id,
                        group: group,
                        label: label,
                        color: color,
                        Component: Component,
                        size: 35,
                        hover: hoverNode === id,
                        hidden: hoverNode !== id && hiddenNodes.includes(id),
                        onClick: innerOnNodeClick,
                        onMouseEnter: onOverNode,
                        onMouseLeave: onLeaveNode,
                        onDrag: noDrag ? void 0 : onDrag,
                        onStart: noDrag ? void 0 : onStart,
                        onEnd: noDrag ? void 0 : onEnd,
                      }),
                    )
                  }),
                ),
              ),
            )
      }
      var src_Graph = Graph
      try {
        ;(Graph.displayName = 'Graph'),
          (Graph.__docgenInfo = {
            description: '',
            displayName: 'Graph',
            props: {
              nodes: {
                defaultValue: null,
                description: '',
                name: 'nodes',
                required: !0,
                type: { name: 'TreeNode[] | GraphNode[]' },
              },
              type: {
                defaultValue: null,
                description: '',
                name: 'type',
                required: !0,
                type: { name: '"tree" | "graph"' },
              },
              style: {
                defaultValue: null,
                description: '',
                name: 'style',
                required: !1,
                type: { name: 'CSSProperties' },
              },
              className: {
                defaultValue: null,
                description: '',
                name: 'className',
                required: !1,
                type: { name: 'string' },
              },
              noZoom: {
                defaultValue: null,
                description: '',
                name: 'noZoom',
                required: !1,
                type: { name: 'boolean' },
              },
              noViewportMove: {
                defaultValue: null,
                description: '',
                name: 'noViewportMove',
                required: !1,
                type: { name: 'boolean' },
              },
              noDrag: {
                defaultValue: null,
                description: '',
                name: 'noDrag',
                required: !1,
                type: { name: 'boolean' },
              },
              onNodeClick: {
                defaultValue: null,
                description: '',
                name: 'onNodeClick',
                required: !1,
                type: { name: '(node: any) => void' },
              },
              onLinkClick: {
                defaultValue: null,
                description: '',
                name: 'onLinkClick',
                required: !1,
                type: { name: '(link: any) => void' },
              },
            },
          }),
          'undefined' != typeof STORYBOOK_REACT_CLASSES &&
            (STORYBOOK_REACT_CLASSES['src/Graph.tsx#Graph'] = {
              docgenInfo: Graph.__docgenInfo,
              name: 'Graph',
              path: 'src/Graph.tsx#Graph',
            })
      } catch (__react_docgen_typescript_loader_error) {}
      const Line = (props) => {
        const {
          id: id,
          label: label,
          source: source,
          target: target,
          hover: hover,
          quadraticPoint: quadraticPoint,
          size: size,
        } = props
        return react_default.a.createElement(
          'g',
          null,
          react_default.a.createElement('line', {
            id: `${id}`,
            x1: source.x * size,
            y1: source.y * size,
            x2: target.x * size,
            y2: target.y * size,
            strokeWidth: hover ? 5 : 1,
            stroke: source.color,
          }),
          react_default.a.createElement(
            'foreignObject',
            Object.assign({}, quadraticPoint, { width: 50, height: 100 }),
            react_default.a.createElement(
              'div',
              {
                style: {
                  textAlign: 'center',
                  color: source.color,
                  fontWeight: hover ? 'bold' : 'lighter',
                },
              },
              label,
            ),
          ),
        )
      }
      var stories_Line = Line
      try {
        ;(Line.displayName = 'Line'),
          (Line.__docgenInfo = {
            description: '',
            displayName: 'Line',
            props: {
              id: {
                defaultValue: null,
                description: '',
                name: 'id',
                required: !0,
                type: { name: 'string | number' },
              },
              d: {
                defaultValue: null,
                description: '',
                name: 'd',
                required: !0,
                type: { name: 'string' },
              },
              quadraticPoint: {
                defaultValue: null,
                description: '',
                name: 'quadraticPoint',
                required: !0,
                type: { name: 'WithCoords' },
              },
              sweep: {
                defaultValue: null,
                description: '',
                name: 'sweep',
                required: !0,
                type: { name: 'number' },
              },
              length: {
                defaultValue: null,
                description: '',
                name: 'length',
                required: !0,
                type: { name: 'number' },
              },
              label: {
                defaultValue: null,
                description: '',
                name: 'label',
                required: !1,
                type: { name: 'string' },
              },
              size: {
                defaultValue: null,
                description: '',
                name: 'size',
                required: !0,
                type: { name: 'number' },
              },
              hover: {
                defaultValue: null,
                description: '',
                name: 'hover',
                required: !0,
                type: { name: 'boolean' },
              },
              source: {
                defaultValue: null,
                description: '',
                name: 'source',
                required: !0,
                type: { name: 'ChartNode' },
              },
              target: {
                defaultValue: null,
                description: '',
                name: 'target',
                required: !0,
                type: { name: 'ChartNode' },
              },
            },
          }),
          'undefined' != typeof STORYBOOK_REACT_CLASSES &&
            (STORYBOOK_REACT_CLASSES['stories/Line.tsx#Line'] = {
              docgenInfo: Line.__docgenInfo,
              name: 'Line',
              path: 'stories/Line.tsx#Line',
            })
      } catch (__react_docgen_typescript_loader_error) {}
      var stories_Square = Object(react.memo)((props) => {
        const { label: label, color: color, size: size } = props,
          innerSize = 3 * size
        return react_default.a.createElement(
          'g',
          null,
          react_default.a.createElement(
            'foreignObject',
            { width: 200, height: 50, x: -100, y: (-innerSize - 100) / 2 },
            react_default.a.createElement('div', null, label),
          ),
          react_default.a.createElement(
            'foreignObject',
            {
              x: -innerSize / 2,
              y: -innerSize / 2,
              width: innerSize,
              height: innerSize,
            },
            react_default.a.createElement('div', {
              style: {
                width: innerSize,
                height: innerSize,
                backgroundColor: color || 'grey',
              },
            }),
          ),
        )
      })
      try {
        ;(Square.displayName = 'Square'),
          (Square.__docgenInfo = {
            description: '',
            displayName: 'Square',
            props: {
              id: {
                defaultValue: null,
                description: '',
                name: 'id',
                required: !0,
                type: { name: 'string | number' },
              },
              size: {
                defaultValue: null,
                description: '',
                name: 'size',
                required: !0,
                type: { name: 'number' },
              },
              group: {
                defaultValue: null,
                description: '',
                name: 'group',
                required: !1,
                type: { name: 'string' },
              },
              label: {
                defaultValue: null,
                description: '',
                name: 'label',
                required: !1,
                type: { name: 'string' },
              },
              hover: {
                defaultValue: null,
                description: '',
                name: 'hover',
                required: !1,
                type: { name: 'boolean' },
              },
              hidden: {
                defaultValue: null,
                description: '',
                name: 'hidden',
                required: !1,
                type: { name: 'boolean' },
              },
              color: {
                defaultValue: null,
                description: '',
                name: 'color',
                required: !1,
                type: { name: 'string' },
              },
            },
          }),
          'undefined' != typeof STORYBOOK_REACT_CLASSES &&
            (STORYBOOK_REACT_CLASSES['stories/Square.tsx#Square'] = {
              docgenInfo: Square.__docgenInfo,
              name: 'Square',
              path: 'stories/Square.tsx#Square',
            })
      } catch (__react_docgen_typescript_loader_error) {}
      __webpack_require__(322).withSource
      var addSourceDecorator = __webpack_require__(322).addSource,
        __SOURCE_PREFIX__ = '/home/fabienjuif/work/react-kgraph/stories',
        __STORY__ =
          "import React from 'react'\nimport Graph from '../src/Graph'\nimport Line from './Line'\nimport Square from './Square'\n\nexport default {\n  title: 'Graph',\n  component: Graph,\n}\n\nconst nodes = [\n  {\n    id: 'jack',\n    label: 'Jack',\n  },\n  {\n    id: 'john',\n    label: 'John',\n    color: '#4f9ceb',\n  },\n  {\n    id: 'meridith',\n    label: 'Meridith',\n    color: 'green',\n  },\n]\n\nconst links = [\n  {\n    source: 0,\n    target: 1,\n    label: '200€',\n  },\n  {\n    source: 1,\n    target: 2,\n    label: '100€',\n  },\n  {\n    source: 1,\n    target: 0,\n    label: '150€',\n  },\n]\n\nexport const Readme = () => (\n  <div style={{ width: '30em', height: '30em' }}>\n    <Graph\n      style={{ width: '100%', height: '100%' }}\n      nodes={nodes}\n      links={links}\n      type=\"graph\"\n      onLinkClick={console.log}\n    />\n  </div>\n)\nReadme.story = {\n  name: 'README example',\n}\n\nconst tree = {\n  id: 'john',\n  label: 'John',\n  children: [\n    {\n      id: 'meridith',\n      label: 'Meridith',\n    },\n    {\n      id: 'jack',\n      label: 'Jack',\n    },\n  ],\n}\nexport const Tree = () => <Graph nodes={[tree]} type=\"tree\" />\nTree.story = {\n  name: 'Layout: Tree',\n}\n\nexport const CustomLink = () => (\n  <Graph\n    onLinkClick={console.log}\n    nodes={nodes}\n    links={links.map((l) => ({ ...l, Component: Line }))}\n    type=\"graph\"\n  />\n)\nCustomLink.story = {\n  name: 'Link: Custom',\n}\n\nexport const CustomNode = () => (\n  <Graph\n    onNodeClick={console.log}\n    links={links}\n    nodes={nodes.map((l) => ({ ...l, Component: Square }))}\n    type=\"graph\"\n  />\n)\nCustomNode.story = {\n  name: 'Node: Custom',\n}\n\nexport const BlockZoom = () => (\n  <Graph type=\"graph\" nodes={nodes} links={links} noZoom />\n)\n\nexport const BlockMove = () => (\n  <Graph type=\"graph\" nodes={nodes} links={links} noViewportMove />\n)\n\nexport const BlockDrag = () => (\n  <Graph type=\"graph\" nodes={nodes} links={links} noDrag />\n)\n\nexport const StaticView = () => (\n  <Graph\n    type=\"graph\"\n    nodes={nodes}\n    links={links}\n    noDrag\n    noZoom\n    noViewportMove\n  />\n)\n",
        __ADDS_MAP__ = {
          'graph--readme': {
            startLoc: { col: 22, line: 46 },
            endLoc: { col: 1, line: 56 },
            startBody: { col: 22, line: 46 },
            endBody: { col: 1, line: 56 },
          },
          'graph--tree': {
            startLoc: { col: 20, line: 75 },
            endLoc: { col: 62, line: 75 },
            startBody: { col: 20, line: 75 },
            endBody: { col: 62, line: 75 },
          },
          'graph--custom-link': {
            startLoc: { col: 26, line: 80 },
            endLoc: { col: 1, line: 87 },
            startBody: { col: 26, line: 80 },
            endBody: { col: 1, line: 87 },
          },
          'graph--custom-node': {
            startLoc: { col: 26, line: 92 },
            endLoc: { col: 1, line: 99 },
            startBody: { col: 26, line: 92 },
            endBody: { col: 1, line: 99 },
          },
          'graph--block-zoom': {
            startLoc: { col: 25, line: 104 },
            endLoc: { col: 1, line: 106 },
            startBody: { col: 25, line: 104 },
            endBody: { col: 1, line: 106 },
          },
          'graph--block-move': {
            startLoc: { col: 25, line: 108 },
            endLoc: { col: 1, line: 110 },
            startBody: { col: 25, line: 108 },
            endBody: { col: 1, line: 110 },
          },
          'graph--block-drag': {
            startLoc: { col: 25, line: 112 },
            endLoc: { col: 1, line: 114 },
            startBody: { col: 25, line: 112 },
            endBody: { col: 1, line: 114 },
          },
          'graph--static-view': {
            startLoc: { col: 26, line: 116 },
            endLoc: { col: 1, line: 125 },
            startBody: { col: 26, line: 116 },
            endBody: { col: 1, line: 125 },
          },
        },
        __MODULE_DEPENDENCIES__ = [],
        __LOCAL_DEPENDENCIES__ = {},
        __IDS_TO_FRAMEWORKS__ = {}
      __webpack_exports__.default = {
        parameters: {
          storySource: {
            source:
              "import React from 'react'\nimport Graph from '../src/Graph'\nimport Line from './Line'\nimport Square from './Square'\n\nexport default {\n  title: 'Graph',\n  component: Graph,\n}\n\nconst nodes = [\n  {\n    id: 'jack',\n    label: 'Jack',\n  },\n  {\n    id: 'john',\n    label: 'John',\n    color: '#4f9ceb',\n  },\n  {\n    id: 'meridith',\n    label: 'Meridith',\n    color: 'green',\n  },\n]\n\nconst links = [\n  {\n    source: 0,\n    target: 1,\n    label: '200€',\n  },\n  {\n    source: 1,\n    target: 2,\n    label: '100€',\n  },\n  {\n    source: 1,\n    target: 0,\n    label: '150€',\n  },\n]\n\nexport const Readme = () => (\n  <div style={{ width: '30em', height: '30em' }}>\n    <Graph\n      style={{ width: '100%', height: '100%' }}\n      nodes={nodes}\n      links={links}\n      type=\"graph\"\n      onLinkClick={console.log}\n    />\n  </div>\n)\nReadme.story = {\n  name: 'README example',\n}\n\nconst tree = {\n  id: 'john',\n  label: 'John',\n  children: [\n    {\n      id: 'meridith',\n      label: 'Meridith',\n    },\n    {\n      id: 'jack',\n      label: 'Jack',\n    },\n  ],\n}\nexport const Tree = () => <Graph nodes={[tree]} type=\"tree\" />\nTree.story = {\n  name: 'Layout: Tree',\n}\n\nexport const CustomLink = () => (\n  <Graph\n    onLinkClick={console.log}\n    nodes={nodes}\n    links={links.map((l) => ({ ...l, Component: Line }))}\n    type=\"graph\"\n  />\n)\nCustomLink.story = {\n  name: 'Link: Custom',\n}\n\nexport const CustomNode = () => (\n  <Graph\n    onNodeClick={console.log}\n    links={links}\n    nodes={nodes.map((l) => ({ ...l, Component: Square }))}\n    type=\"graph\"\n  />\n)\nCustomNode.story = {\n  name: 'Node: Custom',\n}\n\nexport const BlockZoom = () => (\n  <Graph type=\"graph\" nodes={nodes} links={links} noZoom />\n)\n\nexport const BlockMove = () => (\n  <Graph type=\"graph\" nodes={nodes} links={links} noViewportMove />\n)\n\nexport const BlockDrag = () => (\n  <Graph type=\"graph\" nodes={nodes} links={links} noDrag />\n)\n\nexport const StaticView = () => (\n  <Graph\n    type=\"graph\"\n    nodes={nodes}\n    links={links}\n    noDrag\n    noZoom\n    noViewportMove\n  />\n)\n",
            locationsMap: {
              'graph--readme': {
                startLoc: { col: 22, line: 46 },
                endLoc: { col: 1, line: 56 },
                startBody: { col: 22, line: 46 },
                endBody: { col: 1, line: 56 },
              },
              'graph--tree': {
                startLoc: { col: 20, line: 75 },
                endLoc: { col: 62, line: 75 },
                startBody: { col: 20, line: 75 },
                endBody: { col: 62, line: 75 },
              },
              'graph--custom-link': {
                startLoc: { col: 26, line: 80 },
                endLoc: { col: 1, line: 87 },
                startBody: { col: 26, line: 80 },
                endBody: { col: 1, line: 87 },
              },
              'graph--custom-node': {
                startLoc: { col: 26, line: 92 },
                endLoc: { col: 1, line: 99 },
                startBody: { col: 26, line: 92 },
                endBody: { col: 1, line: 99 },
              },
              'graph--block-zoom': {
                startLoc: { col: 25, line: 104 },
                endLoc: { col: 1, line: 106 },
                startBody: { col: 25, line: 104 },
                endBody: { col: 1, line: 106 },
              },
              'graph--block-move': {
                startLoc: { col: 25, line: 108 },
                endLoc: { col: 1, line: 110 },
                startBody: { col: 25, line: 108 },
                endBody: { col: 1, line: 110 },
              },
              'graph--block-drag': {
                startLoc: { col: 25, line: 112 },
                endLoc: { col: 1, line: 114 },
                startBody: { col: 25, line: 112 },
                endBody: { col: 1, line: 114 },
              },
              'graph--static-view': {
                startLoc: { col: 26, line: 116 },
                endLoc: { col: 1, line: 125 },
                startBody: { col: 26, line: 116 },
                endBody: { col: 1, line: 125 },
              },
            },
          },
        },
        title: 'Graph',
        component: src_Graph,
      }
      const _2_graph_stories_nodes = [
          { id: 'jack', label: 'Jack' },
          { id: 'john', label: 'John', color: '#4f9ceb' },
          { id: 'meridith', label: 'Meridith', color: 'green' },
        ],
        _2_graph_stories_links = [
          { source: 0, target: 1, label: '200€' },
          { source: 1, target: 2, label: '100€' },
          { source: 1, target: 0, label: '150€' },
        ],
        Readme = addSourceDecorator(
          () =>
            react_default.a.createElement(
              'div',
              { style: { width: '30em', height: '30em' } },
              react_default.a.createElement(src_Graph, {
                style: { width: '100%', height: '100%' },
                nodes: _2_graph_stories_nodes,
                links: _2_graph_stories_links,
                type: 'graph',
                onLinkClick: console.log,
              }),
            ),
          {
            __STORY__: __STORY__,
            __ADDS_MAP__: __ADDS_MAP__,
            __MAIN_FILE_LOCATION__: '/2-graph.stories.tsx',
            __MODULE_DEPENDENCIES__: __MODULE_DEPENDENCIES__,
            __LOCAL_DEPENDENCIES__: __LOCAL_DEPENDENCIES__,
            __SOURCE_PREFIX__: __SOURCE_PREFIX__,
            __IDS_TO_FRAMEWORKS__: __IDS_TO_FRAMEWORKS__,
          },
        )
      Readme.story = { name: 'README example' }
      const tree = {
          id: 'john',
          label: 'John',
          children: [
            { id: 'meridith', label: 'Meridith' },
            { id: 'jack', label: 'Jack' },
          ],
        },
        Tree = addSourceDecorator(
          () =>
            react_default.a.createElement(src_Graph, {
              nodes: [tree],
              type: 'tree',
            }),
          {
            __STORY__: __STORY__,
            __ADDS_MAP__: __ADDS_MAP__,
            __MAIN_FILE_LOCATION__: '/2-graph.stories.tsx',
            __MODULE_DEPENDENCIES__: __MODULE_DEPENDENCIES__,
            __LOCAL_DEPENDENCIES__: __LOCAL_DEPENDENCIES__,
            __SOURCE_PREFIX__: __SOURCE_PREFIX__,
            __IDS_TO_FRAMEWORKS__: __IDS_TO_FRAMEWORKS__,
          },
        )
      Tree.story = { name: 'Layout: Tree' }
      const CustomLink = addSourceDecorator(
        () =>
          react_default.a.createElement(src_Graph, {
            onLinkClick: console.log,
            nodes: _2_graph_stories_nodes,
            links: _2_graph_stories_links.map((l) => ({
              ...l,
              Component: stories_Line,
            })),
            type: 'graph',
          }),
        {
          __STORY__: __STORY__,
          __ADDS_MAP__: __ADDS_MAP__,
          __MAIN_FILE_LOCATION__: '/2-graph.stories.tsx',
          __MODULE_DEPENDENCIES__: __MODULE_DEPENDENCIES__,
          __LOCAL_DEPENDENCIES__: __LOCAL_DEPENDENCIES__,
          __SOURCE_PREFIX__: __SOURCE_PREFIX__,
          __IDS_TO_FRAMEWORKS__: __IDS_TO_FRAMEWORKS__,
        },
      )
      CustomLink.story = { name: 'Link: Custom' }
      const CustomNode = addSourceDecorator(
        () =>
          react_default.a.createElement(src_Graph, {
            onNodeClick: console.log,
            links: _2_graph_stories_links,
            nodes: _2_graph_stories_nodes.map((l) => ({
              ...l,
              Component: stories_Square,
            })),
            type: 'graph',
          }),
        {
          __STORY__: __STORY__,
          __ADDS_MAP__: __ADDS_MAP__,
          __MAIN_FILE_LOCATION__: '/2-graph.stories.tsx',
          __MODULE_DEPENDENCIES__: __MODULE_DEPENDENCIES__,
          __LOCAL_DEPENDENCIES__: __LOCAL_DEPENDENCIES__,
          __SOURCE_PREFIX__: __SOURCE_PREFIX__,
          __IDS_TO_FRAMEWORKS__: __IDS_TO_FRAMEWORKS__,
        },
      )
      CustomNode.story = { name: 'Node: Custom' }
      const BlockZoom = addSourceDecorator(
          () =>
            react_default.a.createElement(src_Graph, {
              type: 'graph',
              nodes: _2_graph_stories_nodes,
              links: _2_graph_stories_links,
              noZoom: !0,
            }),
          {
            __STORY__: __STORY__,
            __ADDS_MAP__: __ADDS_MAP__,
            __MAIN_FILE_LOCATION__: '/2-graph.stories.tsx',
            __MODULE_DEPENDENCIES__: __MODULE_DEPENDENCIES__,
            __LOCAL_DEPENDENCIES__: __LOCAL_DEPENDENCIES__,
            __SOURCE_PREFIX__: __SOURCE_PREFIX__,
            __IDS_TO_FRAMEWORKS__: __IDS_TO_FRAMEWORKS__,
          },
        ),
        BlockMove = addSourceDecorator(
          () =>
            react_default.a.createElement(src_Graph, {
              type: 'graph',
              nodes: _2_graph_stories_nodes,
              links: _2_graph_stories_links,
              noViewportMove: !0,
            }),
          {
            __STORY__: __STORY__,
            __ADDS_MAP__: __ADDS_MAP__,
            __MAIN_FILE_LOCATION__: '/2-graph.stories.tsx',
            __MODULE_DEPENDENCIES__: __MODULE_DEPENDENCIES__,
            __LOCAL_DEPENDENCIES__: __LOCAL_DEPENDENCIES__,
            __SOURCE_PREFIX__: __SOURCE_PREFIX__,
            __IDS_TO_FRAMEWORKS__: __IDS_TO_FRAMEWORKS__,
          },
        ),
        BlockDrag = addSourceDecorator(
          () =>
            react_default.a.createElement(src_Graph, {
              type: 'graph',
              nodes: _2_graph_stories_nodes,
              links: _2_graph_stories_links,
              noDrag: !0,
            }),
          {
            __STORY__: __STORY__,
            __ADDS_MAP__: __ADDS_MAP__,
            __MAIN_FILE_LOCATION__: '/2-graph.stories.tsx',
            __MODULE_DEPENDENCIES__: __MODULE_DEPENDENCIES__,
            __LOCAL_DEPENDENCIES__: __LOCAL_DEPENDENCIES__,
            __SOURCE_PREFIX__: __SOURCE_PREFIX__,
            __IDS_TO_FRAMEWORKS__: __IDS_TO_FRAMEWORKS__,
          },
        ),
        StaticView = addSourceDecorator(
          () =>
            react_default.a.createElement(src_Graph, {
              type: 'graph',
              nodes: _2_graph_stories_nodes,
              links: _2_graph_stories_links,
              noDrag: !0,
              noZoom: !0,
              noViewportMove: !0,
            }),
          {
            __STORY__: __STORY__,
            __ADDS_MAP__: __ADDS_MAP__,
            __MAIN_FILE_LOCATION__: '/2-graph.stories.tsx',
            __MODULE_DEPENDENCIES__: __MODULE_DEPENDENCIES__,
            __LOCAL_DEPENDENCIES__: __LOCAL_DEPENDENCIES__,
            __SOURCE_PREFIX__: __SOURCE_PREFIX__,
            __IDS_TO_FRAMEWORKS__: __IDS_TO_FRAMEWORKS__,
          },
        )
    },
  },
  [[352, 1, 2]],
])
//# sourceMappingURL=main.5d871ca7136213112756.bundle.js.map
