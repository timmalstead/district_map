const { useState, useEffect, createElement } = React;

const DistrictMap = ({ oldCoords, newCoords }) => {
  return createElement("span", {}, "I like the map!");
};

ReactDOM.render(
  createElement(DistrictMap, {
    oldCoords: oldCd13MultPoly,
    newCoords: newCd13Poly,
  }),
  document.getElementById("cd13-map")
);
