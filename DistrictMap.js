const map = new mapboxgl.Map({
  accessToken: prompt("Please enter MapBox Access Token"),
  container: "cd13-map",
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

const isUserInDistricts = ({ coords }) => {
  const { longitude, latitude } = coords;

  const point = [longitude, latitude];

  const inPolygon = window.turf.pointInPolygon.default;

  const inOld = inPolygon(point, oldCd13MultPoly.geometry);
  const inNew = inPolygon(point, newCd13Poly.geometry);

  alert(
    inOld && inNew
      ? "You are in both the old and new map of the district"
      : inOld
      ? "You are in the old map of the district only"
      : inNew
      ? "You are in the new map of the district only"
      : "You have never been in the district"
  );
};

document
  .querySelector("button")
  .addEventListener("click", () =>
    navigator.geolocation.getCurrentPosition(isUserInDistricts, () =>
      alert("You must allow access to the geolocation api to use this tool")
    )
  );
