const accessToken =
  "pk.eyJ1Ijoia2F0ZTRjb3VuY2lsIiwiYSI6ImNrdnJwODgzZzMwZmcyb210MnFmdDBuamEifQ.niFRF8wlKIqlbvbLrNGi4Q";

const map = new mapboxgl.Map({
  accessToken: accessToken,
  container: "cd13-map",
  style: "mapbox://styles/kate4council/ckvrkp0ht04y715qswbkb5c90",
  center: [-118.294, 34.11],
  zoom: 12,
  minZoom: 10,
  maxZoom: 17,
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
      "fill-opacity": 0,
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
      "fill-opacity": 0.4,
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
      "line-opacity": 0.5,
    },
  });

  map.fitBounds([
    [-118.37, 34.05], // southwestern corner of the bounds
    [-118.22, 34.162], // northeastern corner of the bounds
  ]);
});

const geocoder = new MapboxGeocoder({
  accessToken,
  mapboxgl,
  placeholder: "Search In Los Angeles",
  flyTo: false,
  bbox: [
    -118.66817139539052, 33.70466955673143, -118.15535817284703,
    34.33730671189989,
  ],
});

// map.addControl(geocoder);

document.getElementById("geocoder").appendChild(geocoder.onAdd(map));

geocoder.on("result", ({ result }) => {
  const point = result.center;

  const inPolygon = window.turf.pointInPolygon.default;

  const inOld = inPolygon(point, oldCd13MultPoly.geometry);
  const inNew = inPolygon(point, newCd13Poly.geometry);

  const location_info =
    inOld && inNew
      ? "remains"
      : inOld
      ? "redistricted-out"
      : inNew
      ? "redistricted-in"
      : "never";

  document.querySelector("body").setAttribute("data-location", location_info);


  // setTimeout(() => spanEle.scrollIntoView(), 2000);
});

document.querySelector("body").setAttribute("data-location", "unknown");
map.scrollZoom.disable();
map.addControl(new mapboxgl.NavigationControl());
