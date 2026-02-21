# VancouverBikeRackMap
A map of bike racks in Vancouver. 

Uses a City of Vancouver dataset of bike racks and their addresses, found here: <https://opendata.vancouver.ca/explore/dataset/bike-racks/information/>. This dataset is from 2021, but there are no up to date datasets. Notably most bike racks in parks or along the Seawall path (Seaside Greenway) are not included. 

The file `wrangle_bike_racks.py` uses the Google Maps Geocoding API to find coordinates for each of the over 1700 bike rack addresses. This file will generate `bike-racks-geocoded.csv`, but will take a long time to run since it will geocode all of the addresses without stopping. If you wish to recreate the geocoded dataset, you may want to only geocode a few hundred rows at a time. 

The frontend is located in the `maps_javascript_api` folder, and uses the Google Maps JavaScript API to plot of all the bike rack locations on the map. Clustering is applied so users will only see clusters of bike racks when zoomed out, and each bike rack location is given a different colored marker based on how many bike racks are actually at that location. The file `index.js` contains these operations, and more such as the creation of a legend to explain the different colored markers. 

You can explore the map here: <https://vancouverbikeracks.netlify.app/>.







