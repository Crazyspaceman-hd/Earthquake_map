# Leaflet-Challenge
The code for this page produces a scrollable and zoomable map of earthquakes that have occured in the past week. 

It requires an API key from Mapbox saved in a `config.js` file stored in the `static/js` folder.

It uses a query URL from the USGS to aquire geojson data which is then fed through a function to create a circle at the location of each earthquake from the last week. The radius of the created circle is proportional to the magnitude of the earthquake. The color is determined by the depth of the earthquake with it shifting from green to red as the depth increases.

There are 3 options for the background map, a dark map, an outdoors map and a satellite map, the earthquake layer can also be toggled on and off. There is also a layer displaying the tectonic plate boundaries which are imported from a seperate url.

Future improvements would be adding the tectonic boundaries as a togglable layer, and adding a legend indicating which depths correspond to which colors.
