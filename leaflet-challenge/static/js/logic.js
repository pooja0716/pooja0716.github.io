// API endpoint

var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// get our data using our API endpoint and createFeatures function

d3.json(earthquakeURL, function(data)
{
  createFeatures(data.features)
}
)

 // set color of earthquake based on magnitude

 function getColor(m)
 {
     return m > 5 ? "purple" :
     m > 4 ? "orange" :
     m > 3 ? "gold" :
     m > 2 ? "yellow" :
     m > 1 ? "greenyellow" :
             "red";
 }
 
 function getRadius(magnitude) {
      return magnitude * 33000 ;
 }
 
 
function createFeatures(earthquakeData) {
    var EarthQuake = L.geoJson(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.Name + "<br> Magnitude: " + feature.properties.mag + "</h3><hr><p>" + new Date(feature.properties.time) + "<p>");

        },

        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng, {
                radius: getRadius(feature.properties.mag),
                fillcolor: getColor(feature.properties.mag),
                fillOpacity: 0.8,
                stroke: true,
                color: getColor(feature.properties.mag),
                weight: 0.75
            })
        }
    })

    createMap(EarthQuake)
}

function createMap(EarthQuake) {

    // create the tile layer that will be a background of our map
    // Define grayMap

 var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.gray",
  tileSize: 512,
  zoomOffset: -1,
  accessToken: API_KEY
})

// Define outdoorMap

var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.Outdoor",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
  })

  // Define satelliteMap

var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",

    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
  })

  // define baseMap which will be hold our base map layers
  var baseMap = {
       "Satellite": satelliteMap,
       "Greyscale": graymap,
       "Outdoor": outdoorMap
  }

  // Now adding tectonic plates layer

  var tectonicplates = new L.LayerGroup()

  // create overlapMaps object which will hold overlay map layer

  var overlayMaps = {
       earthquakes: EarthQuake,
       "Fault Lines": tectonicplates
  }

  // adding Fault Lines data

  d3.json(platesURL, function(data) {

    L.geoJson(data, {
        color: "red",
        weight: 2
    }).addTo(tectonicplates)
  })

  //create map and giving it satelliteMap, EarthQuake and tectonicplates

  var myMap = L.map("map", {
       center: [43.6529, -79.3849],
       zoom: 3,
       layers: [satelliteMap, EarthQuake, tectonicplates]
  });

  // now create control layer for base map and overlay map

  L.control.layers(baseMap, overlayMaps, {
      collapsed: false
  }).addTo(myMap)

  // create Legend

  var Legend = L.control({position: "bottomright"});

  Legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
       grades = [0, 1, 2, 3, 4, 5],
       labels = [];

       // create for loop

       for (var i = 0; i < grades.length; i++) {
           div.innerHTML +=
           '<i style = "background:' + getColor(grades[i] + 1) + ' "></i>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');

       }

       return div;

    };

    Legend.addTo(myMap);

  }

  


