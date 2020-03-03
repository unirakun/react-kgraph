import React, { useEffect, useState, useCallback } from "react";
import Chart from "./Chart";
import getFlux from "./utils/getFlux";
import "./App.css";

const mapNode = ({ variable, children, parent, ...node }) => {
  return {
    ...node,
    children: children?.map(mapNode),
    parent: parent && parent.id
  };
};

const CustomLink = ({
  source,
  target,
  length,
  d,
  label,
  textPosition,
  hover
}) => (
  <>
    <path
      id="custom1"
      strokeWidth={5}
      fill="transparent"
      d={d}
      stroke="#6de090"
      markerEnd="url(#arrow-#6de090)"
    ></path>
    {hover && (
      <path
        id={"custom1"}
        strokeWidth={20}
        fill="transparent"
        d={d}
        stroke="rgba(249, 121, 117, 0.5)"
      ></path>
    )}
    <foreignObject {...textPosition} width={250} height={100}>
      <div
        style={{
          borderRadius: "5px",
          backgroundColor: "rgba(20, 150, 100, 0.2)",
          textAlign: "center",
          padding: "1em",
          border: "1px solid rgba(50, 50, 50, 0.2)"
        }}
      >
        {label || `${source.label} -> ${target.label}`}
      </div>
    </foreignObject>
  </>
);

function App() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [graphType, setGraphType] = useState("graph");

  const setSimpleTestData = useCallback(() => {
    setGraphType("graph");
    setData({
      nodes: [
        {
          id: "REP",
          label: "REP",
          Component: ({ label, style, outerSize }) => (
            <foreignObject
              width={outerSize}
              height={outerSize}
              x={-outerSize / 2}
              y={-outerSize / 2}
            >
              <div style={{ ...style, backgroundColor: "#6de090" }}>
                {label}
              </div>
            </foreignObject>
          )
        },
        {
          id: "COU",
          label: "COU",
          color: "#4f9ceb"
        },
        {
          id: "ASS",
          label: "ASS",
          color: "#4f9ceb"
        }
      ],
      links: [
        {
          source: 0,
          target: 1,
          Component: CustomLink
        },
        {
          source: 1,
          target: 2
        },
        {
          source: 1,
          target: 0
        }
      ]
    });
  }, []);

  useEffect(() => {
    setSimpleTestData();
  }, [setSimpleTestData]);

  const [selectedNode, setSelectedNode] = useState({});
  const [selectedLink, setSelectedLink] = useState({});

  const onNodeClick = useCallback(node => setSelectedNode(mapNode(node)), []);
  const onLinkClick = useCallback(
    ({ source, target, ...link }) =>
      setSelectedLink({
        ...link,
        source: mapNode(source),
        target: mapNode(target)
      }),
    []
  );

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            onClick={() => {
              setGraphType("tree");
              setData({
                nodes: [
                  {
                    id: "ME18921921",
                    label: "ME18921921",
                    children: [
                      {
                        id: "GR38932"
                      },
                      {
                        id: "GR1239",
                        children: [
                          {
                            id: "SE83932"
                          },
                          {
                            id: "129219"
                          },
                          {
                            id: "3128921"
                          }
                        ]
                      }
                    ]
                  }
                ]
              });
            }}
          >
            Tree
          </button>
          <button
            onClick={() => {
              getFlux().then(data => {
                setData(data);
                setGraphType("graph");
              });
            }}
          >
            Real data
          </button>
          <button onClick={setSimpleTestData}>Simple data</button>
          <button
            onClick={async () => {
              const raw = await fetch(
                "https://gist.githubusercontent.com/mbostock/4062045/raw/5916d145c8c048a6e3086915a6be464467391c62/miserables.json"
              );
              const data = await raw.json();
              const nodes = data.nodes.map(d => ({ ...d, value: d.id }));
              const index = new Map(nodes.map(d => [d.id, d]));
              const links = data.links.map(d =>
                Object.assign(Object.create(d), {
                  source: index.get(d.source),
                  target: index.get(d.target)
                })
              );

              setData({ nodes, links });
              setGraphType("graph");
            }}
          >
            Big data
          </button>
          <button
            onClick={() => {
              if (graphType === "tree") {
                setData(old => ({
                  ...old,
                  nodes: [
                    {
                      ...old.nodes[0],
                      children: [
                        ...old.nodes[0].children,
                        {
                          id: "new",
                          label: "new"
                        }
                      ]
                    }
                  ]
                }));
                return;
              }

              setData(old => ({
                ...old,
                nodes: [
                  ...old.nodes,
                  {
                    id: "DARVA",
                    value: "DARVA",
                    Component: () => (
                      <>
                        <circle cx={0} cy={0} fill="white" r={70}></circle>
                        <image
                          href="https://s.qwant.com/fav/d/a/www_darva_com.ico"
                          x="-45"
                          y="-45"
                          height="90"
                          width="90"
                        />
                      </>
                    )
                  }
                ],
                links: [...old.links, { source: 0, target: 3 }]
              }));
            }}
          >
            Add
          </button>
        </div>
        {data && (
          <Chart
            {...data}
            type={graphType}
            onNodeClick={onNodeClick}
            onLinkClick={onLinkClick}
          />
        )}
      </div>
      <div className="infos">
        <div>
          <b>selected node</b>
          <pre>{JSON.stringify(selectedNode, null, 2)}</pre>
        </div>
        <div>
          <b>selected link</b>
          <pre>{JSON.stringify(selectedLink, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
