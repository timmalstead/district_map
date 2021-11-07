const accessToken = prompt("Please enter Mapbox token");

const map = new mapboxgl.Map({
  accessToken,
  container: "cd13-map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-118.29387970438475, 34.11],
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
    paint: {
      "fill-color": "#00bbf2",
      "fill-opacity": 0.5,
    },
  });

  map.addLayer({
    id: "newCd13Layer",
    type: "fill",
    source: "newCd13",
    paint: {
      "fill-color": "#fff202",
      "fill-opacity": 0.5,
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
