const accessToken = "pk.eyJ1Ijoia2F0ZTRjb3VuY2lsIiwiYSI6ImNrdnJwODgzZzMwZmcyb210MnFmdDBuamEifQ.niFRF8wlKIqlbvbLrNGi4Q";

const map = new mapboxgl.Map({
  accessToken: accessToken,
  container: "cd13-map",
  style: "mapbox://styles/kate4council/ckvrkp0ht04y715qswbkb5c90",
  center: [-118.294, 34.11],
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
    paint: {
      "fill-color": "#ffffff",
      "fill-opacity": 0
    },
  });

  map.addLayer({
    id: "newCd13Layer",
    type: "fill",
    source: "newCd13",
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

const geocoder = new MapboxGeocoder({
  accessToken,
  mapboxgl,
  placeholder: "Search In Los Angeles",
  bbox: [
    -118.66817139539052, 33.70466955673143, -118.15535817284703,
    34.33730671189989,
  ],
});

map.addControl(geocoder);

const isUserInDistricts = ({ coords }) => {
  const { longitude, latitude } = coords;

  const point = [longitude, latitude];

  new mapboxgl.Marker().setLngLat(point).addTo(map);

  const inPolygon = window.turf.pointInPolygon.default;

  const inOld = inPolygon(point, oldCd13MultPoly.geometry);
  const inNew = inPolygon(point, newCd13Poly.features[0].geometry);

  alert(
    inOld && inNew
      ? "You are still in council district 13!"
      : inOld
      ? "You are no longer in council district 13"
      : inNew
      ? "You are now in council district 13!"
      : "You are not in council district 13"
  );
};

document
  .querySelector("button")
  .addEventListener("click", () =>
    navigator.geolocation.getCurrentPosition(isUserInDistricts, () =>
      alert("You must allow access to the geolocation api to use this map.")
    )
  );
