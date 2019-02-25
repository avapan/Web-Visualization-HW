

// Store our API endpoint inside queryUrl
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(URL, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Define marker color and size
function markerColor(mag) {
    if (mag > 5) {
      color = "#ff9900";
    } else if (mag > 4) {
      color = "#ffcc66";
    } else if  (mag > 3) {
      color = "#ffff66";
    } else if (mag > 2) {
      color = "#336600";
    } else {
      color = "#336600";
    }
    return(color)
    }
  
function markerSize(mag){
    return mag*100
}
 // Define a function we want to run once for each feature in the features array
 // Give each feature a popup describing the place and time of the earthquake
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
          layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },
        
        pointToLayer: function (feature, latlng) {
          return new L.circle(latlng,
            {radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.properties.mag),
            fillOpacity: .5,
            color: "#000",
            stroke: true,
            weight: 1.5
        })
    }
    });
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
   // Define streetmap and darkmap layers
   var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
   });

   var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
   });

   // Define a baseMaps object to hold our base layers
   // Pass in our baseMaps 
   var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
   // Create overlay object to hold our overlay layer
   var overlayMaps = {
    "Earthquake": earthquakes
  };
   // Create our map, giving it the streetmap and earthquakes layers to display on load
   var myMap = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 3,
    layers: [streetmap, earthquakes]
   });

  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //Create a legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(myMap){
      var div = L.DomUtil.create('div', 'info legend'),
          levels = [0, 1, 2, 3, 4, 5],
          labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < levels.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(levels[i] + 1) + '"></i> ' +
            levels[i] + (levels[i + 1] ? '&ndash;' + levels[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}

