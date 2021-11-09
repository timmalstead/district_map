const map = new mapboxgl.Map({
  accessToken: "pk.eyJ1Ijoia2F0ZTRjb3VuY2lsIiwiYSI6ImNrdnJwODgzZzMwZmcyb210MnFmdDBuamEifQ.niFRF8wlKIqlbvbLrNGi4Q",
  container: "cd13-map",
  style: "mapbox://styles/kate4council/ckvrkp0ht04y715qswbkb5c90",
  center: [-118.29387970438475, 34.09178686484056],
  zoom: 12,
  minZoom: 10,
  maxZoom: 17
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

  map.addSource("world", {
    type: "geojson",
    data: world,
  });

  map.addLayer({
    id: "oldCd13Layer",
    type: "fill",
    source: "oldCd13",
    layout: {},
    paint: {
      "fill-color": "#ffffff",
      "fill-opacity": 0
    },
  });

  map.addLayer({
    id: "newCd13Layer",
    type: "fill",
    source: "newCd13",
    layout: {},
    paint: {
      "fill-color": "#000000",
      "fill-opacity": 0,
      "fill-outline-color": "#ffffff",
    },
  });

  map.addLayer({
    id: "everythingElse",
    type: "fill",
    source: "world",
    layout: {},
    paint: {
      "fill-color": "#000",
      "fill-opacity": 0.4
    },
  });

  map.addLayer({
    id: "newCd13LayerOutline",
    type: "line",
    source: "newCd13",
    layout: {},
    paint: {
      "line-color": "#000000",
      "line-width": 2,
    },
  });

  map.addLayer({
      id: "oldCd13LayerOutline",
      type: "line",
      source: "oldCd13",
      layout: {},
      paint: {
        "line-color": "#ffffff",
        "line-width": 2,
        "line-dasharray": [5, 2],
        "line-opacity": 0.5
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
      alert("You must allow access to the geolocation api to use this map.")
    )
  );
