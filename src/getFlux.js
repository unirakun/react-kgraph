import createClient from "@fabienjuif/graph-client";
import mapFlux from './mapFlux'

const graphql = createClient({
  url: "http://localhost:3333/graphql",
  fetch: window.fetch
});

const QUERY = `
query {
    coreServices(labels: ["AUTO"]) {
      structurePackages {
        businessContexts(labels: ["AR2"]) {
          messages {
            id
            partenaires {
              properties {
                code
                etat
                sens
              }
            }
          }
        }
      }
    }
  }
`;

const getFlux = async () => {
  const data = await graphql(QUERY);
  return mapFlux(data);
};

export default getFlux;
