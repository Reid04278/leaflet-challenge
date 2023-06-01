// the data url from USGS
// My Map is going to show all the earthquakes from the past week

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.json"

// I'm going to get the marker color based on the depth of the earthquake
function colorGet(depth) {
    if (depth >= 90) {
        return "red"
    } else {
        if (depth > 70) {
            return "orangered"
        } else {
            if (depth > 50) {
                return "orange"
            } else {
                if (depth > 30) {
                    return "gold"
                } else {
                    if (depth > 10) {
                        return "yellow"
                    } else {
                        return "lightgreen"
                    }
                }
            }
        }
    }
};


// Declare a function to create map features
function featuresCreate(earthquakeData) {
    
    // Create some popup layers using earthquake title, the type, and the magnitude
    function onEachFeature(feature, layer) {
        layer.bindPopup("<p>Location: " + feature.properties.place + "</p>" + 
            "<p>Depth: " + feature.geometry.coordinates[2] + "</p>" + 
            "<p>Magnitude: " + feature.properties.mag + "</p>");
    }

    // Create some circle markers for each earthquake in the data set
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            // Make the circle radius dependent on the magnitude and get the color based on the depth
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 4,
                fillOpacity: 1,
                color: colorGet(feature.geometry.coordinates[2])
            })

            
        },
        // Append the popups on each feature
        onEachFeature: onEachFeature
    });
    // Call the create map function using the earthquakes data
    mapCreate(earthquakes);

    
};

// Declare function to create the map
function mapCreate(earthquakes) {
    // Get the initial light layer
    var mapLayer = L.titleLayer('https://{s}.tile.openstreetmap.org/{z]/{x}/{y}.png' , {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Declare the map object and then set it to the map element in the DOM
    var myMap = L.map("map", {
        center: [29.876019, -107.224121],
        zoom: 4,
        layers: [mapLayer, earthquakes]

    });

    // Create a legend for the map based on earh quake data and colors
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var colors = [
            "lightgreen",
            "yellow",
            "gold",
            "orange",
            "orangered",
            "red"];

            var legendInfo = "<h1>EarthquakeDepth<h1>" +
                "<div class=\"labels\">" +
                "<div class=\"max\">90+</div>" +
                "<div class=\"fourth\">70-90</div>" +
                "div class=\"third\">50-70</div>" +
                "div class=\"second\">30-50</div>" +
                "div class=\"first\">10-30</div>" +
                "div class=\"min\"><10</div>" +
            "</div>";

            div.innerHTML = legendInfo;

            colors.forEach(function(color) {
                labels.push("<li style=\"backgroud-color: " + color + "\"</li>");
            });

            div,innerHTML += "<ul>" + labels.join("") + "</ul>";
            return div;
        };

        // Append the legend to the map
        legend.addTo(myMap);

    

    

    
};

// Get earthquakes data
d3.json(url, function(data) {
    // Create features with the earthquakes data
    featuresCreate(data.features)
});



