const { useState, useEffect, createElement } = React;

const DistrictMap = () => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      accessToken: "",
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-118.29387970438475, 34.09178686484056],
      zoom: 12,
    });

    map.on("load", () => {
      map.addSource("oldCd13", {
        type: "geojson",
        data: oldCd13MultPoly,
      });

      map.addSource("newCd13", {
        type: "geojson",
        data: newCd13Poly,
      });

      map.addLayer({
        id: "oldCd13Layer",
        type: "fill",
        source: "oldCd13",
        layout: {},
        paint: {
          "fill-color": "#0080ff",
          "fill-opacity": 0.5,
        },
      });

      map.addLayer({
        id: "newCd13Layer",
        type: "fill",
        source: "newCd13",
        layout: {},
        paint: {
          "fill-color": "#ebdd1e",
          "fill-opacity": 0.5,
        },
      });
    });

    return () => map.remove();
  }, []);

  return createElement("div", {
    id: "map",
    style: { width: "100%", height: "100%" },
  });
};

ReactDOM.render(
  createElement(DistrictMap),
  document.getElementById("cd13-map")
);
