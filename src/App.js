import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import Test from "./Test";
import "./App.css";

const TEST_BIG = false;

const CustomLink = ({ source, target, length, d, label }) => (
  <>
    <path
      id="custom1"
      strokeWidth={Math.sqrt(length) * 10}
      fill="transparent"
      d={d}
      stroke="green"
      markerEnd="url(#arrow-#999)"
    ></path>
    <text x="100" transform="translate(0, 30)">
      {/* TODO: offset to process (not hardcoded) */}
      <textPath href="custom1">
        {label || `${source.label} -> ${target.label}`}
      </textPath>
    </text>
  </>
);

function App() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
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

  return (
    <>
      <Test />
      <button
        onClick={() => {
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
        onNodeClick={({ id, value }) => setSelectedNode({ id, value })}
        onLinkClick={link => console.log(link)}
      />
      <pre>{JSON.stringify(selectedNode, null, 2)}</pre>
    </>
  );
}

export default App;
