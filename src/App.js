import React, { useEffect, useState, useCallback } from "react";
import Chart from "./Chart";
import getFlux from "./getFlux";
import Test from "./Test";
import "./App.css";

const TEST_BIG = false;
const TEST_REAL = false;
const TEST_TREE = false;

const CustomLink = ({ source, target, length, d, label, textPosition }) => (
  <>
    <path
      id="custom1"
      strokeWidth={Math.sqrt(length) * 10}
      fill="transparent"
      d={d}
      stroke="green"
      markerEnd="url(#arrow-green)"
    ></path>
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
  const [rootTree, setRootTree] = useState({
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
  });

  useEffect(() => {
    getFlux();
    const fetchAndSetData = async () => {
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
    };

    if (TEST_BIG) {
      fetchAndSetData();
    } else if (TEST_REAL) {
      getFlux().then(setData);
    } else {
      setData({
        nodes: [
          {
            id: "REP",
            label: "REP",
            Component: ({ label }) => (
              <>
                <circle
                  r={70}
                  fill="#ff0000"
                  cx={0}
                  cy={0}
                  className="circle"
                ></circle>
                <text
                  stroke="#333"
                  textAnchor="middle"
                  dy="0.5em"
                  fontSize="1em"
                >
                  {label}
                </text>
              </>
            )
          },
          {
            id: "COU",
            label: "COU"
          },
          {
            id: "ASS",
            label: "ASS"
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
    }
  }, []);

  const [selectedNode, setSelectedNode] = useState({});

  const onNodeClick = useCallback(
    ({ id, value }) => setSelectedNode({ id, value }),
    []
  );
  const onLinkClick = useCallback(link => console.log(link), []);

  return (
    <>
      <Test />
      <button
        onClick={() => {
          if (TEST_TREE) {
            setRootTree(old => ({
              ...old,
              children: [
                ...old.children,
                {
                  id: "new",
                  label: "new"
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
      <Chart
        {...data}
        root={rootTree}
        tree={TEST_TREE}
        onNodeClick={onNodeClick}
        onLinkClick={onLinkClick}
      />
      <pre>{JSON.stringify(selectedNode, null, 2)}</pre>
    </>
  );
}

export default App;
