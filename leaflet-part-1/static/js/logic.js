// the data url from USGS
// My Map is going to show all the earthquakes from the past month

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Get the data once it gets a respnse

d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
});
// Function for size of marker
function sizeMarker(mag) {
    return mag * mag * 5000;
}
// Function for color of marker based on depth
function colorMarker(depth) {
    if (depth >= 90) {
        return '#EA2C2C'
    } else if (depth >= 70) {
        return '#EA822C'
    } else if (depth >= 50) {
        return '#EE9C00'
    } else if (depth >= 30) {
        return '#EECC00'
    } else if (depth >= 10) {
        return '#D4EE00'
    } else return '#98EE00'
};
// Function to create the features of the map
function createFeatures(earthquakeData) {
    function onEachFeature(features, layer) {
        layer.bindPopup(`<h3>${features.properties.place}</h3><hr><p>${new Date(features.properties.time)}</p>`);

    };
// function to create the circle markers
    function pointToLayer(features, latlng) {
        return L.circle(latlng,
            {radius: sizeMarker(features.properties.mag),
            color: colorMarker(features.geometry.coordinates[2]),
        fillcolor: colorMarker(features.geometry.coordinates[2])})

            

    }
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });


    createMap(earthquakes);

    
}
// Function to create map and legend
function createMap(earthquakes) {
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var baseMaps = {
        "Street Map": street,
        'Topographic Map': topo

    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
    });


    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({ position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var depths = [-10, 10, 30, 50, 70, 90];
        var colors = ["#98EE00", "#D4EE00", "#EECC00", "#EE9C00", "#EA822C", "#EA2C2C"];
        for (var i = 0; i< depths.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
            + depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
    }
    return div;
            
        };

        legend.addTo(myMap)

    }

   

   


    

    






