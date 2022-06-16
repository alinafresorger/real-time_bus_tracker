//   ADD YOUR MAPBOX ACCESS TOKEN HERE:
mapboxgl.accessToken = "pk.eyJ1IjoiYWZyZXNvcmdlciIsImEiOiJjbDN6NjEyeGYwMW9vM2RvZno4cW41ZXdiIn0.AMMBtRy0m_4QZejb73o52w";

var map;
var markers = [];

// Load map
function loadMap() {
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v10",
    center: [-71.091525, 42.35335],
    zoom: 13,
  });
}

// Add markers to map
async function addMarkers() {
  // Get bus location
  var locations = await getBusLocations();
  console.groupCollapsed("Buses");
  // Loop through data, add bus markers
  locations.forEach(function (bus) {
    var marker = getMarker(bus.id);
    console.log("Bus ID", bus.id, bus, "marker", marker);
    if (marker) {
      moveMarker(marker, bus);
    } else {
      addMarker(bus);
    }
  });
  console.groupEnd();

  // timer
  console.log(new Date());
  setTimeout(addMarkers, 15000);
}

// Request bus data from MBTA
async function getBusLocations() {
  var url = "https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=1&include=trip";
  var response = await fetch(url);
  var json = await response.json();
  return json.data;
}

function addMarker(bus) {
  console.log(bus);
  var marker = new mapboxgl.Marker().setLngLat([
    bus.attributes.longitude,
    bus.attributes.latitude,
  ]);
  marker.uid = bus.id;
  marker.addTo(map);
  markers.push(marker);
}

function moveMarker(marker, bus) {
  marker.setLngLat([bus.attributes.longitude, bus.attributes.latitude]);
}

function getMarker(id) {
  var marker = markers.find(function (item) {
    return item.uid === id;
  });
  return marker;
}

window.onload = loadMap;
