// Store our API endpoint inside queryUrl
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(data => {
  console.log(data);
  console.log(d3.extent(data.features.map(d => d.properties.mag)))
  console.log(d3.extent(data.features.map(d => d.geometry.coordinates[2])))
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function getColor(d) {
    return d > 90  ? '#d73027' :
           d > 70  ? '#fc8d59' :
           d > 50  ? '#fee08b' :
           d > 30   ? '#d9ef8b' :
           d > 10   ? '#91cf60' :
           d > -15   ? '#1a9850' :
                      '#252525';
}

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.title +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<hr>Depth: " + feature.geometry.coordinates[2] + "<br>Magnitude: " + feature.properties.mag);
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  const earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
  });

  const mags = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: (feature, latlng) => {
      return new L.Circle(latlng, {
        weight: 1,
        radius: feature.properties.mag*100000,
        fillColor: getColor(feature.geometry.coordinates[2]),
        fillOpacity: 1,
        color: '#000000'
      });
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(mags);
}

function createMap(mags) {

  // Define streetmap and darkmap layers
  const outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });

  const darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  const satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 16,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

  // Define a baseMaps object to hold our base layers
  const baseMaps = {
    "Satellite": satellite,
    "Outdoors": outdoors,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  const overlayMaps = {
    Magnitudes: mags
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  const myMap = L.map("map", {
    center: [
      0, 0
    ],
    zoom: 3,
    layers: [satellite, mags]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then((data) =>{
    L.geoJSON(data,{
        style: {
                opacity: 1,  
                weight: 1.5
        }
    }).addTo(myMap);
 
});
}
