const getFlux = data => {
  const nodes = [];
  const links = [];
  const {
    messages
  } = data.coreServices[0].structurePackages[0].businessContexts[0];

  const addNode = partenaire => {
    const id = partenaire.properties.code;
    if (nodes.some(node => node.id === id)) return;
    nodes.push({ id, label: id });
  };

  const addLink = ({ label }) => {
    const link = { label };
    links.push(link);
    return link;
  };

  // add nodes
  messages
    .flatMap(({ partenaires }) => (partenaires ? partenaires : []))
    .forEach(addNode);

  // add links
  messages.forEach(({ id, partenaires = [] }) => {
    if (!partenaires) return;

    partenaires.forEach(({ properties: { code, sens, etat } }) => {
      // TODO: filter by etat?
      const nodeIndex = nodes.findIndex(node => node.id === code);

      // create a link in both sides and hope for the best
      if (sens.includes("Reception")) {
        let link = links.find(
          link =>
            link.label === id &&
            link.target === undefined &&
            link.source !== nodeIndex
        );
        if (!link) link = addLink({ label: id });
        link.target = nodeIndex;
      }

      if (sens.includes("Emission")) {
        let link = links.find(
          link =>
            link.label === id &&
            link.source === undefined &&
            link.target !== nodeIndex
        );
        if (!link) link = addLink({ label: id });
        link.source = nodeIndex;
      }
    });
  });

  return {
    nodes,
    links: links.filter( // FIXME: whyyy some flux are not complete (with a source and a target??)
      link => link.source !== undefined && link.target !== undefined
    )
  };
};

export default getFlux;
